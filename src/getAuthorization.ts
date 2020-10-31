import base64url from 'base64url';

import { getVerifyData } from './getVerifyData';

export const getAuthorization = async (
  requestOptions: any,
  signatureOptions: any,
  signer: any
) => {
  const { keyId, created, expires } = signatureOptions;
  const data = await getVerifyData(requestOptions, signatureOptions);
  const signature = await signer.sign({ data });
  const encodedSignature = base64url.encode(signature);
  const authorization = `Signature keyId="${keyId}",algorithm="hs2019",headers="(key-id) (created) (expires) (request-target) host content-type digest",signature="${encodedSignature}",created="${created}",expires="${expires}"`;
  return authorization;
};
