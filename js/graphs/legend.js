/**
 * Adds a legend to the svg given
 *
 * @param {object} svg - The object where to append the legend
 * @param {number} numLines - The number of lines of legend to show
 * @param {array} color - The color of the legend
 * @param {array} labels - The array of labels for the legend
 */
var addLegend = function(svg, numLines, color, labels) {
  var domainOnlyScale = d3.range(numLines);

  var legendRectSize = 18;
  var legendSpacing = 4;
  var legend = svg.selectAll('.legend')
    .data(domainOnlyScale)
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', function(d, i) {
      var height = legendRectSize + legendSpacing;
      var offset =  height * color.domain().length / 2;
      var horz = 900 - legendRectSize;
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
      return labels[d];
      });
}
