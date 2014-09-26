var db      = require('./../db'),
    User    = require('./../models/user'),
    Image   = require('./../models/image'),
    sharp   = require('sharp'),
    fs      = require('fs'),
    Dropbox = require('dropbox'),
    secrets = require('./../config/secret-keys'),
    async   = require('async'),
    request = require('request'),
    picName = require('./picture_name'),
    AWS      = require('aws-sdk'),
    s3stream = require('s3-upload-stream')

module.exports = function(email, done){
  s3stream.client(new AWS.S3())

  User.findOne({email: email}, function(err, user){
    if (err) return done(err, null)

    var token  = user.dropbox.token,
        client = new Dropbox.Client({
          key: secrets.dropboxKey,
          secret: secrets.dropboxSecret,
          token: token
        }),
        dirName = "public/images/" + user.id

    var makePull = function(entry, next){
      client.stat(entry.path, function(err, meta){
        client.makeUrl(entry.path, {downloadHack: true }, function(err, data){

          var upload = {
                "Bucket": "blenda",
                "Key": picName(data.url, "large"),
                "ACL": "public-read",
                "ContentType": meta.mimeType
              }

          Image.create({name: picName(data.url), userId: user.id}, function(err, image){
            if (err) return next(err, null)
            user.images.push(image.id)
            user.save()

            next(null, {data: data, upload: upload})
          })

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

      user.dropbox.cursor = data.cursorTag
      user.save()

      if (data.blankSlate && user.images.length > 0)
        blankSlate()

      async.map(data.changes, getURL, function(err, attrs){
        if (err) return done(err, null)

          async.eachSeries(attrs, function(attr, next){
            var data = attr.data,
                thumbResize = sharp().resize(600, 400).max(),
                bigResize   = sharp().resize(1200, 1024).max(),
                response    = request(data.url),
                upload      = s3stream.upload(attr.upload)

            upload.on('error', function(error){
              console.log(error)
              next(error)
            })

            upload.on('uploaded', function(){
              console.log('uploaded: ' + picName(data.url))
              next()
            })
            console.log('upload started: ' + picName(data.url))

            response.pipe(thumbResize).pipe(upload)
          }, done)

      })
    }

    fs.mkdir(dirName, function(){
      client.pullChanges(user.dropbox.cursor, processChanges)
    })
  })
}
