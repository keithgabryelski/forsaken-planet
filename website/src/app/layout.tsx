import type { Metadata } from "next";
import { Inter } from "next/font/google";
//import { GoogleAdSense } from "nextjs-google-adsense";
import { GoogleAnalytics } from "@next/third-parties/google";
import { PrimeReactProvider } from "primereact/api";
import Header from "./header";
import Footer from "./footer";
import "primereact/resources/themes/lara-dark-blue/theme.css";
import "primeicons/primeicons.css";
import "primeflex/themes/primeone-dark.css";
import "primeflex/primeflex.css";
//import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dungeons Of Eternity: Forsaken Planet",
  description: "Dungeons Of Eternity: statistics, wiki and resources.",
  openGraph: {
    type: "website",
    url: "https://forsaken-planet.com/",
    title: "Dungeons Of Eternity: Forsaken Planet",
    description: "Dungeons Of Eternity: statistics, wiki and resources.",
    images: [
      "https://forsaken-planet.com/static/media/forsaken-planet-mint.4068ab575e8e887e9302.png",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // <GoogleAdSense publisherId="pub-8473742881311360" />

  return (
    <html lang="en">
      <body className={inter.className}>
        <PrimeReactProvider>
          <Header />
          {children}
          <Footer />
        </PrimeReactProvider>
      </body>
      <GoogleAnalytics gaId="G-JVFLHEQSDV" />
    </html>
  );
}
