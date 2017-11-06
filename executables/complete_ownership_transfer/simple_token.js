"use strict";
/*
 * Complete ownership transfer for simple token contract.
 *
 * * Author: Kedar, Alpesh
 * * Date: 04/11/2017
 * * Reviewed by: Sunil
 */

const helper = require('./helper');

var contractAddr = process.env.ST_SIMPLE_TOKEN_CONTRACT_ADDR;

helper.performFor('simpleToken', contractAddr);