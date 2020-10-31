import base64url from 'base64url';
import { getVerifyData } from './getVerifyData';
import { getSignatureOptionsFromAuthorizationHeader } from './getSignatureOptionsFromAuthorizationHeader';
import { getVerifierFromVerificationMethod } from './getVerifierFromVerificationMethod';

export const verifyAuthorizedRequest = async (
  request: any,
  keyResolver: any
) => {
  const {
    keyId,
    created,
    expires,
    signature,
  } = getSignatureOptionsFromAuthorizationHeader(request.headers.authorization);
  const verifyData = await getVerifyData(
    {
      method: request.method,
      url: request.url,
      headers: request.headers,
    },
    {
      keyId,
      created,
      expires,
    }
  );
  const verificationMethod = await keyResolver(keyId);
  const verifier = getVerifierFromVerificationMethod(verificationMethod);
  const verified = await verifier.verify({
    data: verifyData,
    signature: base64url.toBuffer(signature),
  });
  return verified;
};
