var express = require('express'),
    router = express.Router()
    User = require('./../models/user')

/* GET home page. */
router.get('/', function(req, res) {
  var authenticated = req.user
  if (authenticated){
    photoStream.bind(this, req, res)()
  } else {
    res.render('index');
  }
})

function photoStream(req, res){
  // TODO: this is wrong, bastards from Dropbox don't allow
  //       sharing stuff from Dropbox in multiple sizes
  //
  //       API doesn't support resizing images, so we have to do it manually
  //
  //       Current plan:
  //
  //       * take stuff from Dropbox, resize them and store them on S3
  //       * map Dropbox stuff to S3 stuff
  //       * implement background worker with Redis
  //
  var user = req.user[0]

  User.findOne({email: user.email}, function(err, result){
    if (err) throw err
    var token = result.dropbox.token
    var client = new Dropbox.Client({
      key: secrets.dropboxKey,
      secret: secrets.dropboxSecret,
      token: token
    })

    var getThumbAndURL = function(entry, next){
      var thumb = client.thumbnailUrl(entry, {size: 'l'})
      client.makeUrl(entry, {downloadHack: true }, function(err, url){
         next(null, {thumb: thumb, url: url.url})
      })
    }

    client.readdir("/", function(err, entries){
      async.map(entries, getThumbAndURL, function(err, images){
        res.render('stream', { user: user, images: images });
      })
    })
  })
}

module.exports = router;
