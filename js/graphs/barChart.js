/**
 * Generate a Bar Chart in the barChartSVG element
 *
 * @param {number} m - The number of x values
 * @param {array} layers - The array of data
 * @param {number} numBars - The number of bars to show
 * @param {array} labels - The array of labels for the legend
 */
var generateBarChart = function (m, layers, numBars, labels) {
  var stack = d3.layout.stack();

  var yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); });
  var yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

  var x = d3.scale.ordinal()
      .domain(d3.range(m))
      .rangeRoundBands([0, width], .08);

  var y = d3.scale.linear()
      .domain([0, yStackMax])
      .range([height, 0]);

  var color = d3.scale.category10();

  var xAxis = d3.svg.axis()
      .scale(x)
      .tickSize(0)
      .tickPadding(6)
      .orient("bottom");

  var yAxis = d3.svg.axis().scale(y)
      .orient("right").ticks(5);

  var svg = d3.select("#barChartSVG")
      .attr("width", width + margin.left + margin.right + 100)
      .attr("height", height + margin.top + margin.bottom + 100)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  addLegend(svg, numBars, color, labels);

  var layer = svg.selectAll(".layer")
      .data(layers)
    .enter().append("g")
      .attr("class", "layer")
      .style("fill", function(d, i) { return color(i); });

  var rect = layer.selectAll("rect")
      .data(function(d) { return d; })
    .enter().append("rect")
    .attr("x", function(d, i, j) { return x(d.x) + x.rangeBand() / numBars * j; })
    .attr("width", x.rangeBand() / numBars)
    .attr("y", function(d) { return y(d.y); })
    .attr("height", function(d) { return height - y(d.y); });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + width + " ,0)")
      .style("fill", "black")
      .call(yAxis);
};
