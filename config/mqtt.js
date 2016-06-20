// Invoke 'strict' JavaScript mode
'use strict';

var mqtt = require('mqtt');
var url = require('url');
var Device = require(appRoot + '/app/models/device');
module.exports = function(io) {
  // Parse 
  // m12.cloudmqtt.com:10818

  var mqtt_url = "mqtt://afkibthd:sAgz1qpRVNd4@m12.cloudmqtt.com:10818";
  var topic_url = "/ssms";
  var client = mqtt.connect(mqtt_url);
  client.on('connect', function() { // When connected
    client.subscribe(topic_url);
  })

client.on('message', function (topic, message) {

  // message convention?
  // machineId:machineStatus

  // if topic is /ssms, then save to mongoDb
  if (topic === '/ssms'){
    ///////////////////////////////
    // Need to derive from message
    var device = new Device();
    device.name = "xiao";
    device.type=0;
    device.status=true;
    device.save(function(err){
      if(err) {
        res.send(err);
      }

      console.log("Device created");
    })

  }

  io.emit(topic, {
    type: 'status',
    text: message.toString()
  });
});

  return client;
}



