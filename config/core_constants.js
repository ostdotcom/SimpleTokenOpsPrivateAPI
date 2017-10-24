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
define("HTTPS_PORT", process.env.ST_OPS_PRIVATE_API_HTTPS_PORT);
define("HTTPS_KEY", process.env.ST_OPS_PRIVATE_API_HTTPS_KEY);
define("HTTPS_CERT", process.env.ST_OPS_PRIVATE_API_HTTPS_CERT);

define("PI", 3.14);

define("ST_OPS_PUBLIC_API_BASE_URL", process.env.ST_OPS_PUBLIC_API_BASE_URL);
define("ST_OPS_PRIVATE_GETH_PROVIDER", process.env.ST_OPS_PRIVATE_GETH_PROVIDER);
define("ST_OPS_PUBLIC_API_SECRET_KEY", process.env.ST_OPS_PUBLIC_API_SECRET_KEY);
define("ST_OPS_PRIVATE_API_SECRET_KEY", process.env.ST_OPS_PRIVATE_API_SECRET_KEY);
