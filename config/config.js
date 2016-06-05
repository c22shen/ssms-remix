// Invoke 'strict' JavaScript mode
'use strict';

// Set the 'production' environment configuration object
module.exports = {
	db: process.env.MONGOLAB_URI || 'mongodb://localhost/mean-production',
	sessionSecret: 'productionSessionSecret'
};