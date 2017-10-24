"use strict";
/*
 * Public Ethereum Wrapper
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

var jwtAuth = require('../jwt/jwt_auth')
  , httpWrapper = require('./http_wrapper')
  , coreConstants = require('../../config/core_constants');

const publicEthereum = {
  getNonce: function(senderAddr) {
    return new Promise(function(onResolve, onReject){

    });
  },

  sendSignedTransaction: function(signedTx) {
    var token = jwtAuth.issueToken({signed_tx: signedTx})
      , postParams = {token: token};

    return httpWrapper.makePostApiCall(
      coreConstants.ST_OPS_PUBLIC_API_BASE_URL,
      80,
      '/whitelist',
      postParams
    )
  }

};

module.exports = publicEthereum;
