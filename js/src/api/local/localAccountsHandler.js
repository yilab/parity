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
  }

  get address () {
    return this._address;
  }

  get name () {
    return this._name;
  }

  fromPhrase (phrase, password) {
    return new Account(randomAddress(), '');
  }
}

const accounts = [];

const handlers = {
  eth_accounts () {
    return accounts.map((account) => account.address);
  },

  eth_coinbase () {
    return NULL_ADDRESS;
  },

  parity_accountsInfo () {
    let result = {};

    for (const { address, name } of accounts) {
      result[address] = { name };
    }

    return result;
  },

  parity_defautAccount () {
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

    return NULL_ADDRESS;
  }
};

export default function localAccountsHandler (method, params) {
  if (method in handlers) {
    return handlers[method](params);
  }

  return null;
}
