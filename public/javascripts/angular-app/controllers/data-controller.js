angular.module('app').controller('DataController', ['$rootScope', '$scope', 'Socket', 'myConfig',
    function($rootScope, $scope, Socket, myConfig) {

        var self = this;

        $rootScope.myConfig = myConfig;


        var panIdArray = ["0013A20040B09A44",
            '0013A20040D7B896',
            "0013A20041629B6A",
            "0013A20041629B72",
            "0013A20041629B76",
            "0013A20041629B77",
            "0013A20040D7B872",
            "0013A20040D7B885"
        ];

        panIdArray.forEach(function(panId) {

            Socket.on(panId, function(updateMsg) {
                console.log("Date: ", new Date());
                console.log("new current", updateMsg);
                $rootScope.machineData = $rootScope.machineData.map(function(data) {
                    if (data.panId === panId) {
                        data.iRms = updateMsg;
                        data.datetime = new moment().format("hh:mm:ssa");
                    }
                    return data;
                })

            });

        });



    }
]);
