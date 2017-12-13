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

  distributeTokens: function (distributorName, tokenContractAddress, userBonusData) {
    return new Promise(async function (onResolve, onReject) {

      var result = [];

      for (var i = 0; i < userBonusData.length; i++) {

        var userData = userBonusData[i];
        var userAddress = userData[0];
        var userBonusAmount = userData[1];

        console.log("Iteration: " + i + " at userAddress: " + userAddress + " userBonusAmount " + userBonusAmount);



        // Call add data method of contract
        //await helper.sendTransferTransaction(distributorName, tokenContractAddress, userAddress, userBonusAmount)
        //    .then(helper.verifyPublicOpsResponse)
        //    .then(
        //          function(data) {
        //            console.log(data);
        //            result.push(['eth_address', 'contract_address' , i])
        //          }
        //    );

        result.push([userAddress, tokenContractAddress , i]);

      }
      onResolve(result);
    });

  }

};

module.exports = helper;