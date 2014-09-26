var AWS      = require('aws-sdk'),
    s3stream = require('s3-upload-stream'),
    fs       = require('fs'),
    sharp    = require('sharp'),
    resize   = sharp().resize(600, 400).max()

s3stream.client(new AWS.S3())

var read = fs.createReadStream('public/images/5421dc6d095c663d76615ed7/tiltshift-2012-09-16-1608.thumb.jpg')

var upload = s3stream.upload({
  "Bucket": "blenda",
  "Key": "wat.jpg",
  "ACL": "public-read",
  "ContentType": "image/jpeg"
})
upload.on('error', function (error) {
  console.log(error);
});

read.pipe(resize).pipe(upload)
