
const rootPrefix = '../..'
    , bigNumber = require('bignumber.js')
    , helper = require(rootPrefix+'/executables/token_allocation/helper')
    , filePath = './data/grant_allocations_in_st.csv';

const convertValuesToWei = {

  perform: async function() {

    console.log('NOTE: Converting ST to ST Wei in given CSV');

    var csvData = await helper.readCsv(filePath);

    var convertedCsvData = await _private.validateAndConvert(csvData);

    convertedCsvData.forEach(function(row){
      console.log(row[0]+','+row[1].toString(10)+','+row[2]);
    });

  }

}

const _private = {

  validateAndConvert: function(csvData){

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
            amountInSTWei = amountInST.mul(oneSTWei),
            isRevokable = rowData[2].trim().toLowerCase();

        console.log("parsed validated addrs: " + userAddr + " amount in ST: " + amountInST + " amount in ST Wei: " + amountInSTWei);
        convertedData.push([userAddr, amountInSTWei, isRevokable]);

      }

      onResolve(convertedData);

    });

  }

}

convertValuesToWei.perform();
