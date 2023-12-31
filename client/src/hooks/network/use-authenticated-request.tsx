import { useTwmuAccount } from "@tmw-universe/react-tmw-universe-authentication-utils";
import { AxiosRequestConfig } from "axios";
import { authenticatedRequest } from "../../utils/networking/authenticated-request.util";
import { ObjectSchema } from "yup";

type RequestOptions<T extends object> = {
  schema?: ObjectSchema<T>;
};

export function useAuthenticatedRequest() {
  const { isAuthenticated, accessToken } = useTwmuAccount();

  if (!isAuthenticated) throw new Error("Authentication error.");

  return {
    request: async <T extends object = object>(
      config: AxiosRequestConfig<T>,
      options?: RequestOptions<T>
    ) => {
      const res = await authenticatedRequest<T>(config, {
        accessToken,
      });

      if (options?.schema)
        return {
          ...res,
          data: options.schema.cast(res.data),
        };
      return res;
    },
  };
}
