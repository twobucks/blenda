process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var kue            = require('kue'),
    jobs           = kue.createQueue(),
    db             = require('./../db'),
    User           = require('./../models/user'),
    dropboxFetcher = require('./../utils/dropbox_fetcher')

jobs.process('fetch-images', 8, function(job, done){
  var email = job.data.email

  dropboxFetcher(email, done)
})
