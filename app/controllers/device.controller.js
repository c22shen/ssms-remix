// Invoke 'strict' JavaScript mode
'use strict';

// How to hook this up without calling the model file?
var Device = require(appRoot + '/app/models/device');
var moment = require('moment');

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

    Device.find(function(err, devices) {
        if (err) {
            res.send(err);
        }
        res.json(devices);
    });
};

exports.read = function(req, res) {
    //panId, created minutes restriction
    var panId = req.params.panid;

    // var minutes = req.params.minutes;
     var now = moment();
	var fiveHourAgo = moment(now).add(-5, 'hours');
	var tenHoursAgo = moment(now).add(-10, 'hours');
var threeHoursAgo = moment(now).add(-3, 'hours');
    Device.find({
        created: {
            "$gte": moment(now).add(-1, 'hours'),
            "$lt": moment()
        }
        // 'panId': panId,
        // 'iRms': {
        //   "$gte": 1
        // }
    }, 'panId created iRms -_id', function(err, devices) {

        if (err) {
            res.send(err);
        }

        // devices.map(function(dataSet){
        // 	var dateTime = new Date(dataSet.created).getT 
        // })

        res.json(devices);
    });
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
