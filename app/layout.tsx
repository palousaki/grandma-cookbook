import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import type { Metadata } from "next";
import { BookOpen, Home, ListChecks } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grandma's Cookbook",
  description:
    "A digital flipbook of handwritten recipes, preserved with love.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-100 text-neutral-800`}
      >
        {/* Header Navigation */}
        <header className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b border-neutral-200">
          <nav className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
            {/* Logo / Site name */}
            <Link
              href="/"
              className="flex items-center gap-2 text-amber-800 hover:text-amber-700 font-semibold text-lg"
            >
              <BookOpen className="w-5 h-5" />
              Grandma&apos;s Cookbook
            </Link>

            {/* Nav links */}
            <div className="flex items-center gap-4 text-sm">
              <Link
                href="/"
                className="flex items-center gap-1 hover:text-amber-700 transition"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                href="/recipes"
                className="flex items-center gap-1 hover:text-amber-700 transition"
              >
                <BookOpen className="w-4 h-4" />
                Recipes
              </Link>
              <Link
                href="/recipes/toc-editor"
                className="flex items-center gap-1 hover:text-amber-700 transition"
              >
                <ListChecks className="w-4 h-4" />
                TOC Editor
              </Link>
            </div>
          </nav>
        </header>

        {/* Page Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t bg-white/70 ">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-neutral-600">
            © {new Date().getFullYear()} Grandma’s Cookbook — made with love.
          </div>
        </footer>
      </body>
    </html>
  );
}
