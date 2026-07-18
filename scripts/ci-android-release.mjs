import { readFileSync, writeFileSync } from "node:fs";

const GRADLE = "android/app/build.gradle";

const required = [
  "BEHIDE_KEYSTORE_PATH",
  "BEHIDE_KEYSTORE_PASSWORD",
  "BEHIDE_KEY_ALIAS",
  "BEHIDE_KEY_PASSWORD",
  "BEHIDE_VERSION_CODE",
];

const missing = required.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

let gradle = readFileSync(GRADLE, "utf8");

if (!/signingConfigs\s*\{/.test(gradle)) {
  console.error(`No signingConfigs block found in ${GRADLE}.`);
  process.exit(1);
}

gradle = gradle.replace(
  /signingConfigs\s*\{/,
  `signingConfigs {
        release {
            storeFile file(System.getenv("BEHIDE_KEYSTORE_PATH"))
            storePassword System.getenv("BEHIDE_KEYSTORE_PASSWORD")
            keyAlias System.getenv("BEHIDE_KEY_ALIAS")
            keyPassword System.getenv("BEHIDE_KEY_PASSWORD")
        }`,
);

const signed = gradle.replace(
  /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)signingConfig signingConfigs\.debug/,
  "$1signingConfig signingConfigs.release",
);

if (signed === gradle) {
  console.error("Could not point the release buildType at signingConfigs.release.");
  process.exit(1);
}
gradle = signed;

if (!/versionCode \d+/.test(gradle)) {
  console.error("Could not set versionCode.");
  process.exit(1);
}

gradle = gradle.replace(
  /versionCode \d+/,
  `versionCode ${process.env.BEHIDE_VERSION_CODE}`,
);

writeFileSync(GRADLE, gradle);

console.log(`Release signing wired, versionCode=${process.env.BEHIDE_VERSION_CODE}.`);
