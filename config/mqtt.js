// Invoke 'strict' JavaScript mode
'use strict';

var mqtt = require('mqtt');
var url = require('url');
var Device = require(appRoot + '/app/models/device');

var getMachineType = function(machineId) {
    return 0;
}

var getMachineStatus = function(currentValue) {
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

    mqttClient.randomPublish = function() {
        var panIdList = ["61a1", "62a2"];
        var randomIndex = Math.floor(Math.random() * 2);
        var panIdChosen = panIdList[randomIndex];
        var randomCurrentReading = Math.round(Math.random() * 1000);
        var payLoad = {};
        payLoad.id = panIdChosen;
        payLoad.value = randomCurrentReading;
        mqttClient.publish(topic_url, JSON.stringify(payLoad).toString(), function() {
            console.log("random publish ", JSON.stringify(payLoad).toString());
        });
    }

    function createDeviceInfo(json) {
        // console.log("safelyParseJSON string", json);
        // if (json.)
        // This function cannot be optimised, it's best to
        // keep it small!
        // var parsed;
        var device;
        try {

            var parsed = JSON.parse(json);
            console.log("parsed", parsed);
            console.log("parsed id ", parsed.id);
            console.log("parsed value ", parsed.value);
            var device = new Device();

            device.status = parseInt(parsed.value);
            device.name = parsed.id;
            return device;

            // device.status = message.toString();

            // console.log("device.name", JSON.parse(message.toString()).id);
            // device.value = parsed.value;
            // console.log("device.value", JSON.parse(message).value);
        } catch (e) {
            console.log("error", e);
            // Oh well, but whatever...
        }

        return device; // Could be undefined!
    }

    mqttClient.on('message', function(topic, message) {
        console.log("topic ", topic);
        console.log("message ", message.toString());


        // message convention?
        // machineId:machineStatus

        // if topic is /ssms, then save to mongoDb
        // var messageData = message.toString().split(':');
        // if (topic === topic_url && messageData.length === 4) {

        // message format 
        // machineId:currentReading





        // device.name = message.id;
        var deviceInfo = createDeviceInfo(message);
        if (!!deviceInfo) {
            io.emit(topic, {
                status: deviceInfo.status,
                name: deviceInfo.name
            });

        }



        // device.status = getMachineStatus(currentReading);
        // device.save(function(err) {
        //     if (err) {
        //         console.log(err);
        //     }
        //     io.emit(topic, {
        //         status: device.status,
        //         deviceId: device.name
        //     });
        // })

        // }


    });

    return mqttClient;
}
