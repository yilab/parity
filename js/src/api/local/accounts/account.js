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

import { randomUUID, randomAddress } from './util';
import { sha3 } from '../../util/sha3';

export default class Account {
  constructor (persist, data) {
    const {
      address = randomAddress(),
      publicKey,
      privateKey,
      password = '',
      name,
      meta = {},
      uuid = randomUUID()
    } = data;

    this._persist = persist;
    this._address = address;
    this._publicKey = publicKey;
    this._privateKey = privateKey;
    this._password = password;
    this._name = name;
    this._meta = meta;
    this._uuid = uuid;
  }

  isValidPassword (password) {
    return this._password === sha3(password);
  }

  get address () {
    return this._address;
  }

  get name () {
    return this._name;
  }

  set name (name) {
    this._name = name;

    this._persist();
  }

  get meta () {
    return JSON.stringify(this._meta);
  }

  set meta (meta) {
    this._meta = JSON.parse(meta);

    this._persist();
  }

  get uuid () {
    return this._uuid;
  }

  get privateKey () {
    return Buffer.from(this._privateKey.slice(2), 'hex');
  }

  static fromWallet (persist, wallet, password) {
    const data = {
      address: wallet.address,
      publicKey: wallet.public,
      privateKey: wallet.secret,
      password: sha3(password)
    };

    const account = new Account(persist, data);

    return account;
  }

  toJSON () {
    return {
      address: this._address,
      publicKey: this._publicKey,
      privateKey: this._privateKey,
      password: this._password,
      name: this._name,
      meta: this._meta,
      uuid: this._uuid
    };
  }
}
