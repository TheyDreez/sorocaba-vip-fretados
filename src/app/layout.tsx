import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";
import { LoadingScreen } from "@/components/LoadingScreen";
import { CustomCursor } from "@/components/CustomCursor";
import { LeadTracker } from "@/components/LeadTracker";

import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: "Batata Fretados | Transporte Executivo Sorocaba ↔ São Paulo",
  description: "Há 39 anos sendo a referência em fretamento executivo diário entre Sorocaba e São Paulo. Confiança, segurança e conforto para a sua rotina.",
  keywords: "fretado Sorocaba São Paulo, Batata Fretados, transporte executivo Sorocaba, fretado diário Sorocaba, ônibus executivo Sorocaba São Paulo",
  verification: {
    google: "aAe8plhsWeUEIOpIr4A1jdSgk1IWZzT0Uk3tmqu4atu",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18333544157"
          strategy="afterInteractive"
        />
        <Script id="google-ads-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
      
            gtag('config', 'AW-18333544157');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} ${outfit.variable}`}>
        <LeadTracker />
        <CustomCursor />
        <LoadingScreen />
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
