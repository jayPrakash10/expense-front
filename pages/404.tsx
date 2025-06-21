import { useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AuthLayout from "@/components/layouts/auth";
import { ThemeProvider } from "next-themes";

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    document.title = "404 - Page Not Found";
  }, []);

  return (
    <ThemeProvider attribute="class" forcedTheme="system">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="text-9xl font-bold text-muted-foreground mb-4">
            404
          </div>
          <h1 className="text-2xl font-semibold mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/")} className="w-full">
            Go Home
          </Button>
        </Card>
      </div>
    </ThemeProvider>
  );
}
