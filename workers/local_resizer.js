var fs            = require('fs'),
    path          = require('path'),
    sharp         = require('sharp'),
    dominantColor = require('dominant-color'),
    oneColor      = require('onecolor'),
    async         = require('async'),
    mongoose      = require('mongoose'),

    db            = require('../db'),
    Image         = require('../models/image'),

    listFiles     = require('../utils/list_files'),
    picName       = require('../utils/picture_name')

var start = new Date().getTime()

Image.collection.remove(function(err, images){
  if (err) throw err
  listFiles('./public/images/raw', function(err, files){
    async.each(files, function(file, next){
      var name   = picName(file, 'large'),
          orig   = path.resolve('./public/images/raw') + "/" + file,
          dest   = path.resolve('./public/images') + "/" + name,
          resize = sharp().resize(null, 500).max().rotate(),
          write  = fs.createWriteStream(dest),
          read   = fs.createReadStream(orig)

      dominantColor(path.resolve('./public/images/raw') + "/" + file, function(err, color){
        resize.toBuffer(function(err, buffer, info){
          // TODO: this is pretty slow, make it smarter?
          info.color = oneColor('#' + color).saturation(0.7).hex()
          Image.create({host: '/images', fullName: picName(file), info: info},
                       function(err, image){ if (err) throw err })
        })
        read.pipe(resize).pipe(write)

        write.on('finish', function(){
          console.log('done ', name)
          next(null, name)
        })
      })
    }, function (err, result){
      if (err) throw err
      var end = new Date().getTime()
      console.log("time: ", end - start, "ms")
      mongoose.disconnect()
    })
  })
})
