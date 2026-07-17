export type SharedIdentity = {
  publicKey: string;
  exchangePublicKey: string;
};

const PREFIX = "behide:v1:";
const HEX64 = /^[0-9a-f]{64}$/;

export const encodeIdentityToken = ({
  publicKey,
  exchangePublicKey,
}: SharedIdentity): string => `${PREFIX}${publicKey}:${exchangePublicKey}`;

export const decodeIdentityToken = (raw: string): SharedIdentity | null => {
  const value = raw.trim().toLowerCase();
  const body = value.startsWith(PREFIX) ? value.slice(PREFIX.length) : value;
  const parts = body.split(":");
  if (parts.length !== 2) return null;

  const [publicKey, exchangePublicKey] = parts;
  if (!HEX64.test(publicKey) || !HEX64.test(exchangePublicKey)) return null;

  return { publicKey, exchangePublicKey };
};
