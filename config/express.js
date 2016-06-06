// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var config = require('./config'),
	path = require('path'),
	http = require('http'),
	socketio = require('socket.io'),
	express = require('express'),
	logger = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	flash = require('connect-flash');

// Define the Express configuration method
module.exports = function(db) {
	// Create a new Express application instance
	var app = express();
	
	// Create a new HTTP server
    var server = http.createServer(app);

    // Create a new Socket.io server
    var io = socketio.listen(server);

	// Use the 'NDOE_ENV' variable to activate the 'morgan' logger or 'compress' middleware
	if (process.env.NODE_ENV === 'development') {
		app.use(logger('dev'));
	} else if (process.env.NODE_ENV === 'production') {
		app.use(compress());
	}

	// Use the 'body-parser' and 'method-override' middleware functions
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	// Configure the MongoDB session storage
	// var mongoStore = new MongoStore({
 //        db: db.connection.db
 //    });

	// Configure the 'session' middleware
	// app.use(session({
	// 	saveUninitialized: true,
	// 	resave: true,
	// 	secret: config.sessionSecret,
	// 	store: mongoStore
	// }));

	// Set the application view engine and 'views' folder
	app.set('views', appRoot + '/views');
	app.set('views', './app/views');

	app.set('view engine', 'hbs');

	// Configure the flash messages middleware
	app.use(flash());

	// Load the routing files
	require(appRoot + '/app/routes/index')(app);
	require(appRoot + '/app/routes/api')(app);

	// Configure static file serving
	app.use(express.static('./public'));
	// Loadin the Socket.io configuration
	require(appRoot + '/config/socketio')(server, io);
	
	// Return the Server instance
	return server;
};







