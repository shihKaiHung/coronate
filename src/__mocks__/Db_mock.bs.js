// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE

import * as React from "react";
import * as Belt_Map from "bs-platform/lib/es6/belt_Map.js";
import * as Belt_Set from "bs-platform/lib/es6/belt_Set.js";
import * as Data_Id$Coronate from "../Data/Data_Id.bs.js";
import * as TestData$Coronate from "../TestData.bs.js";
import * as Data_Config$Coronate from "../Data/Data_Config.bs.js";

function genericDbReducer(state, action) {
  switch (action.tag | 0) {
    case /* Del */0 :
        return Belt_Map.remove(state, action[0]);
    case /* Set */1 :
        return Belt_Map.set(state, action[0], action[1]);
    case /* SetAll */2 :
        return action[0];
    
  }
}

function configReducer(state, action) {
  switch (action.tag | 0) {
    case /* AddAvoidPair */0 :
        return {
                avoidPairs: Belt_Set.add(state.avoidPairs, action[0]),
                byeValue: state.byeValue,
                lastBackup: state.lastBackup
              };
    case /* DelAvoidPair */1 :
        return {
                avoidPairs: Belt_Set.remove(state.avoidPairs, action[0]),
                byeValue: state.byeValue,
                lastBackup: state.lastBackup
              };
    case /* DelAvoidSingle */2 :
        var id = action[0];
        return {
                avoidPairs: Belt_Set.reduce(state.avoidPairs, Data_Config$Coronate.Pair.$$Set.empty, (function (acc, pair) {
                        if (Data_Config$Coronate.Pair.has(pair, id)) {
                          return acc;
                        } else {
                          return Belt_Set.add(acc, pair);
                        }
                      })),
                byeValue: state.byeValue,
                lastBackup: state.lastBackup
              };
    case /* SetAvoidPairs */3 :
        return {
                avoidPairs: action[0],
                byeValue: state.byeValue,
                lastBackup: state.lastBackup
              };
    case /* SetByeValue */4 :
        return {
                avoidPairs: state.avoidPairs,
                byeValue: action[0],
                lastBackup: state.lastBackup
              };
    case /* SetState */5 :
        return action[0];
    case /* SetLastBackup */6 :
        return {
                avoidPairs: state.avoidPairs,
                byeValue: state.byeValue,
                lastBackup: action[0]
              };
    
  }
}

function useAllItemsFromDb(data) {
  var match = React.useReducer(genericDbReducer, data);
  return {
          items: match[0],
          dispatch: match[1],
          loaded: true
        };
}

function useAllPlayers(param) {
  return useAllItemsFromDb(Data_Id$Coronate.$$Map.fromStringArray(TestData$Coronate.players));
}

function useAllTournaments(param) {
  return useAllItemsFromDb(Data_Id$Coronate.$$Map.fromStringArray(TestData$Coronate.tournaments));
}

function useConfig(param) {
  return React.useReducer(configReducer, TestData$Coronate.config);
}

export {
  useAllPlayers ,
  useAllTournaments ,
  useConfig ,
  
}
/* react Not a pure module */
