import { lowerCaseObjectKeys } from './lowerCaseObjectKeys';

function parseHostAndPath(url: string) {
  // handle relative URLs w/absolute path and special case `*` as these are
  // acceptable in the HTTP request line
  if (url.startsWith('/') || url === '*') {
    return {
      host: null,
      path: url,
    };
  }

  try {
    const u = new URL(url);
    const { host, pathname, search } = u;
    return { host, path: pathname + search };
  } catch (e) {
    // throw invalid URL error
    throw new Error(`An invalid url "${url}" was specified.`);
  }
}

// pseudo headers from the spec
const PSEUDO_HEADERS: any = {
  '(created)': 'created',
  '(expires)': 'expires',
  '(algorithm)': 'algorithm',
  '(key-id)': 'keyId',
};

function addValue({ result, validate, key, values, label }: any) {
  let value = values[key];
  validate(key, value);
  if (Array.isArray(value)) {
    value = value.join(', ');
  }
  if (value instanceof Date) {
    // only PSEUDO_HEADERS created & expires have to be unix timestamps
    if (label in PSEUDO_HEADERS) {
      value = value.getTime();
    } else {
      // normal Headers are UTC Time Strings
      value = value.toUTCString();
    }
  }
  // trim the string so it conforms to
  // HTTP Signatures spec v 11 section 2.3 step 4.2
  // header value (after removing leading and trailing whitespace)
  if (typeof value === 'string') {
    value = value.trim();
  }
  result.push(`${label || key}: ${value}`);
}

function signingString({
  includeHeaders,
  headers,
  method,
  host,
  path,
  requestOptions,
  validate,
}: any) {
  const result = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const h of includeHeaders) {
    if (h === '(request-target)') {
      result.push(`(request-target): ${method.toLowerCase()} ${path || '/'}`);
    } else if (h === 'host' && host) {
      result.push(`host: ${host}`);
    } else if (h in PSEUDO_HEADERS) {
      addValue({
        result,
        validate,
        key: PSEUDO_HEADERS[h],
        values: requestOptions,
        label: h,
      });
    } else {
      addValue({ result, validate, key: h, values: headers });
    }
  }
  // conform to HTTP signatures spec v 11
  // section 2.3 step 5
  // If value is not the last value then append an ASCII newline `\n`.
  return result.join('\n');
}

function validateSendHeader(header: any, value: any) {
  if (value === undefined) {
    throw new Error(`${header} was not found in \`requestOptions.headers\``);
  }
  if (header.startsWith('(')) {
    throw new Error(
      `Illegal header "${header}"; headers must not start with "(".`
    );
  }
}

export const createSignatureString = (
  includeHeaders: any,
  requestOptions: any
) => {
  const headers = lowerCaseObjectKeys(requestOptions.headers);
  const lowerCasedIncludeHeaders = includeHeaders.map((h: string) => {
    return h.toLowerCase();
  });
  const { url, method = '' } = requestOptions;
  const { host, path } = parseHostAndPath(url);

  return signingString({
    includeHeaders: lowerCasedIncludeHeaders,
    headers,
    method,
    host,
    path,
    requestOptions,
    validate: validateSendHeader,
  });
};
