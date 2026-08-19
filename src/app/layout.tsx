import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/provider/ReduxProvider";
import ThemeProvider from "@/redux/provider/ThemeProvider";
import Toast from "@/components/ui/Toast/Toast";
import { cn } from "@/lib/utils";
import { Providers } from "./provider";
import FloatingChat from "@/common/components/FloatingChat";
import Preloader from "@/common/components/PreLoader";
import AuthProviders from "@/features/auth/provider/oauth.provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Work Space",
  description: "A World wide Freelancing Platform",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans !light", inter.variable)}>
      <body
      suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-360 mx-auto`}
      >
        <Preloader />
        <ReduxProvider>
          <Providers>
            <AuthProviders>
              <ThemeProvider>
                <Toast />
                {children}
              </ThemeProvider>
            </AuthProviders>
            <FloatingChat />
          </Providers>
        </ReduxProvider>
      </body>
    </html>
  );
}
