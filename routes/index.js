var express     = require('express'),
    router      = express.Router(),
    Image       = require('./../models/image'),
    kue         = require('kue'),
    pictureName = require('./../utils/picture_name'),
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

function processDropbox(user){
  // TODO: progress
  user.dropbox.isProcessing = true
  user.save()

  var job  = jobs.create('fetch-images', {
    email: user.email
  })

  var doneProcessing = function(){
    user.dropbox.isProcessing = false
    user.save()
  }

  job.on('complete', doneProcessing)
  job.on('failed', doneProcessing)
  job.save()
}


function photoStream(req, res){
  var user = req.user[0]

  if (!user.dropbox.isProcessing) processDropbox(user)

  Image.find(function(err, images){
    var images = images.map(function(image){
      return {url: '/images/' + image.user + '/' + pictureName(image.name, 'thumb')}
    })
    res.render('stream', { user: user, images: images });
  })
}

module.exports = router;
