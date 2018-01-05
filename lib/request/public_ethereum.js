"use strict";
/*
 * Public Ethereum Wrapper
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

const jwtAuth = require('../jwt/jwt_auth')
  , httpWrapper = require('./http_wrapper')
  , coreConstants = require('../../config/core_constants');

const publicEthereum = {

  // Get current nonce from Ops Public
  getNonce: function(senderAddr) {
    const token = jwtAuth.issueToken({address: senderAddr}, 'publicOps')
      , params = {token: token};

    return httpWrapper.get(
      coreConstants.ST_OPS_PUBLIC_API_BASE_URL,
      '/address/get-nonce',
      params
    );
  },

  // Get transaction info
  getTransactionInfo: function(transactionHash) {
    const token = jwtAuth.issueToken({transaction_hash: transactionHash}, 'publicOps')
      , params = {token: token};

    return httpWrapper.get(
      coreConstants.ST_OPS_PUBLIC_API_BASE_URL,
      '/transaction/get-info',
      params
    );
  },

  // Get count of Bonuses that were inserted in bonuses contract for processing
  getAddressesSizeForBonuses: function() {

    const token = jwtAuth.issueToken({}, 'publicOps')
        , params = {token: token};

    return httpWrapper.get(
        coreConstants.ST_OPS_PUBLIC_API_BASE_URL,
        '/bonuses/addresses-size',
        params
    );

  },

  // Get list of addresses to which Bonuses are to be processed
  getAddressesForBonuses: function() {

    const token = jwtAuth.issueToken({}, 'publicOps')
        , params = {token: token};

    return httpWrapper.get(
        coreConstants.ST_OPS_PUBLIC_API_BASE_URL,
        '/bonuses/addresses',
        params
    );

  },

  // Get Start Index For Processing Bonus Transactions
  getStartIndexForProcessingBonuses: function() {

    const token = jwtAuth.issueToken({}, 'publicOps')
        , params = {token: token};

    return httpWrapper.get(
        coreConstants.ST_OPS_PUBLIC_API_BASE_URL,
        '/bonuses/start-index-for-processing',
        params
    );

  },

  // Get sum for remaining bonuses that are yet to be processed in Bonuses Contract
  getRemainingTotalBonuses: function() {

    const token = jwtAuth.issueToken({}, 'publicOps')
        , params = {token: token};

    return httpWrapper.get(
        coreConstants.ST_OPS_PUBLIC_API_BASE_URL,
        '/bonuses/remaining-total-bonuses',
        params
    );

  },

  // Get sum for remaining bonuses that are yet to be processed in Bonuses Contract
  getBonusesContractStatus: function() {

    const token = jwtAuth.issueToken({}, 'publicOps')
        , params = {token: token};

    return httpWrapper.get(
        coreConstants.ST_OPS_PUBLIC_API_BASE_URL,
        '/bonuses/get-contract-status',
        params
    );

  },

  getProcessableStatus: function(address) {

    const token = jwtAuth.issueToken({address: address}, 'publicOps')
        , params = {token: token};

    return httpWrapper.get(
        coreConstants.ST_OPS_PUBLIC_API_BASE_URL,
        '/bonuses/get-processable-status',
        params
    );

  },

  // Send signed transaction to Ops Public
  sendSignedTransaction: function(signedTx) {
    const token = jwtAuth.issueToken({signed_tx: signedTx}, 'publicOps')
      , params = {token: token};

    return httpWrapper.post(
      coreConstants.ST_OPS_PUBLIC_API_BASE_URL,
      '/transaction/send',
      params
    );
  }

};

module.exports = publicEthereum;
