"use strict";
/*
 * Address specific routes
 *
 * * Author: Aman
 * * Date: 07/02/2018
 * * Reviewed by: Keadr
 */

const express = require('express')
  , router = express.Router()
  , responseHelper = require('../lib/formatter/response');

/* Elb health checker request */
router.get('/', function (req, res, next) {
  const performer = function () {
    console.log(req.headers['user-agent']);
    return responseHelper.successWithData({}).renderResponse(res);
  };

  performer();

});

module.exports = router;
