import { Link } from 'react-router-dom';
import { BookOpen, ChefHat, ArrowRight, ListChecks, Heart } from 'lucide-react';
import { useToc } from '../hooks/useToc';

export default function Home() {
  const { items } = useToc();
  const featured = items.slice(0, 6);
  const base = import.meta.env.BASE_URL;
  const url = (p: string) => base + p.replace(/^\//, '');

  return (
    <main className="min-h-screen bg-stone-100">
      {/* Hero */}
      <section className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${url('/textures/wood.jpg')})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/60 via-amber-900/50 to-amber-950/70" />
        {/* Fade into page below */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-stone-100 to-transparent" />

        <div className="relative mx-auto max-w-4xl px-6 pt-16 pb-36 text-center text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs tracking-widest uppercase backdrop-blur mb-6">
            <ChefHat className="w-3.5 h-3.5" />
            Family cookbook
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight drop-shadow-lg">
            Grandma&apos;s<br />Cookbook
          </h1>
          <p className="mt-5 text-lg md:text-xl text-white/80 max-w-xl mx-auto leading-relaxed">
            Handwritten treasures, lovingly preserved—now in a beautiful flipbook.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/recipes"
              className="inline-flex items-center gap-2 rounded-full bg-white text-amber-900 px-6 py-3 font-medium shadow-lg hover:bg-amber-50 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              View Recipes
            </Link>
            <Link
              to="/recipes/toc-editor"
              className="inline-flex items-center gap-2 rounded-full border border-white/50 px-6 py-3 font-medium hover:bg-white/10 transition-colors"
            >
              <ListChecks className="w-4 h-4" />
              TOC Editor
            </Link>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-5xl px-6 pt-4 pb-12">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: BookOpen,
              title: 'Realistic page flip',
              body: 'Turn pages like a real book, with crisp scans of the original notes.',
            },
            {
              icon: ListChecks,
              title: 'Table of contents',
              body: 'Jump straight to favorites — changes save instantly, no rebuild needed.',
            },
            {
              icon: Heart,
              title: 'Kept in the family',
              body: 'Fully static — host it anywhere, share it only with those who matter.',
            },
          ].map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl bg-white border border-stone-200 border-t-2 border-t-amber-300 p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="font-semibold text-stone-800">{title}</div>
              </div>
              <p className="text-sm text-stone-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured recipes */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        {/* Ornamental heading */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="h-px w-16 bg-amber-300" />
            <span className="text-xs text-amber-600 uppercase tracking-widest font-medium">
              From the collection
            </span>
            <div className="h-px w-16 bg-amber-300" />
          </div>
          <h2 className="text-3xl font-serif font-semibold text-stone-800">Featured recipes</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.length === 0 && (
            <div className="rounded-2xl border bg-white p-5 text-stone-500">
              Add items in{' '}
              <Link to="/recipes/toc-editor" className="text-amber-700 hover:underline">
                TOC Editor
              </Link>{' '}
              to see them here.
            </div>
          )}
          {featured.map((item, idx) => (
            <Link
              key={`${item.title}-${idx}`}
              to="/recipes"
              state={{ startPage: item.startPage }}
              className="group rounded-2xl border border-stone-200 bg-white shadow-sm hover:shadow-md hover:border-amber-300 transition-all overflow-hidden"
            >
              <div className="bg-gradient-to-r from-amber-50 to-amber-100/60 border-b border-amber-100 px-4 py-3 flex items-center justify-between">
                <span className="text-xs font-medium text-amber-500 uppercase tracking-widest">
                  Recipe
                </span>
                <span className="font-serif text-amber-800 text-sm italic">
                  p.&thinsp;
                  {item.endPage !== item.startPage
                    ? `${item.startPage + 1}–${item.endPage + 1}`
                    : item.startPage + 1}
                </span>
              </div>
              <div className="p-4">
                <div className="font-medium text-stone-800 truncate">{item.title}</div>
                <div className="mt-3 inline-flex items-center gap-1 text-amber-600 group-hover:text-amber-700 text-sm">
                  Open cookbook <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {featured.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              to="/recipes"
              className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 hover:underline underline-offset-4"
            >
              See all {items.length} recipes in the cookbook
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
