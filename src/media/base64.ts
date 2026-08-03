const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

const LOOKUP = (() => {
  const table = new Uint8Array(128);
  for (let index = 0; index < ALPHABET.length; index += 1) {
    table[ALPHABET.charCodeAt(index)] = index;
  }
  return table;
})();

const FLUSH_AT = 8192;

export const bytesToBase64 = (bytes: Uint8Array): string => {
  let out = "";
  let block = "";

  for (let index = 0; index < bytes.length; index += 3) {
    const b0 = bytes[index];
    const b1 = bytes[index + 1] ?? 0;
    const b2 = bytes[index + 2] ?? 0;

    block += ALPHABET[b0 >> 2];
    block += ALPHABET[((b0 & 0x03) << 4) | (b1 >> 4)];
    block += index + 1 < bytes.length ? ALPHABET[((b1 & 0x0f) << 2) | (b2 >> 6)] : "=";
    block += index + 2 < bytes.length ? ALPHABET[b2 & 0x3f] : "=";

    if (block.length >= FLUSH_AT) {
      out += block;
      block = "";
    }
  }

  return out + block;
};

export const base64ToBytes = (input: string): Uint8Array => {
  const clean = input.replace(/[^A-Za-z0-9+/]/g, "");
  const length = Math.floor((clean.length * 3) / 4);
  const bytes = new Uint8Array(length);
  let offset = 0;

  for (let index = 0; index < clean.length; index += 4) {
    const c0 = LOOKUP[clean.charCodeAt(index)];
    const c1 = LOOKUP[clean.charCodeAt(index + 1)] ?? 0;
    const c2 = LOOKUP[clean.charCodeAt(index + 2)] ?? 0;
    const c3 = LOOKUP[clean.charCodeAt(index + 3)] ?? 0;

    if (offset < length) bytes[offset++] = (c0 << 2) | (c1 >> 4);
    if (offset < length) bytes[offset++] = ((c1 & 0x0f) << 4) | (c2 >> 2);
    if (offset < length) bytes[offset++] = ((c2 & 0x03) << 6) | c3;
  }

  return bytes;
};
