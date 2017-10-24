"use strict";
/*
 * Web3 Validator
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

var web3Provider = require('./provider');

const web3Validator = {
  isAddress: function(addr) {
    web3Provider.utils.isAddress(addr)
  }
};

module.exports = web3Validator;