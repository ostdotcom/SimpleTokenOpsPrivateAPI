"use strict";
/*
 * Addresses
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

const core_abis = require('./core_abis');

const allAddresses = {

  users: {
    whitelister: {
      address: [],
      passphrase: process.env.ST_WHITELIST_ACCOUNT_PASSPHRASE
    },
    postInitOwner: {
      address: process.env.ST_POST_INIT_OWNER_ADDR,
      passphrase: process.env.ST_POST_INIT_OWNER_PASSPHRASE
    },
    altCoinDist: {
      address: process.env.ST_ALT_COIN_DIST_ADDR,
      passphrase: process.env.ST_ALT_COIN_DIST_PASSPHRASE
    },
    coinBase: {
      address: process.env.ST_COIN_BASE_ADDR,
      passphrase: process.env.ST_COIN_BASE_PASSPHRASE
    }
  },

  contracts: {
    simpleToken: {
      address: process.env.ST_SIMPLE_TOKEN_CONTRACT_ADDR,
      abi: core_abis.simpleToken
    },
    tokenSale: {
      address: process.env.ST_TOKEN_SALE_CONTRACT_ADDR,
      abi: core_abis.tokenSale
    },
    genericWhitelist: {
      address: JSON.parse(process.env.ST_GENERIC_WHITELIST_CONTRACT_ADDRS),
      abi: core_abis.genericWhitelist
    },
    trustee: {
      address: process.env.ST_TRUSTEE_CONTRACT_ADDR,
      abi: core_abis.trustee
    },
    futureTokenSaleLockBox: {
      address: process.env.ST_FUTURE_TOKEN_SALE_LOCK_BOX_CONTRACT_ADDR,
      abi: core_abis.futureTokenSaleLockBox
    },
    grantableAllocations: {
      address: JSON.parse(process.env.ST_GRANTABLE_ALLOCATIONS_CONTRACT_ADDRS),
      abi: core_abis.grantableAllocations
    },
    presales: {
      address: JSON.parse(process.env.ST_PRESALES_CONTRACT_ADDRS),
      abi: core_abis.presales
    },
    processableAllocations: {
      address: JSON.parse(process.env.ST_PROCESSABLE_ALLOCATIONS_CONTRACT_ADDRS),
      abi: core_abis.processableAllocations
    },
    multiSigWallet: {
      address: JSON.parse(process.env.ST_MULTI_SIG_WALLET_ADDRS),
      abi: core_abis.multiSigWallet
    },
    genericERC20Contract: {
      address: JSON.parse(process.env.ST_GENERIC_ERC20_CONTRACT_ADDRS),
      abi: core_abis.genericERC20Contract
    },
    bonuses: {
      address: JSON.parse(process.env.ST_BONUS_ALLOCATIONS_CONTRACT_ADDRS),
      abi: core_abis.bonuses
    }
  }

};

const bonusContractUserNamePrefix = 'bonusContractUser'
    , bonusContractOwners = JSON.parse(process.env.ST_BONUS_CONTRACT_OWNER_ADDRS);

for(var i = 1; i <= bonusContractOwners.length; i++ ) {
  allAddresses.users[bonusContractUserNamePrefix+i] = {
    address: bonusContractOwners[i-1],
    passphrase: process.env.ST_BONUS_CONTRACT_OWNER_PASSPHRASE
  }
}

const addrToContractNameMap = {};

for(var contractName in allAddresses.contracts) {
  var addr = allAddresses.contracts[contractName].address;

  if ( Array.isArray(addr) ) {
    for(var i = 0; i < addr.length; i ++) {
      addrToContractNameMap[addr[i].toLowerCase()] = contractName;
    }
  } else {
    addrToContractNameMap[addr.toLowerCase()] = contractName;
  }
}

const coreAddresses = {

  bonusContractUserNamePrefix: bonusContractUserNamePrefix,

  getAddressForUser: function(userName){
    var userAddress =  allAddresses.users[userName].address;
    if(!userAddress || userAddress=='' || Array.isArray(userAddress)){
      throw "Please pass valid userName to get user address"
    }
    return userAddress;
  },

  // This must return array of addresses.
  getAddressesForUser: function(userName){
    var userAddresses = allAddresses.users[userName].address;
    if(!userAddresses || !Array.isArray(userAddresses) || userAddresses.length==0 ){
      throw "Please pass valid userName to get user address"
    }
    return userAddresses;
  },

  getPassphraseForUser: function(userName){
    return allAddresses.users[userName].passphrase;
  },

  getAddressForContract: function(contractName){
    var contractAddress = allAddresses.contracts[contractName].address;
    if(!contractAddress || contractAddress=='' || Array.isArray(contractAddress)){
      throw "Please pass valid contractName to get contract address"
    }
    return contractAddress;
  },

  // This must return array of addresses.
  getAddressesForContract: function(contractName){
    var contractAddresses = allAddresses.contracts[contractName].address;
    if(!contractAddresses || !Array.isArray(contractAddresses) || contractAddresses.length==0 ){
      throw "Please pass valid contractName to get contract address"
    }
    return contractAddresses;
  },

  getContractNameFor: function(contractAddr) {
    return addrToContractNameMap[(contractAddr || '').toLowerCase()];
  },

  getAbiForContract: function(contractName) {
    return allAddresses.contracts[contractName].abi;
  }

};

module.exports = coreAddresses;

