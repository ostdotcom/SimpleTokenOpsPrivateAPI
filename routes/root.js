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

    // 200 OK response needed for ELB Health checker
    console.log(req.headers['user-agent']);   // "ELB-HealthChecker/2.0"
    return responseHelper.successWithData({}).renderResponse(res);
  };

  performer();

});

module.exports = router;
