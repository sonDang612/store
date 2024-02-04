import "antd/dist/antd.css";
import "@/styles/tailwind.css";
import "@/styles/responsive.css";
import "react-chat-widget/lib/styles.css";
import "@/styles/globals.css";

import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import MyLayout from "@/components/Layout/MyLayout";
import { queryClient } from "@/react-query/queryClient";

import ResetState from "../components/ResetState";
import { persistor, store } from "../redux/store";

if (typeof window !== "undefined") {
  Storage.prototype.setObject = function setObject(key: string, obj: any) {
    return this.setItem(key, JSON.stringify(obj));
  };
  Storage.prototype.getObject = function getObject(key: string) {
    return JSON.parse(this.getItem(key)) || [];
  };
}

function MyApp({ Component, pageProps }: any) {
  if (typeof window !== "undefined") {
    window.onload = () => {
      document.getElementById("holderStyle")!.remove();
    };
  }

  const { getLayout } = Component;
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ResetState />
          {getLayout ? (
            getLayout(<Component {...pageProps} />)
          ) : (
            <MyLayout>
              <Component {...pageProps} />
            </MyLayout>
          )}
        </PersistGate>
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default MyApp;
