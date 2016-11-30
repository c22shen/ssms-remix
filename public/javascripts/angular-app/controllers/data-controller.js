angular.module('app').controller('DataController', ['$rootScope', '$scope', 'Socket', 'myConfig', 
	function($rootScope, $scope, Socket, myConfig) {
    // var machineInfo = [{ panId: "61a1", type: "M", xcoord: 10, ycoord: 10 },
    //     { panId: "62a2", type: "L", xcoord: 50, ycoord: 50 }
    // ];


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
        console.log("messaged received on socket", updateMsg);
        // var currentInfoAvailable = $rootScope.messages.filter(function(data) {
        //         // console.log("$scope.messages is ", $rootScope.messages);
        //         // console.log("data is", data);
        //         return data.panId === updateMsg.panId;
        //     }).length > 0;


        // if (currentInfoAvailable){ 
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
        // } else {
        	// if(updateMsg.current >myConfig.THRESHOLD) {
        	// 	var type = "M";
        	// 	$rootScope.busy[type]++;
        	// }
         //    $rootScope.messages.push(updateMsg);
        // }


    });

    // console.log(d3.select('.chart1'));
    // var chart1 = d3.select('.chart1');

    // var dataArray=[{name: "Milling", width:50}];
    // console.log(dataArray);
    // var update = d3.select('.chart1').selectAll('rect')
    //     .data(dataArray, function(d) {
    //     	return d? d.name: "test";
    //     });

    // var enter = update.enter()
    // 	.append('rect');


    // console.log(temp1);
    // .append('rect')
    // .width(function(d){
    // 	return d.width;
    // })
    // .height(function(d){
    // 	return 20;
    // }).fill("#8ccdfd");

    // var scores = [
    //   { name: 'Alice', score: 96 },
    //   { name: 'Billy', score: 83 },
    //   { name: 'Cindy', score: 91 },
    //   { name: 'David', score: 96 },
    //   { name: 'Emily', score: 88 }
    // ];

    // var update = d3.select('.chart1')
    //   .selectAll('div')
    //   .data(scores, function (d) {
    //     return d ? d.name : this.innerText;
    //   })
    //   .style('color', 'blue');

    // var enter = update.enter()
    //   .append('div')
    //   .text(function (d) {
    //     return d.name;
    //   })
    //   .style('color', 'green');

    // update.exit().remove();

    // update.merge(enter)
    //   .style('width', d => d.score + 'px')
    //   .style('height', '50px')
    //   .style('background', 'lightgreen')
    //   .style('border', '1px solid black')





}]);
