import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgentNest - Your AI-Powered Real Estate Agent",
  description: "Find your dream home with AgentNest. Browse listings, explore neighborhoods, and get smart insights powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <FavoritesProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
