var generateResults = function() {
  brandFactor = document.getElementById('input1').value;
  generateBreedNumberData().then(function() {

    var Breed_C_Agents_Array = resultData.map(function(a) {return {"x" : a.year, "y": a.Breed_C_Agents, y0: 0};});
    var Breed_NC_Agents_Array = resultData.map(function(a) {return {"x" : a.year, "y": a.Breed_NC_Agents, y0: 0};});
    var layers = [Breed_C_Agents_Array, Breed_NC_Agents_Array];
    generateTable(layers, 2);


    var Breed_C_Lost_Array = resultData.map(function(a) {return {"x" : a.year, "y": a.Breed_C_Lost, y0: 0};});
    var Breed_C_Gained_Array = resultData.map(function(a) {return {"x" : a.year, "y": a.Breed_C_Gained, y0: 0};});
    var Breed_C_Regained_Array = resultData.map(function(a) {return {"x" : a.year, "y": a.Breed_C_Regained, y0: 0};});
    layers = [Breed_C_Lost_Array, Breed_C_Gained_Array, Breed_C_Regained_Array];
    generateTable(layers, 3);

    initBreedNumberGraph();
  });
}
