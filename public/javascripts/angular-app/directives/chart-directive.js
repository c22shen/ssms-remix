angular.module('app').directive('someChart', ['d3', '$rootScope', function(d3, $rootScope){
	function draw(svg, width, height, data) {
		var margin = 30;

		var xScale = d3.time.scale()
			.domain([
				d3.min(data, function(d){ return d.x;}),
				d3.max(data, function(d){ return d.y;})				 
			])
			.range([margin, width-margin]);


		var xAxis = d3.svg.axis()
					.scale(xScale)
					.orient('top')
					.tickFormat(d3.time.format('%S'));

		var yScale = d3.time.scale()
			.domain([0, d3.max([data, function(d){ d.visitors;}])])
			.range([margin, height-margin]);

		var yAxis = d3.svg.axis()
					.scale(yScale)
					.orient('left')
					.tickFormat(d3.format('f'));

		svg.select('.x-axis')
			.attr("transform", "translate(0, " + margin + ") ")
			.call(xAxis);

		svg.select('.y-axis')
			.attr("transform", "translate(0, " + margin + ") ")
			.call(yAxis);


		svg.attr('width', width);
		svg.attr('height', height);

		svg.select('.data')
			.selectAll('circle').data(data)
			.attr('r', 2.5)
			.attr('cx', function(d){ return xScale(d.x); })
			.attr('cy', function(d){ return yScale(d.y); })
	}

	return {
		restrict: 'E',
		link: function(scope, iElement, iAttrs){
			var svg = d3.select(iElement[0]).append('svg');

			svg.append('g').attr('class', 'data');
			svg.append('g').attr('class', 'x-axis axis');
			svg.append('g').attr('class', 'y-axis axis');

			var width = 600, height = 300;
			$rootScope.$watch('graphData', function(newVal, oldVal) {
				if (!!newVal){
					draw(svg, width, height, newVal);					
				}
			}, true);
		}
	};
}]);