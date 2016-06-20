// Invoke 'strict' JavaScript mode
'use strict';

// Set the 'production' environment configuration object
module.exports = {
	db: process.env.MONGOLAB_URI || 'mongodb://localhost/27017/ssms',
	sessionSecret: 'productionSessionSecret'
};