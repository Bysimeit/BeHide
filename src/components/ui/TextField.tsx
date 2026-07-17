import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";
import { colors, fonts, radius, spacing } from "../../constants/theme";
import { AppText } from "./AppText";

type TextFieldProps = TextInputProps & {
  label: string;
  hint?: string;
  error?: string | null;
};

export const TextField = ({
  label,
  hint,
  error,
  style,
  ...props
}: TextFieldProps) => (
  <View style={styles.container}>
    <AppText weight="semiBold" style={styles.label}>
      {label}
    </AppText>

    <TextInput
      style={[styles.input, !!error && styles.inputError, style]}
      placeholderTextColor={colors.textMuted}
      accessibilityLabel={label}
      {...props}
    />

    {error ? (
      <AppText style={styles.error}>{error}</AppText>
    ) : hint ? (
      <AppText muted style={styles.hint}>
        {hint}
      </AppText>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing(4),
  },
  label: {
    marginBottom: spacing(1.5),
    fontSize: 14,
  },
  input: {
    height: 50,
    paddingHorizontal: spacing(4),
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: colors.surface,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  inputError: {
    borderColor: colors.danger,
  },
  hint: {
    marginTop: spacing(1),
    paddingHorizontal: spacing(2),
    fontSize: 12,
  },
  error: {
    marginTop: spacing(1),
    paddingHorizontal: spacing(2),
    fontSize: 12,
    color: colors.danger,
  },
});
