// console.log() is like the print() function
console.log("Good luck!");

// The following lines select the tag with id = "solution".
// Add your JS code below.

// Read a CSV file
// Inspect the output on the Console.

var printCSVDataset = function() {
  // Print out this csv file
  d3.select("body").select("div, #solution").selectAll("p#csv")
  .data(csvDataset)
  .enter()
  .append("p")
  .text(function(rowObject) {
    // rowObject is a JS Object
    console.log(rowObject);
    return rowObject.Agent_Breed + " " + rowObject.Policy_ID + " " + rowObject.Auto_Renew;
  });
}
initBreedNumberGraph();
