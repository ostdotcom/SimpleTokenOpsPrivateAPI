"use strict";
/*
 * Complete ownership transfer for token sale contract.
 *
 * * Author: Kedar, Alpesh
 * * Date: 04/11/2017
 * * Reviewed by: Sunil
 */

const helper = require('./helper')
  , coreAddresses = require('../../config/core_addresses')
  , contractName = 'tokenSale';

var contractAddr = coreAddresses.getAddressForContract(contractName);

helper.performFor(contractName, contractAddr);
