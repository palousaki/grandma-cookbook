"use client";

import Link from "next/link";
import { BookOpen, ChefHat, ArrowRight, ListChecks } from "lucide-react";
import toc from "./recipes/toc.json"; // [{ title, startPage, endPage? }]

type TocItem = { title: string; startPage: number; endPage?: number };

export default function HomePage() {
  const featured = (toc as TocItem[]).slice(0, 6);

  return (
    <main className="min-h-screen bg-neutral-100">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 bg-[url('/textures/wood.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-amber-900/40" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur">
            <ChefHat className="w-4 h-4" />
            Family cookbook
          </div>
          <h1 className="mt-4 text-4xl md:text-6xl font-serif font-bold drop-shadow">
            Grandma&apos;s Cookbook
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90">
            Handwritten treasures, lovingly preserved—now in a beautiful
            flipbook.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-amber-900 px-5 py-3 font-medium shadow hover:bg-amber-50"
            >
              <BookOpen className="w-5 h-5" />
              View Recipes
            </Link>
            <Link
              href="/recipes/toc-editor"
              className="inline-flex items-center gap-2 rounded-xl border border-white/70 px-5 py-3 font-medium shadow hover:bg-white/10"
            >
              <ListChecks className="w-5 h-5" />
              TOC Editor
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-lg font-semibold">Realistic page flip</div>
            <p className="mt-1 text-sm text-neutral-600">
              Turn pages like a real book, with crisp scans of the original
              notes.
            </p>
          </div>
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-lg font-semibold">Table of contents</div>
            <p className="mt-1 text-sm text-neutral-600">
              Jump straight to favorites via the built-in TOC editor.
            </p>
          </div>
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-lg font-semibold">Private & portable</div>
            <p className="mt-1 text-sm text-neutral-600">
              All static assets—easy to host on Vercel, GitHub Pages, or
              Cloudflare.
            </p>
          </div>
        </div>
      </section>

      {/* Featured recipes (from toc.json) */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Featured recipes</h2>
          <Link
            href="/recipes"
            className="inline-flex items-center gap-1 text-sm text-amber-700 hover:underline"
          >
            Open the cookbook <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.length === 0 && (
            <div className="rounded-2xl border bg-white p-5 text-neutral-600">
              Add items in{" "}
              <code className="px-1 py-0.5 rounded bg-neutral-100">
                /recipes/toc-editor
              </code>{" "}
              to see them here.
            </div>
          )}
          {featured.map((item, idx) => (
            <Link
              key={`${item.title}-${idx}`}
              href="/recipes"
              className="group rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition"
              title={`Opens the book; then use the TOC dropdown to jump to ${item.title}`}
            >
              <div className="font-medium truncate">{item.title}</div>
              <div className="mt-1 text-xs text-neutral-500">
                {item.endPage != null && item.endPage !== item.startPage
                  ? `Pages ${item.startPage + 1}–${item.endPage + 1}`
                  : `Page ${item.startPage + 1}`}
              </div>
              <div className="mt-3 inline-flex items-center gap-1 text-amber-700 group-hover:underline text-sm">
                Open cookbook <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
