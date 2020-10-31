import { key } from './key';

it('sign and verify', async () => {
  const message = 'foo';
  const signer = key.signer();
  const verifier = key.verifier();
  const signature = await signer.sign({ data: message });
  const verified = await verifier.verify({ data: message, signature });
  expect(verified).toBe(true);
});
