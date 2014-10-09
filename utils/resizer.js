var sharp       = require('sharp')

var sizes  = {
  thumb: [600, 400],
  large: [1200, 1024]
}

var resizer = function(size){
  var resizer = sharp()
  return resizer.resize.
    apply(resizer, sizes[size]).max()
}

module.exports = resizer
