"use strict";
/*
 * Complete ownership transfer for Grantable allocations contract
 *
 * * Author: Kedar, Alpesh
 * * Date: 04/11/2017
 * * Reviewed by: Sunil
 */


const helper = require('./helper');

var contractAddresses = JSON.parse(process.env.ST_GRANTABLE_ALLOCATIONS_CONTRACT_ADDRS);

for(var i = 0; i < contractAddresses.length; i++) {
  helper.performFor('grantableAllocations', contractAddresses[i]);
}