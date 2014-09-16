process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('mongoose'),
    config = require('./config/config')

module.exports = mongoose.connect(config.db)
