"use strict";
/*
 * Token Sale Routes
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

const express = require('express')
  , router = express.Router()
  , web3Validator = require('../lib/web3/validator')
  , web3Signer = require('../lib/web3/signer')
  , publicEthereum = require('../lib/request/public_ethereum')
  , jwtAuth = require('../lib/jwt/jwt_auth')
  , responseHelper = require('../lib/formatter/response')
  , getRawTx = require('../lib/web3/get_raw_tx');


/* GET users listing. */
router.post('/whitelist', function (req, res, next) {
  const encodedParams = req.body.token;

  // send error, if token is invalid
  const jwtOnReject = function (err) {
    console.error(err);
    return responseHelper.error('ts_1', 'Invalid token or expired').renderResponse(res);
  };

  // send request to public ops, if token was valid
  const jwtOnResolve = function (reqParams) {
    const addressToWhiteList = reqParams.data.address
      , phase = reqParams.data.phase;

    // check if address is a valid address
    if (!web3Validator.isAddress(addressToWhiteList)) {
      return responseHelper.error('ts_2', 'Whitelist address is invalid.').renderResponse(res);
    }

    // check if phase is valid
    if (!web3Validator.isTokenSalePhase(phase)) {
      return responseHelper.error('ts_3', 'Whitelist phase is invalid.').renderResponse(res);
    }

    // generate raw transaction
    const rawTx = getRawTx.forWhitelisting(addressToWhiteList, phase);

    // handle final response
    const handlePublicOpsSuccess = function (publicOpsResp) {
      const success = publicOpsResp.success;

      if (success) {
        var publicOpsRespData = publicOpsResp.data || {}
          , transactionHash = publicOpsRespData.transaction_hash;
        return responseHelper.successWithData({transaction_hash: transactionHash}).renderResponse(res);
      } else {
        console.error(publicOpsResp);
        return responseHelper.error('ts_4', 'Public OPS api error.', publicOpsResp.err.code).renderResponse(res);
      }
    };

    // Sign the transaction, send it to public ops machine, send response
    return web3Signer.signTransactionBy(rawTx, 'whitelister')
      .then(publicEthereum.sendSignedTransaction)
      .then(handlePublicOpsSuccess);

  };

  // Verify token
  Promise.resolve(
    jwtAuth.verifyToken(encodedParams, 'privateOps')
      .then(
        jwtOnResolve,
        jwtOnReject
      )
  ).catch(function(err){
    console.error(err);
    responseHelper.error('ts_5', 'Something went wrong').renderResponse(res)
  });

});

module.exports = router;
