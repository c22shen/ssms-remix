// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies

// Define the routes module' method
module.exports = function(app) {
var device = require(appRoot + '/app/controllers/device.controller');


	// Set up the 'articles' base routes 
	app.route('/api/devices')
	   .get(device.readAll)
	   .post(device.create);
	
	// Set up the 'articles' parameterized routes
	app.route('/api/devices/:device_id')
	   .get(device.read)
	   .put(device.update)
	   .delete(device.delete);
};






