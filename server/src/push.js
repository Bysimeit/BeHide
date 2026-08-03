const EXPO_PUSH_URL =
  process.env.EXPO_PUSH_URL ?? "https://exp.host/--/api/v2/push/send";
const COOLDOWN_MS = 5000;

const lastPush = new Map();

export const notify = async (publicKey, token) => {
  if (!token) return;

  const now = Date.now();
  if (now - (lastPush.get(publicKey) ?? 0) < COOLDOWN_MS) return;
  lastPush.set(publicKey, now);

  try {
    await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify([
        {
          to: token,
          body: "New message. Open BeHide to read it.",
          sound: "default",
          priority: "high",
          data: { from: publicKey },
        },
      ]),
    });
  } catch (error) {
    console.error("Push send failed:", error.message);
  }
};
