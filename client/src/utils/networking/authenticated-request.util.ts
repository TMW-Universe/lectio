import axios, { AxiosRequestConfig } from "axios";

type AuthenticatedOptions = {
  accessToken: string;
};

export const authenticatedRequest = async <T = unknown>(
  config: AxiosRequestConfig<T>,
  options: AuthenticatedOptions
) =>
  await axios.request<T>({
    ...config,
    headers: {
      authorization: `Bearer ${options.accessToken}`,
      ...config.headers,
    },
  });
