"use strict";
/*
 * Complete ownership transfer for trustee contract.
 *
 * * Author: Kedar, Alpesh
 * * Date: 04/11/2017
 * * Reviewed by: Sunil
 */

const helper = require('./helper');

var contractAddr = process.env.ST_TRUSTEE_CONTRACT_ADDR;

helper.performFor('trustee', contractAddr);