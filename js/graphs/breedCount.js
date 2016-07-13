// Note that d3.csv() is an async method.
// Refer to the loaded dataset from within the callback function.
var initBreedNumberGraph = function () {
  d3.csv(csvFileLocation, function(error, data) {
    if (error) {
      // If you're here, then the error was not null.
      // Print the error to console.
      console.log(error);
    } else {
      // No error!
      // Print the dataset to console.
      // data is basically an array of Objects
      console.log("Successfully loaded " + csvFileLocation);
      console.log(data);
      console.log(typeof data);

      // data is a local variable.
      // Copy data into csvDataset (global variable) so it's available to use later.
      csvDataset = data;

      breedNumber = d3.nest()
        .key(function(d) { return d.Agent_Breed; })
        .rollup(function(v) { return v.length; })
        .entries(csvDataset);
      console.log(breedNumber);


      // Print this data to HTML file.
      // printCSVDataset();
      // makeBarChart();
      interactiveBarChart();
    }
  });
}

var interactiveBarChart = function() {
  console.log("Example 5:");

  // Create an SVG object.
  // This will act like our canvas.
  svg = d3.select("body").select("div, #solution").append("svg")

  // Set the width and height (in pixels) of the SVG object.
  var w = 200;
  var h = 200;
  svg.attr("width", w)
     .attr("height", h);

  // This time we will use scales.
  // Setup a scale for the x-axis. We are plotting categorical data on the x-axis.
  var xScale = d3.scale.ordinal()
                 .domain(d3.range(breedNumber.length))
                 .rangeRoundBands([0, w], 0.05)

  // Setup a scale for y-axis.
  // First we obtain the min and max y values we would like to plot.
  var minValue = 0; // We want everything above 0.
  var maxValue = d3.max(breedNumber, function(d) {
    // d is simply csvDataset[i]
    console.log(d.values);
    return d.values;
  });
  console.log(maxValue);
  // maxValue = 100;
  var yScale = d3.scale.linear()
                 .domain([minValue, maxValue])
                 .range([0, h])

  // Finally, we setup a scale for the color
  var colorScale = d3.scale.linear()
                     .domain([minValue, maxValue])
                     .rangeRound([0, 255]) // Based on a 256-bit color map

  // Setup the SVG barchart
  svg.selectAll("rect")
     .data(breedNumber)
     .enter()
     .append("rect")
     .attr("x", function(breedNumber, i) {
      // d is simply csvDataset[i]
      return xScale(i);
     })
     .attr("width", xScale.rangeBand())
     .attr("y", function(breedNumber) {
      // d is simply csvDataset[i]
      return h - yScale(breedNumber.values);
     })
     .attr("height", function(breedNumber) {
      // d is simply csvDataset[i]
      return yScale(breedNumber.values);
     })

};


var generateTable = function (layers, n) {
  var m = 16, // number of samples per layer
      stack = d3.layout.stack();


  yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); });
  yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

  console.log(layers);

  var margin = {top: 40, right: 10, bottom: 20, left: 10},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .domain(d3.range(m))
      .rangeRoundBands([0, width], .08);

  var y = d3.scale.linear()
      .domain([0, yStackMax])
      .range([height, 0]);

  var color = d3.scale.linear()
      .domain([0, n - 1])
      .range(["#1f77b4", "rgb(46, 164, 51)"]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .tickSize(0)
      .tickPadding(6)
      .orient("bottom");

  var yAxis = d3.svg.axis().scale(y)
      .orient("right").ticks(5);

  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right + 100)
      .attr("height", height + margin.top + margin.bottom + 100)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  var legendRectSize = 18;
  var legendSpacing = 4;
  var legend = svg.selectAll('.legend')
  .data(color.domain())
  .enter()
  .append('g')
  .attr('class', 'legend')
  .attr('transform', function(d, i) {
  var height = legendRectSize + legendSpacing;
  var offset =  height * color.domain().length / 2;
  var horz = -2 * legendRectSize;
  var vert = i * height - offset;
  return 'translate(' + 0 + ',' + vert + ')';
  });

  legend.append('rect')
  .attr('width', legendRectSize)
  .attr('height', legendRectSize)
  .style('fill', color)
  .style('stroke', color);

  legend.append('text')
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function(d) {
    if (d === 0) {
      return "Breed_C";
    } else if (d === 1) {
      return "Breed_NC";
    } else {
      return "Breed_2";
    }
  });

  var layer = svg.selectAll(".layer")
      .data(layers)
    .enter().append("g")
      .attr("class", "layer")
      .style("fill", function(d, i) { return color(i); });

  var rect = layer.selectAll("rect")
      .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", height)
      .attr("width", x.rangeBand())
      .attr("height", 0);

  rect.transition()
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d.y0 + d.y); })
      .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + width + " ,0)")
      .style("fill", "black")
      .call(yAxis);

  d3.selectAll("input").on("change", change);

  var timeout = setTimeout(function() {
    d3.select("input[value=\"grouped\"]").property("checked", true).each(change);
  }, 2000);

  function change() {
    clearTimeout(timeout);
    if (this.value === "grouped") transitionGrouped();
    else transitionStacked();
  }

  function transitionGrouped() {
    y.domain([0, yGroupMax]);

    rect.transition()
        .duration(500)
        .delay(function(d, i) { return i * 10; })
        .attr("x", function(d, i, j) { return x(d.x) + x.rangeBand() / n * j; })
        .attr("width", x.rangeBand() / n)
      .transition()
        .attr("y", function(d) { return y(d.y); })
        .attr("height", function(d) { return height - y(d.y); });
  }

  function transitionStacked() {
    y.domain([0, yStackMax]);

    rect.transition()
        .duration(500)
        .delay(function(d, i) { return i * 10; })
        .attr("y", function(d) { return y(d.y0 + d.y); })
        .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
      .transition()
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.rangeBand());
  }
}
