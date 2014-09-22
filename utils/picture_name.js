module.exports = function(url, size){
  var fullName = url.replace(/\?dl=0$/,'').split('/').pop()

  if (!size) return fullName

  var parts    = fullName.split('.'),
      ext      = parts.pop(),
      name     = parts.join('')

  return name + "." + size + "." + ext
}
