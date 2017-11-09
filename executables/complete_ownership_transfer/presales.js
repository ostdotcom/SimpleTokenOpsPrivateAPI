"use strict";
/*
 * Complete ownership transfer for Grantable allocations contract
 *
 * * Author: Kedar, Alpesh
 * * Date: 04/11/2017
 * * Reviewed by: Sunil
 */


const helper = require('./helper')
  , coreAddresses = require('../../config/core_addresses')
  , contractName = 'presales';

var contractAddresses = coreAddresses.getAddressesForContract(contractName);

var loop = async function () {
  for(var i = 0; i < contractAddresses.length; i++) {
    await helper.performFor(contractName, contractAddresses[i]);
  }
}

loop();
