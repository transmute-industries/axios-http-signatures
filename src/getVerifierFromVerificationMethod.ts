import { Ed25519KeyPair } from '@transmute/did-key-ed25519';

export const getVerifierFromVerificationMethod = (verificationMethod: any) => {
  const key = Ed25519KeyPair.from(verificationMethod);
  return key.verifier();
};
