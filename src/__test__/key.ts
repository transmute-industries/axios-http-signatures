import { Ed25519KeyPair } from '@transmute/did-key-ed25519';
import { keypair } from '../__fixtures__';

export const key = Ed25519KeyPair.from(
  keypair[0].keypair['application/did+json']
);
