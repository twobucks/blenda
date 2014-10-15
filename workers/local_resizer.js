var listFiles = require('./../utils/list_files'),
    fs = require('fs'),
    picName = require('./../utils/picture_name'),
    path = require('path'),
    sharp = require('sharp'),
    db = require('../db'),
    Image = require('../models/image'),
    picName = require('../utils/picture_name')

Image.collection.remove(function(err, images){
  if (err) throw err
  console.log('images removed')
  listFiles('./public/images/raw', function(err, files){
    files.forEach(function(file){
      var resize = sharp().resize(null, 500).max().rotate()
      resize.toBuffer(function(err, buffer, info){
        // TODO: is this okay?
        Image.create({host: '/images', fullName: picName(file), info: info},
                     function(err, image){ if (err) throw err })
      })
      var name = picName(file, 'large')
      var orig = path.resolve('./public/images/raw') + "/" + file
      var dest = path.resolve('./public/images') + "/" + name
      var write = fs.createWriteStream(dest)
      var read = fs.createReadStream(orig)
      read.pipe(resize).pipe(write)

      write.on('finish', function(){
        console.log('done ', name)
      })
    })
  })
})
