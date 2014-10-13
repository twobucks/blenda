var listFiles = require('./../utils/list_files'),
    fs = require('fs'),
    picName = require('./../utils/picture_name'),
    path = require('path'),
    sharp = require('sharp')

listFiles('./public/images/raw', function(err, files){
  files.forEach(function(file){
    var resize = sharp().resize(314).max()
    var name = picName(file, 'large')
    var orig = path.resolve('./public/images/raw') + "/" + file
    var dest = path.resolve('./public/images') + "/" + name
    console.log('resizing ', name)
    var write = fs.createWriteStream(dest)
    var read = fs.createReadStream(orig)
    read.pipe(resize).pipe(write)

    write.on('finish', function(){
      console.log('done ', name)
    })
  })
})

