// Invoke 'strict' JavaScript mode
'use strict';
require('newrelic');
// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

global.appRoot = require('path').resolve(__dirname);
console.log("Root path is: ", global.appRoot);

// Load the module dependencies
// var mongoose = require('./config/mongoose')
    var express = require('./config/express');

// Create a new Mongoose connection instance
// var db = mongoose();


var url = process.env.MONGODB_URI || 'mongodb://localhost/27017/ssms';
var MongoClient = require('mongodb').MongoClient;
    // assert = require('assert');

MongoClient.connect(url, function(err, db) {
    // assert.equal(null, err);
    console.log("Connected successfully to server");

    db.close();
});


// Create a new Express application instance
var app = express(db);

// Use the Express application instance to listen to the '3000' port
app.listen(process.env.PORT || 3000);

// Log the server status to the console
console.log('Server running at http://localhost:3000/');

// Use the module.exports property to expose our Express application instance for external usage
module.exports = app;
