import "../auth/polyfills";
import * as Crypto from "expo-crypto";
import { x25519 } from "@noble/curves/ed25519.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { hkdf } from "@noble/hashes/hkdf.js";
import { bytesToHex, hexToBytes, utf8ToBytes } from "@noble/hashes/utils.js";
import { bytesToUtf8 } from "@noble/ciphers/utils.js";
import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";
import type { SecretKeys } from "../auth/identity";

export type Envelope = {
  n: string;
  c: string;
};

const HKDF_INFO = utf8ToBytes("behide/e2e/v1");

export const sharedKey = (
  myExchangePrivate: Uint8Array,
  theirExchangePublic: Uint8Array,
): Uint8Array => {
  const dh = x25519.getSharedSecret(myExchangePrivate, theirExchangePublic);
  return hkdf(sha256, dh, undefined, HKDF_INFO, 32);
};

export const seal = (
  key: Uint8Array,
  plaintext: string,
  aad?: Uint8Array,
): Envelope => {
  const nonce = Crypto.getRandomBytes(24);
  const ciphertext = xchacha20poly1305(key, nonce, aad).encrypt(
    utf8ToBytes(plaintext),
  );
  return { n: bytesToHex(nonce), c: bytesToHex(ciphertext) };
};

export const open = (
  key: Uint8Array,
  envelope: Envelope,
  aad?: Uint8Array,
): string | null => {
  try {
    const plaintext = xchacha20poly1305(key, hexToBytes(envelope.n), aad).decrypt(
      hexToBytes(envelope.c),
    );
    return bytesToUtf8(plaintext);
  } catch {
    return null;
  }
};

const NONCE_BYTES = 24;

export const sealBytes = (key: Uint8Array, plaintext: Uint8Array): Uint8Array => {
  const nonce = Crypto.getRandomBytes(NONCE_BYTES);
  const ciphertext = xchacha20poly1305(key, nonce).encrypt(plaintext);
  const sealed = new Uint8Array(nonce.length + ciphertext.length);
  sealed.set(nonce);
  sealed.set(ciphertext, nonce.length);
  return sealed;
};

export const openBytes = (
  key: Uint8Array,
  sealed: Uint8Array,
): Uint8Array | null => {
  if (sealed.length <= NONCE_BYTES) return null;
  try {
    return xchacha20poly1305(key, sealed.subarray(0, NONCE_BYTES)).decrypt(
      sealed.subarray(NONCE_BYTES),
    );
  } catch {
    return null;
  }
};

export const encryptFor = (
  myKeys: SecretKeys,
  myPublicKeyHex: string,
  theirExchangePubHex: string,
  plaintext: string,
): Envelope =>
  seal(
    sharedKey(myKeys.exchange, hexToBytes(theirExchangePubHex)),
    plaintext,
    hexToBytes(myPublicKeyHex),
  );

export const decryptFrom = (
  myKeys: SecretKeys,
  theirPublicKeyHex: string,
  theirExchangePubHex: string,
  envelope: Envelope,
): string | null =>
  open(
    sharedKey(myKeys.exchange, hexToBytes(theirExchangePubHex)),
    envelope,
    hexToBytes(theirPublicKeyHex),
  );
