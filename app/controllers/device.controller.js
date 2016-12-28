// Invoke 'strict' JavaScript mode
'use strict';

// How to hook this up without calling the model file?
var Device = require(appRoot + '/app/models/device');
var moment = require('moment');
var moment = require('moment-timezone');

var weekDayBreakTime = [{
    start: { hour: 12, minute: 0 },
    end: { hour: 12, minute: 30 }
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
        close: { hour: 0, minute: 0 }
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




var rightNow = new moment();
var openCloseInfo = timeAvailable[rightNow.day()];

var easternDate = moment.tz("America/Toronto").date();
console.log("easternDate", easternDate);

var openTime = moment.tz({ d: easternDate, h: openCloseInfo.open.hour, m: openCloseInfo.open.minute }, "America/Toronto");
var closeTime = moment.tz({ d: easternDate, h: openCloseInfo.close.hour, m: openCloseInfo.close.minute }, "America/Toronto").endOf('minute');

// console.log("openTime",openTime.format());
// console.log("closeTime",closeTime.format());



// exports.create = function(req, res) {
//     var l1PanId = "0013A20041629B77";
//     var currentStatus = 0;
//     var monday10 = moment.tz({ d: 12, h: 9 }, "America/Toronto").toDate();
//     var monday11 = moment.tz({ d: 12, h: 11 }, "America/Toronto").toDate();
//     var monday20 = moment.tz({ d: 19, h: 10 }, "America/Toronto").toDate();
//     var monday21 = moment.tz({ d: 19, h: 12 }, "America/Toronto").toDate();




//     var monday10Device = new Device();
//     monday10Device.iRms = 2;
//     monday10Device.panId = l1PanId;
//     monday10Device.created = monday10;


//     var monday11Device = new Device();
//     monday11Device.iRms = 0;
//     monday11Device.panId = l1PanId;
//     monday11Device.created = monday11;


//     var monday20Device = new Device();
//     monday20Device.iRms = 2;
//     monday20Device.panId = l1PanId;
//     monday20Device.created = monday20;


//     var monday21Device = new Device();
//     monday21Device.iRms = 0;
//     monday21Device.panId = l1PanId;
//     monday21Device.created = monday21;





//     // device.name = req.body.name;

//     monday10Device.save(function(err) {
//         if (err) {
//             res.send(err);
//         }
//         monday11Device.save(function(err) {
//             if (err) {
//                 res.send(err);
//             }
//             monday20Device.save(function(err) {
//                 if (err) {
//                     res.send(err);
//                 }
//                 monday21Device.save(function(err) {
//                     if (err) {
//                         res.send(err);
//                     }
//                     res.send('saved all');



//                 })



//             })




//         })



//     })
// };

exports.readAll = function(req, res) {
    // ,{ sort: { 'created_at': 1 } }
    var easternDate = moment.tz('America/Toronto').date() - 1; // do not let today's data dilute the average, consider yesterday, which has been completed.
    var openTime = moment.tz({ d: easternDate, h: 8, m: 30 }, "America/Toronto");
    var closeTime = moment.tz({ d: easternDate, h: 21, m: 0 }, "America/Toronto");

    Device.find({
        created: {
            "$gte": openTime.add(-2, 'weeks'),
            "$lt": closeTime
        }
    }, 'panId created iRms -_id', function(err, devices) {
        if (err) {
            res.send(err);
        }
        res.json(devices);
    })
};

exports.read = function(req, res) {
    //panId, created minutes restriction
    // var panId = req.params.panid;

    // var minutes = req.params.minutes;
    // var now = moment();
    // var fiveHourAgo = moment(now).add(-5, 'hours');
    // var tenHoursAgo = moment(now).add(-10, 'hours');
    // var threeHoursAgo = moment(now).add(-3, 'hours');
    //     var today = moment().startOf('day')
    // var tomorrow = moment(today).add(1, 'days')
    Device.find({
        created: {
            "$gte": openTime,
            "$lt": closeTime
        },



        // 'panId': panId,
        // 'iRms': {
        //   "$gte": 1
        // }
    }, {}, {}, function(err, devices) {

        if (err) {
            res.send(err);
        }

        // devices.map(function(dataSet){
        //  var dateTime = new Date(dataSet.created).getT 
        // })

        res.json(devices);
    });

    // Device.find().sort('created', -1).limit(5).exec(function(err, p) {
    //     if (err) { res.send(err); };
    //     console.log("p", p);
    //     res.json(p);

    // })
}

exports.update = function(req, res) {
    Device.findById(req.params.device_id, function(err, device) {
        if (err) {
            res.send(err);
        }
        device.name = req.body.name;

        device.save(function(err) {
            if (err) {
                res.send(err);
            }

            res.json({ message: "Device updated" });
        })
    })
};

exports.delete = function(req, res) {
    Device.remove({
        _id: req.params.device_id
    }, function(err, device) {
        if (err) {
            res.send(err);
        }

        res.json({ message: 'Successfully deleted' });
    });
};
