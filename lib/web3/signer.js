"use strict";
/*
 * Web3 Transaction Signer
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

const web3RpcProvider = require('./rpc_provider')
  , coreAddresses = require('../../config/core_addresses')
  , nonceManager = require('./nonce_manager');

const web3Signer = {

  // Sign transaction
  signTransactionBy: function (rawTx, senderName, senderAddr) {
    if (!senderAddr) {
      senderAddr = coreAddresses.getAddressForUser(senderName);
    }

    const senderPassphrase = coreAddresses.getPassphraseForUser(senderName);

    const setRawTx = function (nonce) {
      rawTx['nonce'] = web3RpcProvider.utils.toHex(nonce);
      return new Promise(function(onResolve, onReject){onResolve()});
    };

    const unlockAcc = function() {
      return web3RpcProvider.eth.personal.unlockAccount(senderAddr, senderPassphrase);
    };

    const signRawTx = function() {
      return web3RpcProvider.eth.signTransaction(rawTx, senderAddr);
    };

    const extractRawHex = function(res) {
      return new Promise(function(onResolve, onReject){
        onResolve(res.raw);
      });
    };

    return nonceManager.getNonce(senderAddr)
      .then(setRawTx)
      .then(unlockAcc)
      .then(signRawTx)
      .then(extractRawHex);
  },

  retryAfterClearingNonce: function (rawTx, senderName, senderAddr) {
    if (!senderAddr) {
      senderAddr = coreAddresses.getAddressForUser(senderName);
    }

    nonceManager.clearLocalNonce(senderAddr);

    return web3Signer.signTransactionBy(rawTx, senderName, senderAddr);
  }
};

module.exports = web3Signer;