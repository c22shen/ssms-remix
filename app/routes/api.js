// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies

// Define the routes module' method
module.exports = function(app) {
var device = require(appRoot + '/app/controllers/device.controller');
// var shop = require(appRoot + '/app/controllers/shop.controller');

	// Set up the 'articles' base routes 
	app.route('/api/devices30')
	   .get(device.readAll)

	// Set up the 'articles' base routes 
	app.route('/api/devices')
	   .get(device.read)
	   .post(device.create);
	
	// Set up the 'articles' parameterized routes
	app.route('/api/devices/:panid')
	   .get(device.read)
	   .put(device.update)
	   .delete(device.delete);

	// app.route('/api/shop')
	//    .get(shop.read)
	//    .post(shop.create);


};






