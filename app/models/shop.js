// Invoke 'strict' JavaScript mode
'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shopSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	isStoreOpen: {
		type: Boolean
	},

	isOnBreak: {
		type: Boolean
	}
});

module.exports = mongoose.model('Shop', shopSchema);