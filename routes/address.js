"use strict";
/*
 * Address specific routes
 *
 * * Author: Kedar
 * * Date: 24/10/2017
 * * Reviewed by: Sunil
 */

const express = require('express')
  , router = express.Router()
  , responseHelper = require('../lib/formatter/response')
  , web3Validator = require('../lib/web3/validator')
  , web3RpcProvider = require('../lib/web3/rpc_provider');


/* validate checksum for a address */
router.get('/check', function (req, res, next) {
  const performer = function() {
    const decodedParams = req.decodedParams
      , address = decodedParams.address;

    if (web3Validator.isAddress(address)) {
      try {
        // Just try to generate the checksum once. to be sure.
        var checksumAddr = web3RpcProvider.utils.toChecksumAddress(address);
        return responseHelper.successWithData({}).renderResponse(res);
      } catch(err) {
        return responseHelper.error('r_a_1', 'Invalid address').renderResponse(res);
      }

    } else {
      return responseHelper.error('r_a_2', 'Invalid address').renderResponse(res);
    }
  };

  Promise.resolve(performer()).catch(function (err) {
    console.error(err);
    responseHelper.error('r_a_3', 'Something went wrong').renderResponse(res)
  });

});

module.exports = router;
