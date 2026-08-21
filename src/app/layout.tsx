import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/provider/ReduxProvider";
import { cn } from "@/lib/utils";
import { Providers } from "./provider";
import { StorefrontShell } from "@/components/StorefrontShell";
import { siteConfig } from "@/config/site.config";
import { JsonLd, generateStoreJsonLd } from "@/components/seo/JsonLd";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });

export const viewport: Viewport = {
  themeColor: "#804a62",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: "WELLORA" }],
  creator: "WELLORA",
  publisher: "WELLORA সাজঘর",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        <JsonLd data={generateStoreJsonLd()} />
      </head>
      <body
        suppressHydrationWarning={true}
        className="antialiased max-w-360 mx-auto bg-wellora-background text-wellora-on-background"
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
