var fs = require('fs'),
    path = require('path')

var listFiles = function(dir, next){
  fs.readdir(dir, function(err, nodes){
    if (err) next(err)
    next(null, nodes.filter(function(node){
      return fs.lstatSync(path.resolve(dir) + "/" + node).isFile()
    }))
  })
}

module.exports = listFiles
