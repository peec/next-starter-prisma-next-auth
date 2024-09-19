import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { APP_NAME } from "@/settings";
import { AlertDialogProvider } from "@/hooks/alert";

export const metadata: Metadata = {
  title: APP_NAME,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <AlertDialogProvider>
          {children}
          <Toaster />
        </AlertDialogProvider>
      </body>
    </html>
  );
}
