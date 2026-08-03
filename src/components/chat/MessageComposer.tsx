import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, spacing } from "../../constants/theme";
import { useTranslate } from "../../i18n";

type MessageComposerProps = {
  onSend: (body: string) => void;
  onAttach: (body: string) => Promise<boolean>;
};

export const MessageComposer = ({ onSend, onAttach }: MessageComposerProps) => {
  const t = useTranslate();
  const [draft, setDraft] = useState("");
  const [attaching, setAttaching] = useState(false);
  const canSend = draft.trim().length > 0;

  const send = () => {
    if (!canSend) return;
    onSend(draft.trim());
    setDraft("");
  };

  const attach = async () => {
    if (attaching) return;
    setAttaching(true);
    try {
      if (await onAttach(draft.trim())) setDraft("");
    } finally {
      setAttaching(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => void attach()}
        disabled={attaching}
        accessibilityRole="button"
        accessibilityLabel={t("chat.attach")}
        style={({ pressed }) => [
          styles.attachButton,
          attaching && styles.disabled,
          pressed && styles.pressed,
        ]}
      >
        <Ionicons name="image-outline" size={22} color={colors.primary} />
      </Pressable>

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
          !canSend && styles.disabled,
          pressed && styles.pressed,
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
  attachButton: {
    width: 42,
    height: 42,
    marginRight: spacing(2),
    borderRadius: 21,
    backgroundColor: colors.composerField,
    alignItems: "center",
    justifyContent: "center",
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
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.75,
  },
});
