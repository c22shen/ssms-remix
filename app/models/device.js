// Invoke 'strict' JavaScript mode
'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deviceSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		unique: true,
		trim: true,
		required: 'Name cannot be blank'
	},
	type: {		
		type: Number,
		default: 0,
		required: true
	},

	status: {
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model('Device', deviceSchema);