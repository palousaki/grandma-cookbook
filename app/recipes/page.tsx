"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  BookOpen,
  X,
} from "lucide-react";
import pages from "./pages.json";
import toc from "./toc.json"; // [{ title: string, startPage: number, endPage?: number }]

// Dynamically import the flipbook (client-only)
const HTMLFlipBook = dynamic(() => import("react-pageflip"), {
  ssr: false,
}) as any;

type TocItem = { title: string; startPage: number; endPage?: number };

export default function CookbookFlipbookPage() {
  const flipBookRef = useRef<any>(null);
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [tocOpen, setTocOpen] = useState(false);

  const tocItems = useMemo(
    () => (toc as TocItem[]).slice().sort((a, b) => a.startPage - b.startPage),
    []
  );

  function goPrev() {
    flipBookRef.current?.pageFlip()?.flipPrev();
  }
  function goNext() {
    flipBookRef.current?.pageFlip()?.flipNext();
  }
  function onFlip(e: any) {
    setPage(e.data);
  }
  function toggleZoom() {
    setZoom((z) => (z === 1 ? 1.4 : 1));
  }
  function resetZoom() {
    setZoom(1);
  }
  function openRecipe(item: TocItem) {
    setTocOpen(false);
    resetZoom();
    flipBookRef.current?.pageFlip()?.flip(item.startPage);
  }

  // ESC to reset zoom
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") resetZoom();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center px-4 py-10">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-neutral-100/90 backdrop-blur w-full max-w-5xl flex items-center justify-between mb-4 px-1 py-2 rounded-md">
        <h1 className="text-2xl font-semibold">Grandma&apos;s Cookbook</h1>
        <div className="flex items-center gap-2 text-sm text-neutral-600 relative">
          {/* TOC button */}
          <button
            onClick={() => setTocOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 shadow-sm bg-white hover:bg-neutral-50"
            aria-haspopup="menu"
            aria-expanded={tocOpen}
          >
            <BookOpen className="w-4 h-4" /> Table of Contents
          </button>

          {/* Zoom toggle */}
          <button
            onClick={toggleZoom}
            className="inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 shadow-sm bg-white hover:bg-neutral-50"
            aria-label="Toggle zoom"
          >
            {zoom === 1 ? (
              <>
                <Maximize2 className="w-4 h-4" /> Zoom
              </>
            ) : (
              <>
                <Minimize2 className="w-4 h-4" /> Reset
              </>
            )}
          </button>

          <span className="hidden sm:inline">
            Page {page + 1} / {pages.length}
          </span>

          {/* TOC dropdown panel */}
          {tocOpen && (
            <div className="absolute right-0 top-10 z-50 w-80 max-h-[60vh] overflow-auto rounded-xl border bg-white shadow-lg">
              <div className="flex items-center justify-between px-3 py-2 border-b">
                <div className="text-sm font-medium">Recipes</div>
                <button
                  className="p-1 rounded hover:bg-neutral-50"
                  onClick={() => setTocOpen(false)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ul className="divide-y">
                {tocItems.map((item, idx) => (
                  <li key={`${item.title}-${item.startPage}-${idx}`}>
                    <button
                      onClick={() => openRecipe(item)}
                      className="w-full text-left px-3 py-2 hover:bg-neutral-50"
                    >
                      <div className="font-medium truncate">{item.title}</div>
                      <div className="text-xs text-neutral-500">
                        {item.endPage != null && item.endPage !== item.startPage
                          ? `Pages ${item.startPage + 1}–${item.endPage + 1}`
                          : `Page ${item.startPage + 1}`}
                      </div>
                    </button>
                  </li>
                ))}
                {tocItems.length === 0 && (
                  <li className="px-3 py-2 text-sm text-neutral-500">
                    No TOC entries found. Create one via /recipes/toc-editor
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="relative w-full max-w-5xl select-none">
        {/* Arrows */}
        <button
          onClick={goPrev}
          aria-label="Previous page"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 hover:bg-white border shadow p-2"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={goNext}
          aria-label="Next page"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 hover:bg-white border shadow p-2"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Scroll/zoom container */}
        <div className="mx-10 h-[80vh] overflow-auto">
          <div className="flex justify-center items-center h-full">
            <div
              onDoubleClick={toggleZoom}
              className="origin-center"
              style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
            >
              <HTMLFlipBook
                width={550}
                height={750}
                size="stretch"
                minWidth={315}
                maxWidth={900}
                minHeight={400}
                maxHeight={1200}
                maxShadowOpacity={0.4}
                showCover={true}
                mobileScrollSupport={true}
                /* key change for 2-page spreads */
                usePortrait={false}
                /* the rest of your props as before */
                startPage={0}
                drawShadow={true}
                flippingTime={800}
                startZIndex={0}
                autoSize={true}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
                className="rounded-2xl overflow-hidden bg-neutral-100"
                onFlip={onFlip}
                ref={flipBookRef}
              >
                {/* Front Cover */}
                <div
                  data-density="hard"
                  className="relative flex items-center justify-center bg-[url('/textures/leather.jpg')] bg-cover bg-center text-white"
                >
                  <div className="absolute inset-0 bg-amber-950/40 backdrop-blur-[1px]" />
                  <div className="relative text-center p-8">
                    <h1 className="text-4xl font-serif font-bold mb-10 drop-shadow">
                      Grandma&apos;s Recipes
                    </h1>
                    <p className="text-lg font-light italic">
                      Traditional Greek recipes
                    </p>
                    <p className="text-xs font-light italic">
                      Collected from handwritten notes
                    </p>
                  </div>
                  <div className="absolute bottom-5 right-5 text-xs italic opacity-70">
                    Since 1952
                  </div>
                </div>
                {pages.map((src, idx) => (
                  <div key={idx} className="bg-neutral-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Recipe page ${idx + 1}`}
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  </div>
                ))}
                {/* Back cover */}
                <div
                  data-density="hard"
                  className="relative bg-[url('/textures/leather.jpg')] bg-cover bg-center"
                >
                  <div className="absolute inset-0 bg-amber-950/50" />
                  <div className="absolute bottom-5 right-5 text-xs text-white opacity-70 p-4 italic">
                    A family legacy in every page
                  </div>
                </div>
              </HTMLFlipBook>
            </div>
          </div>
        </div>
      </div>

      {/* Floating reset button (visible when zoomed) */}
      {zoom !== 1 && (
        <button
          onClick={resetZoom}
          aria-label="Reset zoom"
          className="fixed bottom-6 right-6 z-50 rounded-full border bg-white shadow-lg px-4 py-2 inline-flex items-center gap-2"
        >
          <Minimize2 className="w-4 h-4" />
          Reset
        </button>
      )}

      {/* Tips */}
      {/* <div className="max-w-5xl w-full mt-8 text-sm text-neutral-600 leading-6">
        <p className="mb-2 font-medium">Tips:</p>
        <ul className="list-disc ml-5">
          <li>
            Double-click the book to toggle zoom. Press <kbd>Esc</kbd> to reset.
          </li>
          <li>Use high-resolution images (150–300 DPI) for crisp text.</li>
          <li>
            Keep filenames sequential (e.g., page-1.png … page-120.png) so it’s
            easy to generate the list.
          </li>
          <li>
            For many pages, consider lazy-loading or splitting into multiple
            volumes to keep initial load fast.
          </li>
          <li>
            If you later want full-text search, run OCR once (e.g., Tesseract)
            and keep a JSON index that links terms to page numbers.
          </li>
        </ul>
      </div> */}
    </div>
  );
}
