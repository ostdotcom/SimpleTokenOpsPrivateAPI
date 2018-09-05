#!/usr/bin/env bash
export OPS_API_HTTPS_PORT=''
export OPS_API_HTTPS_KEY=''
export OPS_API_HTTPS_CERT=''

export ST_GETH_RPC_PROVIDER='http://127.0.0.1:8545'

export ST_OPS_PUBLIC_API_BASE_URL='http://127.0.0.1:3001'

export ST_OPS_PRIVATE_API_SECRET_KEY='1somethingsarebetterkeptinenvironemntvariables'
export ST_OPS_PUBLIC_API_SECRET_KEY='2somethingsarebetterkeptinenvironemntvariables'

export ST_WHITELIST_ACCOUNT_ADDRS='["0x7316bEf49C8149a2fab0d88Cab5835949f1d5681", "0xee0b91E2ee4438E9d1c90EF801974Bd1830cB4B0", "0xef6328Bde50FeB815204cF9BA551D829D7f45389", "0xf07647aefA52447969CA0f69879e18e3067d6Be2"]'
export ST_WHITELIST_ACCOUNT_PASSPHRASE='testtest'

export ST_POST_INIT_OWNER_ADDR='0x43a376fe822d2db2e3dc6ef48f4b8d40f36e66b5'
export ST_POST_INIT_OWNER_PASSPHRASE='testtest'

export ST_COIN_BASE_ADDR='0xc1dd83ac6de7a1cc1ee81cf9866b17d57f497484'
export ST_COIN_BASE_PASSPHRASE='12345678'

export ST_SIMPLE_TOKEN_CONTRACT_ADDR='0x579ba827D35D5695577e411C72313049a2cFF775'
export ST_BONUS_CONTRACT_OWNER_ADDRS='["0xf7f982ad97fcd65d4fc1d1ce497eab8dc221c2d0","0x75531d95f4747a53822060df7bfa1fe402361400"]'
export ST_BONUS_CONTRACT_OWNER_PASSPHRASE='testtest'

export ST_SIMPLE_TOKEN_CONTRACT_ADDR='0x31Ba69B3A68602bdF0FBF427c41a557B2748B434'
export ST_TOKEN_SALE_CONTRACT_ADDR='0xe288eB57d55E2EC433B61C04eE1f3FC9dc11B03F'
export ST_TRUSTEE_CONTRACT_ADDR='0xD4afdEB9Ea0a6934dC41b7f175b9a1d70cD1FF2A'
export ST_FUTURE_TOKEN_SALE_LOCK_BOX_CONTRACT_ADDR='0xf9C758F897A2Ed30CE3020fc8490aA5496428669'
export ST_BONUS_ALLOCATIONS_CONTRACT_ADDRS='["0x4063b853E77Abe4743FE55C744374F2f6B1E55C6","0x6812D2A21c0e9C5c0681Df045cf07c93471127C5"]'

export ST_GRANTABLE_ALLOCATIONS_CONTRACT_ADDRS='["0x347FAc979D58CC28C11AE17c1690f8159504db28","0x0c06e0d68211A3BcbaCb71287a741AE21F3Ae170"]'
export ST_PRESALES_CONTRACT_ADDRS='[]'
export ST_PROCESSABLE_ALLOCATIONS_CONTRACT_ADDRS='[]'
export ST_MULTI_SIG_WALLET_ADDRS='[]'

export ST_GENERIC_ERC20_CONTRACT_ADDRS='[]'
export ST_GENERIC_WHITELIST_CONTRACT_ADDRS='[]'

export ST_ALT_COIN_DIST_ADDR=''
export ST_ALT_COIN_DIST_PASSPHRASE=''

export OPRA_CACHE_ENGINE='memcached'
export OST_MEMCACHE_SERVERS='127.0.0.1:11211'
export NODE_ENV='development'

# 30 days
export OST_DEFAULT_TTL='2592000'