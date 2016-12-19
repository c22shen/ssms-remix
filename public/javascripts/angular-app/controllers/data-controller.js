angular.module('app').controller('DataController', ['$rootScope', '$scope', 'Socket', 'myConfig', '$mdDialog', '$http',
    function($rootScope, $scope, Socket, myConfig, $mdDialog, $http) {

        var self = this;

        $rootScope.myConfig = myConfig;
        $rootScope.recentHourData = {};

        var panIdArray = ["0013A20040B09A44",
            '0013A20040D7B896',
            "0013A20041629B6A",
            "0013A20041629B72",
            "0013A20041629B76",
            "0013A20041629B77",
            "0013A20040D7B872",
            "0013A20040D7B885"
        ];

        // /0013A20040B09A44
        $http({
            method: 'GET',
            url: '/api/devices'
        }).then(function successCallback(response) {
            panIdArray.forEach(function(panId) {
                $rootScope.recentHourData[panId] = response.data.filter(function(data) {
                    return data.panId === panId;
                });
            })
        }, function errorCallback(errr) {
            console.log('retrieving database error!');
        });


        panIdArray.forEach(function(panId) {

            Socket.on(panId, function(updateMsg) {
                console.log("Date: ", new Date());
                console.log("new current", updateMsg);
                var statusUpdate = {
                    created: new Date(),
                    iRms: updateMsg
                }

                $rootScope.recentHourData[panId].shift();
                $rootScope.recentHourData[panId].push(statusUpdate);


                $rootScope.machineData = $rootScope.machineData.map(function(data) {
                    if (data.panId === panId) {
                        data.iRms = updateMsg;
                        data.datetime = new moment().format("h:mm:ssa");
                    }
                    return data;
                })

            });

        });



    }
]);
