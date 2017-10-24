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
  , web3Provider = require('../lib/web3/provider')
  , web3Signer = require('../lib/web3/signer')
  , coreAddresses = require('../config/core_addresses')
  , whitelistContractAddress = coreAddresses.getAddressForContract('whitelister')
  , tokenSaleContractAbi = require('../abi/TokenSale')
  , myContract = new web3Provider.eth.Contract(tokenSaleContractAbi)
  , publicEthereum = require('../lib/request/public_ethereum')
  , jwtAuth = require('../lib/jwt/jwt_auth')
	, responseHelper = require('../lib/formatter/response')
;


/* GET users listing. */
router.post('/whitelist', function(req, res, next) {
	var addressToWhiteList = req.body.address
    , phase = res.body.phase;

  if (web3Validator.isAddress(addressToWhiteList)) {
    var encodedABI = myContract.methods.updateWhitelist(addressToWhiteList, phase).encodeABI();
    var raxTx = {
      to: whitelistContractAddress,
      data: encodedABI,
      gasPrice: '0x3B9ACA00', // taken from http://ethgasstation.info/ ---- 1 gwei
      gasLimit: '0xAAAAAAAAA'
    };

    web3Signer.perform(rawTx, 'whitelister')
      .then(publicEthereum.sendSignedTransaction)
      .then(function(){
        res.setHeader('Content-Type', 'application/json');
        res.send({});
      });
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.send({err: {code: 'ts_1'}});
  }
  
});


router.get('/test-valid', function(req, res, next) {
	var data = {
		"signed_tx" : "ksdjfgjksfksdjfkasjhdfkasjdfh"
	};
	var token = jwtAuth.issueToken( data );

	jwtAuth.verifyToken( token, function(err, decodedToken) {
    var r = null;

		if (err) {
      r = responseHelper.error('ts_2', 'test-valid');
		} else {
      r = responseHelper.successWithData({
        "token": token,
        "decodedToken" : decodedToken
      });
    }

    return r.sendResponse(res);
	});
});


router.get('/test-invalid', function(req, res, next) {
	var data = {
		"signed_tx" : "ksdjfgjksfksdjfkasjhdfkasjdfh"
	};
	var token = jwtAuth.issueToken( data );

	var malformedToken = token + "asdhaksdgjahgsdjhagsd";

  jwtAuth.verifyToken( malformedToken, function(err, decodedToken) {
    var r = null;

    if (err) {
      r = responseHelper.error('ts_3', 'test-invalid');
    } else {
      r = responseHelper.successWithData({
        "token": token,
        "decodedToken" : decodedToken
      });
    }

    return r.sendResponse(res);
  });
});


module.exports = router;
