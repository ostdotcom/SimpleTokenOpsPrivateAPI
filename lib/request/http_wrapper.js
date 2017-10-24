"use strict";
/*
 * Http wrapper
 *
 * * Author: Kedar
 * * Date: 24/10/2017
 * * Reviewed by: Sunil
 */

var querystring = require('querystring')
  , http = require('http');


const httpWrapper = {
  makePostApiCall: function (host, port, path, params) {
    return new Promise(function(onResolve, onReject){
      // Build the post string from params object
      var post_data = querystring.stringify(params);

      // An object of options to indicate where to post to
      var post_options = {
        host: host,
        port: port.toString(),
        path: path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      // Set up the request
      var post_req = http.request(post_options, function (res) {
        var bodyStr = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
          bodyStr += chunk;
        });

        res.on('end', function () {
          onResolve(bodyStr);
        });
      });

      // post the data
      post_req.write(post_data);
      post_req.end();
    })
  }
};

module.exports = httpWrapper;
