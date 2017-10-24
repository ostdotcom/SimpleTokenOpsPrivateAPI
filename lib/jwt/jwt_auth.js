const coreConstants = require('../../config/core_constants');
const jwt = require('jsonwebtoken');

const jwtAuth = {
  issueToken: function(data) {
    var payload = {
      "data" : data
    };

    /* JWT OPTIONS */
    var expiresInSeconds = 60 * 10;
    var jwtOptions = {
      "expiresIn" : expiresInSeconds
    };

    return jwt.sign(payload, coreConstants.ST_JWT_PRIVATE_KEY, jwtOptions);
  },

  verifyToken: function(token, verifiedCallback) {
    return jwt.verify(token, coreConstants.ST_JWT_PRIVATE_KEY, {}, verifiedCallback);
  }
};

module.exports = jwtAuth;