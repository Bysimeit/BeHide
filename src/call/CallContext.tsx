import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AppState } from "react-native";
import * as Crypto from "expo-crypto";
import { useRouter } from "expo-router";
import type {
  MediaStream,
  RTCPeerConnection,
} from "react-native-webrtc";
import type { Contact } from "../types";
import { useTranslate } from "../i18n";
import { displayName, useAppData } from "../data/store";
import { presentCallNotification } from "../notifications/push";
import type { CallSignal } from "../p2p/signaling";
import { ICE_SERVERS, isCallSupported, loadWebRTC, type WebRTC } from "../p2p/webrtc";

const END_ANIMATION_MS = 1500;

type RTCPeerConnectionEvents = {
  addEventListener(
    type: "icecandidate",
    listener: (event: {
      candidate: {
        candidate: string;
        sdpMLineIndex: number | null;
        sdpMid: string | null;
      } | null;
    }) => void,
  ): void;
  addEventListener(
    type: "track",
    listener: (event: { streams: MediaStream[] }) => void,
  ): void;
  addEventListener(type: "connectionstatechange", listener: () => void): void;
};

export type CallStatus = "calling" | "ringing" | "connected" | "ended";

export type ActiveCall = {
  callId: string;
  contact: Contact;
  video: boolean;
  direction: "outgoing" | "incoming";
  status: CallStatus;
};

export type EndedCall = { contact: Contact; video: boolean };

type CallContextValue = {
  call: ActiveCall | null;
  endedCall: EndedCall | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  muted: boolean;
  cameraOn: boolean;
  remoteCameraOff: boolean;
  webrtc: WebRTC | null;
  startCall: (contactId: string, video: boolean) => boolean;
  accept: () => void;
  decline: () => void;
  hangup: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
};

const CallContext = createContext<CallContextValue | null>(null);

export const CallProvider = ({ children }: { children: ReactNode }) => {
  const t = useTranslate();
  const { contactById, sendSignal, onSignal, logCall } = useAppData();
  const router = useRouter();

  const [call, setCall] = useState<ActiveCall | null>(null);
  const [endedCall, setEndedCall] = useState<EndedCall | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [remoteCameraOff, setRemoteCameraOff] = useState(false);
  const [webrtc, setWebrtc] = useState<WebRTC | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localRef = useRef<MediaStream | null>(null);
  const callRef = useRef<ActiveCall | null>(null);
  const rtcRef = useRef<WebRTC | null>(null);
  const pendingOffer = useRef<{ sdp: string } | null>(null);
  const pendingCandidates = useRef<unknown[]>([]);
  const connectedAt = useRef<number | null>(null);
  const endTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sendSignalRef = useRef(sendSignal);
  sendSignalRef.current = sendSignal;
  callRef.current = call;

  const setStatus = useCallback((status: CallStatus) => {
    setCall((current) => (current ? { ...current, status } : current));
  }, []);

  const teardown = useCallback(
    (log: boolean) => {
      const active = callRef.current;
      callRef.current = null;
      if (!active) return;
      const { contact, video } = active;

      pcRef.current?.close();
      pcRef.current = null;
      localRef.current?.getTracks().forEach((track) => track.stop());
      localRef.current = null;

      if (log && connectedAt.current) {
        const seconds = Math.round((Date.now() - connectedAt.current) / 1000);
        if (seconds > 0) logCall(contact.id, seconds, video);
      }
      connectedAt.current = null;
      pendingOffer.current = null;
      pendingCandidates.current = [];

      setLocalStream(null);
      setRemoteStream(null);
      setMuted(false);
      setCameraOn(true);
      setRemoteCameraOff(false);
      setCall(null);

      setEndedCall({ contact, video });
      if (endTimer.current) clearTimeout(endTimer.current);
      endTimer.current = setTimeout(() => setEndedCall(null), END_ANIMATION_MS);
    },
    [logCall],
  );

  useEffect(() => {
    return () => {
      if (endTimer.current) clearTimeout(endTimer.current);
    };
  }, []);

  const setupPeer = useCallback(
    async (rtc: WebRTC, contact: Contact, callId: string, video: boolean) => {
      const pc = new rtc.RTCPeerConnection({ iceServers: ICE_SERVERS });
      pcRef.current = pc;

      const stream = await rtc.mediaDevices.getUserMedia({
        audio: true,
        video,
      });
      localRef.current = stream;
      setLocalStream(stream);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const events = pc as unknown as RTCPeerConnectionEvents;

      events.addEventListener("icecandidate", (event) => {
        const candidate = event.candidate;
        if (candidate) {
          sendSignalRef.current(contact.id, {
            type: "candidate",
            callId,
            candidate: {
              candidate: candidate.candidate,
              sdpMLineIndex: candidate.sdpMLineIndex,
              sdpMid: candidate.sdpMid,
            },
          });
        }
      });

      events.addEventListener("track", (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
        }
      });

      events.addEventListener("connectionstatechange", () => {
        const state = pc.connectionState;
        if (state === "connected") {
          if (!connectedAt.current) connectedAt.current = Date.now();
          setStatus("connected");
        } else if (
          state === "failed" ||
          state === "closed" ||
          state === "disconnected"
        ) {
          teardown(true);
        }
      });

      return pc;
    },
    [setStatus, teardown],
  );

  const flushCandidates = useCallback(async (rtc: WebRTC) => {
    const pc = pcRef.current;
    if (!pc) return;
    const pending = pendingCandidates.current;
    pendingCandidates.current = [];
    for (const init of pending) {
      try {
        await pc.addIceCandidate(new rtc.RTCIceCandidate(init as never));
      } catch {
      }
    }
  }, []);

  const startCall = useCallback(
    (contactId: string, video: boolean): boolean => {
      if (!isCallSupported) return false;
      const contact = contactById(contactId);
      if (!contact || callRef.current) return false;

      if (endTimer.current) clearTimeout(endTimer.current);
      setEndedCall(null);

      const callId = Crypto.randomUUID();
      setCall({ callId, contact, video, direction: "outgoing", status: "calling" });

      void (async () => {
        const rtc = await loadWebRTC();
        if (!rtc) {
          teardown(false);
          return;
        }
        rtcRef.current = rtc;
        setWebrtc(rtc);

        const pc = await setupPeer(rtc, contact, callId, video);
        const offer = await pc.createOffer({});
        await pc.setLocalDescription(offer);
        sendSignalRef.current(contact.id, {
          type: "offer",
          callId,
          video,
          sdp: offer.sdp ?? "",
        });
      })();

      return true;
    },
    [contactById, setupPeer, teardown],
  );

  const accept = useCallback(() => {
    const current = callRef.current;
    const offer = pendingOffer.current;
    if (!current || current.direction !== "incoming" || !offer) return;

    void (async () => {
      const rtc = await loadWebRTC();
      if (!rtc) {
        teardown(false);
        return;
      }
      rtcRef.current = rtc;
      setWebrtc(rtc);

      const pc = await setupPeer(
        rtc,
        current.contact,
        current.callId,
        current.video,
      );
      await pc.setRemoteDescription(
        new rtc.RTCSessionDescription({ type: "offer", sdp: offer.sdp }),
      );
      await flushCandidates(rtc);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      sendSignalRef.current(current.contact.id, {
        type: "answer",
        callId: current.callId,
        sdp: answer.sdp ?? "",
      });
    })();
  }, [setupPeer, flushCandidates, teardown]);

  const decline = useCallback(() => {
    const current = callRef.current;
    if (current) {
      sendSignalRef.current(current.contact.id, {
        type: "hangup",
        callId: current.callId,
      });
    }
    teardown(false);
  }, [teardown]);

  const hangup = useCallback(() => {
    const current = callRef.current;
    if (current) {
      sendSignalRef.current(current.contact.id, {
        type: "hangup",
        callId: current.callId,
      });
    }
    teardown(true);
  }, [teardown]);

  const toggleMute = useCallback(() => {
    const stream = localRef.current;
    if (!stream) return;
    const next = !muted;
    stream.getAudioTracks().forEach((track) => (track.enabled = !next));
    setMuted(next);
  }, [muted]);

  const toggleCamera = useCallback(() => {
    const stream = localRef.current;
    const current = callRef.current;
    if (!stream) return;
    const next = !cameraOn;
    stream.getVideoTracks().forEach((track) => (track.enabled = next));
    setCameraOn(next);
    if (current) {
      sendSignalRef.current(current.contact.id, {
        type: "camera",
        callId: current.callId,
        on: next,
      });
    }
  }, [cameraOn]);

  useEffect(() => {
    const unsubscribe = onSignal((from, signal) => {
      void handleSignal(from, signal);
    });

    const handleSignal = async (from: Contact, signal: CallSignal) => {
      const current = callRef.current;

      if (signal.type === "offer") {
        if (current) {
          sendSignalRef.current(from.id, {
            type: "hangup",
            callId: signal.callId,
          });
          return;
        }
        pendingOffer.current = { sdp: signal.sdp };
        if (endTimer.current) clearTimeout(endTimer.current);
        setEndedCall(null);
        setRemoteCameraOff(false);
        setCall({
          callId: signal.callId,
          contact: from,
          video: signal.video,
          direction: "incoming",
          status: "ringing",
        });
        router.push({ pathname: "/call/[id]", params: { id: from.id } });
        if (AppState.currentState !== "active") {
          void presentCallNotification(
            from.publicKey,
            displayName(from),
            signal.video
              ? t("notifications.incomingVideoCall")
              : t("notifications.incomingCall"),
          );
        }
        return;
      }

      if (!current || current.callId !== signal.callId) return;

      if (signal.type === "answer") {
        const rtc = rtcRef.current;
        const pc = pcRef.current;
        if (!rtc || !pc) return;
        await pc.setRemoteDescription(
          new rtc.RTCSessionDescription({ type: "answer", sdp: signal.sdp }),
        );
        await flushCandidates(rtc);
      } else if (signal.type === "candidate") {
        const rtc = rtcRef.current;
        const pc = pcRef.current;
        if (rtc && pc && pc.remoteDescription) {
          try {
            await pc.addIceCandidate(new rtc.RTCIceCandidate(signal.candidate as never));
          } catch {
          }
        } else {
          pendingCandidates.current.push(signal.candidate);
        }
      } else if (signal.type === "camera") {
        setRemoteCameraOff(!signal.on);
      } else if (signal.type === "hangup") {
        teardown(true);
      }
    };

    return unsubscribe;
  }, [onSignal, router, flushCandidates, teardown, t]);

  const value = useMemo(
    () => ({
      call,
      endedCall,
      localStream,
      remoteStream,
      muted,
      cameraOn,
      remoteCameraOff,
      webrtc,
      startCall,
      accept,
      decline,
      hangup,
      toggleMute,
      toggleCamera,
    }),
    [
      call,
      endedCall,
      localStream,
      remoteStream,
      muted,
      cameraOn,
      remoteCameraOff,
      webrtc,
      startCall,
      accept,
      decline,
      hangup,
      toggleMute,
      toggleCamera,
    ],
  );

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall doit être utilisé dans un <CallProvider>.");
  }
  return context;
};
