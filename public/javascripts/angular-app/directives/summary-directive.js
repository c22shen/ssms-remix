angular.module('app').directive('trendChart', ['d3', '$rootScope', 'myConfig', '$timeout', '$http',
    function(d3, $rootScope, myConfig, $timeout, $http) {
        var svg, svgGroup;
        var startDateTime = moment.tz({ date: moment.tz({}, "America/Toronto").date() - 1, hour: 8, minute: 30 }, "America/Toronto").add(-2, 'weeks');
        var closeDateTime = moment.tz({ date: moment.tz({}, "America/Toronto").date() - 1, hour: 21, minute: 0 }, "America/Toronto");
        var regulatedDataArray = [];
        var weekDayBreakTime = [{
            start: { hour: 12, minute: 33 },
            end: { hour: 12, minute: 40 }
        }, {
            start: { hour: 16, minute: 30 },
            end: { hour: 17, minute: 0 }
        }, {
            start: { hour: 19, minute: 0 },
            end: { hour: 19, minute: 20 }
        }];

        var saturdayBreakTime = [{
            start: { hour: 12, minute: 0 },
            end: { hour: 12, minute: 30 }
        }, {
            start: { hour: 15, minute: 0 },
            end: { hour: 15, minute: 20 }
        }];

        var timeAvailable = {
            0: {
                open: { hour: 0, minute: 0 },
                close: { hour: 0, minute: 0 }
            },
            1: {
                open: { hour: 8, minute: 30 },
                close: { hour: 17, minute: 0 },
                break: weekDayBreakTime
            },
            2: {
                open: { hour: 8, minute: 30 },
                close: { hour: 21, minute: 0 },
                break: weekDayBreakTime
            },
            3: {
                open: { hour: 8, minute: 30 },
                close: { hour: 21, minute: 0 },
                break: weekDayBreakTime
            },
            4: {
                open: { hour: 8, minute: 30 },
                close: { hour: 21, minute: 0 },
                break: weekDayBreakTime
            },
            5: {
                open: { hour: 8, minute: 30 },
                close: { hour: 21, minute: 0 },
                break: weekDayBreakTime

            },
            6: {
                open: { hour: 10, minute: 0 },
                close: { hour: 17, minute: 0 },
                break: saturdayBreakTime
            }
        }


        var totalWidth = 500;
        var totalHeight = 200;
        var margin = { top: 15, right: 40, bottom: 30, left: 40 };
        var width = totalWidth - margin.left - margin.right;
        var height = totalHeight - margin.top - margin.bottom;
        // console.log("timeAvailable", timeAvailable[6]);





        // dataToProcess = dataToProcess.map(function(d) {
        //     var data = {};
        //     data.iRms = d.iRms;
        //     data.created = d.created;
        //     return data;
        // }).sort(function(a, b) {
        //     return (new Date(a.created) > new Date(b.created));
        // })

        // do not let today's data dilute the average, consider yesterday, which has been completed.



        // iterate through each day







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
                if (targetWidth > 800) {
                    targetWidth = 800;
                }
                svg.attr("width", targetWidth);
                svg.attr("height", Math.round(targetWidth / aspect));
            }
        }



        return {
            restrict: 'A',
            compile: function(elements, attrs, transclude) {
                //this is the link function
                svg = d3.select(elements[0]).append('svg')
                    .attr('width', totalWidth)
                    .attr('height', totalHeight)

                svg.style('margin', 'auto').style('display', 'block');
                svgGroup = svg
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');




                // svgGroup.selectAll('rect')
                //     .data(regulatedDataArray)
                //     .enter()
                //     .append('rect')
                //     .attr('x', d => xScaleTime(d.time) + xScaleBand.bandwidth() * 0.2)
                //     .attr('y', d => yScale(d.status))
                //     .attr('width', d => xScaleBand.bandwidth())
                //     .attr('height', d => height - yScale(d.status))
                //     .attr('fill', '#2196F3');



                return function(scope, element, attrs) {

                    $http({
                        method: 'GET',
                        url: '/api/devices4weeks'
                    }).then(function successCallback(response) {
                        var monthData = response.data;

                        var iterateDate = startDateTime.clone();



                        while (iterateDate < closeDateTime) {
                            var easternAvailability = timeAvailable[iterateDate.tz('America/Toronto').day()];
                            var checkTimeStart = moment.tz({ month: iterateDate.month(), date: iterateDate.date(), hour: easternAvailability.open.hour, minute: easternAvailability.open.minute }, "America/Toronto");
                            var checkTimeEnd = moment.tz({ month: iterateDate.month(), date: iterateDate.date(), hour: easternAvailability.close.hour, minute: easternAvailability.close.minute }, "America/Toronto");

                            var iterateTime = checkTimeStart.clone();
                            var currentOperationStatus = 0;

                            while (iterateTime < checkTimeEnd) {
                                var timePlusHour = iterateTime.clone().add(1, 'hours');
                                var onDataWithinBucket = monthData.filter(function(a) {
                                    return moment(a.created) >= iterateTime && moment(a.created) < timePlusHour;
                                });

                                // iterateTime.
                                if (onDataWithinBucket.length > 0) {
                                    var onActivity = onDataWithinBucket.some(function(a) {
                                        return a.iRms >= 1;
                                    });

                                    currentOperationStatus = onActivity ? 1 : 0;
                                }

                                regulatedDataArray.push({ status: currentOperationStatus, created: iterateTime.utc().toDate() });

                                iterateTime.add(1, 'hours');
                            }

                            iterateDate.add(1, 'days');
                        }

                        console.log("regulatedDataArray", regulatedDataArray)



                        var yScale = d3.scaleLinear()
                            .domain(d3.extent(regulatedDataArray, function(d) {
                                return d.status;
                            }))
                            .range([height, 0]);


                        var yAxis = d3.axisLeft(yScale).tickSizeOuter(0).tickSizeInner(0).tickPadding(1).tickFormat(function(d) {
                            if (d === 1) {
                                return "Peak";
                            } else {
                                return ""
                            }
                            // console.log("axis y d", d);
                            return d;
                        })

                        // yAxis.selectAll('path').attr('stroke', 'white');
                        var yAxisGroup = svgGroup.call(yAxis);
                        yAxisGroup.selectAll('path').attr('stroke', 'white');
                        yAxisGroup.selectAll('text').attr('fill', 'white').attr('font-size', 12);
                        yAxisGroup.selectAll('.domain').remove();
                        // var xScale = d3.scaleTime()
                        //     .rangeRound([0, width])
                        //     .domain(d3.extent(processedData, function(d) {
                        //         return d.created.tz('America/Toronto').format("h:mm A");
                        //     }));

                        var xScaleBand = d3.scaleBand()
                            .padding(0.2)
                            .domain(regulatedDataArray.map(function(data) {
                                return data.created
                            })).range([0, width]);



                        var xScaleTime = d3.scaleTime()
                            .domain(d3.extent(regulatedDataArray, function(d) {
                                return d.created;
                            }))
                            .range([0, width]);
                        var xAxis = d3.axisBottom(xScaleTime)
                            // .ticks(d3.timeHour, 24).tickFormat(d3.timeFormat('%H:%M'))
                            .tickSize(5)
                            .tickPadding(5)
                            .tickSizeOuter(0).tickSizeInner(5)

                        var xAxisGroup = svgGroup.append('g').classed('xAxis', true).attr('transform', `translate(0, ${height})`).call(xAxis)
                        xAxisGroup.selectAll('path').attr('stroke', 'white');
                        xAxisGroup.selectAll('text').attr('fill', 'white').attr('font-size', 10);
                        xAxisGroup.selectAll('line').attr('stroke', 'white');

                        svgGroup.selectAll('rect')
                            .data(regulatedDataArray)
                            .enter()
                            .append('rect')
                            .attr('x', d => xScaleTime(d.created))
                            .attr('y', d => yScale(d.status))
                            .attr('width', d => xScaleBand.bandwidth())
                            .attr('height', d => height - yScale(d.status))
                            .attr('fill', '#2196F3');
                        console.log("regulatedDataArray", regulatedDataArray);
                    })




                    $timeout(function() { responsivefy(svg) }, 100);
                    // scope.$watch('regulatedDataArray', function(newVal, oldVal) { 
                    // if (scope.regulatedDataArray) {

                    // }
                    // }, true);
                };
            }
        }
    }
]);
