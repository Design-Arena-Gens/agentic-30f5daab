import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Health & Productivity AI",
  description: "Track your productivity and health with AI-powered insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
