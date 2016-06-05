var express = require('express');
var Device = require('../models/device');

var router = express.Router();

router.route('/devices')
	.post(function(req, res){
		var device = new Device();
		device.name = req.body.name;

		device.save(function(err){
			if(err) {
				res.send(err);
			}

			res.json({message: 'Device created'});
		})
	})

	.get(function(resq, res){
		Device.find(function(err, devices){
			if (err) {
				res.send(err);
			}
			res.json(devices);
		});
	});

router.route('/devices/:device_id')
	.get(function(req, res){
		Device.findById(req.params.device_id, function(err, device){
			if (err){
				res.send(err);
			}
			res.json(device);
		})
	})
	.put(function(req, res){
		Device.findById(req.params.bear_id, function(err, device) {
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
	})

	.delete(function(req, res) {
		Device.remove({
			_id: req.params.bear_id
		}, function(err, device) {
			if(err) {
				res.send(err);
			}

			res.json({message: 'Successfully deleted'});
		});
	});


module.exports = router;



