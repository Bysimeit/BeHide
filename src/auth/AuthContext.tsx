import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  createIdentity,
  createMasterKey,
  decryptPrivateKey,
  deriveBackupKey,
  deriveStorageKey,
  encryptPrivateKey,
  keysFromPrivateKey,
  privateKeyHex,
  sign,
  type Identity,
  type SecretKeys,
} from "./identity";
import {
  clearBiometricSecret,
  clearVault,
  readBiometricSecret,
  readVault,
  writeBiometricSecret,
  writeVault,
} from "./vault";
import {
  getBiometricSupport,
  runBiometricCheck,
  type BiometricKind,
  type BiometricOutcome,
} from "./biometrics";
import { useTranslate } from "../i18n";
import { clearDatabase } from "../data/db";
import { decryptFrom, encryptFor } from "../p2p/envelope";
import type { Envelope } from "../p2p/envelope";

export type AuthStatus = "loading" | "no-identity" | "locked" | "unlocked";

type AuthContextValue = {
  status: AuthStatus;
  identity: Identity | null;
  register: (pseudo: string, passphrase: string) => Promise<void>;
  unlock: (passphrase: string) => Promise<void>;
  restore: (
    pseudo: string,
    privateKey: string,
    passphrase: string,
  ) => Promise<void>;
  signOut: () => void;
  forgetIdentity: () => Promise<void>;
  biometricAvailable: boolean;
  biometricKind: BiometricKind;
  biometricEnabled: boolean;
  unlockWithBiometrics: () => Promise<BiometricOutcome>;
  setBiometricEnabled: (enabled: boolean) => Promise<boolean>;
  sign: (message: string) => string | null;
  exportPrivateKey: () => string | null;
  storageKey: () => Uint8Array | null;
  backupKey: () => Uint8Array | null;
  sealFor: (theirExchangePublicKey: string, plaintext: string) => Envelope | null;
  openFrom: (
    theirPublicKey: string,
    theirExchangePublicKey: string,
    envelope: Envelope,
  ) => string | null;
};

export class InvalidPassphraseError extends Error {
  constructor() {
    super("Passphrase incorrecte.");
  }
}

export class InvalidPrivateKeyError extends Error {
  constructor() {
    super("Clé privée invalide.");
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const t = useTranslate();
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricKind, setBiometricKind] = useState<BiometricKind>("generic");
  const [biometricEnabled, setBiometricEnabledState] = useState(false);

  const keysRef = useRef<SecretKeys | null>(null);

  const wipeSecrets = () => {
    keysRef.current = null;
  };

  useEffect(() => {
    let cancelled = false;

    readVault().then((record) => {
      if (cancelled) return;
      const usable = record?.secret ? record : null;
      setIdentity(usable?.identity ?? null);
      setBiometricEnabledState(usable?.biometricEnabled ?? false);
      setStatus(usable ? "locked" : "no-identity");
    });

    getBiometricSupport().then((support) => {
      if (cancelled) return;
      setBiometricAvailable(support.available);
      setBiometricKind(support.kind);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const register = useCallback(
    async (pseudo: string, passphrase: string): Promise<void> => {
      const { identity: newIdentity, keys } = createIdentity(
        pseudo,
        createMasterKey(),
      );
      const secret = await encryptPrivateKey(privateKeyHex(keys), passphrase);

      await writeVault({ identity: newIdentity, secret });

      keysRef.current = keys;
      setIdentity(newIdentity);
      setStatus("unlocked");
    },
    [],
  );

  const unlock = useCallback(async (passphrase: string) => {
    const record = await readVault();
    if (!record?.secret) {
      setStatus("no-identity");
      throw new InvalidPassphraseError();
    }

    const privateKey = await decryptPrivateKey(record.secret, passphrase);
    const keys = privateKey ? keysFromPrivateKey(privateKey) : null;
    if (!keys) throw new InvalidPassphraseError();

    keysRef.current = keys;
    setIdentity(record.identity);
    setStatus("unlocked");
  }, []);

  const restore = useCallback(
    async (pseudo: string, privateKey: string, passphrase: string) => {
      const keys = keysFromPrivateKey(privateKey);
      if (!keys) throw new InvalidPrivateKeyError();

      const { identity: restored } = createIdentity(pseudo, keys.signing);
      const secret = await encryptPrivateKey(privateKeyHex(keys), passphrase);

      await writeVault({ identity: restored, secret });

      keysRef.current = keys;
      setIdentity(restored);
      setStatus("unlocked");
    },
    [],
  );

  const unlockWithBiometrics =
    useCallback(async (): Promise<BiometricOutcome> => {
      const record = await readVault();
      if (!record) {
        setStatus("no-identity");
        return "unavailable";
      }
      if (!record.biometricEnabled) return "unavailable";

      const outcome = await runBiometricCheck(
        t("biometrics.unlockPrompt"),
        t("biometrics.usePassphrase"),
      );
      if (outcome !== "success") return outcome;

      const privateKey = await readBiometricSecret();
      const keys = privateKey ? keysFromPrivateKey(privateKey) : null;
      if (!keys) return "failed";

      keysRef.current = keys;
      setIdentity(record.identity);
      setStatus("unlocked");
      return "success";
    }, [t]);

  const setBiometricEnabled = useCallback(
    async (enabled: boolean): Promise<boolean> => {
      const record = await readVault();
      if (!record) return false;

      if (enabled) {
        const keys = keysRef.current;
        if (!keys) return false;

        const outcome = await runBiometricCheck(
          t("biometrics.enablePrompt"),
          t("biometrics.usePassphrase"),
        );
        if (outcome !== "success") return false;

        await writeBiometricSecret(privateKeyHex(keys));
      } else {
        await clearBiometricSecret();
      }

      await writeVault({ ...record, biometricEnabled: enabled });
      setBiometricEnabledState(enabled);
      return true;
    },
    [t],
  );

  const signMessage = useCallback(
    (message: string) => (keysRef.current ? sign(keysRef.current, message) : null),
    [],
  );

  const exportPrivateKey = useCallback(
    () => (keysRef.current ? privateKeyHex(keysRef.current) : null),
    [],
  );

  const storageKey = useCallback(
    () => (keysRef.current ? deriveStorageKey(keysRef.current) : null),
    [],
  );

  const backupKey = useCallback(
    () => (keysRef.current ? deriveBackupKey(keysRef.current) : null),
    [],
  );

  const sealFor = useCallback(
    (theirExchangePublicKey: string, plaintext: string): Envelope | null => {
      const keys = keysRef.current;
      if (!keys || !identity) return null;
      return encryptFor(
        keys,
        identity.publicKey,
        theirExchangePublicKey,
        plaintext,
      );
    },
    [identity],
  );

  const openFrom = useCallback(
    (
      theirPublicKey: string,
      theirExchangePublicKey: string,
      envelope: Envelope,
    ): string | null => {
      const keys = keysRef.current;
      if (!keys) return null;
      return decryptFrom(keys, theirPublicKey, theirExchangePublicKey, envelope);
    },
    [],
  );

  const signOut = useCallback(() => {
    wipeSecrets();
    setStatus(identity ? "locked" : "no-identity");
  }, [identity]);

  const forgetIdentity = useCallback(async () => {
    await clearVault();
    await clearBiometricSecret();
    await clearDatabase();
    wipeSecrets();
    setIdentity(null);
    setBiometricEnabledState(false);
    setStatus("no-identity");
  }, []);

  const value = useMemo(
    () => ({
      status,
      identity,
      register,
      unlock,
      restore,
      signOut,
      forgetIdentity,
      biometricAvailable,
      biometricKind,
      biometricEnabled,
      unlockWithBiometrics,
      setBiometricEnabled,
      sign: signMessage,
      exportPrivateKey,
      storageKey,
      backupKey,
      sealFor,
      openFrom,
    }),
    [
      status,
      identity,
      register,
      unlock,
      restore,
      signOut,
      forgetIdentity,
      biometricAvailable,
      biometricKind,
      biometricEnabled,
      unlockWithBiometrics,
      setBiometricEnabled,
      signMessage,
      exportPrivateKey,
      storageKey,
      backupKey,
      sealFor,
      openFrom,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un <AuthProvider>.");
  }
  return context;
};
