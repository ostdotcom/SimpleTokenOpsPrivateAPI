"use strict";
/*
 * Standard Response Formatter
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */
function Result(data, err_code, err_msg) {
  this.success = (err_code == null);
  this.data = data || {};
  if (!this.success){
    this.err = {
      code: err_code,
      msg: err_msg
    };
  }

  this.isSuccess = function() {
    return this.success;
  };

  this.serialize = function() {
    var s = {};
    if (this.success) {
      s.success = true;
      s.data = this.data;
    } else {
      s.success = false;
      s.err = this.err;
    }

    return JSON.stringify(s);
  }
}

const responseHelper = {
  successWithData: function(data) {
    return new Result(data);
  },

  error: function(err_code, err_msg) {
    return new Result({}, err_code, err_msg);
  }
};

module.exports = responseHelper;