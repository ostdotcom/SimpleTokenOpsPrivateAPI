"use strict";
/*
 * Nonce Manager
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

const publicEthereum = require("../request/public_ethereum");

// Global variable for nonce
global.nonces = global.nonces || {};

const nonceManager = {

  // get nonce from global constant or Ops public API
  getNonce: function(senderAddr) {
    return new Promise(function(onResolve, onReject){
      const incrAndReturn = function() {
        global.nonces[senderAddr] += 1;
        onResolve(global.nonces[senderAddr]);
      };

      if (global.nonces[senderAddr]) {
        incrAndReturn();
      } else {
        nonceManager.resetNonceFor(senderAddr).then(incrAndReturn, onReject);
      }
    });
  },

  // Reset nounce by fetching current nonce from Public Ops API
  resetNonceFor: function(senderAddr) {
    return new Promise(function(onResolve, onReject){

      const handleOnSuccess = function (currNonce) {
        global.nonces[senderAddr] = currNonce;
        onResolve();
      };

      publicEthereum.getNonce(senderAddr).then(handleOnSuccess, onReject);

    });
  }
};

module.exports = nonceManager;