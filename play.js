process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('mongoose'),
    db = require('./db'),
    vaw = require('./models/user'),
    User = mongoose.model('User'),
    Dropbox = require('dropbox'),
    secrets = require('./config/secret-keys')

// var user = new User({email: "shime.ferovac@gmail.com"})
// user.save(function(err){
//   if (err) throw err
//   console.log('success')
// })

var user =  User.findOne({email: "shime.ferovac@gmail.com"}, function(err, result){
  if (err) throw err
  var token = result.dropbox.token
  var client = new Dropbox.Client({
    key: secrets.dropboxKey,
    secret: secrets.dropboxSecret,
    token: token
  })

  client.readdir("/", function(err, entries){
    entries.forEach(function(entry){
      console.log(client.thumbnailUrl(entry, {size: 'large'}))
    })
  })
})
