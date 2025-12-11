import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexuma - The AI Command Center",
  description: "Plan, launch and scale — in one glass-clear dashboard for modern founders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <body className={cn(inter.className, "min-h-screen bg-background antialiased")}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
