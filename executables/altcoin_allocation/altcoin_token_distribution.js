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

const pathPrefix = '../..';
const coreAddresses = require(pathPrefix + '/config/core_addresses')
  , fs = require('fs')
  , readline = require('readline')
  , bigNumber = require('bignumber.js')
  , web3RpcProvider = require(pathPrefix + '/lib/web3/rpc_provider')
  , helper = require('./helper');

const altcoinDistribution = {

  validateAndParse: function (data) {

    return new Promise(function (onResolve, onReject) {

      var parsedDataHash = {};
      for (var i = 0; i < data.length; i++) {

        // Continue if blank value
        if (!data[i] || data[i] == '') {
          continue;
        }

        var bonusData = data[i]
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

        if (amount.isZero()) {
          console.error("Amount 0 is not allowed for receiver " + receiverAddr);
          process.exit(1);
        }

        var checkSumReceiverAddr = web3RpcProvider.utils.toChecksumAddress(receiverAddr);
        var checkSumTokenContractAddr = web3RpcProvider.utils.toChecksumAddress(tokenContractAddr);

        console.log("receiver addrs: " + checkSumReceiverAddr + "token contract addrs: " + checkSumTokenContractAddr + " amount: " + amount);

        if ( typeof parsedDataHash[checkSumTokenContractAddr] === 'undefined' )
          parsedDataHash[checkSumTokenContractAddr] = [];

        parsedDataHash[checkSumTokenContractAddr].push([checkSumReceiverAddr, amount]);
      }

      onResolve(parsedDataHash);
    });
  },

    writeToCsv: function(csvData) {
        csvData.forEach(function (csvData) {
            var formattedLine = (csvData[0] + "," + csvData[1] + "," + csvData[2] + "\n")
            fs.appendFileSync("alt_coin_bonus_log_transaction_hash_data.csv", formattedLine);
        });
},

  perform: async function() {

    //DELETE RESULT FILE BEFORE STARTING

    const filePath = "../../data/altcoin_distribution.csv",
      distributorName = 'altCoinDist',
      distributorAddress = coreAddresses.getAddressForUser(distributorName),
      senderName = 'postInitOwner';

    var csvData = await helper.readCsv(filePath);
    var parsedCsvDataHash = await altcoinDistribution.validateAndParse(csvData);

    console.log("Distributor Name: "+ distributorName + " Addresses: " + distributorAddress);
    console.log("Total distinct tokens addresses  " + Object.keys(parsedCsvDataHash).length );

    var totalCount = 0;

    Object.keys(parsedCsvDataHash).forEach(function(tokenContractAddress) {
        var userBonusData = parsedCsvDataHash[tokenContractAddress];
        console.log("Total Entries to process for contract: " + tokenContractAddress +  " is " + userBonusData.length);
        totalCount = totalCount + userBonusData.length;
    });

    console.log("Total Entries to process: " + totalCount);

    const createPromptPromise = function ( tokenContractAddress) {
        var userBonusData = parsedCsvDataHash[tokenContractAddress];
        return new Promise(function (onResolve, onReject) {
            var prompts = readline.createInterface(process.stdin, process.stdout);
            console.log("Total Entries to process for contract: " + tokenContractAddress +  " is " + userBonusData.length);
            prompts.question("Do you want to really do this? [Y/N]",
                function (intent) {
                    console.log("prompts.question :: intent :: " , intent);
                    if (intent === 'Y') {
                        console.log("Initiating altcoin Distribution script for contract: " + tokenContractAddress);
                        prompts.close();
                        onResolve();
                    } else {
                        console.error('Exiting script.');
                        process.exit(1);
                    }
                }
            );
        }).then( function() {
            return helper.distributeTokens(distributorName, tokenContractAddress, userBonusData);
        }).then( function (outputData) {
                console.log("--------- ENDING -------");
            altcoinDistribution.writeToCsv(outputData);
            return outputData;
        });
    };

    const distributor = async function() {
        Object.keys(parsedCsvDataHash).forEach(function(tokenContractAddress) {
            await createPromptPromise( tokenContractAddress );
        });
    };

    distributor();


  }

};

altcoinDistribution.perform();