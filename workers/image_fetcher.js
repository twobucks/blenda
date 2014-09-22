process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var kue     = require('kue'),
    jobs    = kue.createQueue(),
    Dropbox = require('dropbox'),
    secrets = require('./../config/secret-keys'),
    async   = require('async'),
    request = require('request'),
    sharp   = require('sharp'),
    fs      = require('fs'),
    db      = require('./../db'),
    User    = require('./../models/user'),
    picName = require('./../utils/picture_name')

jobs.process('fetch-images', 4, function(job, done){
  var email = job.data.email

  User.findOne({email: email}, function(err, result){
    if (err) throw err

    var token  = result.dropbox.token,
        client = new Dropbox.Client({
          key: secrets.dropboxKey,
          secret: secrets.dropboxSecret,
          token: token
        }),
        dirName = "pics/" + result.id

    var getURLs = function(entry, next){
      client.makeUrl(entry, {downloadHack: true }, function(err, data){

        var thumbResize = sharp().resize(600, 400).max(),
            bigResize   = sharp().resize(1200, 1024).max(),
            thumb       = fs.createWriteStream(dirName + "/" + picName(data.url, "thumb")),
            big         = fs.createWriteStream(dirName + "/" + picName(data.url, "large")),
            response    = request(data.url)

        response.pipe(thumbResize).pipe(thumb)
        response.pipe(bigResize).pipe(big)
        response.on('end', function(){
          next(null, data.url)
        })
      })
    }

    fs.mkdir(dirName, function(){
      client.readdir("/", function(err, entries){
        async.map(entries, getURLs, function(err, urls){
          done()
        })
      })
    })
  })
})
