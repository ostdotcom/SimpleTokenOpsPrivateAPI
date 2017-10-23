"use strict";
/*
 * Main application file
 *
 * * Author: Rachin
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */
var express = require('express');
var router = express.Router();
var constants = require('../lib/constants');

/* GET users listing. */
router.post('/whitelist', function(req, res, next) {
  console.log("PI = " + constants.PI);
	var address_to_white_list = req.body.address || req.parmas;
  if ( address_to_white_list && isAddressValid(address_to_white_list) ) {
    res.send('Address is valid. address_to_white_list = |' + address_to_white_list + '|');
  } else {
    console.dir(req.body);
    res.send('invalid address address_to_white_list = |" + address_to_white_list = |' + address_to_white_list + '|');
  }
  
});

var isAddressValid = function( addressToWhiteList ) {
  return true && addressToWhiteList;
};

module.exports = router;
