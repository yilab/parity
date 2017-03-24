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

import dictionary from './dictionary';

// Allow a web worker in the browser, with a fallback for Node.js
const hasWebWorkers = typeof Worker !== 'undefined';
const KeyWorker = hasWebWorkers ? require('worker-loader!./worker')
                                : require('./worker').KeyWorker;

export function phraseToAddress (phrase) {
  return phraseToWallet(phrase).then((wallet) => wallet.address);
}

export function phraseToWallet (phrase) {
  return new Promise((resolve, reject) => {
    const worker = new KeyWorker();

    worker.postMessage(phrase);
    worker.onmessage = ({ data }) => {
      resolve(data);
    };
  });
}

export function randomWord () {
  // TODO mh: use better entropy
  const index = Math.random() * dictionary.length | 0;

  return dictionary[index];
}

export function randomPhrase (length) {
  const words = [];

  while (length--) {
    words.push(randomWord());
  }

  return words.join(' ');
}
