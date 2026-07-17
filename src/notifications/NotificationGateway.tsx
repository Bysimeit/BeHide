import { useCallback, useEffect, useRef } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "../auth/AuthContext";
import { useAppData } from "../data/store";
import {
  addNotificationResponseListener,
  getInitialNotificationTap,
} from "./push";

export const NotificationGateway = () => {
  const router = useRouter();
  const segments = useSegments();
  const { status } = useAuth();
  const { contacts } = useAppData();

  const pendingFrom = useRef<string | null>(null);

  const openConversation = useCallback(
    (from: string) => {
      const contact = contacts.find((c) => c.publicKey === from);
      if (!contact) return false;
      router.push({ pathname: "/chat/[id]", params: { id: contact.id } });
      return true;
    },
    [contacts, router],
  );

  useEffect(() => {
    void getInitialNotificationTap().then((tap) => {
      if (tap?.kind === "message") pendingFrom.current = tap.from;
    });
  }, []);

  useEffect(() => {
    return addNotificationResponseListener((tap) => {
      if (tap.kind !== "message") return;
      if (status === "unlocked" && openConversation(tap.from)) return;
      pendingFrom.current = tap.from;
    });
  }, [status, openConversation]);

  useEffect(() => {
    if (status !== "unlocked" || segments[0] === "(auth)") return;
    const from = pendingFrom.current;
    if (from && openConversation(from)) pendingFrom.current = null;
  }, [status, segments, contacts, openConversation]);

  return null;
};
