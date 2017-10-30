"use strict";
/*
 * Generate Raw Tx without nonce
 *
 * * Author: Kedar
 * * Date: 24/10/2017
 * * Reviewed by: Sunil
 */

const web3RpcProvider = require('./rpc_provider')
  , coreAddresses = require('../../config/core_addresses');

// Include required abi files
const tokenSaleContractAbi = require('../../abi/TokenSale');

// Include required contract addresses
const whitelistContractAddress = coreAddresses.getAddressForContract('whitelister');

const getRawTx = {

  // Generate raw whitelisting transaction
  forWhitelisting: function(addressToWhiteList, phase) {
    const myContract = new web3RpcProvider.eth.Contract(tokenSaleContractAbi);
    const encodedABI = myContract.methods.updateWhitelist(addressToWhiteList, phase).encodeABI();

    return {
      to: whitelistContractAddress,
      from: coreAddresses.getAddressForUser('whitelister'),
      data: encodedABI,
      gasPrice: '0x3B9ACA00', // taken from http://ethgasstation.info/ ---- 1 gwei
      gasLimit: '0xEA60'
    };
  },

  forEthTransfer: function(senderName, receiverName, value) {
    const senderAddress = coreAddresses.getAddressForUser(senderName)
      , receiverAddress = coreAddresses.getAddressForUser(receiverName);
    return {
      to: receiverAddress,
      from: senderAddress,
      value: web3RpcProvider.utils.toWei(value),
      gasPrice: '0x3B9ACA00', // taken from http://ethgasstation.info/ ---- 1 gwei
      gasLimit: '0xEA60'
    };
  }

};

module.exports = getRawTx;