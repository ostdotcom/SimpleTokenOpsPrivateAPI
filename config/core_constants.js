"use strict";
/*
 * Constants file
 *
 * * Author: Rachin
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */
function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("PI", 3.14);

define("ST_PUBLIC_GETH_BASE_URL", process.env.ST_PUBLIC_GETH_BASE_URL);
define("ST_PRIVATE_GETH_PROVIDER", process.env.ST_PRIVATE_GETH_PROVIDER);