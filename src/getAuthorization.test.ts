import { getAuthorization } from './getAuthorization';

import { key } from './__test__/key';

it('getAuthorization', async () => {
  const signer = key.signer();
  const verificationMethod = key.controller + key.id;
  const created = '1602879801289';
  const expires = '1602880401289';
  const authorization = await getAuthorization(
    {
      method: 'get',
      url: 'http://localhost:8080/ping',
      headers: {
        'content-type': 'application/json',
      },
      data: { hello: 'world' },
    },
    {
      keyId: verificationMethod,
      created,
      expires,
    },
    signer
  );
  expect(authorization).toBe(
    `Signature keyId="did:key:z6Mkk7yqnGF3YwTrLpqrW6PGsKci7dNqh1CjnvMbzrMerSeL#z6Mkk7yqnGF3YwTrLpqrW6PGsKci7dNqh1CjnvMbzrMerSeL",algorithm="hs2019",headers="(key-id) (created) (expires) (request-target) host content-type digest",signature="HvIojLqerlopYTAjnpAlFs8DoHMETbdWwsteTYWm41dz1qlfnPmCqjAE6HaiC52GqGXxsLuOSsO9BM025nRpCw",created="1602879801289",expires="1602880401289"`
  );
});
