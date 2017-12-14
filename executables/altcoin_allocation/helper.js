"use strict";
/*
 * Helper
 *
 * * Author: Aman
 * * Date: 04/11/2017
 * * Reviewed by:
 */

const pathPrefix = '../..';
const fs = require('fs')
  , parseCsv = require('csv-parse')
  , coreAddresses = require(pathPrefix + '/config/core_addresses')
  , getRawTx = require(pathPrefix + '/lib/web3/get_raw_tx')
  , web3Signer = require(pathPrefix + '/lib/web3/signer')
  , publicEthereum = require(pathPrefix + '/lib/request/public_ethereum');

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

  // Transfer From distributor address for different calls
  sendTransferTransaction: function (distributorName, tokenContractAddress, receiverAddr, amount) {

    var rawTx =  getRawTx.dist_alt_coin(distributorName, tokenContractAddress, receiverAddr, amount);
    console.log("-----------------------------------rawTx-----------------------------------");
    console.log(rawTx);
    console.log("-----------------------------------rawTx-----------------------------------");

    // handle final response
    const handlePublicOpsOkResponse = function (publicOpsResp) {
      return new Promise(function (onResolve, onReject) {
        const success = publicOpsResp.success;

        if (success) {
          console.log('----- Tx Successful for contract address: ' +  tokenContractAddress);
          console.log(publicOpsResp);
          onResolve(publicOpsResp.data);
        } else {
          console.error('----- Tx Error for contract address: ' + tokenContractAddress);
          console.error(publicOpsResp);
          process.exit(1);
        }

      });
    };

    // Sign the transaction, send it to public ops machine, send response
    return web3Signer.signTransactionBy(rawTx, distributorName)
      .then(publicEthereum.sendSignedTransaction)
      .then(handlePublicOpsOkResponse);

  },

  // Poll for transaction receipt
  verifyPublicOpsResponse: function(publicOpsRespData){
    return new Promise(function(onResolve, onReject){
      var txSetInterval = null;

      var handleGetTxInfoResponse = function (response) {
        console.log("\n\ngetTransactionInfo API response: ");
        console.log(response);
        if (response.success) {
          clearInterval(txSetInterval);
          onResolve(response);
        } else {
          console.log('\n\nWaiting for ' + publicOpsRespData.transaction_hash + ' to be mined');
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

  parseResp: function(getTxInfoResponse) {
    console.log(JSON.stringify(getTxInfoResponse));

    var events = [];
    var events_data = getTxInfoResponse.data.events_data;

    for(var i = 0; i < events_data.length ; i++) {
      events.push(events_data[i].name);
    }

    console.log("\n\n\t\tEVENTS RECEIVED-" + events  + '\n\n');

    return getTxInfoResponse.data.transaction_hash;
  },

  distributeTokens: function (distributorName, checkSumTokenContractAddr, checkSumReceiverAddr, amount) {
    return helper.sendTransferTransaction(
      distributorName,
      checkSumTokenContractAddr,
      checkSumReceiverAddr,
      amount
    ).then(helper.verifyPublicOpsResponse)
      .then(helper.parseResp);
  }

};

module.exports = helper;