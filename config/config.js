var _ = require('lodash')
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Extend the base configuration in all.js with environment
// specific configuration.
module.exports = _.extend(
	// Load env settings
	require(__dirname + '/../config/env/all.js'),
	require(__dirname + '/../config/env/' + process.env.NODE_ENV + '.js') || {}
)
