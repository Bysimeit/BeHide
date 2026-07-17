import { Stack } from "expo-router";
import { colors } from "../../constants/theme";

const AuthLayout = () => (
  <Stack
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: colors.background },
    }}
  />
);

export default AuthLayout;
