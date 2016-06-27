// Invoke 'strict' JavaScript mode
'use strict';

var mqtt = require('mqtt');
var url = require('url');
var Device = require(appRoot + '/app/models/device');

var getMachineType = function(machineId){
  return 0;
}

var getMachineStatus = function(currentValue){
  var currentVal = parseInt(currentValue) || 0;
  return currentVal;
}

module.exports = function(io) {
  // Parse 
  // m12.cloudmqtt.com:10818

  var mqtt_url = "mqtt://afkibthd:sAgz1qpRVNd4@m12.cloudmqtt.com:10818";
  var topic_url = "/ssms";
  var mqttClient = mqtt.connect(mqtt_url);
  mqttClient.on('connect', function() { // When connected
    mqttClient.subscribe(topic_url);
  })

mqttClient.on('message', function (topic, message) {

  // message convention?
  // machineId:machineStatus

  // if topic is /ssms, then save to mongoDb
  var messageData = message.toString().split(':');
  if (topic === topic_url && messageData.length === 4){
    
    // message format 
    // machineId:currentReading


    var device = new Device();
    

    device.name = messageData[0] + messageData[1];
    var currentReading = parseInt(messageData[3] + messageData[2], 16);

    device.status=getMachineStatus(currentReading);
    device.save(function(err){
      if(err) {
        console.log(err);
      } 
      io.emit(topic, {
        status: device.status,
        deviceId: device.name
      });
    })

  }


});

  return mqttClient;
}



