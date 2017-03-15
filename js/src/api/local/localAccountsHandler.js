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

const HEX = '0123456789abcdef';

function randomAddress () {
  let address = '0x';

  for (let i = 0; i < 40; i++) {
    address += HEX[Math.random() * 16 | 0];
  }

  return address;
}

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

class Account {
  constructor (address, name) {
    this._address = address;
    this._name = name;
    this._meta = '{}';
  }

  get address () {
    return this._address;
  }

  get name () {
    return this._name;
  }

  set name (name) {
    this._name = name;
  }

  get meta () {
    return this._meta;
  }

  set meta (meta) {
    this._meta = meta;
  }

  static fromPhrase (phrase, password) {
    return new Account(randomAddress(), '');
  }
}

const accounts = [];

console.log(accounts);

const handlers = {
  eth_accounts () {
    return accounts.map((account) => account.address);
  },

  eth_coinbase () {
    return handlers.parity_defaultAccount();
  },

  parity_accountsInfo () {
    let result = {};

    for (const { address, name } of accounts) {
      result[address] = { name };
    }

    return result;
  },

  parity_allAccountsInfo () {
    return handlers.parity_accountsInfo();
  },

  parity_defaultAccount () {
    if (accounts.length === 0) {
      return NULL_ADDRESS;
    }

    return accounts[0].address;
  },

  parity_hardwareAccountsInfo () {
    return {};
  },

  parity_newAccountFromPhrase ([phrase, password]) {
    console.log('Create account from phrase', phrase, password);

    const account = Account.fromPhrase(phrase, password);

    accounts.push(account);

    return account.address;
  },

  parity_setAccountMeta ([address, meta]) {
    const account = accounts.find((account) => address === account.address);

    if (account) {
      account.meta = meta;
    }

    return true;
  },

  parity_setAccountName ([address, name]) {
    const account = accounts.find((account) => address === account.address);

    if (account) {
      account.name = name;
    }

    return true;
  }
};

export default function localAccountsHandler (method, params) {
  if (method in handlers) {
    const response = handlers[method](params);

    console.log(method, params, '=>', response);

    return response;
  }

  return null;
}
