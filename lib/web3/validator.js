"use strict";
/*
 * Web3 Validator
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

const rootPrefix = '../..'
  , web3RpcProvider = require(rootPrefix + '/lib/web3/rpc_provider')
  , coreAddresses = require(rootPrefix + '/config/core_addresses');

const web3Validator = {
  isAddress: function (addr) {
    return web3RpcProvider.utils.isAddress(addr);
  },

  isTokenSalePhase: function (phase) {
    return [0, 1, 2].indexOf(Number(phase)) > -1;
  },

  isWhitelisterAddress: function (whitelistAddr) {
    return coreAddresses.getAddressesForUser('whitelister').indexOf(whitelistAddr) > -1;
  }

};

module.exports = web3Validator;