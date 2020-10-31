import canonicalize from 'canonicalize';
import base64url from 'base64url';
import crypto from 'isomorphic-webcrypto';

export const getDigest = async (requestOptions: any) => {
  const digest = new Uint8Array(
    await crypto.subtle.digest(
      { name: 'SHA-256' },
      Buffer.from(canonicalize(requestOptions.data))
    )
  );
  // format as multihash digest
  // sha2-256: 0x12, length: 32 (0x20), digest value
  const mh = new Uint8Array(34);
  mh[0] = 0x12;
  mh[1] = 0x20;
  mh.set(digest, 2);
  // encode multihash using multibase, base64url: `u`
  return `mh=u${base64url.encode(Buffer.from(mh))}`;
};
