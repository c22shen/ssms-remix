angular.module('app').controller('DataController', ['$rootScope', '$scope', 'Socket', function($rootScope, $scope, Socket) {

	$scope.messages = {};
	Socket.on('/ssms', function(message){
		var status = {};
		$scope.messages[message.name] = message.status; 
	});
}]);