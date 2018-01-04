"use strict";
/*
 * Bonuses
 *
 * * Author: Puneet
 * * Date: 11/11/2017
 * * Reviewed by:
 *
 * node bonuses/ingestData.js bool
 *
 */

// STEPS
//
// READ CSV
// VALIDATE data
// TO checksum
// Prompt for confirmation for feeding
// Call contract add(address _address, uint256 _amount) method
// Call Lock method

const coreAddresses = require('../../../config/core_addresses')
  , readline = require('readline')
  , bigNumber = require('bignumber.js')
  , web3RpcProvider = require('../../../lib/web3/rpc_provider')
  , helper = require('../helper');

const ingestBonusesData = {

  validateAndParse: function (data, contractAddress) {

    return new Promise(function (onResolve, onReject) {

      var totalEntries = data.length;

      if (totalEntries == 0) {
        console.error("No data present in csv!");
        process.exit(1);
      }

      var parsedData = [];
      for (var i = 0; i < totalEntries; i++) {

        // Continue if blank value
        if (!data[i] || data[i] == '') {
          continue;
        }

        var grantData = data[i]
          , receiverAddr = grantData[0].trim()
          , amount = new bigNumber(grantData[1].trim());

        if (!web3RpcProvider.utils.isAddress(receiverAddr)) {
          console.error("Receiver Address " + receiverAddr + " is not a valid ethereum address");
          process.exit(1);
        }

        if (amount.isZero()) {
          console.error("Amount 0 is not allowed for receiver " + receiverAddr);
          process.exit(1);
        }

        var checkSumAddr = web3RpcProvider.utils.toChecksumAddress(receiverAddr);
        console.log("parsed validated addrs: " + checkSumAddr + " amount: " + amount.toString(10));
        parsedData.push([checkSumAddr, amount]);
      }

      onResolve(parsedData);

    });
  },

  perform: async function() {

    const isPromptNeededBool = helper.validateIsPromptNeeded(process.argv[2]);

    const filePath = "../../../data/bonuses_in_stwei.csv",
      contractName = 'bonuses',
      contractAddress = coreAddresses.getAddressForContract(contractName),
      senderName = 'postInitOwner';

    var csvData = await helper.readCsv(filePath);

    var parsedCsvData = await ingestBonusesData.validateAndParse(csvData, contractAddress);

    console.log("Total Entries to process: " + parsedCsvData.length);
    console.log("Sender Name: "+ senderName + " address: " + coreAddresses.getAddressForUser(senderName));
    console.log("Contract Address: " + contractAddress);

    if (isPromptNeededBool) {

      var prompts = readline.createInterface(process.stdin, process.stdout);

      await new Promise(
        function (onResolve, onReject) {
          prompts.question("Do you want to really do this? [Y/N]",
            function (intent) {
              if (intent === 'Y') {
                console.log("Initiating ingesting bonus data script on contract: " + contractName);
                prompts.close();
                onResolve();
              } else {
                console.error('Exiting script.');
                process.exit(1);
              }
            }
          );
        }
      );
    }

    await helper.processFeedingData(contractName, senderName, parsedCsvData, 1000000000000, [contractAddress]);

  }

};

ingestBonusesData.perform();