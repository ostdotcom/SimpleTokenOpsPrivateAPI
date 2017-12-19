"use strict";
/*
 * Altcoin Token Distribution
 *
 * * Author: Aman
 * * Date: 13/11/2017
 * * Reviewed by:
 *
 * node altcoin_token_distribution.js
 *
 */

// STEPS
//
// READ CSV
// VALIDATE data
// TO checksum
// Prompt for distribution per altcoin token address
// Call contract transferFrom(address _grantee, uint256 _amount) method
// Print Output csv with transaction hash

const pathPrefix = '../..'
  , coreAddresses = require(pathPrefix + '/config/core_addresses')
  , fs = require('fs')
  , readline = require('readline')
  , bigNumber = require('bignumber.js')
  , web3RpcProvider = require(pathPrefix + '/lib/web3/rpc_provider')
  , helper = require('./helper')
  , distributorName = 'altCoinDist';

const _private = {

  validateAndParse: function (csvData) {

    return new Promise(function (onResolve, onReject) {

      var parsedData = [];
      for (var i = 0; i < csvData.length; i++) {

        if (!csvData[i] || csvData[i] == '') {
          console.error("Empty invalid row found in csv.");
          process.exit(1);
        }

        var bonusData = csvData[i]
          , receiverAddr = bonusData[0].trim()
          , tokenContractAddr = bonusData[1].trim()
          , amount = new bigNumber(bonusData[2].trim());

        if (!web3RpcProvider.utils.isAddress(receiverAddr)) {
          console.error("Receiver Address " + receiverAddr + " is not a valid ethereum address");
          process.exit(1);
        }

        if (!web3RpcProvider.utils.isAddress(tokenContractAddr)) {
          console.error("Token contact Address " + tokenContractAddr + " is not a valid ethereum address");
          process.exit(1);
        }

        // amount should be greater than zero
        if (amount.equals(0)) {
          console.error("Amount to be transferred should be greater than 0");
          process.exit(1);
        }

        var checkSumReceiverAddr = web3RpcProvider.utils.toChecksumAddress(receiverAddr);
        var checkSumTokenContractAddr = web3RpcProvider.utils.toChecksumAddress(tokenContractAddr);

        console.log("receiver addrs: " + checkSumReceiverAddr + "token contract addrs: " + checkSumTokenContractAddr + " amount: " + amount.toString(10));

        parsedData.push([checkSumTokenContractAddr, checkSumReceiverAddr, amount.toString(10)]);

      }

      onResolve(parsedData);
    });
  },

  promtForApprovalFor: function (parsedDataRow) {
    var checkSumTokenContractAddr = parsedDataRow[0]
      , checkSumReceiverAddr = parsedDataRow[1]
      , amount = parsedDataRow[2];

    console.log("Processing:: ", "contractAddr: ", checkSumTokenContractAddr,
        ", checkSumReceiverAddr: ", checkSumReceiverAddr, ", amount: ", amount);

      var readlineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'Do you want to really do this? [Y/N]'
      });

      return new Promise( function(onResolve, onReject) {
        readlineInterface.prompt();
        const rlCallback = function(line) {
          line = line.trim().toLowerCase();
          switch ( line ) {
            case "y":
              readlineInterface.removeListener("line", rlCallback);
              onResolve();
              break;
            case "n":
              console.error("ABORTED OPERATION. BYE");
              process.exit(0);
              break;
            default:
              console.error("Invalid Input. Supported Inputs: Y/N");
          }
        };
        readlineInterface.on("line", rlCallback);
      });

  },

  distributeFor: function (parsedDataRow) {
    var checkSumTokenContractAddr = parsedDataRow[0]
      , checkSumReceiverAddr = parsedDataRow[1]
      , amount = parsedDataRow[2];

    return helper.distributeTokens(distributorName, checkSumTokenContractAddr, checkSumReceiverAddr, amount);
  }


};

const altcoinDistribution = {

  perform: async function () {

    const filePath = "../../data/altcoin_distribution.csv",
      distributorAddress = coreAddresses.getAddressForUser(distributorName);

    var csvData = await helper.readCsv(filePath);

    var parsedCsvData = await _private.validateAndParse(csvData);

    console.log("Distributor Name: " + distributorName + " Addresses: " + distributorAddress);

    var totalCount = parsedCsvData.length;

    console.log("Total Entries to process: " + totalCount);

    for(var i = 0; i < totalCount; i++) {
      var parsedDataRow = parsedCsvData[i]
        , tokenContractAddr = parsedDataRow[0]
        , receiverAddr = parsedDataRow[1]
        , amount = parsedDataRow[2];

      await _private.promtForApprovalFor(parsedDataRow);

      var transactionHash = await _private.distributeFor(parsedDataRow);

      var formattedLine = (receiverAddr + "," + tokenContractAddr + "," + transactionHash + "\n");

      fs.appendFileSync("alt_coin_bonus_log_transaction_hash_data.csv", formattedLine);
    }
  }

};

altcoinDistribution.perform();