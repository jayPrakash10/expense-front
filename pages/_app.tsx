import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ReduxProvider } from "@/components/providers/ReduxProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
      <ReduxProvider>
        <Toaster />
        <Component {...pageProps} />
      </ReduxProvider>
  );
}
