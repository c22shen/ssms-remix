angular.module('app').directive('trendChart', ['d3', '$rootScope', 'myConfig', '$timeout',
    function(d3, $rootScope, myConfig, $timeout) {
        var svg;

        // the data source should be the recent data received from database
        var dataToProcess = [
            { "_id": "585d3e3e230b060011295830", "panId": "0013A20040B09A44", "__v": 0, "iRms": 0.07, "created": "2016-12-23T15:09:50.334Z" },
            { "_id": "585d26e2230b0600112957f1", "panId": "0013A20040B09A44", "__v": 0, "iRms": 0.01, "created": "2016-12-23T13:30:10.124Z" },
            { "_id": "585d310e230b0600112957f3", "panId": "0013A20040B09A44", "__v": 0, "iRms": 1.1, "created": "2016-12-23T14:03:34.393Z" },
            { "_id": "585d312d230b0600112957f4", "panId": "0013A20040B09A44", "__v": 0, "iRms": 2.38, "created": "2016-12-23T14:14:05.253Z" },
            { "_id": "585d3137230b0600112957f5", "panId": "0013A20040B09A44", "__v": 0, "iRms": 1.71, "created": "2016-12-23T14:14:15.540Z" }
        ];

        // var dataToProcess1 = [

        //     { "_id": "585d4e75230b06001129586e", "panId": "0013A20041629B77", "__v": 0, "iRms": 0, "created": "2016-12-23T13:19:01.815Z" },
        //     { "_id": "585d4e95230b06001129586f", "panId": "0013A20041629B77", "__v": 0, "iRms": 1, "created": "2016-12-23T13:19:33.678Z" },
        //     { "_id": "585d4ec8230b060011295870", "panId": "0013A20041629B77", "__v": 0, "iRms": 2, "created": "2016-12-23T14:20:24.189Z" },
        //     { "_id": "585d4eef230b060011295871", "panId": "0013A20041629B77", "__v": 0, "iRms": 0, "created": "2016-12-23T14:21:03.798Z" },
        //     { "_id": "585d4f0b230b060011295872", "panId": "0013A20041629B77", "__v": 0, "iRms": 2, "created": "2016-12-23T15:08:31.277Z" }
        // ]





        dataToProcess = dataToProcess.map(function(d) {
            var data = {};
            data.iRms = d.iRms;
            data.created = d.created;
            return data;
        }).sort(function(a, b) {
            return (new Date(a.created) > new Date(b.created));
        })

        var startTime, endTime;
        var easternDate = moment.tz({}, "America/Toronto").date();
        var easternDay = moment.tz({}, "America/Toronto").day();

        var openTime = moment.tz({ d: 23, h: 8, m: 30 }, "America/Toronto").utc();
        var closeTime = moment.tz({ d: 23, h: 10, m: 0 }, "America/Toronto").utc().endOf("minute");


        var processData = function(data) {
            var iterateTime = openTime;
            var regulatedDataArray = [];
            var currentOperationStatus = 0;

            while (iterateTime < closeTime) {
                // debugger
                var tenMinutesMore = iterateTime.clone().add(10, 'minutes').endOf("minute");
                var onDataWithinBucket = dataToProcess.filter(function(a) {

                    return moment(a.created) >= iterateTime && moment(a.created) < tenMinutesMore;
                });

                // iterateTime.
                if (onDataWithinBucket.length > 0) {
                    var onDataPts = onDataWithinBucket.filter(function(a) {
                        return a.iRms >= 1;
                    });

                    if (onDataPts.length > 0) {
                        currentOperationStatus = 1;
                    } else {
                        currentOperationStatus = 0;
                    }
                }

                regulatedDataArray.push({ status: currentOperationStatus, time: new Date(iterateTime.tz('America/Toronto').format()) });

                iterateTime.add(10, 'minutes');
            }
            return regulatedDataArray;

        }

        var processedData = processData(dataToProcess);


        console.log("processedData", processedData);

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
                if (targetWidth>800){
                    targetWidth = 800;
                }
                svg.attr("width", targetWidth);
                svg.attr("height", Math.round(targetWidth / aspect));
            }
        }



        return {
            restrict: 'A',
            compile: function(elements, attrs, transclude) {
                var totalWidth = 500;
                var totalHeight = 200;
                var margin = { top: 15, right: 40, bottom: 30, left: 40 };
                var width = totalWidth - margin.left - margin.right;
                var height = totalHeight - margin.top - margin.bottom;


                //this is the link function
                svg = d3.select(elements[0]).append('svg')
                    .attr('width', totalWidth)
                    .attr('height', totalHeight)

                svg.style('margin', 'auto').style('display', 'block');
                var svgGroup = svg
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


                var yScale = d3.scaleLinear()
                    .domain([0, 5])
                    // .domain(d3.extent(processedData, function(d) {
                    //     return d.status;
                    // }))
                    .range([height, 0]);


                var yAxis = d3.axisLeft(yScale).tickSizeOuter(0).tickSizeInner(0).tickPadding(1).tickFormat(function(d) {
                    if (d === 5) {
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
                    .domain(processedData.map(function(data) {
                        return data.time
                    })).range([0, width]);



                var xScaleTime = d3.scaleTime()
                    .domain(d3.extent(processedData, function(d) {
                        return d.time;
                    }))
                    .range([0, width]);
                var xAxis = d3.axisBottom(xScaleTime)
                    .ticks(d3.timeMinute, 20).tickFormat(d3.timeFormat('%H:%M'))
                    .tickSize(5)
                    .tickPadding(5)
                    .tickSizeOuter(0).tickSizeInner(5)

                var xAxisGroup = svgGroup.append('g').classed('xAxis', true).attr('transform', `translate(0, ${height})`).call(xAxis)
                xAxisGroup.selectAll('path').attr('stroke', 'white');
                xAxisGroup.selectAll('text').attr('fill', 'white').attr('font-size', 10);
                xAxisGroup.selectAll('line').attr('stroke', 'white');

                svgGroup.selectAll('rect')
                    .data(processedData)
                    .enter()
                    .append('rect')
                    .attr('x', d => xScaleTime(d.time) + xScaleBand.bandwidth()*0.2)
                    .attr('y', d => yScale(d.status))
                    .attr('width', d => xScaleBand.bandwidth())
                    .attr('height', d => height - yScale(d.status))
                    .attr('fill', '#2196F3');



                return function(scope, element, attrs) {
                     $timeout(function() { responsivefy(svg) }, 100);
                };
            }
        }
    }
]);
