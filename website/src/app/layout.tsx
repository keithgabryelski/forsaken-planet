import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
  title: "Forsaken Planet | All Things Dungeons Of Eternity",
  description:
    "Forsaken Planet -- statistics, wiki and resources for Dungeons Of Eternity",
  openGraph: {
    type: "website",
    url: "https://forsaken-planet.com/",
    title: "Forsaken Planet | All Things Dungeons Of Eternity",
    description:
      "Forsaken Planet -- statistics, wiki and resources for Dungeons Of Eternity",
    image:
      "https://forsaken-planet.com/static/media/forsaken-planet-mint.4068ab575e8e887e9302.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PrimeReactProvider>
          <Header />
          {children}
          <Footer />
        </PrimeReactProvider>
      </body>
    </html>
  );
}
