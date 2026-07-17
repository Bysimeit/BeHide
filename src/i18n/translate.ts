import { DEFAULT_LANGUAGE, type Language } from "./languages";
import { CATALOGS, type Catalog } from "./translations";

type Paths<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${Paths<T[K]>}`;
}[keyof T & string];

export type TranslationKey = Paths<Catalog>;

export type TranslationParams = Record<string, string | number>;

export type Translate = (
  key: TranslationKey,
  params?: TranslationParams,
) => string;

const resolve = (catalog: Catalog, key: string): string | null => {
  const node = key
    .split(".")
    .reduce<unknown>(
      (current, part) =>
        current && typeof current === "object"
          ? (current as Record<string, unknown>)[part]
          : undefined,
      catalog,
    );

  return typeof node === "string" ? node : null;
};

const interpolate = (template: string, params?: TranslationParams) =>
  params
    ? template.replace(/{(\w+)}/g, (match, name: string) =>
        name in params ? String(params[name]) : match,
      )
    : template;

export const createTranslator =
  (language: Language): Translate =>
  (key, params) => {
    const template =
      resolve(CATALOGS[language], key) ??
      resolve(CATALOGS[DEFAULT_LANGUAGE], key);
    return template ? interpolate(template, params) : key;
  };
