"use strict";
/*
 * Nonce Manager
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

var publicEthereum = require("../request/public_ethereum");
global.nonces = global.nonces || {};

const nonceManager = {
  getNonce: function(senderAddr) {
    return new Promise(function(onResolve, onReject){
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
      publicEthereum.getNonce(senderAddr)
        .then(function(currNonce){
          global.nonces[senderAddr] = currNonce + 1;

          onResolve(currNonce);
        }
      )

    });
  }
};

module.exports = nonceManager;