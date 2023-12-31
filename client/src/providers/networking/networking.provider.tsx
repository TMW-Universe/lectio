import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DataFetchProvider from "./data-fetch.provider";

type Props = {
  children: JSX.Element | JSX.Element[];
};
const queryClient = new QueryClient();

export default function NetworkingProvider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <DataFetchProvider queryClient={queryClient}>
        {children}
      </DataFetchProvider>
    </QueryClientProvider>
  );
}
