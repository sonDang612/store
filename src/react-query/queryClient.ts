import { message } from "antd";
import { AxiosError } from "axios";
import { QueryClient } from "react-query";

function queryErrorHandler(error: unknown): void {
  let title = "error connecting to server";

  if (error instanceof AxiosError<Error>) {
    title =
      error.response && error.response.data
        ? error.response.data.message
        : error.message;
  }
  message.error(`Error: ${title}`);
  console.log("\x1b[31m%s\x1b[0m", error);
}

export function generateQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        onError: queryErrorHandler,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        retry: 1,
      },
      mutations: {
        onError: queryErrorHandler,
      },
    },
  });
}
export const queryClient = generateQueryClient();
