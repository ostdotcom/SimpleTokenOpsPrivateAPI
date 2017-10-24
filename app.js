"use strict";
/*
 * Main application file
 *
 * * Author: Rachin
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */
const express = require('express')
  , path = require('path')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , helmet = require('helmet')
  , sanitizer = require('express-sanitized')
  , app = express()
  , responseHelper = require('./lib/formatter/response')
  // Address whitelisting route file
  , tokenSale = require('./routes/token_sale');

// uncomment after placing your favicon in /public
app.use(logger('combined'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* 
  Request Sanitizer
  The below peice of code should always be before routes.
  Docs: https://www.npmjs.com/package/express-sanitized
*/
app.use(sanitizer());

app.use('/token-sale', tokenSale);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  return responseHelper.error('404', 'Not Found').renderResponse(res, 404);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.error(err);
  return responseHelper.error('500', 'Something went wrong').renderResponse(res, 500);
});

module.exports = app;
