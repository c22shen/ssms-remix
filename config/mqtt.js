// Invoke 'strict' JavaScript mode
'use strict';

var mqtt = require('mqtt');
var url = require('url');
var Device = require(appRoot + '/app/models/device');
var moment = require('moment');
var jsonfile = require('jsonfile')

var file = '/tmp/devicesNow.json'

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
    // var topic_url = "0013A20040B09A44";
    var mqttClient = mqtt.connect(mqtt_url);
    mqttClient.on('connect', function() { // When connected
        mqttClient.subscribe("0013A20040B09A44");
        mqttClient.subscribe("0013A20040D7B896");
        mqttClient.subscribe("0013A20041629B6A");
        mqttClient.subscribe("0013A20041629B72");
        mqttClient.subscribe("0013A20041629B76");
        mqttClient.subscribe("0013A20041629B77");
        mqttClient.subscribe("0013A20040D7B872");
        mqttClient.subscribe("0013A20040D7B885");
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



//     var today = moment().startOf('day')
// var tomorrow = moment(today).add(1, 'days')

    var now = moment();
var halfNHourAgo = moment(now).add(-30, 'minutes')

// {"$gte": new Date(2012, 7, 14), "$lt": new Date(2012, 7, 15)}

// Device.find({
//   created: {
//     "$gte": halfNHourAgo,
//     "$lt": now
//   },
//   'panId': '0013A20040B09A44',
//   // 'iRms': {
//   //   "$gte": 1
//   // }
// }, 'created iRms -_id', function (err, devices) {
//     console.log("devices", devices);
//     console.log("devices number", devices.length);
//     var json = JSON.stringify(devices);
//     console.log(json);
//     // fs.writeFile('myjsonfile.json', json, 'utf8', function(){});
// })


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
