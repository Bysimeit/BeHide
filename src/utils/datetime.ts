import { LANGUAGE_LOCALES, type Language } from "../i18n/languages";
import type { Translate } from "../i18n/translate";

export const EVENING_STARTS_AT_HOUR = 18;

type FormatKind = "time" | "date" | "dayHeader";

const OPTIONS: Record<FormatKind, Intl.DateTimeFormatOptions> = {
  time: { hour: "2-digit", minute: "2-digit" },
  date: { day: "numeric", month: "long", year: "numeric" },
  dayHeader: { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" },
};

const formatters = new Map<string, Intl.DateTimeFormat>();

const formatter = (language: Language, kind: FormatKind) => {
  const cacheKey = `${language}:${kind}`;
  const cached = formatters.get(cacheKey);
  if (cached) return cached;

  const created = new Intl.DateTimeFormat(
    LANGUAGE_LOCALES[language],
    OPTIONS[kind],
  );
  formatters.set(cacheKey, created);
  return created;
};

const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

const isYesterday = (date: Date, now: Date) => {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  return isSameDay(date, yesterday);
};

export const greeting = (name: string, t: Translate, now = new Date()) =>
  now.getHours() >= EVENING_STARTS_AT_HOUR
    ? t("home.greetingEvening", { name })
    : t("home.greetingDay", { name });

export const formatTime = (iso: string, language: Language) =>
  formatter(language, "time").format(new Date(iso));

export const formatDate = (iso: string, language: Language) =>
  formatter(language, "date").format(new Date(iso));

export const formatRelativeDateTime = (
  iso: string,
  language: Language,
  t: Translate,
  now = new Date(),
) => {
  const date = new Date(iso);
  const time = formatTime(iso, language);

  if (isSameDay(date, now)) return t("datetime.todayAt", { time });
  if (isYesterday(date, now)) return t("datetime.yesterdayAt", { time });
  return t("datetime.dateAt", { date: formatDate(iso, language), time });
};

export const formatDayHeader = (iso: string, language: Language) => {
  const label = formatter(language, "dayHeader")
    .format(new Date(iso))
    .replace(/,?\s+/, " - ");
  return label.charAt(0).toUpperCase() + label.slice(1);
};

export const formatClock = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
};

export const formatDuration = (seconds: number, t: Translate) => {
  if (seconds < 60) return t("datetime.seconds", { count: seconds });
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest === 0
    ? t("datetime.minutes", { count: minutes })
    : t("datetime.minutesSeconds", { minutes, seconds: rest });
};

export const dayKey = (iso: string) => new Date(iso).toDateString();
