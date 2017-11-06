"use strict";
/*
 * Complete ownership transfer for token sale contract.
 *
 * * Author: Kedar, Alpesh
 * * Date: 04/11/2017
 * * Reviewed by: Sunil
 */

const helper = require('./helper');

var contractAddr = process.env.ST_TOKEN_SALE_CONTRACT_ADDR;

helper.performFor('tokenSale', contractAddr);
