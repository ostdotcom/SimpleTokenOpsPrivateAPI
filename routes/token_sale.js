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
  , coreAddresses = require(rootPrefix + '/config/core_addresses')
  , nonceCacheManagerKlass = require(rootPrefix + '/lib/cache_management/nonce_cache_manager')
;


/* GET users listing. */
router.post('/whitelist', function (req, res, next) {
  const performer = function () {
    const decodedParams = req.decodedParams
      , phase = decodedParams.phase
      , nonce = web3RpcProvider.utils.toHex(decodedParams.nonce)
      , gasPrice = web3RpcProvider.utils.toHex(decodedParams.gasPrice)
      , isNonceAbsentInRequest = (nonce === undefined);
    ;

    // Get the address of the contract for whitelisting. This will be different for different client.
    var whitelisterAddress = decodedParams.whitelister_address
      , contractAddress = decodedParams.contract_address
      , addressToWhiteList = decodedParams.address
    ;

    // for nonce too low error, we will retry once.
    var retryCount = 0;

    try {
      // convert the addresses to checksum.
      addressToWhiteList = web3RpcProvider.utils.toChecksumAddress(addressToWhiteList);
      contractAddress = web3RpcProvider.utils.toChecksumAddress(contractAddress);
      whitelisterAddress = web3RpcProvider.utils.toChecksumAddress(whitelisterAddress);
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

    // check if whitelister address is valid- dont check now. Rails should handle
    // if (!web3Validator.isWhitelisterAddress(whitelisterAddress)) {
    //   return responseHelper.error('ts_1.1', 'Whitelist address is invalid.').renderResponse(res);
    // }

    // check if address is a valid address
    if (!web3Validator.isAddress(addressToWhiteList)) {
      return responseHelper.error('ts_2', 'Ethereum address is invalid.').renderResponse(res);
    }

    // check if phase is valid
    if (!web3Validator.isTokenSalePhase(phase)) {
      return responseHelper.error('ts_3', 'Whitelist phase is invalid.').renderResponse(res);
    }

    // generate raw transaction
    const rawTx = getRawTx.forWhitelisting(whitelisterAddress, contractAddress, addressToWhiteList, phase, nonce, gasPrice);

    // handle final response
    const handlePublicOpsOkResponse = function (publicOpsResp) {
      const success = publicOpsResp.success
        , usedNonce = rawTx.nonce
        , usedGasPrice = rawTx.gasPrice
      ;
      if (success) {
        console.log("handlePublicOpsOkResponse SUCCESS");
        var publicOpsRespData = publicOpsResp.data || {}
          , transactionHash = publicOpsRespData.transaction_hash
          , processData = {
            transaction_hash: transactionHash,
            nonce:usedNonce,
            gas_price:usedGasPrice
          }
        ;

        return responseHelper.successWithData(processData).renderResponse(res);
      } else {

        console.error("handlePublicOpsOkResponse ERROR-", publicOpsResp.err.code);

        const isNonceTooLow = function () {
          return publicOpsResp.err.code.indexOf('wrong_nonce') > -1;
        };

        // when transaction is pending or queued and if any data(including gas price) is modified,
        // but transaction cannot be resubmitted because gas price is still less than 110% of previous
        const isTxUnderpriced = function () {
          return  publicOpsResp.err.code.indexOf('transaction_underpriced') > -1;
        };

        const clearNonceIfRequired = function(){
          if (isNonceAbsentInRequest){
            const nonceManager = new nonceCacheManagerKlass({address_id: whitelisterAddress});
            nonceManager.clearLocalNonce();
          }
        };

        const retryCountMaxReached = function () {
          return retryCount > 0;
        };

        if(isNonceAbsentInRequest && (isNonceTooLow() || isTxUnderpriced())&& !retryCountMaxReached()) {
          console.error("handlePublicOpsOkResponse RETRYING");
          retryCount = retryCount + 1;
          return web3Signer.retryAfterClearingNonce(rawTx, 'whitelister', whitelisterAddress)
            .then(publicEthereum.sendSignedTransaction)
            .then(handlePublicOpsOkResponse)
            .catch(function(){
              return responseHelper.error('ts_7', 'Private OPS api error.').renderResponse(res);
            });
        } else {
          clearNonceIfRequired();
          return responseHelper.error('ts_4', 'Public OPS api error.', publicOpsResp.err.code).renderResponse(res);
        }
      }
    };

    //todo: if transaction fails nonce is not cleared

    // Sign the transaction, send it to public ops machine, send response
    return web3Signer.signTransactionBy(rawTx, 'whitelister', whitelisterAddress)
      .then(publicEthereum.sendSignedTransaction)
      .then(handlePublicOpsOkResponse)
      .catch(function(){
        return responseHelper.error('ts_5', 'Private OPS api error.').renderResponse(res);
      });

  };

  // Verify token
  Promise.resolve(performer()).catch(function(err){
    console.error(err);
    responseHelper.error('ts_6', 'Something went wrong').renderResponse(res)
  });

});

module.exports = router;
