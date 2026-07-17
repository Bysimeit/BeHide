import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const sdk =
  process.env.ANDROID_HOME ??
  process.env.ANDROID_SDK_ROOT ??
  join(process.env.LOCALAPPDATA ?? "", "Android", "Sdk");
const adb = join(
  sdk,
  "platform-tools",
  process.platform === "win32" ? "adb.exe" : "adb",
);
const APK = join(
  "android",
  "app",
  "build",
  "outputs",
  "apk",
  "debug",
  "app-debug.apk",
);
const PKG = "be.behide.app";
const METRO_URL = "http://localhost:8081";
const DEEP_LINK = `behide://expo-development-client/?url=${encodeURIComponent(METRO_URL)}`;

if (!existsSync(adb)) {
  console.error(`adb not found (${adb}). Check ANDROID_HOME.`);
  process.exit(1);
}
if (!existsSync(APK)) {
  console.error(`APK not found (${APK}).\nBuild it first: npx expo run:android`);
  process.exit(1);
}

const run = (args, opts = {}) =>
  execSync(`"${adb}" ${args}`, { stdio: "inherit", ...opts });

const devices = execSync(`"${adb}" devices`)
  .toString()
  .split("\n")
  .slice(1)
  .map((line) => line.trim().split(/\s+/))
  .filter(([id, state]) => id && state === "device")
  .map(([id]) => id);

if (devices.length === 0) {
  console.error("No device connected (`adb devices` is empty).");
  process.exit(1);
}

console.log(`Devices: ${devices.join(", ")}\n`);

for (const id of devices) {
  console.log(`- ${id}: installing...`);
  run(`-s ${id} install -r "${APK}"`);
  try {
    execSync(`"${adb}" -s ${id} reverse tcp:8081 tcp:8081`, { stdio: "ignore" });
  } catch {
  }
  execSync(
    `"${adb}" -s ${id} shell am start -a android.intent.action.VIEW -d "${DEEP_LINK}"`,
    { stdio: "ignore" },
  );
  console.log(`  launched on ${id} (connected to Metro)`);
}

console.log(`\nDeployed on ${devices.length} device(s).`);
