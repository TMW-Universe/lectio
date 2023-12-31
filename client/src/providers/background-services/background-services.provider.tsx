import { useTwmuAccount } from "@tmw-universe/react-tmw-universe-authentication-utils";
import { useAutoChaptersSync } from "../../hooks/background-services/use-auto-chapters-sync";

type Props = {
  children: JSX.Element;
};

export default function BackgroundServicesProvider({ children }: Props) {
  const { isAuthenticated } = useTwmuAccount();

  if (!isAuthenticated) return children;

  return <ChaptersSync>{children}</ChaptersSync>;
}

const ChaptersSync = ({ children }: Props) => {
  useAutoChaptersSync();

  return children;
};
