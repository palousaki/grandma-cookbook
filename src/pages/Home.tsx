import { Link } from 'react-router-dom';
import { BookOpen, ChefHat, ArrowRight } from 'lucide-react';
import { useToc } from '../hooks/useToc';

export default function Home() {
  const { items } = useToc();

  const featured = [
    { title: 'Μπακλαβάς',            startPage: 9,  emoji: '🍯', image: 'https://images.unsplash.com/photo-1651507126852-7bc852a8bb99?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', position: 'center 80%' },
    { title: 'Τσουρέκια',            startPage: 19, emoji: '🥐', image: 'https://images.unsplash.com/photo-1648978734176-4278722c7275?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', position: 'center' },
    { title: 'Σιμιγδάλι',            startPage: 32, emoji: '🍮', image: 'https://images.unsplash.com/photo-1613222097523-87d3e3311c38?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', position: 'center' },
    { title: 'Κολοκυθοκεφτέδες',     startPage: 33, emoji: '🥒', image: 'https://images.unsplash.com/photo-1741791415742-61aa540b4d86?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', position: 'center' },
    { title: 'Κολοκυθόπιτα',         startPage: 36, emoji: '🥧', image: 'https://images.unsplash.com/photo-1623169495515-0d6073ec0723?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', position: 'center' },
    { title: 'Χοιρινό στη γάστρα',   startPage: 40, emoji: '🍖', image: 'https://images.unsplash.com/photo-1560762229-3d3450edacd9?q=80&w=826&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', position: 'center' },
  ];
  const base = import.meta.env.BASE_URL;
  const url = (p: string) => base + p.replace(/^\//, '');

  return (
    <main className="min-h-screen bg-stone-100">
      {/* Hero */}
      <section className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1623169495561-ba9aa789406e?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)` }}
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
          <div className="mt-10">
            <Link
              to="/recipes"
              className="inline-flex items-center gap-2 rounded-full bg-white text-amber-900 px-6 py-3 font-medium shadow-lg hover:bg-amber-50 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              View Recipes
            </Link>
          </div>
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
          {featured.map((item) => (
            <Link
              key={item.title}
              to="/recipes"
              state={{ startPage: item.startPage }}
              className="group rounded-2xl border border-stone-200 bg-white shadow-sm hover:shadow-md hover:border-amber-300 transition-all overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden bg-amber-50 flex items-center justify-center relative">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    style={{ objectPosition: item.position }}
                  />
                ) : (
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300 select-none">
                    {item.emoji}
                  </span>
                )}
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-stone-800">{item.title}</div>
                  <div className="text-xs text-stone-400 font-serif italic mt-0.5">
                    p.&thinsp;{item.startPage + 1}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:text-amber-600 shrink-0 transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        {items.length > 0 && (
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
