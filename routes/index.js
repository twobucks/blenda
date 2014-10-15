var express     = require('express'),
    paginate    = require('express-paginate')
    kue         = require('kue'),

    jobs        = kue.createQueue(),
    router      = express.Router(),

    Image       = require('./../models/image'),
    pictureName = require('./../utils/picture_name'),
    listFiles   = require('./../utils/list_files')

/* GET home page. */
router.get('/', function(req, res) {
  var authenticated = req.user
  if (authenticated){
    photoStream.bind(this, req, res)()
  } else {
    // without pagination:
    //
    // Image.find().sort({updatedAt: -1}).exec(function(err, images){
    //   res.render('index', {images: images})
    // })

    Image.paginate({}, req.query.page, req.query.limit,
               function(err, pageCount,  images, itemCount){
                 var images = images.map(function(image){
                   return {url: image.url('large'),
                           height: image.info.height,
                           width: image.info.width}
                 })
                  res.format({
                    html: function(){
                      res.render('index', {
                        images: images,
                        pageCount: pageCount,
                        itemCount: itemCount
                      })
                    },
                    json: function(){
                      res.json({
                        object: 'list',
                        has_more: paginate.hasNextPages(req)(pageCount),
                        data: images
                      })
                    }
                  })
                }, {sortBy: { updatedAt: -1}})
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
