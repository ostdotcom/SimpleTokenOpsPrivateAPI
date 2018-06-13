"use strict";
/*
 * Web3 Transaction Signer
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

const rootPrefix = "../.."
  , web3RpcProvider = require(rootPrefix + '/lib/web3/rpc_provider')
  , coreAddresses = require(rootPrefix + '/config/core_addresses')
  , nonceCacheManagerKlass = require(rootPrefix + '/lib/cache_management/nonce_cache_manager')
  ;

const web3Signer = {

  // Sign transaction
  signTransactionBy: function (rawTx, senderName, senderAddr) {
    if (!senderAddr) {
      senderAddr = coreAddresses.getAddressForUser(senderName);
    }

    const senderPassphrase = coreAddresses.getPassphraseForUser(senderName);

    const setRawTx = function (nonce) {
      console.log("USING NONCE-", nonce);
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

    const handleCatch = function(res) {
      return Promise.reject();
    };

    const nonceManager = new nonceCacheManagerKlass({address_id: senderAddr});
    return nonceManager.getNonce(rawTx.nonce)
      .then(setRawTx)
      .then(unlockAcc)
      .then(signRawTx)
      .then(extractRawHex)
      .catch(handleCatch);
  },

  retryAfterClearingNonce: function (rawTx, senderName, senderAddr) {
    if (!senderAddr) {
      senderAddr = coreAddresses.getAddressForUser(senderName);
    }

    const nonceManager = new nonceCacheManagerKlass({address_id: senderAddr});
    nonceManager.clearLocalNonce();
    rawTx.nonce = undefined;
    return web3Signer.signTransactionBy(rawTx, senderName, senderAddr);
  }
};

module.exports = web3Signer;