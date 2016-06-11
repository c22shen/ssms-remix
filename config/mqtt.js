// Invoke 'strict' JavaScript mode
'use strict';

var mqtt = require('mqtt');
var url = require('url');

module.exports = function(io) {
  // Parse 
  // m12.cloudmqtt.com:10818

  var mqtt_url = "mqtt://afkibthd:sAgz1qpRVNd4@m12.cloudmqtt.com:10818";
 
  var client = mqtt.connect(mqtt_url);
  client.on('connect', function() { // When connected
    client.subscribe('/ssms');
  })

client.on('message', function (topic, message) {
  io.emit('chatMessage', {
    type: 'status',
    text: message.toString()
  });
});

  return client;
}



