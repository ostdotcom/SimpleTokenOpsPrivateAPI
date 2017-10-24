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
  , publicEthereum = require("../lib/request/public_ethereum")
  , jwtAuth = require("../lib/jwt/jwt_auth")
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
		if (err) {
			return res.json(200, {
				success: false, 
				data: {
					"token": token
				},
				error: {
					"msg": 'The token is not valid'
				}
			});
		}
		return res.json(200, {
			success: true, 
			data: {
				"token": token,
				"decodedToken" : decodedToken
			}
		});
	}); 

	res.send("token: |" + token + "|");
});


router.get('/test-invalid', function(req, res, next) {
	var data = {
		"signed_tx" : "ksdjfgjksfksdjfkasjhdfkasjdfh"
	};
	var token = jwtAuth.issueToken( data );

	var malformedToken = token + "asdhaksdgjahgsdjhagsd";
	jwtAuth.verifyToken( malformedToken, function(err, decodedToken) {
		if (err) {
			return res.json(200, {
				success: false, 
				data: {
					"token": token,
					"malformedToken": malformedToken
				},
				error: {
					"msg": 'The token is not valid'
				}
			});
		}
		return res.json(200, {
			success: true, 
			data: {
				"token": token,
				"decodedToken" : decodedToken
			}
		});
	}); 

	res.send("token: |" + token + "|");
});


module.exports = router;
