import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { httpSignatureRequestHeaders } from '../__fixtures__';
import { getServer } from './server';
import { makeAuthorizedRequest } from '../makeAuthorizedRequest';
import { verifyAuthorizedRequest } from '../verifyAuthorizedRequest';
import { key } from './key';

const WRITE_FIXTURES_TO_DISK = false;

const httpSignatureRequestHeadersFixture: any = [];

axios.defaults.adapter = require('axios/lib/adapters/http');

const server = getServer();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const keyResolver = async (_keyId: string) => {
  return key.toJsonWebKeyPair(false);
};

describe('HTTP Signature Request Headers', () => {
  httpSignatureRequestHeaders.forEach((requestTestVector: any) => {
    beforeEach(async () => {
      const route = requestTestVector.requestOptions.url
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
          httpSignatureRequestHeadersFixture.push({
            clientKeyPair: key.toJsonWebKeyPair(true),
            requestOptions: requestTestVector.requestOptions,
            requestHeaders,
          });
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
      await server.listen(8080);
    });
    afterEach(() => {
      server.close();
    });
    it(`${requestTestVector.requestOptions.method} ${requestTestVector.requestOptions.url}`, async () => {
      const signer = key.signer();
      const verificationMethod = key.controller + key.id;
      const created = '1602879801289';
      const expires = '1602880401289';
      const response = await makeAuthorizedRequest(
        requestTestVector.requestOptions,
        {
          keyId: verificationMethod,
          created,
          expires,
        },
        signer
      );
      expect(response.data.verified).toBe(true);
    });
  });
});

it('test vectors have not changed', () => {
  if (WRITE_FIXTURES_TO_DISK) {
    fs.writeFileSync(
      path.resolve(
        __dirname,
        '../__fixtures__/http-signature-request-headers.json'
      ),
      JSON.stringify(httpSignatureRequestHeadersFixture, null, 2)
    );
  } else {
    expect(httpSignatureRequestHeadersFixture).toEqual(
      httpSignatureRequestHeaders
    );
  }
});
