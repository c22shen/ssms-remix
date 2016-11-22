// Invoke 'strict' JavaScript mode
'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deviceSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	panId: {
		type: String,
		trim: true,
		required: 'Name cannot be blank'
	},

	current: {
		type: Number,
		default: 0
	}
});

module.exports = mongoose.model('Device', deviceSchema);