var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deviceSchema = new Schema({
	name: String
});

module.exports = mongoose.model('Bear', deviceSchema);