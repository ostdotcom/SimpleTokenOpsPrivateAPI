"use strict";

const bigNumber = require('bignumber.js')
    , helper = require('./helper');

const computeSum = {

  perform: async function(filePath) {

    var csvData = await helper.readCsv(filePath)
    , sum = new bigNumber(0);

    for ( var i = 0; i < csvData.length; i++ ) {
      var amount = new bigNumber(csvData[i][1].trim());
      // console.log(amount);
      sum = sum.plus(amount);
    }

    console.log('sum: ' + sum.toString(10));

  }

}

module.exports = computeSum;