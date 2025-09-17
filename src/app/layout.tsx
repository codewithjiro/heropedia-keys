import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Topnav } from "./components/topnav";

export const metadata: Metadata = {
  title: "Hero Pedia Heroes",
  description: "Explore the world of heroes",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geist.variable} dark`}>
        <body>
          <Topnav />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
