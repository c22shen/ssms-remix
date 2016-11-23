// Invoke 'strict' JavaScript mode
'use strict';

// How to hook this up without calling the model file?
var Device = require(appRoot + '/app/controllers/device.controller');


exports.create = function(req, res){
		var device = new Device();
		device.name = req.body.name;

		device.save(function(err){
			if(err) {
				res.send(err);
			}

			res.json({message: 'Device created'});
		})
	};

exports.readAll = function(resq, res){
		Device.find(function(err, devices){
			if (err) {
				res.send(err);
			}
			res.json(devices);
		});
	};

exports.read = function(req, res){
		Device.findById(req.params.device_id, function(err, device){
			if (err){
				res.send(err);
			}
			res.json(device);
		})
	};

exports.update = function(req, res){
		Device.findById(req.params.device_id, function(err, device) {
			if (err){
				res.send(err);
			}
			device.name = req.body.name;

			device.save(function(err){
				if (err){
					res.send(err);
				}

				res.json({message: "Device updated"});
			})
		})
	};

exports.delete = function(req, res) {
		Device.remove({
			_id: req.params.device_id
		}, function(err, device) {
			if(err) {
				res.send(err);
			}

			res.json({message: 'Successfully deleted'});
		});
	};



