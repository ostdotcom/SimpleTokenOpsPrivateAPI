"use strict";
/*
 * Bonuses
 *
 * * Author: Puneet
 * * Date: 11/11/2017
 * * Reviewed by:
 *
 * node processIngestedData.js 1 true
 *
 */

const readline = require('readline')

const rootPrefix = '../../..'
    , coreAddresses = require(rootPrefix + '/config/core_addresses')
    , web3RpcProvider = require(rootPrefix + '/lib/web3/rpc_provider')
    , publicEthereum = require(rootPrefix + '/lib/request/public_ethereum')
    , helper = require('../helper')
    , contractName = 'bonuses'
    , contractAddresses = coreAddresses.getAddressesForContract(contractName)
    , STContractAddress = coreAddresses.getAddressForContract('simpleToken')
;

var processablesSize = null
    , senderName = null
    , senderAddress = null
    , contractAddress = null;

const _private = {

  verifyContractDataBeforeProcessing: async function() {

    processablesSize = await _private.getProcessablesSizeForBonuses() ;

    console.log("processablesSize : " + processablesSize);
    if (processablesSize == 0) {
      console.error('nothing to process as processablesSize == 0');
      process.exit(1);
    }

    const remainingTotalBonuses = await _private.getRemainingTotalBonuses();
    console.log("remainingTotalBonuses : " + remainingTotalBonuses);

    if (remainingTotalBonuses == 0) {
      console.error('nothing to process as remainingTotalBonuses == 0');
      process.exit(1);
    }

    const bonusesContractStatus = await _private.getBonusesContractStatus();
    if (bonusesContractStatus != 2) {
      console.error('bonusesContractStatus != 2. Value: ' + bonusesContractStatus);
      process.exit(1);
    }

  },

  processBonusesInBatches: async function() {

    const toIndex = await _private.getProcessablesSizeForBonuses();

    var fromIndex = await _private.getStartIndex()
        , nextStartIndex = 0
        , batchResponse = {}
        , iterationCount = 1
    ;

    while (fromIndex < toIndex) {

      console.log('starting process iteration: ' + iterationCount + ' with fromIndex : ' + fromIndex + ' toIndex: ' + toIndex);

      var batchResponse = await helper.sendTransaction(
          'processBonusAllocations', contractName, contractAddress, senderName, fromIndex
      ).then(helper.verifyPublicOpsResponse);

      nextStartIndex = await _private.getStartIndex();
      console.log("nextStartIndex : " + nextStartIndex);

      if (!_private.verifyBatchResponse(batchResponse, nextStartIndex - fromIndex)) {
        process.exit(1);
      }

      fromIndex = nextStartIndex;
      iterationCount = iterationCount + 1;

    }

    return batchResponse;

  },

  getStartIndex: async function() {
    var rsp = await publicEthereum.getStartIndexForProcessingBonuses(contractAddress);
    return rsp.data.startIndex;
  },

  getRemainingTotalBonuses: async function() {
    var rsp = await publicEthereum.getRemainingTotalBonuses(contractAddress);
    return rsp.data.remainingTotalBonuses;
  },

  getProcessablesSizeForBonuses: async function() {
    var rsp = await publicEthereum.getProcessablesSizeForBonuses(contractAddress);
    return rsp.data.size;
  },

  getBonusesContractStatus: async function() {
    var rsp = await publicEthereum.getBonusesContractStatus(contractAddress);
    return rsp.data.status;
  },

  verifyBatchResponse: function(batchResponse, countProcessed) {

    if (countProcessed == 0) {
      console.error('countProcessed: 0');
      return false;
    }

    const eventsData = batchResponse.data.events_data;

    if (eventsData.length == 1) {
      console.error('no events emmited batched responce: ');
      console.error(batchResponse);
      return false;
    }

    var bonusProcessedEventsCount = 0;

    for (var i = 0; i < eventsData.length; i++) {
      var eventData = eventsData[i];
      if (eventData.name == 'BonusProcessed') {
        bonusProcessedEventsCount = bonusProcessedEventsCount + 1;
      }
    }

    if (bonusProcessedEventsCount != countProcessed) {
      console.error('mismatch found in BonusProcessed event count');
      console.error('bonusProcessedEventsCount: ' + bonusProcessedEventsCount);
      console.error('countProcessed: ' + countProcessed);
      return false;
      // We would stop the process even if one BonusProcessed is missed
      // It could be restarted
    } else {
      console.log('batch verified : countProcessed: ' + countProcessed);
    }

    return true;

  },
  
  verifyContractDataAfterProcessing: async function(lastBatchRsp) {

    const eventsData = lastBatchRsp.data.events_data
        , lastEventData = eventsData[eventsData.length - 1];

    console.log('Checking For Completed Event');
    if (lastEventData.name != 'Completed') {
      console.error('last event name is not Completed but is : ' + lastEventData.name);
      console.error(lastEventData);
    }

    console.log('checking for remainingTotalBonuses == 0');
    const remainingTotalBonuses = await _private.getRemainingTotalBonuses();
    if (remainingTotalBonuses != 0) {
      console.error('remainingTotalBonuses is non zero: ' + remainingTotalBonuses);
    }

    console.log('checking for status of bonuses contract');
    const bonusesContractStatus = await _private.getBonusesContractStatus();
    if (bonusesContractStatus != 3) {
      console.error('bonusesContractStatus != 3. Value: ' + bonusesContractStatus);
    }

    console.log('validation done. check error logs above (if any)');

  }

};

const processIngestedData = {

  perform: async function() {

    const isPromptNeededBool = helper.validateIsPromptNeeded(process.argv[3])
        , contractIndex = parseInt(process.argv[2]);

    contractAddress = contractAddresses[contractIndex-1];
    senderName = coreAddresses.bonusContractUserNamePrefix + contractIndex;
    senderAddress = coreAddresses.getAddressForUser(senderName);

    console.log(senderName + " Address: " + senderAddress);
    console.log("Bonus Contract Address: " + contractAddress);
    console.log("ST Contract Address: " + STContractAddress);
    console.log("start idex would be : " + await _private.getStartIndex(contractAddress));

    console.log('starting data verification before processing');
    await _private.verifyContractDataBeforeProcessing();

    if (isPromptNeededBool) {

      var prompts = readline.createInterface(process.stdin, process.stdout);

      await new Promise(
          function (onResolve, onReject) {
            prompts.question("Do you want to really do this? [Y/N]",
                function (intent) {
                  if (intent === 'Y') {
                    console.log("Initiating processing of bonus data on contract: " + contractName + " at address " + contractAddress);
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

    const lastBatchRsp = await _private.processBonusesInBatches();

    console.log('starting data verification after processing');
    await _private.verifyContractDataAfterProcessing(lastBatchRsp);

  }

};

processIngestedData.perform();