angular.module('app').directive('lineChart', ['d3', '$rootScope', 'myConfig', '$timeout', '$http',

    function(d3, $rootScope, myConfig, $timeout, $http) {
        var svg, svgGroup, xAxis, yAxis, splinePath;
        var margin = { top: 0, right: 10, bottom: 0, left: 10 };




        var draw = function(svgGroup, height, width, timedata) {
            // console.log("timedata within draw", timedata);

            // var revisedData = timedata.map(function(data) {
            //     data.created = new Date(data.created);
            //     data.iRms = data.iRms > 1 ? 'ON' : 'OFF';
            //     return data;
            // })

            var width = width - margin.left - margin.right;
            var height = height - margin.top - margin.bottom;

            // var timeArray = timedata.map(function(data) {
            //     return new Date(data.created);
            // })

            var x = d3.scaleTime()
                .rangeRound([0, width])
                .domain(d3.extent(timedata, function(d) {
                    return new Date(d.created);
                }));
            var y = d3.scaleQuantize()
                .domain([0, 2])
                .range([height,0]);
            // console.log("y(1.5)", y(1.5));

            var line = d3.line()
                .x(function(d) {
                    // console.log("d.created", d.created);
                    // console.log("d.created", x(new Date(d.created)));
                    return x(new Date(d.created));
                })
                .y(function(d) {
                    // console.log("d.iRms", d.iRms);
                    // console.log("y(d.iRms)", y(d.iRms));
                    return y(d.iRms);
                })



            
            // xAxis
            //     .attr('transform', "translate(0, " + height + ")")
            //     .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0).tickSizeInner(0))
            // yAxis
            //     .call(d3.axisLeft(y));

            splinePath
                .datum(timedata)
                .attr("class", "line")
                .attr("d", line)
                .style('stroke', "white")
                .style('stroke-width', 2)
                .style('fill', 'none');

            d3.selectAll('g.tick').select('text').attr('fill', 'white')
            d3.selectAll('.domain').remove();

        };



        return {
            restrict: 'A',
            // scope: {
            //     data: '='
            // },
            compile: function(elements, attrs, transclude) {
                // console.log("line directive compile function");
                svg = d3.select(elements[0])
                    .append('svg')
                  

                svgGroup = svg
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + "," + margin.top + ")");

                xAxis = svgGroup
                    .append('g').classed('xAxis', true);

                yAxis = svgGroup
                    .append('g').classed('yAxis', true);


                splinePath = svgGroup.append("path").classed('path', true);

                return function(scope, element, attrs) {
                    // $timeout(function() { responsivefy(svg) }, 100);
                    var totalHeight = 44,
                        totalWidth = 120;
                        svg.attr('width', totalWidth - margin.left - margin.right);
                        svg.attr('height', totalHeight - margin.top - margin.bottom);

                    $rootScope.$watch('$root.popOverData', function(newVal, oldVal) {

                        // Update the chart
                        if (!!newVal) {
                            // console.log("I'm drawing");
                            // console.log("draw Data", $rootScope.popOverData);
                            // $timeout(function(){
                                draw(svgGroup, totalHeight, totalWidth, $rootScope.popOverData);
                            // },500)

                        }
                    }, true);

                }
            },
        }

    }
]);
