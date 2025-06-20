import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { ThemeProvider } from "next-themes";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" themes={["light", "dark"]}>
      <ReduxProvider>
        <Toaster />
        <Component {...pageProps} />
      </ReduxProvider>
    </ThemeProvider>
  );
}
