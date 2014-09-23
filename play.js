process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var db = require('./db'),
    User = require('./models/user'),
    Dropbox = require('dropbox'),
    secrets = require('./config/secret-keys')

User.find(function(err, users){
  console.log(users)
})

// var user =  User.findOne({email: "shime.ferovac@gmail.com"}, function(err, user){
//   if (err) throw err
//   var token = user.dropbox.token
//   var client = new Dropbox.Client({
//     key: secrets.dropboxKey,
//     secret: secrets.dropboxSecret,
//     token: token
//   })

//   console.log(user.dropbox.cursor)

//   client.pullChanges(user.dropbox.cursor, function(err, changes){
//     if (err) throw err
//     user.dropbox.cursor = changes.cursorTag
//     user.save()
//     console.log(changes)
//   })
// })
