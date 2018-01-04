
const rootPrefix = '../..'
    , bigNumber = require('bignumber.js')
    , helper = require(rootPrefix+'/executables/token_allocation/helper');

var totatStAmount = new bigNumber(0);
var totatStAmountInWei = new bigNumber(0);

const convertValuesToWei = {

  perform: async function() {

    var processName = process.argv[2];

    if (!(['grantable_allocations', 'processable_allocations', 'bonuses'].includes(processName))) {
      console.error("Invalid processName: " + processName);
      process.exit(1);
    }

    console.log('NOTE: Converting ST to ST Wei for '+ processName);

    var filePath = './data/' + processName + '_in_st.csv'

    console.log('reading from file: ' + filePath);
    var csvData = await helper.readCsv(filePath);

    console.log('converting data from file: ' + filePath);
    var convertedCsvData = await _private.validateAndConvert(csvData, processName);

    console.log('converted data from file: ' + filePath);
    convertedCsvData.forEach(function(row){
      console.log(row.join(','));
    });

  }

}

const _private = {

  validateAndConvert: function(csvData, processName){

    return new Promise(function (onResolve, onReject) {

      var totalEntries = csvData.length;

      if (totalEntries == 0) {
        console.error("No data present in csv!");
        process.exit(1);
      }

      var convertedData = [];

      for (var i = 0; i < totalEntries; i++) {

        // Continue if blank value
        if (!csvData[i] || csvData[i] == '') {
          continue;
        }

        var rowData = csvData[i],
            userAddr = rowData[0].trim(),
            oneSTWei = new bigNumber('1000000000000000000'),
            amountInST = new bigNumber(rowData[1].trim()),
            amountInSTWei = amountInST.mul(oneSTWei);

        totatStAmount = totatStAmount.plus(amountInST);
        totatStAmountInWei = totatStAmountInWei.plus(amountInSTWei);

        var buffer = [userAddr, amountInSTWei.toString(10)];

        if (processName == 'grantable_allocations') {
          buffer.push(rowData[2].trim().toLowerCase());
        }

        convertedData.push(buffer);

      }

      console.log('totatStAmount: ' + totatStAmount.toString(10));
      console.log('converted totatStAmountInWei: ' + totatStAmountInWei.toString(10));

      onResolve(convertedData);

    });

  }

}

convertValuesToWei.perform();
