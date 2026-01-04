import type { Metadata } from "next";
import { Inter, Dancing_Script } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: '--font-dancing',
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: "Happy Birthday Khushi 🎉",
  description: "A special birthday celebration for someone special",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${dancingScript.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
