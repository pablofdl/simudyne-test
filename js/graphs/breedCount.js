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


var margin = {top: 20, right: 40, bottom: 30, left: 20},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    barWidth = Math.floor(width / 19) - 1;

var x = d3.scale.linear()
    .range([barWidth / 2, width - barWidth / 2]);

var y = d3.scale.linear()
    .range([height, 0]);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("right")
    .tickSize(-width)
    .tickFormat(function(d) { return Math.round(d / 1e6) + "M"; });

// An SVG element with a bottom-right origin.
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// A sliding container to hold the bars by birthyear.
var birthyears = svg.append("g")
    .attr("class", "birthyears");

// A label for the current year.
var title = svg.append("text")
    .attr("class", "title")
    .attr("dy", ".71em")
    .text(2000);

d3.csv(csvFileLocation, function(error, data) {

  // Convert strings to numbers.
  data.forEach(function(d) {
    d.people = +d.people;
    d.year = +d.year;
    d.age = +d.age;
  });

  // Compute the extent of the data set in age and years.
  var age1 = d3.max(data, function(d) { return d.age; }),
      year0 = d3.min(data, function(d) { return d.year; }),
      year1 = d3.max(data, function(d) { return d.year; }),
      year = year1;

  // Update the scale domains.
  x.domain([year1 - age1, year1]);
  y.domain([0, d3.max(data, function(d) { return d.people; })]);

  // Produce a map from year and birthyear to [male, female].
  data = d3.nest()
      .key(function(d) { return d.year; })
      .key(function(d) { return d.year - d.age; })
      .rollup(function(v) { return v.map(function(d) { return d.people; }); })
      .map(data);

  // Add an axis to show the population values.
  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + width + ",0)")
      .call(yAxis)
    .selectAll("g")
    .filter(function(value) { return !value; })
      .classed("zero", true);

  // Add labeled rects for each birthyear (so that no enter or exit is required).
  var birthyear = birthyears.selectAll(".birthyear")
      .data(d3.range(year0 - age1, year1 + 1, 5))
    .enter().append("g")
      .attr("class", "birthyear")
      .attr("transform", function(birthyear) { return "translate(" + x(birthyear) + ",0)"; });

  birthyear.selectAll("rect")
      .data(function(birthyear) { return data[year][birthyear] || [0, 0]; })
    .enter().append("rect")
      .attr("x", -barWidth / 2)
      .attr("width", barWidth)
      .attr("y", y)
      .attr("height", function(value) { return height - y(value); });

  // Add labels to show birthyear.
  birthyear.append("text")
      .attr("y", height - 4)
      .text(function(birthyear) { return birthyear; });

  // Add labels to show age (separate; not animated).
  svg.selectAll(".age")
      .data(d3.range(0, age1 + 1, 5))
    .enter().append("text")
      .attr("class", "age")
      .attr("x", function(age) { return x(year - age); })
      .attr("y", height + 4)
      .attr("dy", ".71em")
      .text(function(age) { return age; });

  // Allow the arrow keys to change the displayed year.
  window.focus();
  d3.select(window).on("keydown", function() {
    switch (d3.event.keyCode) {
      case 37: year = Math.max(year0, year - 10); break;
      case 39: year = Math.min(year1, year + 10); break;
    }
    update();
  });

  function update() {
    if (!(year in data)) return;
    title.text(year);

    birthyears.transition()
        .duration(750)
        .attr("transform", "translate(" + (x(year1) - x(year)) + ",0)");

    birthyear.selectAll("rect")
        .data(function(birthyear) { return data[year][birthyear] || [0, 0]; })
      .transition()
        .duration(750)
        .attr("y", y)
        .attr("height", function(value) { return height - y(value); });
  }
});
