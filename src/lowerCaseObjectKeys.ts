/**
 * Iterates over all keys in an object (not recursive)
 * and lower cases them.
 *
 * @see https://github.com/digitalbazaar/http-signature-header/blob/master/lib/index.js#L138
 *
 * @param {Object} obj - Any javascript object.
 *
 * @returns {Object} A new object with the keys lowercased.
 */
export function lowerCaseObjectKeys(obj: any) {
  const newObject: any = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const k of Object.keys(obj)) {
    newObject[k.toLowerCase()] = obj[k];
  }
  return newObject;
}
