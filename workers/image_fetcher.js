var kue            = require('kue'),
    jobs           = kue.createQueue()

jobs.process('fetch-images', 8, function(job, done){
  var email = job.data.email
  var dropboxFetcher = require('./../utils/dropbox_fetcher')

  dropboxFetcher(email, job, done)
})
