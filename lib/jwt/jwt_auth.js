"use strict";
/*
 * JWT implementation
 *
 * * Author: Rachin
 * * Date: 24/10/2017
 * * Reviewed by: Sunil
 */
const coreConstants = require('../../config/core_constants');
const jwt = require('jsonwebtoken');

const jwtAuth = {
  issueToken: function(data) {
    var payload = {
      "data" : data
    };

    /* JWT OPTIONS */
    var expiresInSeconds = 60 * 5;
    var jwtOptions = {
      "expiresIn" : expiresInSeconds
    };

    return jwt.sign(payload, coreConstants.ST_OPS_PUBLIC_API_SECRET_KEY, jwtOptions);
  },

  verifyToken: function(token) {
    return new Promise(function(onResolve, onReject){
      var jwtCB = function(err, decodedToken) {
        if (err) {
          onReject(err)
        } else {
          onResolve(decodedToken)
        }
      };

      jwt.verify(
        token,
        coreConstants.ST_OPS_PRIVATE_API_SECRET_KEY,
        {},
        jwtCB
      )
    });
  }
};

module.exports = jwtAuth;