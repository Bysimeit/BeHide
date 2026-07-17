import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, spacing } from "../../constants/theme";
import { useTranslate } from "../../i18n";

type MessageComposerProps = {
  onSend: (body: string) => void;
};

export const MessageComposer = ({ onSend }: MessageComposerProps) => {
  const t = useTranslate();
  const [draft, setDraft] = useState("");
  const canSend = draft.trim().length > 0;

  const send = () => {
    if (!canSend) return;
    onSend(draft.trim());
    setDraft("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={draft}
        onChangeText={setDraft}
        onSubmitEditing={send}
        multiline
        placeholder={t("chat.composerPlaceholder")}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={t("chat.composerLabel")}
      />
      <Pressable
        onPress={send}
        disabled={!canSend}
        accessibilityRole="button"
        accessibilityLabel={t("chat.send")}
        style={({ pressed }) => [
          styles.sendButton,
          !canSend && styles.sendButtonDisabled,
          pressed && styles.sendButtonPressed,
        ]}
      >
        <Ionicons
          name="paper-plane-outline"
          size={22}
          color={colors.textOnPrimary}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2.5),
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    backgroundColor: colors.composer,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    maxHeight: 110,
    minHeight: 42,
    paddingHorizontal: spacing(4),
    paddingTop: spacing(2.5),
    paddingBottom: spacing(2.5),
    borderRadius: radius.lg,
    backgroundColor: colors.composerField,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  sendButton: {
    width: 42,
    height: 42,
    marginLeft: spacing(2),
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonPressed: {
    opacity: 0.75,
  },
});
