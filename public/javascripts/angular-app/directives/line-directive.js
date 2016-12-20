angular.module('app').directive('lineChart', ['d3', '$rootScope', 'myConfig', '$timeout', '$http',

    function(d3, $rootScope, myConfig, $timeout, $http) {
        var svg, svgGroup, xAxis, splinePath;




        var draw = function(svgGroup, height, width, timedata) {
            // console.log("timedata within draw", timedata);

            var timedata = timedata.map(function(data) {
                data.created = new Date(data.created);
                data.iRms = data.iRms > 1 ? 2 : 0;
                return data;
            })

            var margin = { top: 10, right: 20, bottom: 30, left: 30 };
            var width = 784 - margin.left - margin.right;
            var height = 304 - margin.top - margin.bottom;

            var timeArray = timedata.map(function(data) {
                return data.created;
            })

            var x = d3.scaleTime()
                .rangeRound([0, width]);

            var y = d3.scaleQuantize()
                .range([height, 0]);

            var line = d3.line()
                .x(function(d) {
                    return x(d.created);
                })
                .y(function(d) {
                    return y(d.iRms);
                })



            x.domain(d3.extent(timedata, function(d) {
                return d.created;
            }));
            y.domain([0, 2]);
            // xAxis
            //     .attr('transform', "translate(0, " + height + ")")
            //     .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0).tickSizeInner(0))

            splinePath
                .datum(timedata)
                .attr("class", "line")
                .attr("d", line)
                .style('stroke', "white")
                .style('stroke-width', 10)
                .style('fill', 'none');

            d3.selectAll('g.tick').select('text').attr('fill', 'white')
            d3.selectAll('.domain').remove();

        };


        function responsivefy(svg) {
            // get container + svg aspect ratio
            var container = d3.select(svg.node().parentNode),
                // var container = d3.select('.header'),
                width = parseInt(svg.style("width")),
                height = parseInt(svg.style("height")),
                aspect = 734 / 264;

            // add viewBox and preserveAspectRatio properties,
            // and call resize so that svg resizes on inital page load
            svg.attr("viewBox", "0 0 " + width + " " + height)
                .attr("preserveAspectRatio", "xMinYMid")
                .call(resize);

            // to register multiple listeners for same event type,
            // you need to add namespace, i.e., 'click.foo'
            // necessary if you call invoke this function for multiple svgs
            // api docs: https://github.com/mbostock/d3/wiki/Selections#on
            d3.select(window).on("resize." + container.attr("id"), resize);

            // get width of container and resize svg to fit it
            function resize() {
                console.log("container", container);
                console.log("container width", container.style("width"));

                var targetWidth = parseInt(container.style("width"));

                if (targetWidth > 800) {
                    targetWidth = 800;
                }
                svg.attr("width", targetWidth);
                svg.attr("height", Math.round(targetWidth / aspect));
                // container.style("width", targetWidth);
                // console.log("container", container);
            }
        }



        return {
            restrict: 'A',
            // scope: {
            //     data: '='
            // },
            compile: function(elements, attrs, transclude) {
                    console.log("line directive compile function");

                var margin = { top: 10, right: 20, bottom: 30, left: 30 };
                var width = 784 - margin.left - margin.right;
                var height = 304 - margin.top - margin.bottom;
                svg = d3.select(elements[0])
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom);

                svgGroup = svg
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + "," + margin.top + ")");

                xAxis = svgGroup
                    .append('g').classed('xAxis', true);

                splinePath = svgGroup.append("path").classed('path', true);

                return function(scope, element, attrs) {
                    console.log("line directive link function");
                    // $timeout(function() { responsivefy(svg) }, 100);
                    var totalHeight = 304,
                        totalWidth = 784;


                    scope.$watch('$root.popOverData', function(newVal, oldVal) {
                        console.log("dataChanged!", newVal);
                        // Update the chart
                        if (!!newVal) {
                            draw(svgGroup, totalHeight, totalWidth, newVal);
                        }

                        // draw(svg, width, height, scope.data);
                    }, 0);
                    $timeout(function() { responsivefy(svg) }, 100);

                }
            },
        }

    }
]);
