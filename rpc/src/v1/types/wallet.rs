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

use v1::types::{H160, H256, H512};
use ethkey::KeyPair;

/// Wallet to be managed outside of the Node
#[derive(Debug, Serialize)]
pub struct Wallet {
	address: H160,
	secret: H256,
	public: H512,
}

impl From<KeyPair> for Wallet {
	fn from(key_pair: KeyPair) -> Wallet {
		let secret = **key_pair.secret();
		let public = *key_pair.public();

		Wallet {
			address: key_pair.address().into(),
			secret: secret.into(),
			public: public.into(),
		}
	}
}
