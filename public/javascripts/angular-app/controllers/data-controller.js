angular.module('app').controller('DataController', ['$rootScope', 'd3', '$scope', 'Socket', 'myConfig', '$mdDialog', '$http',
    function($rootScope, d3, $scope, Socket, myConfig, $mdDialog, $http) {

        var self = this;

        var colorScale = d3.scaleLinear()
            .domain([0, 7.5, 15])
            // .interpolate(d3.interpolateCubehelixLong)
            .range(["#e74c3c", "#F39C12", "#1abc9c"]);

        $rootScope.determineStatusString = function(status) {
            if (status === 'busy') {
                return 'In Use'
            } else if (status === 'idle') {
                return "Available"
            } else if (status === 'unsure') {
                return "Used recently"
            } else {
                return "No data available"
            }
        }

        var determineStatusColor = function(iRms, statusChangeMoment) {
            var result = {
                status: null,
                color: "white"
            }
            if (iRms === undefined || iRms === null) {
                return result;
            }

            if (iRms >= 1) {
                result.status = "busy";
                result.color = "#e74c3c";
            } else if (!!statusChangeMoment) {
                var now = moment();
                var duration = moment.duration(now.diff(statusChangeMoment));
                var minutes = duration.asMinutes();
                if (minutes < 15) {
                    result.status = "unsure";
                    result.color = colorScale(minutes);
                } else {
                    result.status = "idle";
                    result.color = "#1abc9c";
                }
            } else {
                result.status = "idle";
                result.color = "#1abc9c";
            }
            return result;
        }



        $rootScope.myConfig = myConfig;
        $rootScope.recentHourData = {};
        $rootScope.machineData = [{
            type: 'M',
            panId: "0013A20040B09A44",
            xCoordinate: 220,
            yCoordinate: 10,
            text: "Mill 1",
            statusColor: "white"
        }, {
            type: 'M',
            panId: "0013A20040D7B896",
            xCoordinate: 260,
            yCoordinate: 10,
            text: "Mill 2",
            statusColor: "white"
        }, {
            type: 'M',
            panId: "0013A20041629B6A",
            xCoordinate: 300,
            yCoordinate: 10,
            text: "Mill 3",
            statusColor: "white"

        }, {
            type: 'M',
            panId: "0013A20041629B72",
            xCoordinate: 340,
            yCoordinate: 10,
            text: "Mill 4",
            statusColor: "white"
        }, {
            type: 'M',
            panId: "0013A20041629B76",
            xCoordinate: 380,
            yCoordinate: 10,
            text: "Mill 5",
            statusColor: "white"
        }, {
            type: 'L',
            panId: "0013A20041629B77",
            xCoordinate: 120,
            yCoordinate: 10,
            text: "Lathe 1",
            statusColor: "white"
        }, {
            type: 'L',
            panId: "0013A20040D7B872",
            xCoordinate: 170,
            yCoordinate: 10,
            text: "Lathe 2",
            statusColor: "white"
        }, {
            type: 'L',
            panId: "0013A20041629B6C",
            xCoordinate: 120,
            yCoordinate: 70,
            text: "Lathe 3",
            statusColor: "white"
        }];




        $http({
            method: 'GET',
            url: '/api/devices'
        }).then(function successCallback(response) {
            $rootScope.machineData.forEach(function(machineUnitData) {
                var panId = machineUnitData.panId;

                $rootScope.recentHourData[panId] = response.data.filter(function(data) {
                    return data.panId === panId;
                }).sort(function(a, b) {
                    return new Date(b) > new Date(a);
                });
                var recentDataSet = $rootScope.recentHourData[panId];
                if (recentDataSet.length > 0) {
                    var mostRecentData = recentDataSet[recentDataSet.length - 1];
                    machineUnitData.iRms = mostRecentData.iRms;
                    if (recentDataSet > 1) {
                        // first one is initialization, not a state change
                        machineUnitData.statusChangeMoment = new moment(mostRecentData.created); //assumption
                    }
                    // machineUnitData.datetime = machineUnitData.statusChangeMoment.format("h:mm:ssa");
                    var statusAndColor = determineStatusColor(machineUnitData.iRms, machineUnitData.statusChangeMoment);
                    machineUnitData.status = statusAndColor.status;
                    machineUnitData.statusColor = statusAndColor.color;
                }


            })
        }, function errorCallback(errr) {
            console.log('retrieving database error!');
        });

        Socket.on("INTERNAL", function(d) {
            $rootScope.storeAvailable = d.isStoreOpen;
            $rootScope.onBreak = d.isOnBreak;
        })




        $rootScope.machineData.forEach(function(machineUnitData) {
            var panId = machineUnitData.panId;
            Socket.on(panId, function(updateMsg) {
                var parsedCurrent = parseFloat(updateMsg);
                var statusUpdate = {
                        panId: panId,
                        created: new moment().utc().format(),
                        iRms: parsedCurrent
                    }
                    $rootScope.recentHourData[panId].push(statusUpdate);
                    $rootScope.machineData = $rootScope.machineData.map(function(data) {
                        if (data.panId === panId) {
                            if (Math.abs(data.iRms - updateMsg) > 1) {
                                // statusChange
                                data.statusChangeMoment = new moment();
                            }
                            data.iRms = parsedCurrent;
                            var statusAndColor = determineStatusColor(data.iRms, data.statusChangeMoment);
                            data.status = statusAndColor.status;
                            data.statusColor = statusAndColor.color;
                            data.datetime = new moment().format("h:mm:ssa");
                        }
                        return data;
                    })
            });
        })

    }
]);
