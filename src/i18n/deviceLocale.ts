import { requireOptionalNativeModule } from "expo-modules-core";
import { DEFAULT_LANGUAGE, isLanguage, type Language } from "./languages";

const fromExpoLocalization = async (): Promise<string[]> => {
  if (!requireOptionalNativeModule("ExpoLocalization")) return [];
  try {
    const { getLocales } = await import("expo-localization");
    return getLocales()
      .map((locale) => locale.languageTag)
      .filter((tag): tag is string => Boolean(tag));
  } catch {
    return [];
  }
};

const fromIntl = (): string[] => {
  try {
    const { locale } = Intl.DateTimeFormat().resolvedOptions();
    return locale ? [locale] : [];
  } catch {
    return [];
  }
};

export const resolveDeviceLanguage = async (): Promise<Language> => {
  const tags = [...(await fromExpoLocalization()), ...fromIntl()];

  for (const tag of tags) {
    const code = tag.split(/[-_]/)[0]?.toLowerCase();
    if (isLanguage(code)) return code;
  }
  return DEFAULT_LANGUAGE;
};
