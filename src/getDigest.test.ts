// https://github.com/digitalbazaar/edv-client/pull/76/files#diff-9792e171d4b56a163d5ee905978687580322e52660a98ee9f67868d725ed9682R8
//  "digest": "mh=uEiCNeORSxfOCyAK6rTLurlwbfRHUz7gfTn-njjJEvZDVGQ",
// https://tools.ietf.org/html/draft-cavage-http-signatures-12

import { getDigest } from './getDigest';

it('getDigest', async () => {
  const digest = await getDigest({
    data: { hello: 'world' },
  });
  expect(digest).toBe('mh=uEiCTojlxqRTl6svwqNJRVM2jCcPBxy-7mRTUfGDzy2gViA');
});
