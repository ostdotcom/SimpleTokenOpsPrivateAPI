"use strict";
/*
 * Complete ownership transfer for futureTokenSaleLockBox contract.
 *
 * * Author: Kedar, Alpesh
 * * Date: 04/11/2017
 * * Reviewed by: Sunil
 */

const helper = require('./helper');

var contractAddr = process.env.ST_FUTURE_TOKEN_SALE_LOCK_BOX_CONTRACT_ADDR;

helper.performFor('futureTokenSaleLockBox', contractAddr);