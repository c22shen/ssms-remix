angular.module('app').directive('barChart', ['d3', '$rootScope', 'myConfig',

    function(d3, $rootScope, myConfig) {

        return {
            restrict: 'E',
            compile: function(elements, attrs, transclude) {
                var svg = d3.select(elements[0]).append('svg').attr('width', "100%").attr('height', "30");
                // var entry = d3.select(elements[0]).append("div")
                // 	.attr("class", "text-center")
                // 	.style("color", "#2980B9")
                // 	.html("<i class='fa fa-arrow-up fa-3x' aria-hidden='true' style='color: #2980B9'></i>");
                 
                svg.append('g').attr("class","background").append('rect').attr('height', 10).attr('width', "100%").style('fill', "#8ccdfd");
                svg.append('g').attr("class", "info").append('rect').attr('height', 10).attr('width', 0	).style('fill', "#199cfc")
               
                //this is the link function
                return function(scope, element, attrs) {
                	$rootScope.$watch('messages', function(newVal, oldVal, scope){
                		var percentageValue = $rootScope.busy.M/myConfig.PANID.M.length*100.0 + '%';
                		d3.select(".info rect").transition().duration(2000).ease(d3.easeQuadOut).attr('width',percentageValue);
                	}, true);
                };
            }
        }
    }
]);
