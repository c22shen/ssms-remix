// Invoke 'strict' JavaScript mode
'use strict';

var mqtt = require('mqtt');
var url = require('url');
var Device = require(appRoot + '/app/models/device');

var mostCurrentData = {
    "0013A20040B09A44": 0
}

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
    var topic_url = "0013A20040B09A44";
    var mqttClient = mqtt.connect(mqtt_url);
    mqttClient.on('connect', function() { // When connected
        mqttClient.subscribe(topic_url);
    })

    // mqttClient.randomPublish = function() {
    //     var panIdList = [1,2,3,4];
    //     var randomIndex = Math.floor(Math.random() * 4);
    //     var panIdChosen = panIdList[randomIndex];
    //     var payLoad = {};
    //     payLoad.panId = panIdChosen;
    //     payLoad.current = Math.round(Math.random() * 100);

    //     mqttClient.publish(topic_url, JSON.stringify(payLoad).toString(), function() {
    //         console.log("random publish ", JSON.stringify(payLoad).toString());
    //     });
    // }

    // function createDeviceInfo(iRms, panId) {
    //     // console.log("safelyParseJSON string", json);
    //     // if (json.)
    //     // This function cannot be optimised, it's best to
    //     // keep it small!
    //     // var parsed;
    //     var device;
    //     try {

    //         var device = new Device();

    //         device.current = iRms;
    //         device.panId = panId;
    //         return device;

    //         // device.status = message.toString();

    //         // console.log("device.name", JSON.parse(message.toString()).id);
    //         // device.value = parsed.value;
    //         // console.log("device.value", JSON.parse(message).value);
    //     } catch (e) {
    //         console.log("error", e);
    //         // Oh well, but whatever...
    //     }

    //     return device; // Could be undefined!
    // }

    mqttClient.on('message', function(panId, iRms) {
        console.log("panId", panId);
        console.log("iRms", parseFloat(iRms).toFixed(2));
        // var buffer = new ArrayBuffer(4);
        // var dataview = new DataView(iRms);
        // console.log(dataview.getFloat32(1)); // 0

        var currentValue = parseFloat(iRms).toFixed(2);
        panId = panId.toString();
        if (Math.abs(currentValue-mostCurrentData[panId])>0.1 || true) {
            var device = new Device();
            device.iRms = currentValue;
            device.panId = panId;

            device.save(function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("device saved");
                }
                io.emit(device.panId, device.iRms);
                mostCurrentData[panId] =currentValue; 
            })
        }



        //     console.log("websocket send current", deviceInfo.current);
        //     console.log("websocket send panId", deviceInfo.panId);
        //     io.emit(topic, {
        //         current: device.iRms,
        //         panId: device.panId
        //     });

        // }



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
