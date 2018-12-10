'use strict';

var app = angular.module('app', ['ngMaterial'])
.config(function($mdThemingProvider, $mdIconProvider) {
	var rootURL = "https://cdn.jsdelivr.net/gh/angular/material-start@es5-tutorial/app/";

$mdIconProvider
              // .defaultIconSet(rootURL + "assets/svg/avatars.svg", 128)
              .icon("menu", "/images/menu.svg", 24)
              .icon("legend", "/images/legend.svg", 15)

  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
     .dark();
})


