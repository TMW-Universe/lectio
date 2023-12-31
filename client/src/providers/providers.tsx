import AuthProvider from "./authentication/auth.provider";
import BackgroundServicesProvider from "./background-services/background-services.provider";
import DatabaseProvider from "./database/database.provider";
import NetworkingProvider from "./networking/networking.provider";
import ThemeProvider from "./theming/theme.provider";

type Props = {
  children: JSX.Element;
};

export default function Providers({ children }: Props) {
  return (
    <DatabaseProvider>
      <ThemeProvider>
        <AuthProvider>
          <NetworkingProvider>
            <BackgroundServicesProvider>{children}</BackgroundServicesProvider>
          </NetworkingProvider>
        </AuthProvider>
      </ThemeProvider>
    </DatabaseProvider>
  );
}
