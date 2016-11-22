angular.module('app').directive('barChart', ['d3', '$rootScope', 'myConfig',

    function(d3, $rootScope, myConfig) {
    	// var percentageValue =[];
  		var draw = function(rect) {

  			if (!!$rootScope.messages) {

  				var percentageValue = $rootScope.busy.L/myConfig.PANID.L.count*100.0;
  				var percentageValue = percentageValue = "%"; 
  				console.log("percentageValue",percentageValue);

 				svg.selectAll('rect').data([{percent:percentageValue}]).
 				enter()
 				.append('rect')
 				.attr('height', 20).style('fill', "#199cfc")
  				.attr('width', function(d){
  					return d.percent + '%'
  				});
  				rect.attr('height',percentageValue);
  			
  			}
  		};



        return {
            restrict: 'E',
            compile: function(elements, attrs, transclude) {
                var svg = d3.select(elements[0]).append('svg').attr('width', "100%");

                 
                svg.append('g').attr("class","background").append('rect').attr('height', 20).attr('width', "100%").style('fill', "#8ccdfd");
                svg.append('g').attr("class", "info").append('rect').attr('height', 20).attr('width', 0	).style('fill', "#199cfc")
               
                // var rect = svg.append('rect').attr('height', 20).style('fill', "#199cfc")
                var height = 300;

                //this is the link function
                return function(scope, element, attrs) {
                	$rootScope.$watch('messages', function(newVal, oldVal, scope){
                		// draw();

                		var percentageValue = $rootScope.busy.M/myConfig.PANID.M.length*100.0 + '%';
                		d3.select(".info rect").transition().duration(2000).ease(d3.easeQuadOut).attr('width',percentageValue );
                	}, true);
                };
            }
        }
    }
]);
