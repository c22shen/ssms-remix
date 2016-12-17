angular.module('app').directive('lineChart', ['d3', '$rootScope', 'myConfig', '$timeout', '$http',

    function(d3, $rootScope, myConfig, $timeout, $http) {
        var svg;


        function responsivefy(svg) {
            // get container + svg aspect ratio
            var container = d3.select(svg.node().parentNode),
                width = parseInt(svg.style("width")),
                height = parseInt(svg.style("height")),
                aspect = width / height;

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
                var targetWidth = parseInt(container.style("width"));
                svg.attr("width", targetWidth);
                svg.attr("height", Math.round(targetWidth / aspect));
                container.style("width", targetWidth);
                console.log("container", container);
            }
        }



        return {
            restrict: 'A',
            compile: function(elements, attrs, transclude) {

                var margin = { top: 10, right: 20, bottom: 30, left: 30 };
                var width = 600 - margin.left - margin.right;
                var height = 400 - margin.top - margin.bottom;
                svg = d3.select(elements[0])
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom);
                svgGroup = svg
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + "," + margin.top + ")");
                $http({
                    method: 'GET',
                    url: '/api/devices/0013A20040B09A44'
                }).then(function successCallback(response) {
                        // this callback will be called asynchronously
                        // when the response is available
                        // var lineChartWidth = 600;
                        // var lineChartHeight = 400;
                        // var parseTime = d3.timeParse('%H:%M:%S');

                        var timedata = response.data.map(function(data) {
                            data.created = new Date(data.created);
                            return data;
                        })

                        var timeArray = timedata.map(function(data) {
                            return data.created;
                        })

                        // var xScale = d3.scaleTime()
                        //     .domain([d3.min(timeArray), d3.max(timeArray)])
                        //     .range([0, width]);




                        // var yScale = d3.scaleLinear()
                        //     .domain([
                        //         0, d3.max(timedata.map(function(data) {
                        //             return data.iRms
                        //         }))
                        //     ])
                        //     .range([height, 0]);


                        var x = d3.scaleTime()
                            .rangeRound([0, width]);

                        var y = d3.scaleLinear()
                            .rangeRound([height, 0]);

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
                        y.domain([0,2]);
                        // svgGroup
                        //     .append('g')
                        //     .call(d3.axisLeft(y));

                        svgGroup
                            .append('g')
                            .attr('transform', "translate(0, " + height + ")")
                            .call(d3.axisBottom(x).ticks(5))

                        // var line = d3.line()
                        //     .x(function(d) {
                        //         // console.log("xScale(d.created)", xScale(d.created));
                        //         return xScale(d.created);
                        //     })
                        //     .y(function(d) {
                        //         // console.log("yScale(d.iRms)", yScale(d.iRms));
                        //         return yScale(d.iRms);
                        //     })




                        svgGroup.append("path")
                            .datum(timedata)
                            .attr("class", "line")
                            .attr("d", line)
                        .style('stroke', "#2196F3")
                            .style('stroke-width', 2)
                            .style('fill', 'none');
                        // svgGroup
                        //     .selectAll('.line')
                        //     .data(timedata)
                        //     .enter()
                        //     .append('path')
                        //     .attr('class', 'line')
                        //     .attr('d', function(data) {
                        //         console.log("line data", data);
                        //         return line(data)
                        //     })
                        //     .style('stroke', "white")
                        //     .style('stroke-width', 2)
                        // style('fill')
                        // console.log();
                        // svg.append('g').classed("lineChart")
                        //     .attr('width', lineChartWidth)
                        //     .attr('height', lineChartHeight)
                        //     .call(responsivefy)
                    },
                    function errorCallback(error) {
                        console.log("error");
                    });



                return function(scope, element, attrs) {
                    $timeout(function() { responsivefy(svg) }, 100);

                }
            },
        }

    }
]);
