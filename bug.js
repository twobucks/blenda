// var upload = function(url, next){
//   var AWS         = require('aws-sdk'),
//       s3stream    = require('s3-upload-stream'),
//       request     = require('request'),
//       response    = request(url),
//       fs          = require('fs'),
//       name        = url.split('/').pop(),
//       write       = fs.createWriteStream(name)

//   s3stream.client(new AWS.S3())

//   var upload      = s3stream.upload({
//     "Bucket": "blenda",
//     "Key": name,
//     "ACL": "public-read",
//     "ContentType": "image/png"
//   })

//   upload.on('error', function(error){
//     console.log(error)
//     next(error)
//   })

//   upload.on('uploaded', function(){
//     console.log('uploaded: ' + name)
//     next()
//   })

//   console.log('upload started: ' + name)

//   write.on('end', function(){
//     console.log('done')
//     next()
//   })

//   response.pipe(upload)
// }

// var async = require('async'),
//      pics = ["https://www.npmjs.org/static/img/npm.png", "http://calebmadrigal.com/static/images/nodejs-logo.png"]

// async.each(pics, upload, function(err){
//   if (err) throw err
// })

var dropboxFetcher = require('./utils/dropbox_fetcher')('shime.ferovac@gmail.com', console, function(err){
  if (err) throw err
  console.log('done')
})
