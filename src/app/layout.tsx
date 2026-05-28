import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarMatch — AI-Powered Car Buyer Assistant",
  description:
    "Find your perfect car in minutes. Answer 5 quick questions and let AI match you with the best cars from 33+ options in the Indian market.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
