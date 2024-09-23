import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { APP_NAME } from "@/settings";
import { AlertDialogProvider } from "@/hooks/alert";

import { ThemeProvider } from "next-themes";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
export const metadata: Metadata = {
  title: APP_NAME,
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();
  return (
    <html lang={locale || "en"} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
