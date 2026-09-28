import type { Metadata } from "next";
import { Lato, Plus_Jakarta_Sans, Titillium_Web } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-jakarta",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

const titillium = Titillium_Web({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-titillium",
});

export const metadata: Metadata = {
  title: {
    default: "Realidad Nacional",
    template: "%s · Realidad Nacional",
  },
  description:
    "Análisis sobre Paraguay construidos con datos abiertos del Estado. Cátedra de Realidad Nacional, Facultad Politécnica UNA.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body
        className={`${jakarta.variable} ${lato.variable} ${titillium.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
