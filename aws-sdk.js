var AWS    = require('aws-sdk'),
    s3     = new AWS.S3(),
    params = {Bucket: 'blenda', Key: '5.jpg'},
    file   = require('fs').createWriteStream('6.jpg')
s3.getObject(params).createReadStream().pipe(file)
