
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
