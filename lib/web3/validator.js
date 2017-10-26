"use strict";
/*
 * Web3 Validator
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

const web3RpcProvider = require('./rpc_provider');

const web3Validator = {
  isAddress: function(addr) {
    return web3RpcProvider.utils.isAddress(addr);
  },

  isTokenSalePhase: function(phase) {
    return [0, 1, 2].indexOf(Number(phase)) > -1;
  }
};

module.exports = web3Validator;