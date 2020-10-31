import { createSignatureString } from './createSignatureString';
import { lowerCaseObjectKeys } from './lowerCaseObjectKeys';
import { getDigest } from './getDigest';

export const getVerifyData = async (
  requestOptions: any,
  signatureOptions: any
) => {
  const includeHeaders = [
    '(key-id)',
    '(created)',
    '(expires)',
    '(request-target)',
    'host',
    // 'capability-invocation',
  ];
  if (requestOptions.data) {
    includeHeaders.push('content-type');
    includeHeaders.push('digest');
  }
  const { keyId, created, expires } = signatureOptions;
  const { url, method, headers } = requestOptions;
  const headersToBeSigned: any = {
    ...lowerCaseObjectKeys(headers),
    host: new URL(url).host,
  };
  if (requestOptions.data) {
    headersToBeSigned.digest = getDigest(requestOptions);
  }
  const plaintext = createSignatureString(includeHeaders, {
    url,
    method,
    headers: headersToBeSigned,
    created,
    expires,
    keyId,
  });
  const data = Buffer.from(plaintext);
  return data;
};
