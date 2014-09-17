var mongoose = require('mongoose'),
    config = require('./config/config')

module.exports = mongoose.connect(config.db)
