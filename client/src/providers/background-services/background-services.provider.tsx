import { useAutoChaptersSync } from "../../hooks/background-services/use-auto-chapters-sync";

type Props = {
  children: JSX.Element;
};

export default function BackgroundServicesProvider({ children }: Props) {
  // Auto chapters sync service
  useAutoChaptersSync();

  return children;
}
