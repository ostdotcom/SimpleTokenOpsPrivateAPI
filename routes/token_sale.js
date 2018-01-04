"use strict";
/*
 * Token Sale Routes
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

const express = require('express')
  , router = express.Router();

const rootPrefix = '..'
  , web3Validator = require(rootPrefix + '/lib/web3/validator')
  , web3Signer = require(rootPrefix + '/lib/web3/signer')
  , publicEthereum = require(rootPrefix + '/lib/request/public_ethereum')
  , responseHelper = require(rootPrefix + '/lib/formatter/response')
  , getRawTx = require(rootPrefix + '/lib/web3/get_raw_tx')
  , web3RpcProvider = require(rootPrefix + '/lib/web3/rpc_provider')
  ;


/* GET users listing. */
router.post('/whitelist', function (req, res, next) {
  const performer = function () {
    const decodedParams = req.decodedParams
      , phase = decodedParams.phase
      ;

    // Get the address of the contract for whitelisting. This will be different for different client.
    var contractAddress = decodedParams.contract_address;
    var addressToWhiteList = decodedParams.address;

    // for nonce too low error, we will retry once.
    var retryCount = 0;

    try {
      // convert the addresses to checksum.
      addressToWhiteList = web3RpcProvider.utils.toChecksumAddress(addressToWhiteList);
      contractAddress = web3RpcProvider.utils.toChecksumAddress(contractAddress);
    } catch(err) {
      console.error(err);
      return responseHelper.error(
        'ts_1',
        'Invalid address passed. user address: ',
        addressToWhiteList,
        ', contract address: ',
        contractAddress
      ).renderResponse(res);
    }

    // check if address is a valid address
    if (!web3Validator.isAddress(addressToWhiteList)) {
      return responseHelper.error('ts_2', 'Whitelist address is invalid.').renderResponse(res);
    }

    // check if phase is valid
    if (!web3Validator.isTokenSalePhase(phase)) {
      return responseHelper.error('ts_3', 'Whitelist phase is invalid.').renderResponse(res);
    }

    // generate raw transaction
    const rawTx = getRawTx.forWhitelisting(contractAddress, addressToWhiteList, phase);

    // handle final response
    const handlePublicOpsOkResponse = function (publicOpsResp) {
      const success = publicOpsResp.success;

      if (success) {
        var publicOpsRespData = publicOpsResp.data || {}
          , transactionHash = publicOpsRespData.transaction_hash;
        return responseHelper.successWithData({transaction_hash: transactionHash}).renderResponse(res);
      } else {
        console.error(publicOpsResp);

        const isNonceTooLow = function () {
          return publicOpsResp.err.code.indexOf('nonce too low') > -1;
        };

        const retryCountMaxReached = function () {
          return retryCount > 0;
        };

        if(isNonceTooLow() && !retryCountMaxReached()) {
          retryCount = retryCount + 1;
          return web3Signer.retryAfterClearingNonce(rawTx, 'whitelister')
            .then(publicEthereum.sendSignedTransaction)
            .then(handlePublicOpsOkResponse);
        } else {
          return responseHelper.error('ts_4', 'Public OPS api error.', publicOpsResp.err.code).renderResponse(res);
        }
      }
    };

    // Sign the transaction, send it to public ops machine, send response
    return web3Signer.signTransactionBy(rawTx, 'whitelister')
      .then(publicEthereum.sendSignedTransaction)
      .then(handlePublicOpsOkResponse);

  };

  // Verify token
  Promise.resolve(performer()).catch(function(err){
    console.error(err);
    responseHelper.error('ts_5', 'Something went wrong').renderResponse(res)
  });

});

module.exports = router;
