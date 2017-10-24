"use strict";
/*
 * Http wrapper
 *
 * * Author: Kedar
 * * Date: 24/10/2017
 * * Reviewed by: Sunil
 */

const querystring = require('querystring')
  , https = require('https')
  , http = require('http');


const httpWrapper = {

  // make API call
  makeApiCall: function (protocol, host, port, path, params, method) {
    return new Promise(function(onResolve, onReject){
      // Build the post string from params object
      const params_data = querystring.stringify(params)
        , httpProvider = (protocol == 'https:') ?  https : http
        , sanitizedPort = (port || (protocol=='https:' ?  443 : 80)).toString();

      // An object of options to indicate where to post to
      const req_options = {
        host: host,
        port: sanitizedPort,
        path: path,
        method: method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      // Set up the request
      const post_req = httpProvider.request(req_options, function (res) {
        var bodyStr = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
          bodyStr += chunk;
        });

        res.on('end', function () {
          onResolve(bodyStr);
        });
      });

      post_req.on('error', function(err) {
        onReject(err);
      });

      // make remote request
      post_req.write(params_data);
      post_req.end();
    })
  }
};

module.exports = httpWrapper;
