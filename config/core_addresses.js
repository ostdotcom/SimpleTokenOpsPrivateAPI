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
    }
  },
  contracts: {
    whitelister: {
      address: process.env.ST_WHITELIST_CONTRACT_ADDR
    }
  }
};

const coreAddreses = {
  getAddressForUser: function(userName){
    return allAddresses.users[userName].address;
  },

  getPassphraseForUser: function(userName){
    return allAddresses.users[userName].passphrase;
  },

  getAddressForContract: function(contractName){
    return allAddresses.contracts[contractName].address;
  }
};

module.exports = coreAddreses;

