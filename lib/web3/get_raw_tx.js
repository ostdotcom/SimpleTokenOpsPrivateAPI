"use strict";
/*
 * Generate Raw Tx without nonce
 *
 * * Author: Kedar
 * * Date: 24/10/2017
 * * Reviewed by: Sunil
 */

const web3RpcProvider = require('./rpc_provider')
  , coreAddresses = require('../../config/core_addresses')
  , gasPrice = '0x3B9ACA00' // taken from http://ethgasstation.info/ ---- 1 gwei
  , gasLimit = '0xEA60';

const getRawTx = {

  // Generate raw whitelisting transaction
  forWhitelisting: function(addressToWhiteList, phase) {
    const currContract = new web3RpcProvider.eth.Contract(coreAddresses.getAbiForContract('tokenSale'));
    const encodedABI = currContract.methods.updateWhitelist(addressToWhiteList, phase).encodeABI();

    return {
      to: coreAddresses.getAddressForContract('tokenSale'),
      from: coreAddresses.getAddressForUser('whitelister'),
      data: encodedABI,
      gasPrice: gasPrice,
      gasLimit: gasLimit
    };
  },

  // Transfer ETH
  forEthTransfer: function(senderName, receiverName, value) {
    //const senderAddress = coreAddresses.getAddressForUser(senderName)
    //  , receiverAddress = coreAddresses.getAddressForUser(receiverName);
    //return {
    //  to: receiverAddress,
    //  from: senderAddress,
    //  value: web3RpcProvider.utils.toHex(web3RpcProvider.utils.toWei(value)),
    //  gasPrice: gasPrice,
    //  gasLimit: gasLimit
    //};
  },

  // Generate raw whitelisting transaction
  completeOwnershipTransfer: function(contractName, contractAddr, senderName) {
    const senderAddress = coreAddresses.getAddressForUser(senderName)
      , currContract = new web3RpcProvider.eth.Contract(coreAddresses.getAbiForContract(contractName))
      , encodedABI = currContract.methods.completeOwnershipTransfer().encodeABI();

    return {
      to: contractAddr,
      from: senderAddress,
      data: encodedABI,
      gasPrice: gasPrice,
      gasLimit: gasLimit
    };
  },

  // Call addGrantableAllocation method of GrantAllocation contracts
  addGrantableAllocation: function(contractName, contractAddr, senderName, receiver, amount, isRevokable) {
    const senderAddress = coreAddresses.getAddressForUser(senderName)
      , currContract = new web3RpcProvider.eth.Contract(coreAddresses.getAbiForContract(contractName))
      , encodedABI = currContract.methods.addGrantableAllocation(receiver, amount, isRevokable).encodeABI();

    return {
      to: contractAddr,
      from: senderAddress,
      data: encodedABI,
      gasPrice: gasPrice,
      gasLimit: '0x1D4C0' //120000
    };
  },

  // Call lock method of contract
  forLockContract: function(contractName, contractAddr, senderName) {
    const senderAddress = coreAddresses.getAddressForUser(senderName)
      , currContract = new web3RpcProvider.eth.Contract(coreAddresses.getAbiForContract(contractName))
      , encodedABI = currContract.methods.lock().encodeABI();

    return {
      to: contractAddr,
      from: senderAddress,
      data: encodedABI,
      gasPrice: gasPrice,
      gasLimit: '0x1D4C0' //120000
    };
  }

};

module.exports = getRawTx;