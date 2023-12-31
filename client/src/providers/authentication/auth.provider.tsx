import TmwuAuthProvider from "@tmw-universe/react-tmw-universe-authentication-utils/dist/providers/tmwu-auth.provider";
import { useTranslation } from "react-i18next";
import { ThemeContextType, useTheme } from "../theming/theme.provider";

type Props = {
  children: JSX.Element;
};

export default function AuthProvider({ children }: Props) {
  const { i18n } = useTranslation();

  const { setTheme } = useTheme();

  return (
    <TmwuAuthProvider
      options={{
        authClient: import.meta.env.VITE_AUTH_CLIENT_HOST,
        authHost: import.meta.env.VITE_AUTH_HOST,
        onAccountChange: (account) => {
          if (account) {
            if (account?.preferences?.language) {
              i18n.changeLanguage(account.preferences.language);
            }

            const theme: Partial<ThemeContextType> = {};

            if (account.preferences?.color) {
              theme.primaryColor = account.preferences.color;
            }

            if (account.preferences?.theme) {
              theme.theme = account.preferences.theme;
            }

            setTheme(theme);
          }
        },
      }}
    >
      {children}
    </TmwuAuthProvider>
  );
}
