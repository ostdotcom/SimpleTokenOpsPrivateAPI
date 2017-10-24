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
  , coreConstants = require('../../config/core_constants')
  , url = require('url');

const publicEthereum = {

  // Get current nonce from Ops Public
  getNonce: function(senderAddr) {
    const token = jwtAuth.issueToken({address: senderAddr}, 'publicOps')
      , params = {token: token}
      , ops_pub_url = url.parse(coreConstants.ST_OPS_PUBLIC_API_BASE_URL);

    return httpWrapper.makeApiCall(
      ops_pub_url.protocol,
      ops_pub_url.hostname,
      ops_pub_url.port,
      '/address/get-nonce',
      params,
      'GET'
    );
  },

  // Send signed transaction to Ops Public
  sendSignedTransaction: function(signedTx) {
    const token = jwtAuth.issueToken({signed_tx: signedTx}, 'publicOps')
      , params = {token: token}
      , ops_pub_url = url.parse(coreConstants.ST_OPS_PUBLIC_API_BASE_URL);

    return httpWrapper.makeApiCall(
      ops_pub_url.protocol,
      ops_pub_url.hostname,
      ops_pub_url.port,
      '/token-sale/whitelist',
      params,
      'POST'
    );
  }

};

module.exports = publicEthereum;
