'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    const userStr = localStorage.getItem('teken_user');
    setIsLoggedIn(!!userStr);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('teken_user');
    window.location.href = '/login';
  };

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
        <nav className="flex items-center gap-4 sm:gap-6">
          {pathname !== '/' && (
            <Link href="/" className="nav-link text-sm hidden sm:block">
              Beranda
            </Link>
          )}
          {isMounted && (
            isLoggedIn ? (
              <>
                {pathname !== '/dashboard' && (
                  <Link href="/dashboard" className="btn-primary py-2 px-4 text-xs sm:text-sm">
                    Ke Dashboard
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="text-xs sm:text-sm font-semibold text-[var(--color-danger-red)] hover:opacity-80 flex items-center gap-1 transition-opacity border border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] px-3 py-2 rounded-md"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar
                </button>
              </>
            ) : (
              <Link href="/login" className="btn-primary py-2 px-4 text-xs sm:text-sm">
                Masuk
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
