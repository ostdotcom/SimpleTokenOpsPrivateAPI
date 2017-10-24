"use strict";
/*
 * Token Sale Routes
 *
 * * Author: Rachin
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

var express = require('express')
  , router = express.Router()
  , web3Validator = require('../lib/web3/validator')
  , web3Signer = require('../lib/web3/signer')
  , publicEthereum = require('../lib/request/public_ethereum')
  , jwtAuth = require('../lib/jwt/jwt_auth')
	, responseHelper = require('../lib/formatter/response')
  , getRawTx = require('../lib/web3/get_raw_tx');


/* GET users listing. */
router.post('/whitelist', function(req, res, next) {
  var encodedParams = req.body.token;

  var jwtOnResolve = function(reqParams){
    var addressToWhiteList = reqParams.address
      , phase = reqParams.phase
      , apiResponse = null;

    if (web3Validator.isAddress(addressToWhiteList)) {

      var rawTx = getRawTx.forWhitelisting(addressToWhiteList, phase);

      web3Signer.perform(rawTx, 'whitelister')
        .then(publicEthereum.sendSignedTransaction)
        .then(function(publicOpsResp){
          var parsedPublicOpsResp = JSON.parse(publicOpsResp)
            , success = parsedPublicOpsResp.success
            , transactionHash = parsedPublicOpsResp.transaction_hash;

          if (success) {
            apiResponse = responseHelper.successWithData({transaction_hash: transactionHash})
          } else {
            apiResponse = responseHelper.error('ts_1', 'public ops api errored out.')
          }

          return apiResponse.sendResponse(res)
        });
    } else {
      apiResponse = responseHelper.error('ts_2', 'address is not valid.');
      return apiResponse.sendResponse(res)
    }
  };

  var jwtOnReject = function(err) {
    var apiResponse = responseHelper.error('ts_3', 'Invalid params obtained for whitelisting.');
    return apiResponse.sendResponse(res);
  };

  jwtAuth.verifyToken(encodedParams)
    .then(
      jwtOnResolve,
      jwtOnReject
    );
  
});

module.exports = router;
