import axios from 'axios';
import { getDigest } from './getDigest';
import { getAuthorization } from './getAuthorization';

export const makeAuthorizedRequest = async (
  requestOptions: any,
  signatureOptions: any,
  signer: any
) => {
  const requestHeaders: any = {
    ...requestOptions.headers,
    authorization: await getAuthorization(
      requestOptions,
      signatureOptions,
      signer
    ),
  };

  if (requestOptions.data) {
    requestHeaders.digest = await getDigest(requestOptions);
  }

  return axios({
    ...requestOptions,
    headers: requestHeaders,
  });
};
