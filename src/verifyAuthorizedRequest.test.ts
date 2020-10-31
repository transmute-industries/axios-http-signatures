import { verifyAuthorizedRequest } from './verifyAuthorizedRequest';
import { key } from './__test__/key';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const keyResolver = async (_keyId: string) => {
  return key.toJsonWebKeyPair(false);
};
it('verifyAuthorizedRequest', async () => {
  const authorizationParameters = {
    method: 'get',
    url: 'http://localhost:8080/verify-get',
    headers: {
      authorization:
        'Signature keyId="did:key:z6Mkk7yqnGF3YwTrLpqrW6PGsKci7dNqh1CjnvMbzrMerSeL#z6Mkk7yqnGF3YwTrLpqrW6PGsKci7dNqh1CjnvMbzrMerSeL",algorithm="hs2019",headers="(key-id) (created) (expires) (request-target) host content-type digest",signature="4v-HYAYJT5dEa9ZY0FoOSIwTG-A17PxvJNFJmKffUsWV6utFfJ8mRJqYLripg28cXXTwtotsMID6k77EnM6SAA",created="1602879801289",expires="1602880401289"',
    },
  };

  const verified = await verifyAuthorizedRequest(
    authorizationParameters,
    keyResolver
  );
  expect(verified).toBe(true);
});
