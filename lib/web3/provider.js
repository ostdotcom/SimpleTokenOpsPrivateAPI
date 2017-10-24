"use strict";
/*
 * Web3 provider
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

const coreConstants = require('../../config/core_constants');

var Web3 = require('web3');
var web3 = new Web3(coreConstants.ST_OPS_PRIVATE_GETH_PROVIDER);

module.exports = web3;
