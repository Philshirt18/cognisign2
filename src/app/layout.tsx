import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cognisight Web",
  description: "Browser-based cognitive voice screening prototype."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
