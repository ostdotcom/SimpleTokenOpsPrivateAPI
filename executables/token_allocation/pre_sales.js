"use strict";
/*
 * Grantable Allocations
 *
 * * Author: Abhay
 * * Date: 05/11/2017
 * * Reviewed by:
 */

// STEPS
//
// READ CSV
// VALIDATE data
// TO checksum both grantee
// Bignumber baseToken and discountToken
// Prompt for confirmation for feeding
// Call contract addPresale method
// Call Lock method
//
// QUESTIONS
//
const coreAddresses = require('../../config/core_addresses')
  , readline = require('readline')
  , bigNumber = require('bignumber.js')
  , web3RpcProvider = require('../../lib/web3/rpc_provider')
  , helper = require('./helper');

const preSaleAllocations = {

  validateAndParse: function (data, contractAddresses, maxEntriesPerContract) {

    return new Promise(function (onResolve, onReject) {

      var totalEntries = data.length;

      if (totalEntries == 0) {
        console.error("No data present in csv!");
        process.exit(1);
      }

      const maxContractsNeeded = Math.ceil(totalEntries / maxEntriesPerContract);

      if (contractAddresses.length != maxContractsNeeded) {
        console.error("Contract addresses count: " + contractAddresses.length + " does not match with maxContractsNeeded: " + maxContractsNeeded);
        process.exit(1);
      }

      var parsedData = [];
      for (var i = 0; i < totalEntries; i++) {

        // Continue if blank value
        if (!data[i] || data[i] == '') {
          continue;
        }

        var grantData = data[i],
          receiverAddr = grantData[0].trim(),
          baseAmount = new bigNumber(grantData[1].trim()),
          bonusAmount = new bigNumber(grantData[2].trim());

        if (!web3RpcProvider.utils.isAddress(receiverAddr)) {
          console.error("Receiver Address " + receiverAddr + " is not a valid ethereum address");
          process.exit(1);
        }

        if (baseAmount.isZero()) {
          console.error("Base Amount 0 is not allowed for receiver " + receiverAddr);
          process.exit(1);
        }

        var bonusAmountPercentage = Math.ceil((bonusAmount/baseAmount)*100);
        if (bonusAmountPercentage < 15 || bonusAmountPercentage > 55) {
          console.error("bonusAmount: " + bonusAmount + " + baseAmount: " + baseAmount );
          console.error("bonus tokens percentage: " + bonusAmountPercentage +" should be between 15% - 55% of base tokens for receiver: " + receiverAddr);
          process.exit(1);
        }

        parsedData.push([web3RpcProvider.utils.toChecksumAddress(receiverAddr), baseAmount, bonusAmount]);
      }

      onResolve(parsedData);
    });
  },

  performGrant: async function() {

    const filePath = "../../data/pre_sales.csv",
      contractName = 'preSales',
      contractAddresses = coreAddresses.getAddressesForContract(contractName),
      maxEntriesPerContract = 35,
      senderName = 'postInitOwner';

    var csvData = await helper.readCsv(filePath);

    var parsedCsvData = await preSaleAllocations.validateAndParse(csvData, contractAddresses, maxEntriesPerContract);

    console.log("Max Entries " + maxEntriesPerContract + " will be entered per Contract");
    console.log("Total Entries to process: " + parsedCsvData.length);
    console.log("All Contract Addresses: " + contractAddresses);

    var prompts = readline.createInterface(process.stdin, process.stdout);

    await new Promise(
      function (onResolve, onReject) {
        prompts.question("Do you want to really do this? [Y/N]",
          function (intent) {
            if (intent === 'Y') {
              console.log("Initiating PreSaleAllocations script for contract: " + contractName);
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

    await helper.processFeedingData(contractName, senderName, parsedCsvData, maxEntriesPerContract, contractAddresses);
  }

};

preSaleAllocations.performGrant();