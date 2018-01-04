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
  , contractName = 'bonuses';

var contractAddress = coreAddresses.getAddressForContract(contractName);

var main = async function () {
  await helper.performFor(contractName, contractAddress) ;
}

main();
