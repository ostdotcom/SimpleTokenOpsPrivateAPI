"use strict";
/*
 * Complete ownership transfer for Bonuses contract
 *
 * * Author: Puneet
 * * Date: 04/01/2018
 * * Reviewed by:
 */


const helper = require('./helper')
  , coreAddresses = require('../../config/core_addresses')
  , contractName = 'bonuses'
  , bonusContractUserNamePrefix = coreAddresses.bonusContractUserNamePrefix;

var contractAddresses = coreAddresses.getAddressesForContract(contractName);

var loop = async function () {
  for(var i = 0; i < contractAddresses.length; i++) {
    var senderName = bonusContractUserNamePrefix + (i+1);
    await helper.performFor(contractName, contractAddresses[i], senderName);
  }
}

loop();
