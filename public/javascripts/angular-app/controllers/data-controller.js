angular.module('app').controller('DataController', ['$rootScope', '$scope', 'Socket', 'myConfig',
    function($rootScope, $scope, Socket, myConfig) {
        // var machineInfo = [{ panId: "61a1", type: "M", xcoord: 10, ycoord: 10 },
        //     { panId: "62a2", type: "L", xcoord: 50, ycoord: 50 }
        // ];

        var self = this;
        // message is an object: {panId: , current}
        // $rootScope.busy = {
        //  M: 0,
        //  L: 0 
        // };


        $rootScope.myConfig = myConfig;

//         Socket.on("*",function(event,data) {

//  $rootScope.machineData = $rootScope.machineData.map(function(data) {
//                     if (data.panId === event.toString()) {
//                         data.iRms = updateMsg;
//                     }
//                     return data;
//                 })

// });

var panIdArray = ["0013A20040B09A44",
'0013A20040D7B896',
"0013A20041629B6A",
"0013A20041629B72",
"0013A20041629B76",
"0013A20041629B77",
"0013A20040D7B872",
"0013A20040D7B885"
];

panIdArray.forEach(function(panId){

         Socket.on(panId, function(updateMsg) {
            console.log("Date: ", new Date());
            console.log("new current", updateMsg);
            $rootScope.machineData = $rootScope.machineData.map(function(data) {
                    if (data.panId === panId) {
                        data.iRms = updateMsg;
                    }
                    return data;
                })

        });

});



        // Socket.on('0013A20040D7B896', function(updateMsg) {

        //     console.log("new current", updateMsg);
        //     $rootScope.machineData = $rootScope.machineData.map(function(data) {
        //         if (data.panId === '0013A20040D7B896') {
        //             data.iRms = updateMsg;
        //         }
        //         return data;
        //     })
        // });




    }
]);
