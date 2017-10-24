"use strict";
/*
 * Web3 Validator
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

const web3Provider = require('./provider');

const web3Validator = {
  isAddress: function(addr) {
    return web3Provider.utils.isAddress(addr);
  },

  isTokenSalePhase: function(phase) {
    return [0, 1, 2].indexOf(Number(phase)) > -1;
  }
};

module.exports = web3Validator;