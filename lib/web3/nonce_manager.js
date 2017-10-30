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
  getNonce: function(addr) {
    return new Promise(function(onResolve, onReject){
      const incrAndReturn = function() {
        var currNonce = global.nonces[addr];
        global.nonces[addr] += 1;
        onResolve(currNonce);
      };

      if (global.nonces[addr]) {
        incrAndReturn();
      } else {
        nonceManager.resetNonceFor(addr).then(incrAndReturn, onReject);
      }
    });
  },

  // Reset nounce by fetching current nonce from Public Ops API
  resetNonceFor: function(addr) {
    return new Promise(function(onResolve, onReject){

      const handleOnSuccess = function (publicOpsResp) {
        const success = publicOpsResp.success;
        if (success) {
          var publicOpsRespData = publicOpsResp.data || {};
          global.nonces[addr] = publicOpsRespData.nonce;
          onResolve();
        } else {
          onReject();
        }
      };

      publicEthereum.getNonce(addr).then(handleOnSuccess, onReject);

    });
  },

  clearLocalNonce: function(addr) {
    console.log('clearing nonce for address: ' + addr);
    global.nonces[addr] = null;
  }
};

module.exports = nonceManager;