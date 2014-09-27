var db          = require('./../db'),
    User        = require('./../models/user'),
    Image       = require('./../models/image'),
    sharp       = require('sharp'),
    fs          = require('fs'),
    Dropbox     = require('dropbox'),
    secrets     = require('./../config/secret-keys'),
    async       = require('async'),
    request     = require('request'),
    picName     = require('./picture_name')
    AWS         = require('aws-sdk'),
    s3stream    = require('s3-upload-stream')

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
          s3stream.client(new AWS.S3())
          var response = request(data.url)

          var performUpload = function(size, next){
            var upload   = new s3stream.upload({
              "Bucket": "blenda",
              "Key": picName(data.url, size),
              "ACL": "public-read",
              "ContentType": meta.mimeType
            })

            var resizer = sharp()
            var resize  = resizer.resize.
              apply(resizer, sizes[size]).max()

            upload.on('error', function(error){
              console.log(error)
              next(error)
            })

            upload.on('uploaded', function(details){
              console.log('uploaded: ' + picName(data.url, size))
              console.log('details: ' + details.Location)

              next(null, picName(data.url))
            })
            console.log('upload started: ' + picName(data.url, size))

            response.pipe(resize).pipe(upload)
          }

          async.map(Object.keys(sizes), performUpload, function(err, pics){
            if (err) return next(err)

            var pics = pics.filter(function(value, index, self){
              return self.indexOf(value) === index
            })

            async.each(pics, function(pic, next){
              Image.create({userId: user.id, fullName: pic}, function(err, image){
                if (err) return next(err)
                user.images.push(image.id)
                user.save(next)
              })
            }, function(err, result){
              if (err) return next(err)
              next()
            })
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
        if (err) return done(err)
        console.log('done')
        done()
      })
    }

    fs.mkdir(dirName, function(){
      client.pullChanges(user.dropbox.cursor, processChanges)
    })
  })
}
