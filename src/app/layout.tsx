import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "../components/AuthProvider";

export const metadata: Metadata = {
  title: "Resonate | Live events that match your vibe",
  description: "Find live events based on your Spotify taste",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased text-foreground bg-background">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
