var express     = require('express'),
    router      = express.Router(),
    User        = require('./../models/user'),
    request     = require('request'),
    sharp       = require('sharp'),
    fs          = require('fs')

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

    var getURLs = function(entry, next){
      client.makeUrl(entry, {downloadHack: true }, function(err, data){
        // var thumbResize = sharp().resize(600, 400).max()
        // var bigResize   = sharp().resize(1200, 1024).max()
        // var name  = Math.random().toString(36).substring(7);
        // var thumb = fs.createWriteStream("pics/" + name + ".thumb.jpg")
        // var big   = fs.createWriteStream("pics/" + name + ".big.jpg")
        // var response = request(data.url)
        // response.pipe(thumbResize).pipe(thumb)
        // response.pipe(bigResize).pipe(big)
        // response.on('end', function(){
          next(null, data.url)
        // })
      })
    }

    client.readdir("/", function(err, entries){
      async.map(entries, getURLs, function(err, urls){
        res.render('stream', { user: user, urls: [] });
      })
    })
  })
}

module.exports = router;
