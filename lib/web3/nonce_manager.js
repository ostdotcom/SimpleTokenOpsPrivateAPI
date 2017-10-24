"use strict";
/*
 * Nonce manager
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

const nonceManager = {
  getNonce: function(senderAddr) {
    return new Promise(function(onResolve, onReject){
      global.nonces = global.nonces || {};
      var nonces = global.nonces
        , senderNonce = nonces[senderAddr];

      if (senderNonce) {
        global.nonces[senderAddr] += 1;
        onResolve(senderNonce);
      } else {
        nonceManager.resetNonceFor(senderAddr).then(onResolve)
      }

    });
  },

  resetNonceFor: function(senderAddr) {
    return new Promise(function(onResolve, onReject){
      global.nonces = global.nonces || {};
      // TODO - get nonce using an API call
      global.nonces[senderAddr] = 0;
      var currNonce = global.nonces[senderAddr];
      global.nonces[senderAddr] += 1;

      onResolve(currNonce);
    });
  }
};