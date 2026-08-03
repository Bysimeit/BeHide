import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import type { Message } from "../types";
import { revealMedia } from "./files";

export type MediaSource =
  | { status: "loading" }
  | { status: "ready"; uri: string }
  | { status: "missing" };

type Resolved = { id: string; uri: string | null };

export const useMediaSource = (message: Message | null): MediaSource => {
  const { storageKey } = useAuth();
  const [resolved, setResolved] = useState<Resolved | null>(null);

  const id = message?.id ?? null;
  const mime = message?.media?.mime ?? null;
  const settled = message?.mediaStatus === "ready";

  useEffect(() => {
    if (!id || !mime || !settled) return;

    const key = storageKey();
    let cancelled = false;

    void (key ? revealMedia(key, id, mime) : Promise.resolve(null))
      .then((uri) => {
        if (!cancelled) setResolved({ id, uri });
      })
      .catch(() => {
        if (!cancelled) setResolved({ id, uri: null });
      });

    return () => {
      cancelled = true;
    };
  }, [id, mime, settled, storageKey]);

  if (!id || !mime || !settled || resolved?.id !== id) {
    return { status: "loading" };
  }
  return resolved.uri
    ? { status: "ready", uri: resolved.uri }
    : { status: "missing" };
};
