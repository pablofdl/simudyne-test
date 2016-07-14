/**
 * Generate a Line Chart in the linerChartSVG element
 *
 * @param {number} numLines - The number of bars to show
 * @param {array} data - The array of data
 * @param {array} labels - The array of labels for the legend
 */
var generateLineChart = function (numLines, data, labels) {
  var svg = d3.select("#lineChartSVG");
  
  xScale = d3.scale.linear().range([margin.left, width - margin.right]).domain([0, 15]),
  yScale = d3.scale.linear().range([height - margin.top, margin.bottom]).domain([0, 3000]),
  xAxis = d3.svg.axis()
    .scale(xScale),
  yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("right");

  svg.append("svg:g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height - 2*margin.bottom) + ")")
    .call(xAxis);
  svg.append("svg:g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + width + " ,0)")
    .call(yAxis);
    var lineGen = d3.svg.line()
    .x(function(d) {
      return xScale(d.x);
    })
    .y(function(d) {
      return yScale(d.y);
    })
    .interpolate("basis");

  var color = d3.scale.category10();

  addLegend(svg, numLines, color, labels);

  for (var j = 0; j < numLines; j++) {
    svg.append('svg:path')
      .attr('d', lineGen(data[j]))
      .attr('stroke', color(j))
      .attr('stroke-width', 2)
      .attr('fill', 'none');
  };
}
