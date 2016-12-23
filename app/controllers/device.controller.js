// Invoke 'strict' JavaScript mode
'use strict';

// How to hook this up without calling the model file?
var Device = require(appRoot + '/app/models/device');
var moment = require('moment');

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
var openTime = new moment({ h: openCloseInfo.open.hour, m: openCloseInfo.open.minute });
var closeTime = new moment({ h: openCloseInfo.close.hour, m: openCloseInfo.close.minute });

console.log("openTime",openTime.format("h:mm A"));
console.log("closeTime",closeTime.format("h:mm A"));






exports.create = function(req, res) {
    var device = new Device();
    device.name = req.body.name;

    device.save(function(err) {
        if (err) {
            res.send(err);
        }

        res.json({ message: 'Device created' });
    })
};

exports.readAll = function(req, res) {
    // ,{ sort: { 'created_at': 1 } }
    Device.find({
        created: {
            "$gte": moment({ hour: 8, minute: 30 }),
            "$lt": moment({ hour: 21, minute: 0 })
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
