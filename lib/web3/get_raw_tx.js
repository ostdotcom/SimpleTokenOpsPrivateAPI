"use strict";
/*
 * Generate Raw Tx without nonce
 *
 * * Author: Kedar
 * * Date: 24/10/2017
 * * Reviewed by: Sunil
 */

var web3Provider = require('./provider')
  , coreAddresses = require('../../config/core_addresses');

const getRawTx = {

  forWhitelisting: function(addressToWhiteList, phase) {
    var tokenSaleContractAbi = require('../../abi/TokenSale')
      , myContract = new web3Provider.eth.Contract(tokenSaleContractAbi)
      , whitelistContractAddress = coreAddresses.getAddressForContract('whitelister');

    var encodedABI = myContract.methods.updateWhitelist(addressToWhiteList, phase).encodeABI();
    var raxTx = {
      to: whitelistContractAddress,
      data: encodedABI,
      gasPrice: '0x3B9ACA00', // taken from http://ethgasstation.info/ ---- 1 gwei
      gasLimit: '0xAAAAAAAAA'
    };

    return raxTx;
  }

};

module.exports = getRawTx;