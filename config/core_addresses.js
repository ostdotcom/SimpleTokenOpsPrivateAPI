"use strict";
/*
 * Addresses
 *
 * * Author: Kedar
 * * Date: 23/10/2017
 * * Reviewed by: Sunil
 */

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
      abi: require('../abi/simpleToken')
    },
    tokenSale: {
      address: process.env.ST_TOKEN_SALE_CONTRACT_ADDR,
      abi: require('../abi/tokenSale')
    },
    trustee: {
      address: '',
      abi: require('../abi/trustee')
    },
    futureTokenSaleLockBox: {
      address: '',
      abi: require('../abi/futureTokenSaleLockBox')
    },
    grantableAllocations: {
      address: '',
      abi: require('../abi/grantableAllocations')
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
    return allAddresses.contracts[contractName].address;
  },

  getAbiForContract: function(contractName) {
    return allAddresses.contracts[contractName].abi;
  }
};

module.exports = coreAddresses;

