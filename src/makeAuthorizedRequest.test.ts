import axios from 'axios';
import { getServer } from './__test__/server';
import { makeAuthorizedRequest } from './makeAuthorizedRequest';
import { verifyAuthorizedRequest } from './verifyAuthorizedRequest';
import { key } from './__test__/key';
import { httpSignatureRequestHeaders } from './__fixtures__';

axios.defaults.adapter = require('axios/lib/adapters/http');

const server = getServer();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const keyResolver = async (_keyId: string) => {
  return key.toJsonWebKeyPair(false);
};
const route = httpSignatureRequestHeaders[0].requestOptions.url
  .split('http://localhost:8080')
  .pop() as string;

server.get(route, async (request, reply) => {
  try {
    // uncomment to capture test vectors
    // console.log(
    //   JSON.stringify(
    //     {
    //       authorization: request.headers.authorization,
    //     },
    //     null,
    //     2
    //   )
    // );
    const requestHeaders = {
      authorization: request.headers.authorization,
    };
    expect(requestHeaders).toEqual(
      httpSignatureRequestHeaders[0].requestHeaders
    );
    const verified = await verifyAuthorizedRequest(
      {
        url: `http://${request.headers.host}${request.url}`,
        method: request.method.toLowerCase(),
        headers: requestHeaders,
      },
      keyResolver
    );
    reply.code(200).send({ verified });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
});

beforeAll(async () => {
  await server.listen(8080);
});

afterAll(() => {
  server.close();
});

it('makeAuthorizedRequest', async () => {
  const signer = key.signer();
  const verificationMethod = key.controller + key.id;
  const created = '1602879801289';
  const expires = '1602880401289';
  const response = await makeAuthorizedRequest(
    httpSignatureRequestHeaders[0].requestOptions,
    {
      keyId: verificationMethod,
      created,
      expires,
    },
    signer
  );
  expect(response.data.verified).toBe(true);
});
