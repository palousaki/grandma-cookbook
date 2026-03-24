import { useEffect, useRef, useState, useMemo } from 'react';
import { PageFlip } from 'page-flip';
import { Download, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import pages from '../data/pages.json';
import { useToc, type TocItem } from '../hooks/useToc';

const base = import.meta.env.BASE_URL;
const url = (p: string) => base + p.replace(/^\//, '');

export default function TocEditor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<PageFlip | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [title, setTitle] = useState('');
  const [startPage, setStartPage] = useState<number | ''>(1);
  const [endPage, setEndPage] = useState<number | ''>('');
  const [titleDrafts, setTitleDrafts] = useState<Record<number, string>>({});
  const { items, save } = useToc();

  const total = pages.length;

  // Init StPageFlip once after mount
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
      maxShadowOpacity: 0.4,
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
    pf.on('flip', (e) => setCurrentPage((e as any).data));
    pageFlipRef.current = pf;

    return () => {
      pf.destroy();
      pageFlipRef.current = null;
    };
  }, []);

  function goPrev() { pageFlipRef.current?.flipPrev(); }
  function goNext() { pageFlipRef.current?.flipNext(); }

  function addItem() {
    const t = title.trim();
    if (!t) return;
    const start = startPage === '' ? currentPage : Number(startPage) - 1;
    const end =
      endPage === ''
        ? start
        : Math.min(Math.max(0, Number(endPage) - 1), total - 1);

    const newItem: TocItem = {
      title: t,
      startPage: Math.min(start, end),
      endPage: Math.max(start, end),
    };

    const sorted = [...items, newItem].sort(
      (a, b) => a.startPage - b.startPage || a.endPage - b.endPage
    );
    save(sorted);
    setTitle('');
    setStartPage('');
    setEndPage('');
  }

  function removeItem(idx: number) {
    save(items.filter((_, i) => i !== idx));
  }

  function renameItem(idx: number, newTitle: string) {
    const trimmed = newTitle.trim();
    if (trimmed) save(items.map((it, i) => i === idx ? { ...it, title: trimmed } : it));
    setTitleDrafts((d) => { const next = { ...d }; delete next[idx]; return next; });
  }

  function updatePages(idx: number, field: 'startPage' | 'endPage', value: string) {
    const n = parseInt(value, 10);
    if (isNaN(n) || n < 1 || n > total) return;
    save(items.map((it, i) => i === idx ? { ...it, [field]: n - 1 } : it));
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'toc.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // Keyboard shortcuts — stable ref to avoid stale closure
  const addItemRef = useRef(addItem);
  addItemRef.current = addItem;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) addItemRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const pageLabel = useMemo(
    () => `Page ${currentPage + 1} / ${total}`,
    [currentPage, total]
  );

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">TOC Editor</h1>
          <div className="text-sm text-neutral-600">{pageLabel}</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          {/* Flipbook preview */}
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
              <div ref={containerRef} style={{ display: 'block', width: '100%' }}>
                {/* Cover */}
                <div className="page" data-density="hard" style={{ position: 'relative', color: 'white' }}>
                  <img
                    src={url('/textures/leather.jpg')}
                    alt=""
                    draggable={false}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(69,26,3,0.45)', backdropFilter: 'blur(1px)' }} />
                  <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem' }}>
                    <h1 style={{ fontFamily: 'Lora, serif', fontSize: '2rem', fontWeight: 700, marginBottom: '1rem', color: '#fff', textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}>
                      Grandma&apos;s Recipes
                    </h1>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)' }}>TOC Tagging Mode</div>
                  </div>
                </div>

                {(pages as string[]).map((src, idx) => (
                  <div key={idx} className="page" style={{ background: '#fafaf9' }}>
                    <img
                      src={url(src)}
                      alt={`Recipe page ${idx + 1}`}
                      loading="lazy"
                      draggable={false}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                ))}

                {/* Back cover */}
                <div className="page" data-density="hard" style={{ position: 'relative' }}>
                  <img
                    src={url('/textures/leather.jpg')}
                    alt=""
                    draggable={false}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(69,26,3,0.5)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Editor sidebar */}
          <div className="bg-white rounded-xl border shadow p-4 flex flex-col h-[75vh]">
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
                  type="number"
                  min={1}
                  max={total}
                  value={startPage}
                  onChange={(e) => setStartPage(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder={`${currentPage + 1}`}
                  className="w-full rounded-lg border px-3 py-2 text-neutral-700"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-600">End page (optional)</label>
                <input
                  type="number"
                  min={currentPage + 1}
                  max={total}
                  value={endPage}
                  onChange={(e) =>
                    setEndPage(e.target.value === '' ? '' : Number(e.target.value))
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
              <div className="text-sm font-medium mb-2">
                TOC Items
                <span className="ml-2 text-xs text-neutral-400 font-normal">auto-saved</span>
              </div>
              <ul className="space-y-2">
                {items.map((it, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded-lg border px-3 py-2"
                  >
                    <div className="min-w-0 flex-1 mr-2">
                      <input
                        value={titleDrafts[i] ?? it.title}
                        onChange={(e) => setTitleDrafts((d) => ({ ...d, [i]: e.target.value }))}
                        onBlur={() => renameItem(i, titleDrafts[i] ?? it.title)}
                        className="w-full font-medium bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-amber-400 focus:outline-none px-0 py-0.5"
                      />
                      <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                        <span>p.</span>
                        <input
                          type="number"
                          min={1}
                          max={total}
                          value={it.startPage + 1}
                          onChange={(e) => updatePages(i, 'startPage', e.target.value)}
                          className="w-12 bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-amber-400 focus:outline-none text-center"
                        />
                        <span>–</span>
                        <input
                          type="number"
                          min={1}
                          max={total}
                          value={it.endPage + 1}
                          onChange={(e) => updatePages(i, 'endPage', e.target.value)}
                          className="w-12 bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-amber-400 focus:outline-none text-center"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(i)}
                      className="rounded-md border px-2 py-1 hover:bg-stone-50 ml-2 shrink-0"
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
              className="mt-3 inline-flex items-center gap-2 rounded-lg border px-3 py-2 bg-white hover:bg-stone-50 text-sm text-neutral-600"
              title="Download toc.json as backup"
            >
              <Download className="w-4 h-4" /> Export backup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
