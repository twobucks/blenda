var express     = require('express'),
    router      = express.Router(),
    User        = require('./../models/user'),
    kue         = require('kue'),
    jobs        = kue.createQueue()

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

  job   = jobs.create('fetch-images', {
    email: user.email
  }).save()

  res.render('stream', { user: user, images: [{}] });
}

module.exports = router;
