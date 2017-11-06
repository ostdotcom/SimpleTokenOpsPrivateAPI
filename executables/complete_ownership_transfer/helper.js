"use strict";
/*
 * Helper
 *
 * * Author: Kedar, Alpesh
 * * Date: 04/11/2017
 * * Reviewed by: Sunil
 */

const getRawTx = require('../../lib/web3/get_raw_tx')
  , web3Signer = require('../../lib/web3/signer')
  , readline = require('readline')
  , coreAddresses = require('../../config/core_addresses')
  , publicEthereum = require('../../lib/request/public_ethereum');

const _private = {

  // Complete Ownership Transfer (claim the ownership)
  completeOwnershipTransferFor: function (contractName, contractAddr, senderName) {
    if (coreAddresses.getContractNameFor(contractAddr) != contractName) {
      throw 'Contract name: ' + contractName + ' and contract addr: ' + contractAddr + ' dont match.';
    }

    var rawTx = getRawTx.completeOwnershipTransfer(contractName, contractAddr, senderName);

    // handle final response
    const handlePublicOpsOkResponse = function (publicOpsResp) {
      return new Promise(function (onResolve, onReject) {
        const success = publicOpsResp.success;

        if (success) {
          console.log('----- DONE - Ownership Transfer for ' + contractName + ' at addr ' + contractAddr + ' to ' + senderName + ' -----');
          console.log(publicOpsResp);
          onResolve(publicOpsResp.data);
        } else {
          console.error('----- ERROR - Ownership Transfer for ' + contractName + ' at addr ' + contractAddr + ' to ' + senderName + ' -----');
          console.error(publicOpsResp);
          onReject();
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
        20000
      );

    });
  }
};

const helper = {
  performFor: async function(contractName, contractAddr) {

    var prompts = readline.createInterface(process.stdin, process.stdout),
      senderName = 'postInitOwner';

    console.log(senderName + ' Address: ' + coreAddresses.getAddressForUser(senderName));
    console.log('Claiming ownership of contract "' + contractName + '" at address: ' + contractAddr);

    await new Promise(
      function (onResolve, onReject) {
        prompts.question("Do you want to really do this? [Y/N]",
          function (intent) {
            if (intent === 'Y') {
              console.log('Great! Proceeding completeOwnershipTransfer for ' + contractName);
              prompts.close();
              onResolve();
            } else {
              console.log('Exiting script.');
              process.exit(1);
            }
          }
        );
      }
    );

    return _private.completeOwnershipTransferFor(contractName, contractAddr, senderName)
      .then(_private.verifyPublicOpsResponse)
      .then(function(data){console.log(data.data.events_data[0].events);});
  }
};

module.exports = helper;