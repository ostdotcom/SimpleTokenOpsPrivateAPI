"use strict";
/*
 * Complete ownership transfer for processable allocations contract
 *
 * * Author: Kedar, Alpesh
 * * Date: 11/11/2017
 * * Reviewed by:
 */


const helper = require('./helper')
  , coreAddresses = require('../../config/core_addresses')
  , contractName = 'processableAllocations';

var contractAddresses = coreAddresses.getAddressesForContract(contractName);

var loop = async function () {
  for(var i = 0; i < contractAddresses.length; i++) {
    await helper.performFor(contractName, contractAddresses[i]);
  }
}

loop();
