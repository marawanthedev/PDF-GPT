import { cn } from "@/lib/utils";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { trpc } from "@/utils/trpc";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDF-GPT",
  description: "Your Article Scanner",
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <body
        className={cn(
          "min-h-screen font-sans antialiased grainy",
          inter.className
        )}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
