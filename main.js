/**
 * Generates and displays the results
 *
 */
var generateResults = function() {
  brandFactor = document.getElementById('input1').value;
  if (!brandFactor) {
    document.getElementById('error').style.display = "block";
  } else {
    document.getElementById('error').style.display = "none";
    document.getElementById('generateButton').disabled = true;
    generateBreedNumberData(15).then(function() {

      var Breed_C_Agents_Array = resultData.map(function(a) {return {"x" : a.year, "y": a.Breed_C_Agents, y0: 0};});
      var Breed_NC_Agents_Array = resultData.map(function(a) {return {"x" : a.year, "y": a.Breed_NC_Agents, y0: 0};});
      var layers = [Breed_C_Agents_Array, Breed_NC_Agents_Array];
      generateBarChart(16, layers, 2, ['Breed_C', 'Breed_NC']);

      var Breed_C_Lost_Array = resultData.map(function(a) {return {"x" : a.year, "y": a.Breed_C_Lost, y0: 0};});
      var Breed_C_Gained_Array = resultData.map(function(a) {return {"x" : a.year, "y": a.Breed_C_Gained, y0: 0};});
      var Breed_C_Regained_Array = resultData.map(function(a) {return {"x" : a.year, "y": a.Breed_C_Regained, y0: 0};});
      layers = [Breed_C_Lost_Array, Breed_C_Gained_Array, Breed_C_Regained_Array];
      generateLineChart(3, layers, ['Breed_C_Lost', 'Breed_C_Gained', 'Breed_C_Regained']);

    });
  }
};
document.getElementById('generateButton').disabled = false;
