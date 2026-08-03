import { requireOptionalNativeModule } from "expo-modules-core";
import {
  MAX_MEDIA_BYTES,
  MEDIA_IMAGE_QUALITY,
  MEDIA_VIDEO_MAX_SECONDS,
} from "../constants/config";
import type { MediaKind } from "../types";
import { sourceInfo } from "./files";

export type PickedMedia = {
  uri: string;
  kind: MediaKind;
  mime: string;
  bytes: number;
  width: number;
  height: number;
  durationMs?: number;
};

export type PickSource = "library" | "camera";

export type PickOutcome =
  | { status: "picked"; media: PickedMedia }
  | { status: "cancelled" }
  | { status: "unavailable" }
  | { status: "denied" }
  | { status: "unreadable" }
  | { status: "too-large"; bytes: number };

type ImagePicker = typeof import("expo-image-picker");

let imagePicker: ImagePicker | null = null;

export const isPickerSupported = () =>
  requireOptionalNativeModule("ExponentImagePicker") !== null;

const loadPicker = async (): Promise<ImagePicker | null> => {
  if (imagePicker) return imagePicker;
  if (!isPickerSupported()) return null;
  try {
    const picker = await import("expo-image-picker");
    imagePicker = picker;
    return picker;
  } catch (error) {
    console.warn("Sélecteur de médias indisponible :", error);
    return null;
  }
};

const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  heic: "image/heic",
  heif: "image/heif",
  mp4: "video/mp4",
  mov: "video/quicktime",
  mkv: "video/x-matroska",
  webm: "video/webm",
  "3gp": "video/3gpp",
};

const guessMime = (uri: string, kind: MediaKind) => {
  const extension = uri.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  return (
    MIME_BY_EXTENSION[extension] ?? (kind === "video" ? "video/mp4" : "image/jpeg")
  );
};

export const pickMedia = async (source: PickSource): Promise<PickOutcome> => {
  const picker = await loadPicker();
  if (!picker) return { status: "unavailable" };

  const options: import("expo-image-picker").ImagePickerOptions = {
    mediaTypes: ["images", "videos"],
    quality: MEDIA_IMAGE_QUALITY,
    videoMaxDuration: MEDIA_VIDEO_MAX_SECONDS,
    allowsMultipleSelection: false,
    exif: false,
  };

  let result: import("expo-image-picker").ImagePickerResult;
  try {
    if (source === "camera") {
      const permission = await picker.requestCameraPermissionsAsync();
      if (!permission.granted) return { status: "denied" };
      result = await picker.launchCameraAsync(options);
    } else {
      result = await picker.launchImageLibraryAsync(options);
    }
  } catch (error) {
    console.warn("Sélection de média échouée :", error);
    return { status: "unavailable" };
  }

  if (result.canceled) return { status: "cancelled" };

  const asset = result.assets[0];
  if (!asset) return { status: "cancelled" };

  const kind: MediaKind = asset.type === "video" ? "video" : "image";
  const info = await sourceInfo(asset.uri);
  const bytes = asset.fileSize ?? info?.bytes ?? 0;

  if (bytes === 0) return { status: "unreadable" };
  if (bytes > MAX_MEDIA_BYTES) return { status: "too-large", bytes };

  return {
    status: "picked",
    media: {
      uri: asset.uri,
      kind,
      mime: asset.mimeType ?? guessMime(asset.uri, kind),
      bytes,
      width: asset.width,
      height: asset.height,
      durationMs: asset.duration ?? undefined,
    },
  };
};
