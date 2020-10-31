export const getSignatureOptionsFromAuthorizationHeader = (
  authorization: string
) => {
  const keyIdMatches: any = /keyId="(.+?)"/.exec(authorization);
  const keyId = keyIdMatches[1];
  const createdMatches: any = /created="(.+?)"/.exec(authorization);
  const created = createdMatches[1];
  const expiresMatches: any = /expires="(.+?)"/.exec(authorization);
  const expires = expiresMatches[1];
  const signatureMatches: any = /signature="(.+?)"/.exec(authorization);
  const signature = signatureMatches[1];
  const parsed = { keyId, created, expires, signature };
  return parsed;
};
