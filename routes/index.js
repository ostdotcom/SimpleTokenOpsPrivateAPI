"use strict";
/*
 * Generic routes
 *
 * * Author: Kedar
 * * Date: 24/10/2017
 * * Reviewed by: Sunil
 */

const express = require('express')
  , router = express.Router()
  , jwtAuth = require('../lib/jwt/jwt_auth')
  , responseHelper = require('../lib/formatter/response')
  , web3Validator = require('../lib/web3/validator');


/* validate checksum for a address */
router.get('/address/check', function (req, res, next) {
  const encodedParams = req.query.token;

  // send error, if token is invalid
  const jwtOnReject = function (err) {
    console.error('### Error while decoding JWT token. Invalid token or expired.');
    console.error(err);
    return responseHelper.error('i_1', 'Invalid token or expired').renderResponse(res);
  };

  // Send request to ethereum
  var jwtOnResolve = function (reqParams) {
    const address = reqParams.data.address;

    if (web3Validator.isAddress(address)) {
      responseHelper.successWithData({}).renderResponse(res);
    } else {
      responseHelper.error('i_2', 'Invalid address').renderResponse(res)
    }
  };

  // Verify token
  Promise.resolve(
    jwtAuth.verifyToken(encodedParams, 'privateOps')
      .then(
        jwtOnResolve,
        jwtOnReject
      )
  ).catch(function (err) {
    console.error('### Error in /address/check. Inside Catch block.');
    console.error(err);
    responseHelper.error('i_3', 'Something went wrong').renderResponse(res)
  });

});

module.exports = router;
