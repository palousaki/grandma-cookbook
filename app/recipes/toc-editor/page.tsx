"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  Download,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import pages from "../pages.json";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), {
  ssr: false,
}) as any;

type TocItem = { title: string; startPage: number; endPage: number };

export default function TocEditor() {
  const flipBookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [title, setTitle] = useState("");
  const [endPage, setEndPage] = useState<number | "">("");
  const [items, setItems] = useState<TocItem[]>([]);

  const total = pages.length;

  function onFlip(e: any) {
    setCurrentPage(e.data);
  }
  function goPrev() {
    flipBookRef.current?.pageFlip()?.flipPrev();
  }
  function goNext() {
    flipBookRef.current?.pageFlip()?.flipNext();
  }

  function addItem() {
    const t = title.trim();
    if (!t) return;
    const start = currentPage;
    const end =
      endPage === ""
        ? currentPage
        : Math.min(Math.max(0, Number(endPage) - 1), total - 1); // UI uses 1-based input

    const newItem: TocItem = {
      title: t,
      startPage: Math.min(start, end),
      endPage: Math.max(start, end),
    };

    setItems((prev) =>
      [...prev, newItem].sort(
        (a, b) => a.startPage - b.startPage || a.endPage - b.endPage
      )
    );

    setTitle("");
    setEndPage("");
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function exportJSON() {
    const data = JSON.stringify(items, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "toc.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) addItem();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pageLabel = useMemo(
    () => `Page ${currentPage + 1} / ${total}`,
    [currentPage, total]
  );

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">TOC Editor</h1>
          <div className="text-sm text-neutral-600">{pageLabel}</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          {/* Flipbook + nav */}
          <div className="relative">
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

            <div className="mx-10 h-[75vh] overflow-auto flex items-center justify-center">
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
                startPage={0}
                drawShadow={true}
                flippingTime={800}
                usePortrait={true}
                startZIndex={0}
                autoSize={true}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
                className="shadow-2xl rounded-2xl overflow-hidden bg-neutral-200"
                onFlip={onFlip}
                ref={flipBookRef}
              >
                {/* Cover */}
                <div className="bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="text-3xl font-bold mb-2">
                      Grandma&apos;s Recipes
                    </div>
                    <div className="text-neutral-600">TOC Tagging Mode</div>
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
                <div className="bg-gradient-to-br from-amber-200 to-amber-100" />
              </HTMLFlipBook>
            </div>
          </div>

          {/* Sidebar: add/edit TOC */}
          <div className="bg-white rounded-xl border shadow p-4 flex flex-col">
            <label className="text-sm font-medium mb-1">Recipe title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Kourabiedes"
              className="rounded-lg border px-3 py-2 outline-none focus:ring focus:ring-amber-200"
            />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-neutral-600">Start page</label>
                <input
                  value={currentPage + 1}
                  readOnly
                  className="w-full rounded-lg border px-3 py-2 bg-neutral-50 text-neutral-700"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-600">
                  End page (optional)
                </label>
                <input
                  type="number"
                  min={currentPage + 1}
                  max={total}
                  value={endPage}
                  onChange={(e) =>
                    setEndPage(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder={`${currentPage + 1}`}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
            </div>
            <button
              onClick={addItem}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border px-3 py-2 bg-amber-50 hover:bg-amber-100"
              title="Add (Ctrl/Cmd + Enter)"
            >
              <Plus className="w-4 h-4" /> Add recipe
            </button>

            <div className="mt-5 flex-1 overflow-auto">
              <div className="text-sm font-medium mb-2">TOC Items</div>
              <ul className="space-y-2">
                {items.map((it, i) => (
                  <li
                    key={`${it.title}-${it.startPage}-${i}`}
                    className="flex items-center justify-between rounded-lg border px-3 py-2"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium">{it.title}</div>
                      <div className="text-xs text-neutral-500">
                        {it.startPage === it.endPage
                          ? `Page ${it.startPage + 1}`
                          : `Pages ${it.startPage + 1}–${it.endPage + 1}`}
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(i)}
                      className="rounded-md border px-2 py-1 hover:bg-neutral-50"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
                {items.length === 0 && (
                  <li className="text-sm text-neutral-500">
                    No entries yet. Add your first one!
                  </li>
                )}
              </ul>
            </div>

            <button
              onClick={exportJSON}
              className="mt-3 inline-flex items-center gap-2 rounded-lg border px-3 py-2 bg-white hover:bg-neutral-50"
              title="Download toc.json"
            >
              <Download className="w-4 h-4" /> Export JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
