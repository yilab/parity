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

import Worker from 'worker-loader!./worker';
import dictionary from './dictionary';

export function phraseToAddress (phrase) {
  return phraseToWallet(phrase).then((wallet) => wallet.address);
}

export function phraseToWallet (phrase) {
  return new Promise((resolve, reject) => {
    const worker = new Worker();
    const start = Date.now();

    worker.postMessage(phrase);
    worker.onmessage = (event) => {
      console.log('worker done in', Date.now() - start);
      resolve(event.data);
    };
  });
}

export function randomWord () {
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
