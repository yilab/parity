// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

import { accounts, Account } from './accounts';

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

function defaultAccount () {
  if (accounts.length === 0) {
    return NULL_ADDRESS;
  }

  return accounts[0].address;
}

export default {
  'eth_accounts' () {
    return accounts.map((account) => account.address);
  },

  'eth_coinbase' () {
    return defaultAccount();
  },

  'parity_accountsInfo' () {
    let result = {};

    for (const { address, name } of accounts) {
      result[address] = { name };
    }

    return result;
  },

  'parity_allAccountsInfo' () {
      let result = {};

    for (const { address, name, meta, uuid } of accounts) {
      result[address] = { name, meta, uuid };
    }

    return result;
  },

  'parity_defaultAccount' () {
    return defaultAccount();
  },

  'parity_getNewDappsAddresses' () {
    return [];
  },

  'parity_hardwareAccountsInfo' () {
    return {};
  },

  'parity_newAccountFromPhrase' ([phrase, password]) {
    const account = Account.fromPhrase(phrase, password);

    accounts.push(account);

    return account.address;
  },

  'parity_setAccountMeta' ([address, meta]) {
    const account = accounts.find((account) => address === account.address);

    if (account == null) {
      throw new Error(`Account not found: ${address}`);
    }

    account.meta = meta;

    return true;
  },

  'parity_setAccountName' ([address, name]) {
    const account = accounts.find((account) => address === account.address);

    if (account == null) {
      throw new Error(`Account not found: ${address}`);
    }

    account.name = name;

    return true;
  },

  'parity_useLocalAccounts' () {
    return true;
  },

  'parity_listGethAccounts' () {
    return [];
  },

  'parity_listRecentDapps' () {
    return {};
  },

  'parity_killAccount' ([address, password]) {
    const index = accounts.findIndex((account) => account.address === address);

    if (index === -1) {
      return false;
    }

    accounts.splice(index, 1);

    return true;
  }
}
