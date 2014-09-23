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

module.exports = function(email, done){
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
      client.makeUrl(entry.path, {downloadHack: true }, function(err, data){

        var thumbResize = sharp().resize(600, 400).max(),
            bigResize   = sharp().resize(1200, 1024).max(),
            thumb       = fs.createWriteStream(dirName + "/" + picName(data.url, "thumb")),
            big         = fs.createWriteStream(dirName + "/" + picName(data.url, "large")),
            response    = request(data.url)

        Image.create({name: picName(data.url), userId: user.id}, function(err, image){
          if (err) return next(err, null)
          user.images.push(image.id)
          user.save()
        })

        response.pipe(thumbResize).pipe(thumb)
        response.pipe(bigResize).pipe(big)
        response.on('end', function(){
          next(null, data.url)
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

      async.map(data.changes, getURL, function(err, urls){
        if (err) return done(err, null)

        done()
      })
    }

    fs.mkdir(dirName, function(){
      client.pullChanges(user.dropbox.cursor, processChanges)
    })
  })
}
