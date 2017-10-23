"use strict";
/*
 * Web3 provider
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

var web3Provider = require('./provider')
  , coreAddreses = require('../../config/core_addreses');

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

    return web3Signer
      .getNonce(senderAddr)
      .then(setRawTx)
      .then(unlockAcc)
      .then(signRawTx)
      .then(extractRawHex)

  },

  getNonce: function(senderAddr) {
    return new Promise(function(onResolve, onReject){
      global.nonces = global.nonces || {};
      var nonces = global.nonces
        , senderNonce = nonces[senderAddr];

      if (senderNonce) {
        global.nonces[senderAddr] += 1;
        onResolve(senderNonce);
      } else {
        web3Signer.resetNonceFor(senderAddr).then(onResolve)
      }

    });
  },

  resetNonceFor: function(senderName) {
    return new Promise(function(onResolve, onReject){
      global.nonces = global.nonces || {};
      // TODO - get nonce using an API call
      global.nonces[senderName] = 0;
    });
  }
};

module.exports = web3Signer;