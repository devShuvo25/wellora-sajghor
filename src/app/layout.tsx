import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/provider/ReduxProvider";
import { cn } from "@/lib/utils";
import { Providers } from "./provider";
import { StorefrontShell } from "@/components/StorefrontShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: {
    default: "WELLORA সাজঘর | Skincare & Beauty Products",
    template: "%s | WELLORA সাজঘর",
  },
  description:
    "WELLORA সাজঘর — আপনার পছন্দের skincare ও beauty products-এর trusted online destination in Bangladesh.",
  keywords: [
    "WELLORA",
    "WELLORA সাজঘর",
    "skincare Bangladesh",
    "Korean skincare Bangladesh",
    "beauty products Bangladesh",
    "Korean beauty products",
  ],
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
    <html lang="en" className={cn("light", inter.variable, montserrat.variable)}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body
      suppressHydrationWarning={true}
        className="antialiased max-w-360 mx-auto"
      >
        <ReduxProvider>
          <Providers>
            <StorefrontShell>{children}</StorefrontShell>
          </Providers>
        </ReduxProvider>
      </body>
    </html>
  );
}
