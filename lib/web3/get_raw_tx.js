"use strict";
/*
 * Generate Raw Tx without nonce
 *
 * * Author: Kedar
 * * Date: 24/10/2017
 * * Reviewed by: Sunil
 */

const rootPrefix = '../..'
  , web3RpcProvider = require(rootPrefix + '/lib/web3/rpc_provider')
  , coreAddresses = require(rootPrefix + '/config/core_addresses')
  , coreConstants = require(rootPrefix + '/config/core_constants')
  , oneGw = '0x3B9ACA00' // taken from http://ethgasstation.info/ ---- 1 gwei
  , twoGw = '0x77359400' // 2 GWei
  , threeGw = '0xB2D05E00' // 3 GWei
  , fourGw = '0xEE6B2800' // 4 GWei
  , fiveGw = '0x12A05F200' // 5 GWei
  , sixGw = '0x165A0BC00' // 6 GWei
  , sevenGw = '0x1A13B8600' // 7 GWei
  , eightGw = '0x1DCD65000' // 8 GWei
  , nineGw = '0x218711A00' // 9 GWei
  , tenGw = '0x2540BE400' // 10 Gwei
  , elevenGw = '0x28FA6AE00' // 11 Gwei
  , twentyOneGw = '0x4E3B29200' // 21 Gwei
  , thirtyOneGw = '0x737BE7600' // 31 Gwei
  , fortyOneGw = '0x98BCA5A00' // 41 Gwei
  , fiftyOneGw = '0xBDFD63E00' // 51 Gwei
  , sixtyOneGw = '0xE33E22200' // 61 Gwei
  , defaultGasLimit = '0xEA60' //60000
  , highGasLimit = '0x1D4C0' //120000
  , maxGasLimit = '0x5B8D80' // 6M 6000000 use web3.eth.getBlock("latest") to check current limit and set accordingly
  , sixHundredKGasLimit = '0x927C0' // 0.6M 600000
  , twoHundredKGasLimit = '0x30D40' // 0.2M 200000
;

//used only for production
var gasPrice = fiveGw;

if (coreConstants.NODE_ENV != 'production') {
  gasPrice = fortyOneGw;
}


const getRawTx = {

  // Generate raw whitelisting transaction
  forWhitelisting: function (whitelisterAddress, contractAddress, addressToWhiteList, phase, nonce, currentGasPrice) {
    const currContract = new web3RpcProvider.eth.Contract(coreAddresses.getAbiForContract('genericWhitelist'));
    const encodedABI = currContract.methods.updateWhitelist(addressToWhiteList, phase).encodeABI();
    return {
      to: contractAddress,
      from: whitelisterAddress,
      data: encodedABI,
      gasPrice: currentGasPrice || gasPrice,
      gasLimit: twoHundredKGasLimit,
      nonce: nonce
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
  completeOwnershipTransfer: function (contractName, contractAddr, senderName) {

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
  addGrantableAllocation: function (contractName, contractAddr, senderName, receiver, amount, isRevokable) {
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
  forLockContract: function (contractName, contractAddr, senderName) {
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
  addPreSaleAllocation: function (contractName, contractAddr, senderName, receiver, baseAmount, bonusAmount) {

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
  addProcessableAllocations: function (contractName, contractAddr, senderName, receiver, amount) {

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

  addBonusAllocations: function (contractName, contractAddr, senderName, dataForTx) {

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

  processBonusAllocations: function (contractName, contractAddr, senderName, fromIndex) {

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

  dist_alt_coin: function (distributorName, contractAddr, receiver, amount) {
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
