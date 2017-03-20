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

import accounts from './accounts';
import { Middleware } from '../transport';

export default class LocalAccountsMiddleware extends Middleware {
  constructor (transport) {
    super(transport);

    const register = this.register.bind(this);

    register('eth_accounts', () => {
      return accounts.mapArray((account) => account.address);
    });

    register('eth_coinbase', () => {
      return accounts.lastUsed();
    });

    register('parity_accountsInfo', () => {
      return accounts.mapObject(({ name }) => {
        return { name };
      });
    });

    register('parity_allAccountsInfo', () => {
      return accounts.mapObject(({ name, meta, uuid }) => {
        return { name, meta, uuid };
      });
    });

    register('parity_defaultAccount', () => {
      return accounts.lastUsed();
    });

    register('parity_getNewDappsAddresses', () => {
      return [];
    });

    register('parity_hardwareAccountsInfo', () => {
      return {};
    });

    register('parity_newAccountFromPhrase', ([phrase, password]) => {
      return this
        .rpcRequest('parity_phraseToWallet', [phrase])
        .then((wallet) => {
          return accounts.create(wallet, password);
        });
    });

    register('parity_setAccountMeta', ([address, meta]) => {
      accounts.get(address).meta = meta;

      return true;
    });

    register('parity_setAccountName', ([address, name]) => {
      accounts.get(address).name = name;

      return true;
    });

    register('parity_useLocalAccounts', () => {
      return true;
    });

    register('parity_listGethAccounts', () => {
      return [];
    });

    register('parity_listRecentDapps', () => {
      return {};
    });

    register('parity_killAccount', ([address, password]) => {
      accounts.remove(address);

      return true;
    });
  }
}
