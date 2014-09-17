var Dropbox = require('dropbox'),
    secrets = require('./secret-keys')

var client = new Dropbox.Client({
  key: secrets.dropboxKey,
  secret: secrets.dropboxSecret
})

client.authDriver(new Dropbox.AuthDriver.NodeServer(8192))

module.exports = client

// Runs and returns the Dropbox Auth server
// module.exports = new Dropbox.AuthDriver.NodeServer(8192);
