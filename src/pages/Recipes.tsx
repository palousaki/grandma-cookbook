import { useEffect, useRef, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { PageFlip } from 'page-flip';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  BookOpen,
  X,
} from 'lucide-react';
import pages from '../data/pages.json';
import { useToc } from '../hooks/useToc';

const base = import.meta.env.BASE_URL;
const url = (p: string) => base + p.replace(/^\//, '');

export default function Recipes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<PageFlip | null>(null);
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [tocOpen, setTocOpen] = useState(false);
  const { items } = useToc();
  const location = useLocation();
  const targetPage = (location.state as { startPage?: number } | null)?.startPage;

  const tocItems = useMemo(
    () => [...items].sort((a, b) => a.startPage - b.startPage),
    [items]
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const pf = new PageFlip(containerRef.current, {
      width: 550,
      height: 750,
      size: 'stretch' as const,
      minWidth: 315,
      maxWidth: 900,
      minHeight: 400,
      maxHeight: 1200,
      maxShadowOpacity: 0.5,
      showCover: true,
      mobileScrollSupport: true,
      usePortrait: window.innerWidth < 768,
      drawShadow: true,
      flippingTime: 800,
      startZIndex: 0,
      autoSize: true,
      clickEventForward: true,
      useMouseEvents: true,
      swipeDistance: 30,
      showPageCorners: true,
      disableFlipByClick: false,
    });

    pf.loadFromHTML(containerRef.current.querySelectorAll<HTMLElement>('.page'));
    pf.on('flip', (e) => setPage((e as any).data));
    pageFlipRef.current = pf;
    window.scrollTo(0, 0);

    if (targetPage != null) {
      setTimeout(() => pf.flip(targetPage), 50);
    }

    return () => {
      pf.destroy();
      pageFlipRef.current = null;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoom(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const totalPages = pages.length + 2;

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center px-4 py-8">
      {/* Toolbar */}
      <div className="sticky top-0 z-40 w-full max-w-5xl mb-4">
        <div className="bg-white/80 backdrop-blur border border-stone-200 rounded-2xl shadow-sm px-4 py-2.5 flex items-center justify-between">
          {/* Page counter */}
          <span className="font-serif italic text-amber-800 text-sm hidden sm:block">
            p. {page + 1} <span className="text-stone-400 not-italic font-sans text-xs">/ {totalPages}</span>
          </span>

          {/* Controls */}
          <div className="flex items-center gap-2 text-sm text-stone-600 relative ml-auto">
            <button
              onClick={() => setTocOpen((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm transition-colors ${
                tocOpen
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-white border-stone-200 hover:border-amber-300 hover:bg-amber-50'
              }`}
              aria-haspopup="menu"
              aria-expanded={tocOpen}
            >
              <BookOpen className="w-4 h-4" /> Table of Contents
            </button>

            <button
              onClick={() => setZoom((z) => (z === 1 ? 1.4 : 1))}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-1.5 bg-white hover:border-amber-300 hover:bg-amber-50 transition-colors"
              aria-label="Toggle zoom"
            >
              {zoom === 1 ? (
                <><Maximize2 className="w-4 h-4" /> Zoom</>
              ) : (
                <><Minimize2 className="w-4 h-4" /> Reset</>
              )}
            </button>

            {/* TOC dropdown */}
            {tocOpen && (
              <div className="absolute right-0 top-11 z-50 w-80 max-h-[60vh] overflow-auto rounded-2xl border border-stone-200 bg-white shadow-xl">
                <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
                  <span className="font-serif text-stone-800 font-semibold">Recipes</span>
                  <button
                    className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 transition-colors"
                    onClick={() => setTocOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <ul className="divide-y divide-stone-100">
                  {tocItems.map((item, idx) => (
                    <li key={`${item.title}-${idx}`}>
                      <button
                        onClick={() => {
                          setTocOpen(false);
                          setZoom(1);
                          pageFlipRef.current?.flip(item.startPage);
                        }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-amber-50 transition-colors group ${
                          page === item.startPage ? 'bg-amber-50' : ''
                        }`}
                      >
                        <div className="font-medium text-stone-800 truncate group-hover:text-amber-900">
                          {item.title}
                        </div>
                        <div className="text-xs text-stone-400 font-serif italic mt-0.5">
                          {item.endPage !== item.startPage
                            ? `pp. ${item.startPage + 1}–${item.endPage + 1}`
                            : `p. ${item.startPage + 1}`}
                        </div>
                      </button>
                    </li>
                  ))}
                  {tocItems.length === 0 && (
                    <li className="px-4 py-3 text-sm text-stone-400">
                      No entries yet. Add some in the TOC Editor.
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Flipbook */}
      <div className="relative w-full max-w-5xl select-none">
        <button
          onClick={() => pageFlipRef.current?.flipPrev()}
          aria-label="Previous page"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-300 shadow-md p-2.5 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-stone-600" />
        </button>
        <button
          onClick={() => pageFlipRef.current?.flipNext()}
          aria-label="Next page"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white hover:bg-amber-50 border border-stone-200 hover:border-amber-300 shadow-md p-2.5 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-stone-600" />
        </button>

        <div className="mx-12 h-[82vh] overflow-auto">
          <div className="flex justify-center items-center h-full">
            <div
              onDoubleClick={() => setZoom((z) => (z === 1 ? 1.4 : 1))}
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.3s ease' }}
            >
              <div ref={containerRef} style={{ display: 'block', width: '100%' }}>
                {/* Front cover */}
                <div className="page" data-density="hard" style={{ position: 'relative', color: 'white' }}>
                  <img
                    src={url('/textures/leather.jpg')}
                    alt=""
                    draggable={false}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(69,26,3,0.45)', backdropFilter: 'blur(1px)' }} />
                  <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '3rem 2rem' }}>
                    <div style={{ width: '3rem', height: '2px', background: 'rgba(255,255,255,0.7)', margin: '0 auto 1.5rem' }} />
                    <h1 style={{ fontFamily: 'Lora, serif', fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '1.5rem', color: '#fff', textShadow: '0 1px 6px rgba(0,0,0,0.6)', letterSpacing: '-0.01em' }}>
                      Grandma&apos;s<br />Recipes
                    </h1>
                    <div style={{ width: '3rem', height: '2px', background: 'rgba(255,255,255,0.7)', margin: '0 auto 1.5rem' }} />
                    <p style={{ fontStyle: 'italic', fontWeight: 300, fontSize: '1rem', color: 'rgba(255,255,255,0.9)' }}>Traditional Greek recipes</p>
                    <p style={{ fontStyle: 'italic', fontWeight: 300, fontSize: '0.7rem', marginTop: '0.5rem', color: 'rgba(255,255,255,0.75)' }}>Collected from handwritten notes</p>
                  </div>
                  <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', zIndex: 1, fontSize: '0.7rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.75)', letterSpacing: '0.05em' }}>
                    Since 1952
                  </div>
                </div>

                {/* Recipe pages */}
                {(pages as string[]).map((src, i) => (
                  <div key={i} className="page" style={{ background: '#faf9f7' }}>
                    <img
                      src={url(src)}
                      alt={`Recipe page ${i + 1}`}
                      loading="lazy"
                      draggable={false}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                ))}

                {/* Back cover */}
                <div className="page" data-density="hard" style={{ position: 'relative', color: 'white' }}>
                  <img
                    src={url('/textures/leather.jpg')}
                    alt=""
                    draggable={false}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(69,26,3,0.55)' }} />
                  <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', fontSize: '0.7rem', opacity: 0.5, fontStyle: 'italic', letterSpacing: '0.03em' }}>
                    A family legacy in every page
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {zoom !== 1 && (
        <button
          onClick={() => setZoom(1)}
          aria-label="Reset zoom"
          className="fixed bottom-6 right-6 z-50 rounded-full border border-stone-200 bg-white shadow-lg px-4 py-2 inline-flex items-center gap-2 text-sm hover:bg-amber-50 hover:border-amber-300 transition-colors"
        >
          <Minimize2 className="w-4 h-4" /> Reset zoom
        </button>
      )}
    </div>
  );
}
