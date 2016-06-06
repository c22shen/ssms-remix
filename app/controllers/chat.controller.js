// Invoke 'strict' JavaScript mode
'use strict';

module.exports = function(io, socket){
	io.emit('chatMessage', {
		type: 'status',
		text: 'connected',
		created: Date.now()
	});

	socket.on('chatMessage', function(message) {
		message.type = 'message';
		message.created = Date.now();

		io.emit('chatMessage', message);
	});

	socket.on('disconnect', function(){
		io.emit('chatMessage', {
			type: 'status',
			text: 'disconnected',
			created: Date.now()
		});
	});
};