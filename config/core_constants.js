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
define("HTTPS_PORT", process.env.HTTPS_PORT);
define("HTTPS_KEY", process.env.HTTPS_KEY);
define("HTTPS_CERT", process.env.HTTPS_CERT);

define("PI", 3.14);

define("ST_PUBLIC_GETH_BASE_URL", process.env.ST_PUBLIC_GETH_BASE_URL);
define("ST_PRIVATE_GETH_PROVIDER", process.env.ST_PRIVATE_GETH_PROVIDER);