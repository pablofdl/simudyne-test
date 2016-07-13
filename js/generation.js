var currentAgents;
var resultData = [];
var i = -1;

var generateBreedNumberData = function () {
  return new Promise(function(resolve, reject) {
    initAgents().then(function() {
      runYear();
      for (i = 0; i < 15; i++) {
        console.log(currentAgents);
        console.log(brandFactor);
        advanceYear();
      }
      console.log(resultData);
      resolve();
    });
  });
}

var initAgents = function() {
  return new Promise(function(resolve, reject) {
    d3.csv(csvFileLocation, function(data) {
      currentAgents = data;
      for (var agentNum = 0; agentNum < currentAgents.length; agentNum++) {
        currentAgents[agentNum].Second_Last_Breed = currentAgents[agentNum].Agent_Breed;
        currentAgents[agentNum].Last_Breed = currentAgents[agentNum].Agent_Breed;
      }
      resolve();
    });
  });
}

var advanceYear = function () {
  for (var agentNum = 0; agentNum < currentAgents.length; agentNum++) {
    // console.log(currentAgents[agentNum]);
    if (currentAgents[agentNum].Auto_Renew === '0') {
      var affinity = currentAgents[agentNum].Payment_at_Purchase/currentAgents[agentNum].Attribute_Price + (2 * currentAgents[agentNum].Attribute_Promotions * currentAgents[agentNum].Inertia_for_Switch);
      // console.log(affinity);
      if ((currentAgents[agentNum].Agent_Breed === 'Breed_C') &&
          (affinity < (currentAgents[agentNum].Social_Grade * currentAgents[agentNum].Attribute_Brand))) {
        currentAgents[agentNum].Second_Last_Breed = currentAgents[agentNum].Last_Breed;
        currentAgents[agentNum].Last_Breed = currentAgents[agentNum].Agent_Breed;
        currentAgents[agentNum].Agent_Breed  = 'Breed_NC';
      } else if ((currentAgents[agentNum].Agent_Breed === 'Breed_NC') &&
          (affinity < (currentAgents[agentNum].Social_Grade * currentAgents[agentNum].Attribute_Brand * brandFactor))) {
        currentAgents[agentNum].Second_Last_Breed = currentAgents[agentNum].Last_Breed;
        currentAgents[agentNum].Last_Breed = currentAgents[agentNum].Agent_Breed;
        currentAgents[agentNum].Agent_Breed = 'Breed_C';
      }
    }
  };
  runYear();
}

var runYear = function() {
  var contBreed = {'Breed_NC' : 0, 'Breed_C' : 0};
  var contBreed_C_Lost = 0;
  var contBreed_C_Gained = 0;
  var contBreed_C_Regained = 0;
  for (var agentNum = 0; agentNum < currentAgents.length; agentNum++) {
    contBreed[currentAgents[agentNum].Agent_Breed]++;
    if (currentAgents[agentNum].Last_Breed !== currentAgents[agentNum].Agent_Breed) {
      if (currentAgents[agentNum].Agent_Breed === 'Breed_C') {
        contBreed_C_Gained++;
        if (currentAgents[agentNum].Second_Last_Breed === 'Breed_C') {
          contBreed_C_Regained++;
        }
      } else {
        contBreed_C_Lost++;
      }
    }
  };
  // console.log(contBreed);
  // console.log(contBreed_C_Lost);
  // console.log(contBreed_C_Gained);
  // console.log(contBreed_C_Regained);
  resultData.push({year : i+1, Breed_C_Agents: contBreed['Breed_C'], Breed_NC_Agents: contBreed['Breed_NC'], Breed_C_Lost: contBreed_C_Lost, Breed_C_Gained: contBreed_C_Gained, Breed_C_Regained: contBreed_C_Regained});
  // console.log(resultData);
}
