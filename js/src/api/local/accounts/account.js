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

export default class Account {
  constructor (persist, data) {
    const {
      name,
      address = randomAddress(),
      meta = {},
      uuid = randomUUID()
    } = data;

    this._persist = persist;
    this._name = name;
    this._address = address;
    this._meta = meta;
    this._uuid = uuid;
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

  static fromPhrase (persist, phrase, password) {
    const account = new Account(persist, {});

    return account;
  }

  toJSON () {
    return {
      name: this._name,
      address: this._address,
      meta: this._meta,
      uuid: this._uuid
    };
  }
}
