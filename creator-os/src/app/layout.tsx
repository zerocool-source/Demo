import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creator OS",
  description:
    "The all-in-one operating system for content creators. Manage brands, scripts, scheduling, analytics, and monetization from a single dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
