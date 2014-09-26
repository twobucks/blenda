var knox = require('knox').createClient({
  key: process.env.AWS_ACCESS_KEY_ID,
  secret: process.env.AWS_SECRET_ACCESS_KEY,
  bucket: 'blenda'
}),
  filePath = '6.jpg',
  fs     = require('fs'),
  file   = fs.createReadStream(filePath),
  size   = fs.statSync(filePath)["size"]
  mime   = require('mime'),
  mimetype = mime.lookup(filePath)

  knox.putStream(file, 'file.jpg', {
    'Content-Type': mimetype,
    'Cache-Control': 'max-age=604800',
    'x-amz-acl': 'public-read',
    'Content-Length': size
  }, function(err, result) {
    console.log(result);
  })

