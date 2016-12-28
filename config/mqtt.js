// Invoke 'strict' JavaScript mode
'use strict';

var mqtt = require('mqtt');
var url = require('url');
var Device = require(appRoot + '/app/models/device');
var moment = require('moment');
var moment = require('moment-timezone');
var jsonfile = require('jsonfile')

// var file = '/tmp/devicesNow.json'

var weekDayBreakTime = [{
    start: { hour: 12, minute: 33 },
    end: { hour: 12, minute: 40 }
}, {
    start: { hour: 16, minute: 30 },
    end: { hour: 17, minute: 0 }
}, {
    start: { hour: 19, minute: 0 },
    end: { hour: 19, minute: 20 }
}];


var saturdayBreakTime = [{
    start: { hour: 12, minute: 0 },
    end: { hour: 12, minute: 30 }
}, {
    start: { hour: 15, minute: 0 },
    end: { hour: 15, minute: 20 }
}];
var timeAvailable = {
    0: {
        open: { hour: 0, minute: 0 },
        close: { hour: 0, minute: 0 },
        break: []
    },
    1: {
        open: { hour: 8, minute: 30 },
        close: { hour: 17, minute: 0 },
        break: weekDayBreakTime
    },
    2: {
        open: { hour: 8, minute: 30 },
        close: { hour: 21, minute: 0 },
        break: weekDayBreakTime
    },
    3: {
        open: { hour: 8, minute: 30 },
        close: { hour: 21, minute: 0 },
        break: weekDayBreakTime
    },
    4: {
        open: { hour: 8, minute: 30 },
        close: { hour: 21, minute: 0 },
        break: weekDayBreakTime
    },
    5: {
        open: { hour: 8, minute: 30 },
        close: { hour: 21, minute: 0 },
        break: weekDayBreakTime

    },
    6: {
        open: { hour: 10, minute: 0 },
        close: { hour: 17, minute: 0 },
        break: saturdayBreakTime
    }
}








module.exports = function(io) {
    // Parse 
    // m12.cloudmqtt.com:10818
    var mqtt_url = "mqtt://afkibthd:sAgz1qpRVNd4@m12.cloudmqtt.com:10818";
    // var topic_url = "0013A20040B09A44";
    var mqttClient = mqtt.connect(mqtt_url);
    

    mqttClient.on('connect', function() { // When connected
        // mqttClient.subscribe("0013A20041629B6C");
        // mqttClient.subscribe("0013A20041629B76");
        // mqttClient.subscribe("0013A20040D7B896");
        // mqttClient.subscribe("0013A20041629B72");
        // mqttClient.subscribe("0013A20041629B77");
        // mqttClient.subscribe("0013A20041629B6A");
        // mqttClient.subscribe("0013A20040D7B872");
        mqttClient.subscribe("0013A20040B09A44");
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

    // var now = moment();
    // var halfNHourAgo = moment(now).add(-30, 'minutes')

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
        // console.log("mostCurrentData", mostCurrentData); 
        // var buffer = new ArrayBuffer(4);
        // var dataview = new DataView(iRms);
        // console.log(dataview.getFloat32(1)); // 0

        var easternDate = moment.tz({}, "America/Toronto").date();
        var easternDay = moment.tz({}, "America/Toronto").day();

        var openCloseInfo = timeAvailable[easternDay];
        var breakTimes = openCloseInfo.break;


        var onBreak = false;
        var breakTimeStartText, breakTimeEndText;
        breakTimes.forEach(function(breakTime) {
            // console.log("breakTime", breakTime);
            var breakTimeStart = moment.tz({ d: easternDate, h: breakTime.start.hour, m: breakTime.start.minute }, "America/Toronto");
            var breakTimeEnd = moment.tz({ d: easternDate, h: breakTime.end.hour, m: breakTime.end.minute }, "America/Toronto").endOf("minute");;
            // console.log("breakTimeEnd END", breakTimeEnd);
            if (moment() > breakTimeStart && moment() < breakTimeEnd) {
                onBreak = true;
                breakTimeStartText = breakTimeStart.tz('America/Toronto').format("h:mm A");
                breakTimeEndText = breakTimeEnd.tz('America/Toronto').format("h:mm A");
                // console.log("breakTimeStartText", breakTimeStartText);
                // console.log("breakTimeEndText", breakTimeEndText);
            }
        })


        // var openTime = new moment({ d: easternDate, h: openCloseInfo.open.hour, m: openCloseInfo.open.minute });
        // var closeTime = new moment({ d: easternDate, h: openCloseInfo.close.hour, m: openCloseInfo.close.minute });
        var openTime = moment.tz({ d: easternDate, h: openCloseInfo.open.hour, m: openCloseInfo.open.minute }, "America/Toronto");
        var closeTime = moment.tz({ d: easternDate, h: openCloseInfo.close.hour, m: openCloseInfo.close.minute }, "America/Toronto");

        var storeOpen = false;
        if (moment() > openTime && moment() < closeTime) {
            storeOpen = true;
        }
        io.emit("INTERNAL", {isStoreOpen: storeOpen, isOnBreak: onBreak, breakTimeStart: breakTimeStartText, breakTimeEnd: breakTimeEndText}); 

        // var closeTime = moment.tz( {}, "America/Toronto"); 


        // console.log("openTime",openTime.utc().format());
        // console.log("closeTime",closeTime.utc().format());
        // console.log("now ",moment().format());


        var currentValue = parseFloat(iRms).toFixed(2);
        panId = panId.toString();

        if (storeOpen && !onBreak) {
            io.emit(panId, currentValue);
        }



        Device.findOne({
            'panId': panId,
            'created': {
                "$gte": openTime,
                "$lt": closeTime
            }
        }, {}, { sort: { 'created': -1 } }, function(err, lastAvailableData) {
            // console.log("lastAvailableData ", lastAvailableData);
            // console.log("rightNow > openTime", rightNow > openTime);
            // console.log("rightNow < closeTime", rightNow < closeTime);
            // console.log("Math.abs(currentValue - lastAvailableData.iRms)", Math.abs(currentValue - lastAvailableData.iRms));

            // check break time
            if (storeOpen && !onBreak && (!lastAvailableData || Math.abs(currentValue - lastAvailableData.iRms) > 0.1)) {
                var device = new Device();
                device.iRms = currentValue;
                device.panId = panId;

                device.save(function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("device saved");
                    }
                })
            }

        });





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
