import "./polyfills";
import * as Crypto from "expo-crypto";
import { ed25519, x25519 } from "@noble/curves/ed25519.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { hkdf } from "@noble/hashes/hkdf.js";
import { scryptAsync } from "@noble/hashes/scrypt.js";
import { bytesToHex, hexToBytes, utf8ToBytes } from "@noble/hashes/utils.js";
import { bytesToUtf8 } from "@noble/ciphers/utils.js";
import { xchacha20poly1305 } from "@noble/ciphers/chacha.js";

export type Identity = {
  pseudo: string;
  publicKey: string;
  exchangePublicKey: string;
  fingerprint: string;
  createdAt: string;
};

export type SecretKeys = {
  signing: Uint8Array;
  exchange: Uint8Array;
};

export type EncryptedSecret = {
  kdf: "scrypt";
  n: number;
  r: number;
  p: number;
  salt: string;
  nonce: string;
  ciphertext: string;
};

const SCRYPT_N = 2 ** 15;
const SCRYPT_R = 8;
const SCRYPT_P = 1;

export const PRIVATE_KEY_BYTES = 32;

export const PRIVATE_KEY_LENGTH = PRIVATE_KEY_BYTES * 2;

const toHex = (bytes: Uint8Array) => bytesToHex(bytes);

export const formatFingerprint = (publicKey: string) =>
  publicKey
    .slice(0, 16)
    .toUpperCase()
    .replace(/(.{4})(?=.)/g, "$1 · ");

export const createMasterKey = (): Uint8Array =>
  Crypto.getRandomBytes(PRIVATE_KEY_BYTES);

export const deriveKeys = (privateKey: Uint8Array): SecretKeys => ({
  signing: privateKey,
  exchange: hkdf(sha256, privateKey, undefined, utf8ToBytes("behide/x25519/v1"), 32),
});

export const privateKeyHex = (keys: SecretKeys) => toHex(keys.signing);

export const deriveStorageKey = (keys: SecretKeys): Uint8Array =>
  hkdf(sha256, keys.signing, undefined, utf8ToBytes("behide/storage/v1"), 32);

export const deriveBackupKey = (keys: SecretKeys): Uint8Array =>
  hkdf(sha256, keys.signing, undefined, utf8ToBytes("behide/backup/v1"), 32);

export const keysFromPrivateKey = (value: string): SecretKeys | null => {
  if (validatePrivateKey(value)) return null;
  return deriveKeys(hexToBytes(value.trim().toLowerCase()));
};

export const publicKeysOf = (keys: SecretKeys) => ({
  publicKey: toHex(ed25519.getPublicKey(keys.signing)),
  exchangePublicKey: toHex(x25519.getPublicKey(keys.exchange)),
});

export const createIdentity = (
  pseudo: string,
  privateKey: Uint8Array,
): { identity: Identity; keys: SecretKeys } => {
  const keys = deriveKeys(privateKey);
  const { publicKey, exchangePublicKey } = publicKeysOf(keys);

  return {
    identity: {
      pseudo: pseudo.trim(),
      publicKey,
      exchangePublicKey,
      fingerprint: formatFingerprint(publicKey),
      createdAt: new Date().toISOString(),
    },
    keys,
  };
};

export const sign = (keys: SecretKeys, message: string) =>
  toHex(ed25519.sign(utf8ToBytes(message), keys.signing));

const deriveEncryptionKey = (
  passphrase: string,
  salt: Uint8Array,
  params: Pick<EncryptedSecret, "n" | "r" | "p">,
) =>
  scryptAsync(utf8ToBytes(passphrase.normalize("NFKC")), salt, {
    N: params.n,
    r: params.r,
    p: params.p,
    dkLen: 32,
  });

export const encryptPrivateKey = async (
  privateKey: string,
  passphrase: string,
): Promise<EncryptedSecret> => {
  const params = { n: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P } as const;
  const salt = Crypto.getRandomBytes(16);
  const nonce = Crypto.getRandomBytes(24);
  const key = await deriveEncryptionKey(passphrase, salt, params);
  const ciphertext = xchacha20poly1305(key, nonce).encrypt(utf8ToBytes(privateKey));

  return {
    kdf: "scrypt",
    ...params,
    salt: toHex(salt),
    nonce: toHex(nonce),
    ciphertext: toHex(ciphertext),
  };
};

export const decryptPrivateKey = async (
  secret: EncryptedSecret,
  passphrase: string,
): Promise<string | null> => {
  const key = await deriveEncryptionKey(passphrase, hexToBytes(secret.salt), secret);
  try {
    const plaintext = xchacha20poly1305(key, hexToBytes(secret.nonce)).decrypt(
      hexToBytes(secret.ciphertext),
    );
    return bytesToUtf8(plaintext);
  } catch {
    return null;
  }
};

export const PSEUDO_MIN_LENGTH = 3;
export const PSEUDO_MAX_LENGTH = 24;
export const PASSPHRASE_MIN_LENGTH = 8;

export type ValidationCode =
  | "pseudoTooShort"
  | "pseudoTooLong"
  | "passphraseTooShort"
  | "passphraseMismatch"
  | "privateKeyRequired"
  | "privateKeyHex"
  | "privateKeyLength";

export const VALIDATION_PARAMS = {
  pseudoMin: PSEUDO_MIN_LENGTH,
  pseudoMax: PSEUDO_MAX_LENGTH,
  passphraseMin: PASSPHRASE_MIN_LENGTH,
  keyLength: PRIVATE_KEY_LENGTH,
};

export const validatePseudo = (pseudo: string): ValidationCode | null => {
  const value = pseudo.trim();
  if (value.length < PSEUDO_MIN_LENGTH) return "pseudoTooShort";
  if (value.length > PSEUDO_MAX_LENGTH) return "pseudoTooLong";
  return null;
};

export const validatePassphrase = (
  passphrase: string,
): ValidationCode | null =>
  passphrase.length < PASSPHRASE_MIN_LENGTH ? "passphraseTooShort" : null;

export const validatePrivateKey = (value: string): ValidationCode | null => {
  const key = value.trim().toLowerCase();
  if (!key) return "privateKeyRequired";
  if (!/^[0-9a-f]*$/.test(key)) return "privateKeyHex";
  if (key.length !== PRIVATE_KEY_LENGTH) return "privateKeyLength";
  return null;
};
