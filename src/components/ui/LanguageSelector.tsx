import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { colors, radius, spacing } from "../../constants/theme";
import {
  LANGUAGES,
  LANGUAGE_FLAGS,
  LANGUAGE_NAMES,
  useI18n,
  type LanguagePreference,
} from "../../i18n";
import { AppText } from "./AppText";

type OptionProps = {
  flag?: string;
  icon?: keyof typeof Feather.glyphMap;
  label: string;
  hint?: string;
  selected: boolean;
  onPress: () => void;
};

const Option = ({ flag, icon, label, hint, selected, onPress }: OptionProps) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityState={{ selected }}
    accessibilityLabel={label}
    style={({ pressed }) => [
      styles.option,
      selected && styles.optionSelected,
      pressed && styles.pressed,
    ]}
  >
    <View style={styles.optionIcon}>
      {flag ? (
        <AppText style={styles.optionFlag}>{flag}</AppText>
      ) : (
        <Feather name={icon ?? "globe"} size={17} color={colors.primary} />
      )}
    </View>

    <View style={styles.optionText}>
      <AppText weight="semiBold" style={styles.optionLabel}>
        {label}
      </AppText>
      {hint ? (
        <AppText muted style={styles.optionHint}>
          {hint}
        </AppText>
      ) : null}
    </View>

    {selected ? (
      <Feather name="check" size={18} color={colors.primary} />
    ) : null}
  </Pressable>
);

const LanguageSheet = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const insets = useSafeAreaInsets();
  const { t, preference, setPreference } = useI18n();

  const choose = (next: LanguagePreference) => {
    setPreference(next);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.sheetRoot}>
        <Pressable
          style={styles.backdrop}
          accessibilityRole="button"
          accessibilityLabel={t("common.close")}
          onPress={onClose}
        />

        <View
          style={[styles.sheet, { paddingBottom: insets.bottom + spacing(4) }]}
        >
          <View style={styles.handle} />

          <AppText weight="bold" style={styles.title}>
            {t("language.title")}
          </AppText>
          <AppText muted style={styles.subtitle}>
            {t("language.subtitle")}
          </AppText>

          <ScrollView
            style={styles.list}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Option
              icon="globe"
              label={t("language.system")}
              hint={t("language.systemHint")}
              selected={preference === "system"}
              onPress={() => choose("system")}
            />

            <View style={styles.separator} />

            {LANGUAGES.map((language) => (
              <Option
                key={language}
                flag={LANGUAGE_FLAGS[language]}
                label={LANGUAGE_NAMES[language]}
                selected={preference === language}
                onPress={() => choose(language)}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export const LanguagePill = () => {
  const [open, setOpen] = useState(false);
  const { t, language } = useI18n();

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={t("language.open")}
        style={({ pressed }) => [styles.pill, pressed && styles.pressed]}
      >
        <AppText style={styles.pillFlag}>{LANGUAGE_FLAGS[language]}</AppText>
        <AppText weight="medium" style={styles.pillLabel}>
          {LANGUAGE_NAMES[language]}
        </AppText>
        <Feather name="chevron-down" size={14} color={colors.textMuted} />
      </Pressable>

      <LanguageSheet visible={open} onClose={() => setOpen(false)} />
    </>
  );
};

export const LanguageButton = () => {
  const [open, setOpen] = useState(false);
  const { t, language } = useI18n();

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={t("language.current", {
          name: LANGUAGE_NAMES[language],
        })}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <AppText style={styles.buttonFlag}>{LANGUAGE_FLAGS[language]}</AppText>
        <Feather name="chevron-down" size={13} color={colors.textMuted} />
      </Pressable>

      <LanguageSheet visible={open} onClose={() => setOpen(false)} />
    </>
  );
};

const styles = StyleSheet.create({
  pill: {
    alignSelf: "center",
    paddingLeft: spacing(3),
    paddingRight: spacing(2.5),
    height: 38,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.overlay,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
  },
  pillFlag: {
    fontSize: 15,
  },
  pillLabel: {
    marginHorizontal: spacing(2),
    fontSize: 13,
  },
  button: {
    paddingLeft: spacing(2.5),
    paddingRight: spacing(1.5),
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonFlag: {
    marginRight: spacing(1),
    fontSize: 17,
  },
  pressed: {
    opacity: 0.7,
  },
  sheetRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  sheet: {
    paddingTop: spacing(2),
    paddingHorizontal: spacing(5),
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.overlay,
  },
  title: {
    marginTop: spacing(4),
    fontSize: 20,
  },
  subtitle: {
    marginTop: spacing(1),
    fontSize: 13,
  },
  list: {
    marginTop: spacing(3),
  },
  option: {
    paddingVertical: spacing(2.5),
    paddingHorizontal: spacing(2),
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
  },
  optionSelected: {
    backgroundColor: colors.background,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: spacing(3),
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  optionFlag: {
    fontSize: 18,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 15,
  },
  optionHint: {
    marginTop: spacing(0.25),
    fontSize: 12,
  },
  separator: {
    marginVertical: spacing(1.5),
    height: 1,
    backgroundColor: colors.overlay,
  },
});
