import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { APP_NAME } from "@/settings";
import { AlertDialogProvider } from "@/hooks/alert";

import { ThemeProvider } from "next-themes";
export const metadata: Metadata = {
  title: APP_NAME,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AlertDialogProvider>
            {children}
            <Toaster />
          </AlertDialogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
