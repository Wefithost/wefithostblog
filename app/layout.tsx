import type { Metadata } from "next";
import "./globals.css";

import localFont from "next/font/local";
import Header from "./components/header";
const PoppinsReg = localFont({
  src: "./fonts/Poppins-Regular.ttf",
  variable: "--font-poppins",
});

const QuicksandReg = localFont({
  src: "./fonts/Quicksand-VariableFont_wght.ttf",
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "WefitHost Blog",
  description:
    "WeFitHost Blog brings you the latest tips, updates, and insights on web hosting, website management, and digital tools — helping individuals and businesses build faster, smarter, and more secure online experiences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${PoppinsReg.variable}  ${QuicksandReg.variable} antialiased max-w-[1500px] flex flex-col mx-auto`}
      >
        <Header/>
        {children}
      </body>
    </html>
  );
}
