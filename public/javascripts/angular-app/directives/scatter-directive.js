angular.module('app').directive('scatterChart', ['d3', '$rootScope', 'myConfig',
    function(d3, $rootScope, myConfig) {
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
            }
        }



        return {
            restrict: 'A',
            compile: function(elements, attrs, transclude) {
                var totalWidth = 1500;
                var totalHeight = 2094;
                var margin = { top: 0, right: 0, bottom: 0, left: 0 };

                var width = totalWidth - margin.left - margin.right;
                var height = totalHeight - margin.top - margin.bottom;

                var svg = d3.select(elements[0])
                    .append('svg')
                    .attr('width', totalWidth)
                    .attr('height', totalHeight)
                    .classed("map", true)
                    .call(responsivefy)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

                return function(scope, element, attrs) {
                    // location data for 1 2 3 4 
                    // var locationInfo = [
                    // 	{
                    // 		"panId" : 1,
                    // 		"x": 100, 
                    // 		"y":100
                    // 	},
                    // 	{
                    // 		"panId" : 2,
                    // 		"x": 200, 
                    // 		"y":200
                    // 	},
                    // 	{
                    // 		"panId" : 3,
                    // 		"x": 300, 
                    // 		"y": 300
                    // 	},
                    // 	{
                    // 		"panId" : 4,
                    // 		"x": 400, 
                    // 		"y": 400
                    // 	}
                    // ];

                    // var yScale = d3.scaleLinear()
                    // 	.domain([0,d3.max(locationInfo.map(function(d){
                    // 			return d.y;
                    // 		}))
                    // 	])
                    // 	.range([]);


                    //enter
                    var circles = svg
                        .selectAll('.ball')
                        .data($rootScope.messages)
                        .enter()
                        .append('g')
                        .attr('class', 'ball')
                        .attr('transform', function(d) {
                            var translationCommand = "translate(" + d.x + "," + d.y + ")";
                            return translationCommand;
                        });

                    circles
                        .append('circle')
                        .attr('cx', 0)
                        .attr('cy', 0)
                        .attr('r', 50)
                        .style('fill-opacity', 0.5)
                        .style('fill', function(d) {
                            return d.current > myConfig.THRESHOLD ? "red" : "green";
                        });

                    $rootScope.$watch("messages", function(newVal, oldVal, scope) {
                        var update = svg
                            .selectAll('.ball')
                            .data(newVal);

                        d3.selectAll("circle").style('fill', function(d) {
                            return d.current > myConfig.THRESHOLD ? "red" : "green";
                        });
                    });

                    // circles
                    //   .append('text')
                    //   .style('text-anchor', 'middle')
                    //   .style('fill', 'black')
                    //   .attr('y', 4)
                    //   .text("L");







                }

            }
        }



    }
])




// var margin = { top: 10, right: 20, bottom: 30, left: 30 };
// var width = 400 - margin.left - margin.right;
// var height = 565 - margin.top - margin.bottom;

// var svg = d3.select('.chart')
//     .append('svg')
//     .attr('width', width + margin.left + margin.right)
//     .attr('height', height + margin.top + margin.bottom)
//     .call(responsivefy)
//     .append('g')
//     .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

// d3.json('./data.json', function(err, data) {
//     var yScale = d3.scaleLinear()
//         .domain(d3.extent(data, d => d.expectancy))
//         .range([height, 0])
//         .nice();
//     var yAxis = d3.axisLeft(yScale);
//     svg.call(yAxis);

//     var xScale = d3.scaleLinear()
//         .domain(d3.extent(data, d => d.cost))
//         .range([0, width])
//         .nice();

//     var xAxis = d3.axisBottom(xScale)
//         .ticks(5);
//     svg
//         .append('g')
//         .attr('transform', `translate(0, ${height})`)
//         .call(xAxis);

//     var rScale = d3.scaleSqrt()
//         .domain([0, d3.max(data, d => d.population)])
//         .range([0, 40]);

//     var circles = svg
//         .selectAll('.ball')
//         .data(data)
//         .enter()
//         .append('g')
//         .attr('class', 'ball')
//         .attr('transform', d => {
//             return `translate(${xScale(d.cost)}, ${yScale(d.expectancy)})`;
//         });

//     circles
//         .append('circle')
//         .attr('cx', 0)
//         .attr('cy', 0)
//         .attr('r', d => rScale(d.population))
//         .style('fill-opacity', 0.5)
//         .style('fill', 'steelblue');

//     circles
//         .append('text')
//         .style('text-anchor', 'middle')
//         .style('fill', 'black')
//         .attr('y', 4)
//         .text(d => d.code);

// });
