var kue            = require('kue'),
    jobs           = kue.createQueue(),
    dropboxFetcher = require('./../utils/dropbox_fetcher')

jobs.process('fetch-images', 8, function(job, done){
  var email = job.data.email

  dropboxFetcher(email, done)
})
