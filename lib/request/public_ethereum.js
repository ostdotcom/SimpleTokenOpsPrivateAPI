"use strict";
/*
 * Public Ethereum Wrapper
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

const jwtAuth = require('../jwt/jwt_auth')
  , httpWrapper = require('./http_wrapper')
  , coreConstants = require('../../config/core_constants');

const publicEthereum = {

  // Get current nonce from Ops Public
  getNonce: function(senderAddr) {
    const token = jwtAuth.issueToken({address: senderAddr}, 'publicOps')
      , params = {token: token};

    return httpWrapper.get(
      coreConstants.ST_OPS_PUBLIC_API_BASE_URL,
      '/address/get-nonce',
      params
    );
  },

  // Send signed transaction to Ops Public
  sendSignedTransaction: function(signedTx) {
    const token = jwtAuth.issueToken({signed_tx: signedTx}, 'publicOps')
      , params = {token: token};

    return httpWrapper.post(
      coreConstants.ST_OPS_PUBLIC_API_BASE_URL,
      '/transaction/send',
      params
    );
  }

};

module.exports = publicEthereum;
