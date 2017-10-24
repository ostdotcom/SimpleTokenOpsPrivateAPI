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
  , publicEthereum = require("../lib/request/public_ethereum");

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

module.exports = router;
