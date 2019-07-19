// Generated by BUCKLESCRIPT VERSION 6.0.3, PLEASE EDIT WITH CARE

import * as Belt_Array from "bs-platform/lib/es6/belt_Array.js";
import * as Pervasives from "bs-platform/lib/es6/pervasives.js";
import * as Belt_MapString from "bs-platform/lib/es6/belt_MapString.js";
import * as Belt_SortArray from "bs-platform/lib/es6/belt_SortArray.js";
import * as Utils$Coronate from "./Utils.bs.js";
import * as EdmondsBlossom from "edmonds-blossom";

function priority(value, condition) {
  if (condition) {
    return value;
  } else {
    return 0.0;
  }
}

function divisiblePriority(dividend, divisor) {
  return dividend / divisor;
}

function avoidMeetingTwice(param) {
  if (param) {
    return 32.0;
  } else {
    return 0.0;
  }
}

function sameScores(param) {
  return 16.0 / param;
}

function halfPosition(param) {
  return 8.0 / param;
}

function sameHalfPriority(param) {
  return 0.0;
}

function differentHalf(isDiffHalf) {
  if (isDiffHalf) {
    return halfPosition;
  } else {
    return sameHalfPriority;
  }
}

function differentDueColor(param) {
  if (param) {
    return 4.0;
  } else {
    return 0.0;
  }
}

var maxPriority = Utils$Coronate.arraySumFloat(/* array */[
      halfPosition(1.0),
      4.0,
      16.0 / 1.0,
      32.0
    ]);

function calcPairIdeal(player1, player2) {
  if (player1[/* id */0] === player2[/* id */0]) {
    return 0.0;
  } else {
    var metBefore = player1[/* opponents */6].includes(player2[/* id */0]);
    var mustAvoid = player1[/* avoidIds */1].includes(player2[/* id */0]);
    var match = player1[/* colors */3].length;
    var isDiffDueColor;
    if (match !== 0) {
      var match$1 = player2[/* colors */3].length;
      isDiffDueColor = match$1 !== 0 ? Utils$Coronate.last(player1[/* colors */3]) !== Utils$Coronate.last(player2[/* colors */3]) : true;
    } else {
      isDiffDueColor = true;
    }
    var scoreDiff = Utils$Coronate.absf(player1[/* score */8] - player2[/* score */8]) + 1.0;
    var halfDiff = Pervasives.abs(player1[/* halfPos */4] - player2[/* halfPos */4] | 0) + 1 | 0;
    var isDiffHalf = player1[/* isUpperHalf */5] !== player2[/* isUpperHalf */5] && player1[/* score */8] === player2[/* score */8];
    return Utils$Coronate.arraySumFloat(/* array */[
                isDiffDueColor ? 4.0 : 0.0,
                16.0 / scoreDiff,
                (
                    isDiffHalf ? halfPosition : sameHalfPriority
                  )(halfDiff),
                !metBefore && !mustAvoid ? 32.0 : 0.0
              ]);
  }
}

function descendingScore(param, param$1) {
  return Utils$Coronate.descend((function (x) {
                return x[/* score */8];
              }), param, param$1);
}

function descendingRating(param, param$1) {
  return Utils$Coronate.descend((function (x) {
                return x[/* rating */7];
              }), param, param$1);
}

function setUpperHalves(data) {
  var dataList = Belt_MapString.valuesToArray(data);
  return Belt_Array.reduce(dataList, Belt_MapString.empty, (function (acc, playerData) {
                var match = Utils$Coronate.splitInHalf(Belt_SortArray.stableSortBy(dataList.filter((function (p2) {
                                  return p2[/* score */8] === playerData[/* score */8];
                                })), descendingRating).map((function (p) {
                            return p[/* id */0];
                          })));
                var upperHalfIds = match[0];
                var isUpperHalf = upperHalfIds.includes(playerData[/* id */0]);
                var halfPos = isUpperHalf ? upperHalfIds.indexOf(playerData[/* id */0]) : match[1].indexOf(playerData[/* id */0]);
                var newPlayerData_000 = /* id */playerData[/* id */0];
                var newPlayerData_001 = /* avoidIds */playerData[/* avoidIds */1];
                var newPlayerData_002 = /* colorScores */playerData[/* colorScores */2];
                var newPlayerData_003 = /* colors */playerData[/* colors */3];
                var newPlayerData_006 = /* opponents */playerData[/* opponents */6];
                var newPlayerData_007 = /* rating */playerData[/* rating */7];
                var newPlayerData_008 = /* score */playerData[/* score */8];
                var newPlayerData = /* record */[
                  newPlayerData_000,
                  newPlayerData_001,
                  newPlayerData_002,
                  newPlayerData_003,
                  /* halfPos */halfPos,
                  /* isUpperHalf */isUpperHalf,
                  newPlayerData_006,
                  newPlayerData_007,
                  newPlayerData_008
                ];
                return Belt_MapString.set(acc, playerData[/* id */0], newPlayerData);
              }));
}

var partial_arg = /* array */[
  descendingScore,
  descendingRating
];

function sortByScoreThenRating(param) {
  return Utils$Coronate.sortWith(partial_arg, param);
}

function setByePlayer(byeQueue, dummyId, data) {
  var hasNotHadBye = function (p) {
    return !p[/* opponents */6].includes(dummyId);
  };
  var match = Belt_MapString.keysToArray(data).length % 2 === 0;
  if (match) {
    return /* tuple */[
            data,
            undefined
          ];
  } else {
    var dataList = sortByScoreThenRating(Belt_MapString.valuesToArray(data).filter(hasNotHadBye));
    var playersWithoutByes = dataList.map((function (p) {
            return p[/* id */0];
          }));
    var hasntHadBye = function (id) {
      return playersWithoutByes.includes(id);
    };
    var nextByeSignups = byeQueue.filter(hasntHadBye);
    var match$1 = Belt_Array.get(nextByeSignups, 0);
    var dataForNextBye;
    if (match$1 !== undefined) {
      var match$2 = Belt_MapString.get(data, match$1);
      dataForNextBye = match$2 !== undefined ? match$2 : Utils$Coronate.last(dataList);
    } else {
      var match$3 = dataList.length > 0;
      dataForNextBye = match$3 ? Utils$Coronate.last(dataList) : Utils$Coronate.last(sortByScoreThenRating(Belt_MapString.valuesToArray(data)));
    }
    var dataWithoutBye = Belt_MapString.remove(data, dataForNextBye[/* id */0]);
    return /* tuple */[
            dataWithoutBye,
            dataForNextBye
          ];
  }
}

function assignColorsForPair(pair) {
  var player2 = pair[1];
  var player1 = pair[0];
  var match = Utils$Coronate.arraySumFloat(player1[/* colorScores */2]) < Utils$Coronate.arraySumFloat(player2[/* colorScores */2]);
  if (match) {
    return /* tuple */[
            player2[/* id */0],
            player1[/* id */0]
          ];
  } else {
    return /* tuple */[
            player1[/* id */0],
            player2[/* id */0]
          ];
  }
}

function netScore(param) {
  return param[0][/* score */8] + param[1][/* score */8];
}

function netRating(param) {
  return param[0][/* rating */7] + param[1][/* rating */7];
}

function netScoreDescend(pair1, pair2) {
  return netScore(pair2) - netScore(pair1);
}

function netRatingDescend(pair1, pair2) {
  return netRating(pair2) - netRating(pair1);
}

var partial_arg$1 = /* array */[
  netScoreDescend,
  netRatingDescend
];

function sortByNetScoreThenRating(param) {
  return Utils$Coronate.sortWithF(partial_arg$1, param);
}

function pairPlayers(pairData) {
  var playerIdArray = Belt_MapString.keysToArray(pairData);
  var playerArray = Belt_MapString.valuesToArray(pairData);
  var pairIdealReducer = function (accArr, player1, index) {
    var playerMatches = playerArray.slice(index + 1 | 0, Infinity).map((function (player2) {
            return /* tuple */[
                    playerIdArray.indexOf(player1[/* id */0]),
                    playerIdArray.indexOf(player2[/* id */0]),
                    calcPairIdeal(player1, player2)
                  ];
          }));
    return accArr.concat(playerMatches);
  };
  var blossom2Pairs = function (acc, p1Index, p2Index) {
    var match = p1Index === -1;
    if (match) {
      return acc;
    } else {
      var p1 = Belt_MapString.getExn(pairData, Belt_Array.getExn(playerIdArray, p1Index));
      var p2 = Belt_MapString.getExn(pairData, Belt_Array.getExn(playerIdArray, p2Index));
      var matched = acc.map((function (param) {
              return param[0];
            }));
      var match$1 = !matched.includes(p1) && !matched.includes(p2);
      if (match$1) {
        return acc.concat(/* array */[/* tuple */[
                      p1,
                      p2
                    ]]);
      } else {
        return acc;
      }
    }
  };
  return sortByNetScoreThenRating(EdmondsBlossom.default(playerArray.reduce(pairIdealReducer, /* array */[])).reduce(blossom2Pairs, /* array */[])).map(assignColorsForPair);
}

export {
  priority ,
  divisiblePriority ,
  avoidMeetingTwice ,
  sameScores ,
  halfPosition ,
  sameHalfPriority ,
  differentHalf ,
  differentDueColor ,
  maxPriority ,
  calcPairIdeal ,
  descendingScore ,
  descendingRating ,
  setUpperHalves ,
  sortByScoreThenRating ,
  setByePlayer ,
  assignColorsForPair ,
  netScore ,
  netRating ,
  netScoreDescend ,
  netRatingDescend ,
  sortByNetScoreThenRating ,
  pairPlayers ,
  
}
/* maxPriority Not a pure module */
