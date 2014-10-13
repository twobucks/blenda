var express     = require('express'),
    router      = express.Router(),
    Image       = require('./../models/image'),
    kue         = require('kue'),
    pictureName = require('./../utils/picture_name'),
    listFiles   = require('./../utils/list_files')
    jobs        = kue.createQueue(),

/* GET home page. */
router.get('/', function(req, res) {
  var authenticated = req.user
  if (authenticated){
    photoStream.bind(this, req, res)()
  } else {
    listFiles('./public/images', function(err, images){
      images = images.map(function(image) { return {url: '/images/' + image}})
      console.log(images)
      res.render('index', { images: images });
    })
  }
})

router.post('/sync', function(req, res){
  processDropbox(req.user[0])
  res.redirect('/')
})

function processDropbox(user){
  // TODO: progress
  if (user.dropbox.isProcessing) return

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

  if (user.images.length == 0) processDropbox(user)

  Image.find().sort({updatedAt: -1}).exec(function(err, images){
    // var images = images.map(function(image){
    //   return {url: image.location('large') }
    // })
    //
    listFiles('./public/images', function(err, images){
      images = images.map(function(image) { return {url: '/images/' + image}})
      console.log(images)
      res.render('stream', { user: user, images: images });
    })
  })
}

module.exports = router;
