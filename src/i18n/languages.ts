export const LANGUAGES = ["fr", "en", "nl", "de", "es"] as const;

export type Language = (typeof LANGUAGES)[number];

export type LanguagePreference = Language | "system";

export const DEFAULT_LANGUAGE: Language = "fr";

export const LANGUAGE_NAMES: Record<Language, string> = {
  fr: "Français",
  en: "English",
  nl: "Nederlands",
  de: "Deutsch",
  es: "Español",
};

export const LANGUAGE_FLAGS: Record<Language, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
  nl: "🇳🇱",
  de: "🇩🇪",
  es: "🇪🇸",
};

export const LANGUAGE_LOCALES: Record<Language, string> = {
  fr: "fr-FR",
  en: "en-GB",
  nl: "nl-NL",
  de: "de-DE",
  es: "es-ES",
};

export const isLanguage = (value: unknown): value is Language =>
  typeof value === "string" && (LANGUAGES as readonly string[]).includes(value);

export const isLanguagePreference = (
  value: unknown,
): value is LanguagePreference => value === "system" || isLanguage(value);
