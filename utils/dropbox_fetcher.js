var db      = require('./../db'),
    User    = require('./../models/user'),
    Image   = require('./../models/image'),
    sharp   = require('sharp'),
    fs      = require('fs'),
    Dropbox = require('dropbox'),
    secrets = require('./../config/secret-keys'),
    async   = require('async'),
    request = require('request'),
    picName = require('./picture_name')

module.exports = function(email, job, done){
  User.findOne({email: email}, function(err, user){
    if (err) return done(err, null)

    var token  = user.dropbox.token,
        client = new Dropbox.Client({
          key: secrets.dropboxKey,
          secret: secrets.dropboxSecret,
          token: token
        }),
        dirName = "public/images/" + user.id

    var sizes  = {
      thumb: [600, 400],
      large: [1200, 1024]
    }

    var makePull = function(entry, next){
      client.stat(entry.path, function(err, meta){
        client.makeUrl(entry.path, {downloadHack: true }, function(err, data){
          var AWS         = require('aws-sdk'),
              response    = request(data.url),
              s3          = new AWS.S3()

          var resize = sharp().resize(600, 400).max().toBuffer(function(err, buffer){
            if (err) next(err)
            console.log('resized: ' + picName(data.url))

            s3.putObject({
              "Bucket": "blenda",
              "Key": picName(data.url, "thumb"),
              "ACL": "public-read",
              "ContentType": meta.mimeType,
              "Body": buffer
            }, function(err){
              if (err){
                console.log(err)
                next(err)
              } else {
                console.log('uploaded: ' + picName(data.url))
                next()
              }
            })
          })

          Image.create({name: picName(data.url), userId: user.id}, function(err, image){
            if (err) return next(err, null)
            user.images.push(image.id)
            user.save()
          })

          console.log('upload started: ' + picName(data.url))
          response.pipe(resize)
        })
      })

    }

    var getURL = function(entry, next){
      if (entry.wasRemoved){
        Image.findOne({userId: user.id, name: picName(entry.path)}, function(err, image){
          user.images.pull(image.id)
          user.save()
          image.remove(next)
        })
      } else {
        makePull(entry, next)
      }
    }

    var blankSlate = function(){
      Image.remove(user.images).exec()
      user.images = []
      user.save()
    }

    var processChanges = function(err, data){
      if (err) return done(err, null)

      // user.dropbox.cursor = data.cursorTag
      // user.save()

      if (data.blankSlate && user.images.length > 0)
        blankSlate()

      async.map(data.changes, getURL, function(err, attrs){
        if (err) return done(err, null)
        done()
      })
    }

    fs.mkdir(dirName, function(){
      client.pullChanges(user.dropbox.cursor, processChanges)
    })
  })
}
