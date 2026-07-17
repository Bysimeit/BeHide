import type { Language } from "../languages";
import { fr, type Catalog } from "./fr";
import { en } from "./en";
import { nl } from "./nl";
import { de } from "./de";
import { es } from "./es";

export type { Catalog };

export const CATALOGS: Record<Language, Catalog> = { fr, en, nl, de, es };
