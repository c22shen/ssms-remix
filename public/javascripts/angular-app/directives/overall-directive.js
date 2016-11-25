angular.module('app').directive('overallChart', ['d3', '$rootScope', 'myConfig',
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
                var totalWidth = 1000;
                var totalHeight = 500;
                var margin = { top: 0, right: 0, bottom: 20, left: 0 };

                var width = totalWidth - margin.left - margin.right;
                var height = totalHeight - margin.top - margin.bottom;

                var svg = d3.select(elements[0])
                    .append('svg')
                    .attr('width', totalWidth)
                    .attr('height', totalHeight)
                    .call(responsivefy)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

var data = [
  {name: '8am', math: 10,   science: 62,   language: 54},
  {name: '9am', math: 20, science: 34,   language: 85},
  {name: '10am', math: 33, science: 34,   language: 85},
  {name: '11am', math: 25, science: 34,   language: 85},
  {name: '12pm', math: 44, science: 34,   language: 85},
  {name: '1pm', math: 46, science: 34,   language: 85},
  {name: '2pm', math: 66, science: 34,   language: 85},
  {name: '3pm', math: 77,   science: 48,   language: null},
   {name:'4pm', math: 61,   science: 48,   language: null},
  {name: '5pm', math: 70,   science: null, language: 65},
  {name: '6pm', math: 81,   science: 73,   language: 29},
  {name: '7pm', math: 91,   science: 73,   language: 29},
  {name: '8pm', math: 69,   science: 73,   language: 29},
  {name: '9pm', math: 44,   science: 73,   language: 29}

];


var xScale = d3.scaleBand()
  .domain(data.map(d => d.name))
  .range([0, width])
  .padding(0.3);

svg
  .append('g')
  .classed('x-axis', true)
    .attr('transform', `translate(0, ${height})`)
  .call(d3.axisBottom(xScale));

var yScale = d3.scaleLinear()
  .domain([0, 100])
  .range([height, 0]);
// svg
//   .append('g')
//   .call(d3.axisLeft(yScale));
var subject = "math";





                return function(scope, element, attrs) {
  var t = d3.transition().duration(1000);

  var update = svg.selectAll('rect')
    .data(data.filter(d => d["math"]));

  update.exit()
    .transition(t)
    .attr('y', height)
    .attr('height', 0)
    .remove();

  update
    .transition(t)
    .delay(1000)
    .attr('y', d => yScale(d[subject]))
    .attr('height', d => height - yScale(d[subject]));

  update
    .enter()
    .append('rect')
    .style("fill", "7BAAF7")
    .attr('y', height)
    .attr('height', 0)
    .attr('x', d => xScale(d.name))
    .attr('width', d => xScale.bandwidth())
    .transition(t)
    .delay(update.exit().size() ? 2000 : 0)
    .attr('y', d => yScale(d[subject]))
    .attr('height', d => height - yScale(d[subject]));
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
