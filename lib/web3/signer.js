"use strict";
/*
 * Web3 provider
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

var web3Provider = require('./provider')
  , coreAddreses = require('../../config/core_addreses')
  , nonceManager = require('./nonce_manager');

const web3Signer = {
  perform: function(rawTx, senderName){
    var senderAddr = coreAddreses.getAddressForUser(senderName)
      , senderPassphrase = coreAddreses.getPassphraseForUser(senderName);

    var setRawTx = function(nonce){
      rawTx['nonce'] = nonce.toString(16);
      return new Promise(function(onResolve, onReject){onResolve()})
    };

    var unlockAcc = function() {
      return web3Provider.eth.personal.unlockAccount(senderAddr, senderPassphrase);
    };

    var signRawTx = function() {
      return web3Provider.eth.signTransaction(rawTx, senderAddr);
    };

    var extractRawHex = function(res) {
      return new Promise(function(onResolve, onReject){
        onResolve(res.raw)
      });
    };

    return nonceManager.getNonce(senderAddr)
      .then(setRawTx)
      .then(unlockAcc)
      .then(signRawTx)
      .then(extractRawHex)

  }
};

module.exports = web3Signer;