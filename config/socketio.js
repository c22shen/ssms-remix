// var config = require('.config');

module.exports=function(server, io){
	io.use(function(socket, next){
		next(null, true);
	});

	io.on('connection', function(socket){
		console.log("io connected");
		require(appRoot+ '/app/controllers/chat.controller')(io, socket);
	});
};