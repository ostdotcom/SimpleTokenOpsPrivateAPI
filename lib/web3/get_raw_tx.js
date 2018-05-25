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
  , oneGW = '0x3B9ACA00' // taken from http://ethgasstation.info/ ---- 1 gwei
  , fiveGW = '0x12A05F200' // 5 GWei
  , tenGw = '0x2540BE400' // 10 Gwei
  , twentyOneGw = '0x4E3B29200' // 21 Gwei
  , thirtyOneGw = '0x737BE7600' // 31 Gwei
  , fortyOneGw = '0x98BCA5A00' // 41 Gwei
  , fiftyOneGw = '0xBDFD63E00' // 51 Gwei
  , sixtyOneGw = '0xE33E22200' // 61 Gwei
  , defaultGasLimit = '0xEA60' //60000
  , highGasLimit = '0x1D4C0' //120000
  , maxGasLimit = '0x5B8D80' // 6M 6000000 use web3.eth.getBlock("latest") to check current limit and set accordingly
  , sixHundredKGasLimit = '0x927C0' // 0.6M 600000
  ;

var gasPrice = fortyOneGw;

const getRawTx = {

  // Generate raw whitelisting transaction
  forWhitelisting: function(whitelisterAddress, contractAddress, addressToWhiteList, phase) {
    const currContract = new web3RpcProvider.eth.Contract(coreAddresses.getAbiForContract('genericWhitelist'));
    const encodedABI = currContract.methods.updateWhitelist(addressToWhiteList, phase).encodeABI();

    return {
      to: contractAddress,
      from: whitelisterAddress,
      data: encodedABI,
      gasPrice: gasPrice,
      gasLimit: sixHundredKGasLimit
    };
  },

  // Transfer ETH
  //forEthTransfer: function(receiverAddress, value) {
  //  const senderAddress = coreAddresses.getAddressForUser('coinBase');
  //
  //  return {
  //    to: receiverAddress,
  //    from: senderAddress,
  //    value: web3RpcProvider.utils.toHex(web3RpcProvider.utils.toWei(value)),
  //    gasPrice: tenGw,
  //    gasLimit: defaultGasLimit
  //  };
  //},

  // Generate raw completeOwnerShipTransfer transaction
  completeOwnershipTransfer: function(contractName, contractAddr, senderName) {

    const senderAddress = coreAddresses.getAddressForUser(senderName)
      , currContract = new web3RpcProvider.eth.Contract(coreAddresses.getAbiForContract(contractName))
      , encodedABI = currContract.methods.completeOwnershipTransfer().encodeABI();

    var rawTx = {
      to: contractAddr,
      from: senderAddress,
      data: encodedABI,
      gasPrice: gasPrice,
      gasLimit: defaultGasLimit
    };

    return rawTx;

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
      gasLimit: highGasLimit
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
      gasLimit: highGasLimit
    };
  },

  // Call addPresale method of contract
  addPreSaleAllocation: function(contractName, contractAddr, senderName, receiver, baseAmount, bonusAmount){

    const senderAddress = coreAddresses.getAddressForUser(senderName)
      , currContract = new web3RpcProvider.eth.Contract(coreAddresses.getAbiForContract(contractName))
      , encodedABI = currContract.methods.addPresale(receiver, baseAmount, bonusAmount).encodeABI();

    return {
      to: contractAddr,
      from: senderAddress,
      data: encodedABI,
      gasPrice: gasPrice,
      gasLimit: highGasLimit
    };

  },

  // Call addPresale method of contract
  addProcessableAllocations: function(contractName, contractAddr, senderName, receiver, amount){

    const senderAddress = coreAddresses.getAddressForUser(senderName)
      , currContract = new web3RpcProvider.eth.Contract(coreAddresses.getAbiForContract(contractName))
      , encodedABI = currContract.methods.addProcessableAllocation(receiver, amount).encodeABI();

    return {
      to: contractAddr,
      from: senderAddress,
      data: encodedABI,
      gasPrice: gasPrice,
      gasLimit: highGasLimit
    };

  },

  addBonusAllocations: function(contractName, contractAddr, senderName, dataForTx){

    const senderAddress = coreAddresses.getAddressForUser(senderName)
        , currContract = new web3RpcProvider.eth.Contract(coreAddresses.getAbiForContract(contractName))
        , transactionObject = currContract.methods.add(dataForTx.addresses, dataForTx.amounts)
        , encodedABI = transactionObject.encodeABI()
    ;

    const tx = {
      to: contractAddr,
      from: senderAddress,
      data: encodedABI,
      gasPrice: gasPrice,
      gasLimit: maxGasLimit
    };

    return tx;

  },

  processBonusAllocations: function(contractName, contractAddr, senderName, fromIndex){

    const senderAddress = coreAddresses.getAddressForUser(senderName)
        , currContract = new web3RpcProvider.eth.Contract(coreAddresses.getAbiForContract(contractName))
        , transactionObject = currContract.methods.process(fromIndex)
        , encodedABI = transactionObject.encodeABI()
    ;

    const tx = {
      to: contractAddr,
      from: senderAddress,
      data: encodedABI,
      gasPrice: gasPrice,
      gasLimit: maxGasLimit
    };

    return tx;

  },

  dist_alt_coin: function(distributorName, contractAddr, receiver, amount) {
    const contractName = 'genericERC20Contract';

    const distributorAddress = coreAddresses.getAddressForUser(distributorName)
        , currContract = new web3RpcProvider.eth.Contract(coreAddresses.getAbiForContract(contractName))
        , encodedABI = currContract.methods.transfer(receiver, amount).encodeABI();

    return {
      to: contractAddr,
      from: distributorAddress,
      data: encodedABI,
      gasPrice: gasPrice,
      gasLimit: highGasLimit
    };
  }

};

module.exports = getRawTx;