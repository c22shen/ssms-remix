angular.module('app').directive('lineChart', ['d3', '$rootScope', 'myConfig', '$timeout', '$http',

    function(d3, $rootScope, myConfig, $timeout, $http) {
        var svg;




        return {
            restrict: 'A',
            compile: function(elements, attrs, transclude) {
                svg = d3.select(elements[0])
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom);
                var margin = { top: 20, right: 10, bottom: 30, left: 10 };
                $http({
                    method: 'GET',
                    url: '/api/devices/0013A20040B09A44'
                }).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    var lineChartWidth = 600;
                    var lineChartHeight = 400;
                    console.log(response);
                    // svg.append('g').classed("lineChart")
                    //     .attr('width', lineChartWidth)
                    //     .attr('height', lineChartHeight)
                    //     .call(responsivefy)
                }, function errorCallback(error) {
                    console.log("error");
                });



                return function(scope, element, attrs) {

                }
            },
        }

    }
]);
