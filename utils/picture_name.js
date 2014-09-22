module.exports = function(url, size){
  var fullName = url.replace(/\?dl=0$/,'').split('/').pop(),
      parts    = fullName.split('.'),
      ext      = parts.pop(),
      name     = parts.join('')

  return name + "." + size + "." + ext
}
