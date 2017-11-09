"use strict";
/*
 * Helper
 *
 * * Author: Abhay
 * * Date: 04/11/2017
 * * Reviewed by: Sunil
 */

const fs = require('fs')
  , parseCsv = require('csv-parse')
  , coreAddresses = require('../../config/core_addresses')
  , getRawTx = require('../../lib/web3/get_raw_tx')
  , web3Signer = require('../../lib/web3/signer')
  , publicEthereum = require('../../lib/request/public_ethereum');

const helper = {
  readCsv: function (filePath) {

    return new Promise(function (onResolve, onReject) {

      var csvData = [];
      fs.createReadStream(filePath)
        .pipe(parseCsv({delimiter: ','}))
        .on('data', function (csvrow) {
          console.debug(csvrow);
          //Push Row(Array) to csvData
          csvData.push(csvrow);
        })
        .on('end', function () {
          onResolve(csvData);
        })
        .on('error', function (e) {
          console.error("Error: " + e + " in CSV parsing ");
          process.exit(1);
        });
    });

  },

  // Send transaction for different calls
  sendTransaction: function (txType, contractName, contractAddress, senderName, dataForTx) {

    var rawTx = helper.getRawTransactionFor(txType, contractName, contractAddress, senderName, dataForTx);
    console.log("-----------------------------------rawTx-----------------------------------");
    console.log(rawTx);
    console.log("-----------------------------------rawTx-----------------------------------");
    // handle final response
    const handlePublicOpsOkResponse = function (publicOpsResp) {
      return new Promise(function (onResolve, onReject) {
        const success = publicOpsResp.success;

        if (success) {
          console.log('----- Tx Successful for contract: ' +  contractName);
          console.log(publicOpsResp);
          onResolve(publicOpsResp.data);
        } else {
          console.error('----- Tx Error for contract: ' + contractName);
          console.error(publicOpsResp);
          process.exit(1);
        }

      });
    };

    // Sign the transaction, send it to public ops machine, send response
    return web3Signer.signTransactionBy(rawTx, senderName)
      .then(publicEthereum.sendSignedTransaction)
      .then(handlePublicOpsOkResponse);

  },

  // Poll for transaction receipt
  verifyPublicOpsResponse: function(publicOpsRespData){
    return new Promise(function(onResolve, onReject){
      var txSetInterval = null;

      var handleGetTxInfoResponse = function (response) {
        console.log("getTransactionInfo API response: ");
        console.log(response);
        if (response.success) {
          clearInterval(txSetInterval);
          onResolve(response);
        } else {
          console.log('Waiting for ' + publicOpsRespData.transaction_hash + ' to be mined');
        }
      };

      txSetInterval = setInterval(
        function(){
          publicEthereum.getTransactionInfo(publicOpsRespData.transaction_hash).then(handleGetTxInfoResponse);
        },
        10000
      );

    });
  },

  // Feed data in contract with Max 35 logic
  processFeedingData: function (contractName, senderName, data, maxEntriesPerContract, contractAddresses) {
    return new Promise(async function (onResolve, onReject) {

      var contractAddress = null
        , contractAddressIndex = 0;

      var callLockContract = function (contractAddress) {
        return new Promise(async function (onResolve, onReject) {
          console.log("\nInitiating locking of contract address: " + contractAddress + " for contract name: " + contractName + " for sender name: " + senderName);
          await helper.sendTransaction('callLockContract', contractName, contractAddress, senderName, [])
            .then(helper.verifyPublicOpsResponse)
            .then(function(data){console.log(data.data.events_data[0].events);});
          onResolve();
        });
      }

      for (var i = 0; i < data.length; i++) {

        contractAddress = contractAddresses[contractAddressIndex];
        console.log("Iteration: " + i + " at address: " + contractAddress + " Data to Process: " + data[i]);
        // Call add data method of contract
        await helper.sendTransaction('callAddData', contractName, contractAddress, senderName, data[i])
          .then(helper.verifyPublicOpsResponse)
          .then(function(data){console.log(data.data.events_data[0].events);});
        // If contract instance data entry is complete
        if ( (((i + 1) % maxEntriesPerContract) === 0) || ((i + 1) == data.length) ) {
          // Call lock method of contracts
          await callLockContract(contractAddress);
          contractAddressIndex += 1;
          console.log("\n\n");
        }
      }

      onResolve();
    });

  },

  // NOTE:
  //
  // Below is code that need to be modified for different contracts
  //

  // Get raw transaction for transaction type
  getRawTransactionFor: function(txType, contractName, contractAddress, senderName, dataForTx) {

    if (txType == 'callLockContract') {
      // define different lock methods for different contracts
      return getRawTx.forLockContract(contractName, contractAddress, senderName);
    } else if (txType == 'callAddData') {
      // define different add data methods for different contracts
      if ('grantableAllocations' == coreAddresses.getContractNameFor(contractAddress)) {

        return helper.getTxForAddGrantableAllocation(contractName, contractAddress, senderName, dataForTx);

      } else if ('presales' == coreAddresses.getContractNameFor(contractAddress)) {

        return helper.getTxForPreSaleAllocation(contractName, contractAddress, senderName, dataForTx);

      }
    }
    throw "Unhandled txType: " + txType + " for contract name: " + contractName + " at address: " + contractAddress;
  },

  // get raw transaction for addGrantableAllocation method
  getTxForAddGrantableAllocation: function (contractName, contractAddress, senderName, dataForTx) {
    var receiverAddr = dataForTx[0],
      amount = dataForTx[1],
      isRevokable = dataForTx[2];
    return getRawTx.addGrantableAllocation(contractName, contractAddress, senderName, receiverAddr, amount, isRevokable);
  },

  // Get Raw Transaction for addPresale method
  getTxForPreSaleAllocation: function(contractName, contractAddress, senderName, dataForTx) {
    var receiverAddr = dataForTx[0],
      baseAmount = dataForTx[1],
      bonusAmount = dataForTx[2];
    return getRawTx.addPreSaleAllocation(contractName, contractAddress, senderName, receiverAddr, baseAmount, bonusAmount);
  },

  // Verify is prompt needed values
  validateIsPromptNeeded: function(isPromptNeeded) {
    if (isPromptNeeded === undefined || isPromptNeeded == '' || !['true','false'].includes(isPromptNeeded)) {
      console.log("Invalid isPromptNeeded: " + isPromptNeeded + " value");
      process.exit(1);
    }
    return (isPromptNeeded == 'true');
  }

};

module.exports = helper;