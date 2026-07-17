import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { AppText } from "../../components/ui/AppText";
import { Avatar } from "../../components/ui/Avatar";
import { colors, spacing } from "../../constants/theme";
import { useTranslate } from "../../i18n";
import type { Contact } from "../../types";
import { displayName } from "../../data/store";
import { useCall } from "../../call/CallContext";
import { formatClock } from "../../utils/datetime";

type ControlProps = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  active: boolean;
  onPress: () => void;
  accessibilityLabel: string;
};

const Control = ({
  icon,
  label,
  active,
  onPress,
  accessibilityLabel,
}: ControlProps) => (
  <View style={styles.control}>
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.controlButton,
        active && styles.controlButtonActive,
        pressed && styles.pressed,
      ]}
    >
      <Feather
        name={icon}
        size={22}
        color={active ? colors.primary : colors.textOnPrimary}
      />
    </Pressable>
    <AppText style={styles.controlLabel}>{label}</AppText>
  </View>
);

const CallEnded = ({ contact }: { contact: Contact }) => {
  const t = useTranslate();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 80,
    }).start();
  }, [anim]);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.body}>
        <Animated.View
          style={[styles.endedGroup, { opacity: anim, transform: [{ scale }] }]}
        >
          <View style={styles.endedIcon}>
            <Feather name="phone-off" size={34} color={colors.textOnPrimary} />
          </View>
          <AppText weight="bold" style={styles.name}>
            {displayName(contact)}
          </AppText>
          <AppText style={styles.status}>{t("call.ended")}</AppText>
        </Animated.View>
      </View>
    </View>
  );
};

const CallScreen = () => {
  const router = useRouter();
  const t = useTranslate();
  const insets = useSafeAreaInsets();
  const {
    call,
    endedCall,
    localStream,
    remoteStream,
    muted,
    cameraOn,
    remoteCameraOff,
    webrtc,
    accept,
    decline,
    hangup,
    toggleMute,
    toggleCamera,
  } = useCall();

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (call?.status !== "connected") return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [call?.status]);

  useEffect(() => {
    if (!call && !endedCall) router.back();
  }, [call, endedCall, router]);

  if (!call) {
    return endedCall ? <CallEnded contact={endedCall.contact} /> : null;
  }

  const { contact, status, direction, video } = call;
  const RTCView = webrtc?.RTCView;
  const incomingRinging = direction === "incoming" && status === "ringing";
  const showVideo = video && status === "connected";

  const remoteVisible =
    showVideo && !!remoteStream && !remoteCameraOff && !!RTCView;
  const showSelf = video && !!localStream && !!RTCView;

  const statusLabel =
    status === "connected"
      ? video
        ? t("call.video")
        : t("call.ongoing")
      : direction === "incoming"
        ? t("call.incoming")
        : t("call.ringing");

  const centerStatus =
    showVideo && remoteCameraOff ? t("call.remoteCameraOff") : statusLabel;

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      {}
      {remoteVisible && remoteStream && RTCView ? (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={StyleSheet.absoluteFill}
          objectFit="cover"
        />
      ) : null}

      {}
      {showSelf ? (
        <View style={[styles.selfView, { top: insets.top + spacing(3) }]}>
          {cameraOn && localStream && RTCView ? (
            <RTCView
              streamURL={localStream.toURL()}
              style={StyleSheet.absoluteFill}
              objectFit="cover"
              mirror
              zOrder={1}
            />
          ) : (
            <View style={styles.selfOff}>
              <Feather name="video-off" size={22} color={WHITE_75} />
            </View>
          )}
        </View>
      ) : null}

      {remoteVisible ? (
        <View style={[styles.infoPill, { top: insets.top + spacing(3) }]}>
          <AppText weight="semiBold" style={styles.pillName} numberOfLines={1}>
            {displayName(contact)}
          </AppText>
          <View style={styles.pillMetaRow}>
            <View style={styles.pillDot} />
            <AppText style={styles.pillMeta}>{formatClock(seconds)}</AppText>
            {muted && (
              <Feather
                name="mic-off"
                size={12}
                color={WHITE_75}
                style={styles.pillIcon}
              />
            )}
          </View>
        </View>
      ) : (
        <View style={styles.body}>
          <View style={styles.ring}>
            <Avatar
              size={128}
              firstName={contact.firstName}
              lastName={contact.lastName}
            />
          </View>

          <AppText weight="bold" style={styles.name}>
            {displayName(contact)}
          </AppText>
          <AppText style={styles.fingerprint}>{contact.fingerprint}</AppText>

          <View style={styles.statusRow}>
            <View style={styles.dot} />
            <AppText style={styles.status}>{centerStatus}</AppText>
          </View>
          {status === "connected" && (
            <AppText weight="semiBold" style={styles.clock}>
              {formatClock(seconds)}
            </AppText>
          )}
          {muted && <AppText style={styles.muteHint}>{t("call.muted")}</AppText>}
        </View>
      )}

      <View
        style={[styles.footer, { paddingBottom: insets.bottom + spacing(6) }]}
      >
        {incomingRinging ? (
          <View style={styles.answerRow}>
            <Pressable
              onPress={decline}
              accessibilityRole="button"
              accessibilityLabel={t("call.decline")}
              style={({ pressed }) => [styles.hangUp, pressed && styles.pressed]}
            >
              <Feather name="phone-off" size={26} color={colors.textOnPrimary} />
            </Pressable>
            <Pressable
              onPress={accept}
              accessibilityRole="button"
              accessibilityLabel={t("call.accept")}
              style={({ pressed }) => [styles.accept, pressed && styles.pressed]}
            >
              <Feather name="phone" size={26} color={colors.textOnPrimary} />
            </Pressable>
          </View>
        ) : (
          <View style={styles.controls}>
            <Control
              icon={muted ? "mic-off" : "mic"}
              label={t("call.mic")}
              active={muted}
              onPress={toggleMute}
              accessibilityLabel={muted ? t("call.unmute") : t("call.mute")}
            />

            <Pressable
              onPress={hangup}
              accessibilityRole="button"
              accessibilityLabel={t("call.hangup")}
              style={({ pressed }) => [styles.hangUp, pressed && styles.pressed]}
            >
              <Feather name="phone-off" size={26} color={colors.textOnPrimary} />
            </Pressable>

            {video ? (
              <Control
                icon={cameraOn ? "video" : "video-off"}
                label={t("call.camera")}
                active={!cameraOn}
                onPress={toggleCamera}
                accessibilityLabel={
                  cameraOn ? t("call.cameraOff") : t("call.cameraOn")
                }
              />
            ) : (
              <View style={styles.control} />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const WHITE_75 = "rgba(255, 255, 255, 0.75)";
const WHITE_15 = "rgba(255, 255, 255, 0.15)";
const SCRIM = "rgba(0, 0, 0, 0.45)";
const PILL_TINT = "rgba(0, 0, 0, 0.25)";
const HAIRLINE = "rgba(255, 255, 255, 0.22)";
const TEXT_SHADOW = "rgba(0, 0, 0, 0.6)";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  selfView: {
    position: "absolute",
    right: spacing(5),
    width: 100,
    height: 140,
    borderRadius: 16,
    zIndex: 2,
    overflow: "hidden",
    backgroundColor: WHITE_15,
    borderWidth: 1,
    borderColor: WHITE_15,
  },
  selfOff: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: SCRIM,
  },
  infoPill: {
    position: "absolute",
    left: spacing(5),
    zIndex: 1,
    maxWidth: "60%",
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(3.5),
    borderRadius: 18,
    backgroundColor: PILL_TINT,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIRLINE,
  },
  pillName: {
    fontSize: 15,
    letterSpacing: 0.2,
    color: colors.textOnPrimary,
    textShadowColor: TEXT_SHADOW,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  pillMetaRow: {
    marginTop: spacing(1),
    flexDirection: "row",
    alignItems: "center",
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing(1.5),
    backgroundColor: "#3FD07A",
  },
  pillMeta: {
    fontSize: 12,
    letterSpacing: 0.4,
    color: "rgba(255, 255, 255, 0.9)",
    fontVariant: ["tabular-nums"],
    textShadowColor: TEXT_SHADOW,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  pillIcon: {
    marginLeft: spacing(1.5),
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  endedGroup: {
    alignItems: "center",
  },
  endedIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: spacing(5),
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    padding: spacing(2),
    borderRadius: 999,
    backgroundColor: WHITE_15,
  },
  name: {
    marginTop: spacing(5),
    fontSize: 26,
    color: colors.textOnPrimary,
    textAlign: "center",
  },
  fingerprint: {
    marginTop: spacing(1),
    fontSize: 13,
    color: WHITE_75,
  },
  statusRow: {
    marginTop: spacing(6),
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing(2),
    backgroundColor: colors.textOnPrimary,
  },
  status: {
    fontSize: 14,
    color: WHITE_75,
  },
  clock: {
    marginTop: spacing(1),
    fontSize: 34,
    color: colors.textOnPrimary,
    fontVariant: ["tabular-nums"],
  },
  muteHint: {
    marginTop: spacing(2),
    fontSize: 13,
    color: WHITE_75,
  },
  footer: {
    marginTop: "auto",
    zIndex: 3,
    alignItems: "center",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  answerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  control: {
    alignItems: "center",
    marginHorizontal: spacing(4),
    width: 60,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: WHITE_15,
    alignItems: "center",
    justifyContent: "center",
  },
  controlButtonActive: {
    backgroundColor: colors.textOnPrimary,
  },
  controlLabel: {
    marginTop: spacing(1.5),
    fontSize: 12,
    color: WHITE_75,
  },
  hangUp: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginHorizontal: spacing(4),
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  accept: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginHorizontal: spacing(4),
    backgroundColor: "#2E9E5B",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.8,
  },
});

export default CallScreen;
