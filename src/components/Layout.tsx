import { Link, useLocation } from 'react-router-dom';
import { BookOpen, ListChecks } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  const navLink = (to: string, label: string, Icon: React.ElementType) => (
    <Link
      to={to}
      className={`flex items-center gap-1.5 transition-colors hover:text-amber-700 pb-0.5 ${
        pathname === to
          ? 'text-amber-700 font-medium border-b-2 border-amber-400'
          : 'border-b-2 border-transparent'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-stone-50/80 backdrop-blur border-b border-amber-100">
        <nav className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-amber-900 hover:text-amber-700 transition-colors"
          >
            <BookOpen className="w-5 h-5 shrink-0" />
            <span className="font-serif font-semibold text-xl tracking-wide">
              Grandma&apos;s Cookbook
            </span>
          </Link>

          <div className="flex items-center gap-6 text-sm text-stone-600">
            {navLink('/recipes', 'Recipes', BookOpen)}
            {navLink('/recipes/toc-editor', 'TOC Editor', ListChecks)}
          </div>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-amber-100 bg-stone-50/80">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col items-center gap-1 text-center">
          <span className="font-serif text-amber-900 text-base">Grandma&apos;s Cookbook</span>
          <span className="text-xs text-stone-400">
            © {new Date().getFullYear()} — preserved with love
          </span>
        </div>
      </footer>
    </div>
  );
}
