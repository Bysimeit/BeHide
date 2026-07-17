import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  formatDate,
  formatDayHeader,
  formatDuration,
  formatRelativeDateTime,
  formatTime,
  greeting,
} from "../utils/datetime";
import {
  DEFAULT_LANGUAGE,
  type Language,
  type LanguagePreference,
} from "./languages";
import { resolveDeviceLanguage } from "./deviceLocale";
import { readLanguagePreference, writeLanguagePreference } from "./storage";
import { createTranslator, type Translate } from "./translate";

export { LANGUAGES, LANGUAGE_FLAGS, LANGUAGE_NAMES } from "./languages";
export type { Language, LanguagePreference } from "./languages";
export type { Translate, TranslationKey } from "./translate";

type I18nValue = {
  language: Language;
  preference: LanguagePreference;
  setPreference: (preference: LanguagePreference) => void;
  t: Translate;
  ready: boolean;
};

const I18nContext = createContext<I18nValue | null>(null);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreferenceState] =
    useState<LanguagePreference>("system");
  const [ready, setReady] = useState(false);
  const [system, setSystem] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([readLanguagePreference(), resolveDeviceLanguage()]).then(
      ([stored, device]) => {
        if (cancelled) return;
        setPreferenceState(stored);
        setSystem(device);
        setReady(true);
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const setPreference = useCallback((next: LanguagePreference) => {
    setPreferenceState(next);
    void writeLanguagePreference(next).catch((error) =>
      console.warn("Écriture de la langue échouée :", error),
    );
  }, []);

  const language = preference === "system" ? system : preference;

  const value = useMemo<I18nValue>(
    () => ({
      language,
      preference,
      setPreference,
      t: createTranslator(language),
      ready,
    }),
    [language, preference, setPreference, ready],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nValue => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n doit être utilisé dans un <I18nProvider>.");
  }
  return context;
};

export const useTranslate = (): Translate => useI18n().t;

export const useDateFormat = () => {
  const { language, t } = useI18n();

  return useMemo(
    () => ({
      formatTime: (iso: string) => formatTime(iso, language),
      formatDate: (iso: string) => formatDate(iso, language),
      formatDayHeader: (iso: string) => formatDayHeader(iso, language),
      formatDuration: (seconds: number) => formatDuration(seconds, t),
      formatRelativeDateTime: (iso: string, now?: Date) =>
        formatRelativeDateTime(iso, language, t, now),
      greeting: (name: string, now?: Date) => greeting(name, t, now),
    }),
    [language, t],
  );
};
