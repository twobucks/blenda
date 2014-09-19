var express = require('express'),
    router = express.Router()
    User = require('./../models/user')

/* GET home page. */
router.get('/', function(req, res) {
  var authenticated = req.user
  if (authenticated){
    photoStream.bind(this, req, res)()
  } else {
    res.render('index', { authenticated: authenticated });
  }
})

function photoStream(req, res){
  var user = req.user[0]

  User.findOne({email: "shime.ferovac@gmail.com"}, function(err, result){
    if (err) throw err
    var token = result.dropbox.token
    var client = new Dropbox.Client({
      key: secrets.dropboxKey,
      secret: secrets.dropboxSecret,
      token: token
    })

    // TODO: caching
    var getThumbAndURL = function(entry, next){
      var thumb = client.thumbnailUrl(entry, {size: 'l'})
      next(null, {thumb: thumb, url: ''})
      // client.makeUrl(entry, {downloadHack: true }, function(err, url){
      //   next(null, {thumb: thumb, url: url.url})
      // })
    }

    client.readdir("/", function(err, entries){
      async.map(entries, getThumbAndURL, function(err, images){
        res.render('stream', { user: user, images: images });
      })
    })
  })
}

module.exports = router;
