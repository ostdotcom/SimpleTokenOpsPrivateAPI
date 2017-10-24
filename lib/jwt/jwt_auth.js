"use strict";
/*
 * JWT implementation
 *
 * * Author: Rachin
 * * Date: 24/10/2017
 * * Reviewed by: Sunil
 */
const coreConstants = require('../../config/core_constants')
  , jwt = require('jsonwebtoken');

const jwtAuth = {

  // Issue new token
  issueToken: function(data, keyType) {
    const payload = {"data" : data}
      , jwtOptions = {"expiresIn" : 60 * 5};
    return jwt.sign(payload, jwtAuth.getKeyFor(keyType), jwtOptions);
  },

  // Verify token
  verifyToken: function(token, keyType) {
    return new Promise(function(onResolve, onReject){
      var jwtCB = function(err, decodedToken) {
        if (err) {
          onReject(err);
        } else {
          onResolve(decodedToken);
        }
      };

      jwt.verify(token, jwtAuth.getKeyFor(keyType), {}, jwtCB);
    });
  },

  getKeyFor: function(keyType) {
    return (keyType=='publicOps' ? coreConstants.ST_OPS_PUBLIC_API_SECRET_KEY : coreConstants.ST_OPS_PRIVATE_API_SECRET_KEY);
  }
};

module.exports = jwtAuth;