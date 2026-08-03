import { Linking } from "react-native";

export type BodySegment =
  | { kind: "text"; text: string }
  | { kind: "link"; text: string; url: string };

const BIDI = "\\u200e\\u200f\\u202a-\\u202e\\u2066-\\u2069";

const buildPattern = () =>
  new RegExp(`(?:https?://|www\\.)[^\\s<>"'${BIDI}]+`, "gi");

const SAFE_SCHEME = /^https?:\/\//i;

const CLOSERS: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
const PUNCTUATION = ".,;:!?«»\"'…";

const countOf = (text: string, character: string) =>
  text.split(character).length - 1;

const trimTrailing = (raw: string): string => {
  let text = raw;

  while (text.length > 0) {
    const last = text[text.length - 1];
    const opener = CLOSERS[last];

    if (opener) {
      if (countOf(text, last) <= countOf(text, opener)) break;
    } else if (!PUNCTUATION.includes(last)) {
      break;
    }

    text = text.slice(0, -1);
  }

  return text;
};

export const splitBody = (body: string): BodySegment[] => {
  const pattern = buildPattern();
  const segments: BodySegment[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(body)) !== null) {
    const text = trimTrailing(match[0]);
    if (text.length === 0) continue;

    if (match.index > cursor) {
      segments.push({ kind: "text", text: body.slice(cursor, match.index) });
    }

    segments.push({
      kind: "link",
      text,
      url: text.toLowerCase().startsWith("www.") ? `https://${text}` : text,
    });

    cursor = match.index + text.length;
    pattern.lastIndex = cursor;
  }

  if (cursor < body.length) {
    segments.push({ kind: "text", text: body.slice(cursor) });
  }

  return segments;
};

export const openLink = (url: string): void => {
  if (!SAFE_SCHEME.test(url)) return;
  void Linking.openURL(url).catch((error) =>
    console.warn("Ouverture du lien échouée :", error),
  );
};
