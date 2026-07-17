import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";

const DATA_DIR = resolve(process.env.DATA_DIR ?? "data");
const FILE = resolve(DATA_DIR, "state.json");
const TMP = FILE + ".tmp";
const SAVE_DELAY = 200;

export const createPersistence = () => {
  const queues = new Map();
  const tokens = new Map();

  if (existsSync(FILE)) {
    try {
      const raw = JSON.parse(readFileSync(FILE, "utf8"));
      for (const [key, value] of Object.entries(raw.queues ?? {})) {
        queues.set(key, value);
      }
      for (const [key, value] of Object.entries(raw.tokens ?? {})) {
        tokens.set(key, value);
      }
      console.log(
        `State restored: ${queues.size} pending queue(s), ${tokens.size} token(s).`,
      );
    } catch {
      console.warn("Unreadable state file: starting from an empty state.");
    }
  }

  let timer = null;

  const writeNow = () => {
    mkdirSync(DATA_DIR, { recursive: true });
    const data = {
      queues: Object.fromEntries(queues),
      tokens: Object.fromEntries(tokens),
    };
    writeFileSync(TMP, JSON.stringify(data));
    renameSync(TMP, FILE);
  };

  const save = () => {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      try {
        writeNow();
      } catch (error) {
        console.error("Persistence failed:", error.message);
      }
    }, SAVE_DELAY);
  };

  const flush = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    try {
      writeNow();
    } catch (error) {
      console.error("Final persistence failed:", error.message);
    }
  };

  return { queues, tokens, save, flush };
};
