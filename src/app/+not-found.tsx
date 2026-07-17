import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import { Screen } from "../components/ui/Screen";
import { AppText } from "../components/ui/AppText";
import { colors, spacing } from "../constants/theme";
import { useTranslate } from "../i18n";

const NotFoundScreen = () => {
  const t = useTranslate();

  return (
    <Screen style={styles.container}>
      <AppText weight="semiBold" style={styles.title}>
        {t("notFound.title")}
      </AppText>
      <Link href="/" style={styles.link}>
        <AppText weight="medium" style={styles.linkText}>
          {t("notFound.link")}
        </AppText>
      </Link>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
  },
  link: {
    marginTop: spacing(3),
  },
  linkText: {
    color: colors.primary,
  },
});

export default NotFoundScreen;
