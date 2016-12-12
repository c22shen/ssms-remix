angular.module('app').controller('DataController', ['$rootScope', '$scope', 'Socket', 'myConfig', 
	function($rootScope, $scope, Socket, myConfig) {
    // var machineInfo = [{ panId: "61a1", type: "M", xcoord: 10, ycoord: 10 },
    //     { panId: "62a2", type: "L", xcoord: 50, ycoord: 50 }
    // ];

    var self = this;
    self.users=["1", "2", "3", "4"];
    // message is an object: {panId: , current}
    $rootScope.busy = {
    	M: 0,
    	L: 0 
    };

    $scope.rowClass = function(person){
        return person.current > myConfig.THRESHOLD ? "red-label" : "green-label";
    };

    $rootScope.myConfig = myConfig;

    $rootScope.messages = [
    	{panId:"1", current: 0, x: 1350, y:1200 },
    	{panId:"2", current: 0, x: 1350, y: 1400 },
    	{panId:"3", current: 0, x: 1350, y: 1600 },
    	{panId:"4", current: 0, x: 1350, y: 1800 }
    ];


    Socket.on('0013A20040B09A44', function(updateMsg) {
        $rootScope.currentReading = {date: new Date(), current:updateMsg};


            $rootScope.messages = $rootScope.messages.map(function(d) {
                if (d.panId === updateMsg.panId) {
                	//detect if there is change of state
                	if (!(d.current <= myConfig.THRESHOLD) !== !(updateMsg.current <= myConfig.THRESHOLD)) {
                		
                		var type = "M";
                		//figure out how to do this intelligently


                		if (d.current <= myConfig.THRESHOLD) {
                			$rootScope.busy[type]++;
                		} else {
                			$rootScope.busy[type]--;
                		}
                	}
                    
                    d.current = updateMsg.current;
                }
                return d;
            });

    });



}]);
