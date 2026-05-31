import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-trans)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-[var(--color-brand-navy)] hover:opacity-90 transition-opacity">
          <svg className="h-6 w-6 text-[var(--color-brand-navy)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-extrabold uppercase letter-spacing-tight">Teken</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link href="/" className="nav-link text-sm">
            Beranda
          </Link>
          <Link href="/dashboard" className="btn-primary py-2 px-4 text-xs sm:text-sm">
            Dashboard Freelancer
          </Link>
        </nav>
      </div>
    </header>
  );
}
