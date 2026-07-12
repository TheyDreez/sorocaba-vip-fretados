import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";
import { LoadingScreen } from "@/components/LoadingScreen";
import { CustomCursor } from "@/components/CustomCursor";
import { LeadTracker } from "@/components/LeadTracker";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: "Batata Fretados | Transporte Executivo Sorocaba ↔ São Paulo",
  description: "Há 39 anos sendo a referência em fretamento executivo diário entre Sorocaba e São Paulo. Confiança, segurança e conforto para a sua rotina.",
  keywords: "fretado Sorocaba São Paulo, Batata Fretados, transporte executivo Sorocaba, fretado diário Sorocaba, ônibus executivo Sorocaba São Paulo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
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
