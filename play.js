var mongoose = require('mongoose'),
    db = require('./db'),
    vaw = require('./models/user'),
    User = mongoose.model('User')

var user = new User({email: "shime.ferovac@gmail.com"})
user.save(function(err){
  if (err) throw err
  console.log('success')
})

// var user =  User.findOne({email: "shime.ferovac@gmail.com"}, function(err, result){
//   if (err) throw err
//   console.log(result.email)
// })
