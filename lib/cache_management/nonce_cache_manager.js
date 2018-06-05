"use strict";

const rootPrefix = '../..'
  , baseCache = require(rootPrefix + '/lib/cache_management/base')
  , responseHelper = require(rootPrefix + '/lib/formatter/response')
  , publicEthereum = require(rootPrefix + "/lib/request/public_ethereum")
;

/**
 * @constructor
 * @augments baseCache
 *
 * @param {Object} params - cache key generation & expiry related params
 *
 */
const NonceCacheManagerKlass = function(params) {
  const oThis = this
  ;

  oThis.addressId = params['address_id'];
  baseCache.call(this, params);
  oThis.useObject = false;
};

NonceCacheManagerKlass.prototype = Object.create(baseCache.prototype);

const NonceCacheManagerKlassPrototype = {

  /**
   * set cache key
   *
   * @return {String}
   */
  setCacheKey: function() {

    const oThis = this;

    oThis.cacheKey = oThis._cacheKeyPrefix() + "cm_ncm_" + oThis.addressId ;

    return oThis.cacheKey;

  },

  /**
   * set cache expiry in oThis.cacheExpiry and return it
   *
   * @return {Number}
   */
  setCacheExpiry: function() {

    const oThis = this;

    oThis.cacheExpiry = 3600; // 60 minutes

    return oThis.cacheExpiry;

  },
  /**
   * fetch data from source
   *
   * @return {Result}
   */
  fetchDataFromSource: async function() {

    const oThis = this
      , publicOpsResp = await publicEthereum.getNonce(oThis.addressId)
      ;

    var count = "-1";

    console.log('Public ops response for address: ' + oThis.addressId + ": " + JSON.stringify(publicOpsResp));

    if (publicOpsResp.success) {
      var publicOpsRespData = publicOpsResp.data || {};
      count = publicOpsRespData.nonce.toString();
    }

    console.log('Public ops response for address: ' + oThis.addressId + ": " + count);

    //NOTE: storing str in it as of now. As facing problems with setting int 0 as cache value
    return Promise.resolve(responseHelper.successWithData(count));

  },

  // get nonce from global constant or Ops public API
  getNonce: async function(currentNonce) {
    const oThis = this;

    if (currentNonce !== undefined){
      return Promise.resolve(currentNonce);
    }

    const currentGlobalNonce = await oThis.fetch();
    if (currentGlobalNonce.isFailure() || currentGlobalNonce.data < 0){
      return Promise.reject("Nonce error");
    }

    oThis.increment();
    return Promise.resolve(currentGlobalNonce.data);
  },

  clearLocalNonce: function() {
    const oThis = this;
    console.log('clearing nonce for address: ' + oThis.addressId);
    oThis.clear();
  }

};

Object.assign(NonceCacheManagerKlass.prototype, NonceCacheManagerKlassPrototype);

module.exports = NonceCacheManagerKlass;