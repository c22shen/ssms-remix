(function() {
  'use strict';

  angular
    .module('app')
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
		 $stateProvider
	    .state('home', {
	      url: "/home",
	      templateUrl: "/javascripts/angular-app/tpl/home.html"
	    });
	}]);
}());