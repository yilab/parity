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

import EventEmitter from 'eventemitter3';
import { Logging } from '../subscriptions';

export default class JsonRpcBase extends EventEmitter {
  constructor () {
    super();

    this._id = 1;
    this._debug = false;
    this._connected = false;
    this._middlewareList = Promise.resolve([]);
  }

  encode (method, params) {
    const json = JSON.stringify({
      jsonrpc: '2.0',
      method: method,
      params: params,
      id: this._id++
    });

    return json;
  }

  addMiddleware (middleware) {
    this._middlewareList = Promise
      .all([
        middleware,
        this._middlewareList
      ])
      .then(([middleware, middlewareList]) => {
        // Do nothing if `handlerPromise` resolves to a null-y value.
        if (middleware == null) {
          return middlewareList;
        }

        // don't mutate the original array
        return middlewareList.concat([middleware]);
      });
  }

  _wrapHandlerResult (result) {
    return {
      id: this._id,
      jsonrpc: '2.0',
      result
    };
  }

  execute (method, ...params) {
    return this._middlewareList.then((middlewareList) => {
      for (const middleware of middlewareList) {
        const res = middleware(method, params);

        if (res != null) {
          const result = this._wrapHandlerResult(res);
          const json = this.encode(method, params);

          Logging.send(method, params, { json, result });

          return res;
        }
      }

      return this._execute(method, params);
    });
  }

  _execute () {
    throw new Error('Missing implementation of JsonRpcBase#_execute');
  }

  _setConnected () {
    if (!this._connected) {
      this._connected = true;
      this.emit('open');
    }
  }

  _setDisconnected () {
    if (this._connected) {
      this._connected = false;
      this.emit('close');
    }
  }

  get id () {
    return this._id;
  }

  get isDebug () {
    return this._debug;
  }

  get isConnected () {
    return this._connected;
  }

  setDebug (flag) {
    this._debug = flag;
  }

  error (error) {
    if (this.isDebug) {
      console.error(error);
    }
  }

  log (log) {
    if (this.isDebug) {
      console.log(log);
    }
  }
}
