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
      address: process.env.ST_WHITELIST_ACCOUNT_ADDR,
      passphrase: process.env.ST_WHITELIST_ACCOUNT_PASSPHRASE
    },
    postInitOwner: {
      address: process.env.ST_POST_INIT_OWNER_ADDR,
      passphrase: process.env.ST_POST_INIT_OWNER_PASSPHRASE
    }
  },
  contracts: {
    simpleToken: {
      address: '',
      abi: core_abis.simpleToken
    },
    tokenSale: {
      address: process.env.ST_TOKEN_SALE_CONTRACT_ADDR,
      abi: core_abis.tokenSale
    },
    trustee: {
      address: '',
      abi: core_abis.trustee
    },
    futureTokenSaleLockBox: {
      address: '',
      abi: core_abis.futureTokenSaleLockBox
    },
    grantableAllocations: {
      address: '',
      abi: core_abis.grantableAllocations
    }
  }
};

const coreAddresses = {
  getAddressForUser: function(userName){
    return allAddresses.users[userName].address;
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

  getAbiForContract: function(contractName) {
    return allAddresses.contracts[contractName].abi;
  }
};

module.exports = coreAddresses;

