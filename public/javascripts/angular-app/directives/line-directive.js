angular.module('app').directive('lineChart', ['d3', '$rootScope', 'myConfig', '$timeout', '$http',

    function(d3, $rootScope, myConfig, $timeout, $http) {
        var svg, svgGroup, xAxis, yAxis, splinePath;
        var margin = { top: 10, right: 0, bottom: 15, left: 23 };




        var draw = function(svgGroup, totalHeight, totalWidth, timedata) {

            // var timedata = $rootScope.recentHourData[panId];
            // console.log("panId", panId);
            // console.log("timedata", timedata);
            // if (timedata.length < 2 || timedata.filter(function(d) {
            //         d.iRms > 1
            //     }).length === 0) {
            //     $rootScope.displayText = true;

            // } else {
            //     $rootScope.displayText = false;
            // }
            var width = totalWidth - margin.left - margin.right;
            var height = totalHeight - margin.top - margin.bottom;

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
                .range([height, 0])

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




            xAxis
                .attr('transform', "translate(0, " + height + ")")
                .call(d3.axisBottom(x).ticks(2).tickSizeOuter(0).tickSizeInner(0))
            yAxis
                .call(d3.axisLeft(y).tickFormat(function(d) {
                    if (d === 0) {
                        return "OFF";
                    } else if (d === 2) {
                        return "ON"
                    } else {
                        return ""
                    }
                    // console.log("axis y d", d);
                    return d;
                }).ticks(2).tickSizeOuter(0).tickSizeInner(0));

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
                    var totalHeight = 65,
                        totalWidth = 120;
                    svg.attr('width', totalWidth);
                    svg.attr('height', totalHeight);

                    $rootScope.$watch('$root.recentHourData[$root.popOverPanId]', function(newVal, oldVal) {

                        // Update the chart
                        var machineRecentData = $rootScope.recentHourData[$rootScope.popOverPanId];
                        if (!!machineRecentData) {

                            // console.log("I'm drawing");
                            // console.log("draw Data", $rootScope.popOverData);
                            // $timeout(function(){
                            draw(svgGroup, totalHeight, totalWidth, machineRecentData);
                            // },500)

                        }
                    }, true);

                }
            },
        }

    }
]);
