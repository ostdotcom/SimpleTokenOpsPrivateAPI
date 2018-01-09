"use strict";
/*
 * Bonuses
 *
 * * Author: Puneet
 * * Date: 11/11/2017
 * * Reviewed by:
 *
 * node ingestData.js 1 true
 *
 */

// STEPS
//
// READ CSV (using index. index starts from 1)
// VALIDATE data
// Prompt for confirmation for feeding
// Call contract add(address _address, uint256 _amount) method
// Call Lock method

const coreAddresses = require('../../../config/core_addresses')
  , readline = require('readline')
  , bigNumber = require('bignumber.js')
  , web3RpcProvider = require('../../../lib/web3/rpc_provider')
  , helper = require('../helper')
  , publicEthereum = require('../../../lib/request/public_ethereum');

const ingestBonusesData = {

  validateAndParse: function (data, contractAddress) {

    return new Promise(function (onResolve, onReject) {

      var totalEntries = data.length;

      if (totalEntries == 0) {
        console.error("No data present in csv!");
        process.exit(1);
      }

      var addresses = []
          , amounts = [];

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
        // console.log("parsed validated addrs: " + checkSumAddr + " amount: " + amount.toString(10));
        addresses.push(checkSumAddr);
        amounts.push(amount);
      }

      onResolve({
        addresses: addresses,
        amounts: amounts
      });

    });
  },

  callLockContract: function (contractName, senderName, contractAddress) {
    return new Promise(async function (onResolve, onReject) {
      console.log("\nInitiating locking of contract address: " + contractAddress + " for contract name: " + contractName + " for sender name: " + senderName);
      await helper.sendTransaction('callLockContract', contractName, contractAddress, senderName, [])
          .then(helper.verifyPublicOpsResponse)
          .then(function(data){console.log(data.data.events_data[0].events);});
      onResolve();
    });
  },

  processIngestingData: function (contractName, senderName, addresses, amounts, contractAddress) {

    return new Promise(async function (onResolve, onReject) {

      var startIndex = 0
          , endIndex = addresses.length
          , maxPerTransaction = 200;

      console.log('endIndex: ' + endIndex);

      while (startIndex < endIndex) {

        console.log("Iteration starting with startIndex: " + startIndex);

        var addressesVar = addresses.slice(startIndex, startIndex + maxPerTransaction);
        var amountsVar = amounts.slice(startIndex, startIndex + maxPerTransaction);

        var dataForTx = {
          addresses: addressesVar,
          amounts: amountsVar
        }
            , processedCount = null;

        // Call add data method of contract
        // This method DOES NOT RAISE EVENTS
        await helper.sendTransaction('callAddData', contractName, contractAddress, senderName, dataForTx)
            .then(helper.verifyPublicOpsResponse)
            .then(function(data){
              var eventsData = data.data.events_data[0].events[0];
              console.log(eventsData);
              processedCount = parseInt(eventsData.value) + 1;
            });

        if (processedCount == 1) {
          console.error('something went wrong as processedCount == 1');
          process.exit(1);
        }

        startIndex = startIndex + processedCount;
        console.log('newStartIndex: ' + startIndex);

      }

      // Call lock method of contracts
      await ingestBonusesData.callLockContract(contractName, senderName, contractAddress);

      onResolve();

    });

  },

  getIngestedRowsCount: async function(contractAddress) {
    var rsp = await publicEthereum.getProcessablesSizeForBonuses(contractAddress);
    return rsp.data.size;
  },

  perform: async function() {

    const contractIndex = parseInt(process.argv[2])
        , isPromptNeededBool = helper.validateIsPromptNeeded(process.argv[3]);

    const filePath = "../../../data/bonuses_" + contractIndex + "_in_stwei.csv",
      contractName = 'bonuses',
      contractAddresses = coreAddresses.getAddressesForContract(contractName),
      contractAddress = contractAddresses[contractIndex-1],
      senderNamePrefix = coreAddresses.bonusContractUserNamePrefix,
      senderName = senderNamePrefix + contractIndex;

    console.log("Sender Name: "+ senderName + " address: " + coreAddresses.getAddressForUser(senderName));
    console.log("Contract Address: " + contractAddress);
    console.log("filePath: " + filePath);

    var csvData = await helper.readCsv(filePath);

    var parsedCsvData = await ingestBonusesData.validateAndParse(csvData, contractAddress)
    , addresses = parsedCsvData.addresses
    , amounts = parsedCsvData.amounts
    , addressesLength = addresses.length
    , amountsLength = amounts.length;

    console.log("Total addresses length: " + addressesLength);
    console.log("Total amounts length: " + amountsLength);

    if (amountsLength != addressesLength) {
      console.error('addresses & amounts length mismatch');
      process.exit(1);
    }

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

    await ingestBonusesData.processIngestingData(contractName, senderName, addresses, amounts, contractAddress);

  }

};

ingestBonusesData.perform();