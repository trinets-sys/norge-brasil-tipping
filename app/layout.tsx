import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Norge - England tippekonkurranse",
  description: "Kampkveld med tips, fasit og live poengtavle.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body>{children}</body>
    </html>
  );
}
