angular.module('app').controller('DataController', ['$rootScope', '$scope', 'Socket', function($rootScope, $scope, Socket) {
	$rootScope.graphData = [{x:1, y:1}, {x:20, y:20},{x:300, y:300},{x:4000, y:4}];

	$scope.messages = [];
	Socket.on('/ssms', function(message){
		$scope.messages.push(message);
	});

	$scope.sendMessage = function() {
		var message = {
			text: this.messageText
		};

		Socket.emit('/ssms', message);

		this.messageText = '';
	}

	$scope.$on('$destroy', function(){
		Socket.removeListener('chatMessage');
	})
}]);