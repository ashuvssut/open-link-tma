import { ENV } from '@/constants';
import baseX from 'base-x';
import toast from 'react-hot-toast';

// URL-safe Base62 alphabet (0-9, a-z, A-Z)
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const base62 = baseX(BASE62);

/**
 * Encode a string to Base62 (browser-safe)
 * @param str - input string
 * @returns encoded string
 */
const encodeBase62 = (str: string) => {
  const bytes = new TextEncoder().encode(str); // convert string to Uint8Array
  return base62.encode(bytes);
};

/**
 * Decode a Base62 string back to original (browser-safe)
 * @param encoded - Base62 encoded string
 * @returns decoded string
 */
const decodeBase62 = (encoded: string) => {
  const bytes = base62.decode(encoded);
  return new TextDecoder().decode(bytes); // convert Uint8Array back to string
};

export const encodeX = (str: string, useBase62 = ENV.useBase62) => {
  if (useBase62) return encodeBase62(str);
  return encodeURIComponent(str);
};

export const decodeX = (str: string, useBase62 = ENV.useBase62) => {
  if (useBase62) return decodeBase62(str);
  return decodeURIComponent(str);
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const showErrorToast = (err: unknown, prefix = 'Error') => {
  const options = prefix !== 'Error' ? { id: prefix } : {};
  console.error(err, prefix);
  if (err instanceof Error) toast.error(`${prefix}: ${err.message}`, options);
  else toast.error(`${prefix}: ${JSON.stringify(err)}`, options);
};
