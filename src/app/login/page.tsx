'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lock, Mail, User as UserIcon, AlertCircle } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isLogin ? 'login' : 'register',
          email,
          password,
          name: !isLogin ? name : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('teken_user', JSON.stringify(data));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Terjadi kesalahan');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-bg-base)] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-[var(--color-brand-navy)] tracking-tight">
            Teken
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2 text-sm">
            Platform Serah Terima Proyek Digital
          </p>
        </div>

        <div className="glass-card p-8 bg-white shadow-xl rounded-2xl border border-[var(--color-border-subtle)]">
          <div className="mb-4">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-brand-navy)] transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali ke Beranda
            </Link>
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-brand-navy)] mb-6 text-center">
            {isLogin ? 'Masuk ke Akun' : 'Daftar Akun Baru'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--color-text-secondary)] mb-1.5">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
                  <input
                    type="text"
                    required={!isLogin}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="tech-input !pl-10"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--color-text-secondary)] mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="tech-input !pl-10"
                  placeholder="freelancer@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--color-text-secondary)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="tech-input !pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-[var(--color-danger-red)] bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] p-3 rounded">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-4"
            >
              {loading ? 'Memproses...' : isLogin ? 'Masuk ke Dashboard' : 'Daftar Sekarang'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
            {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-[var(--color-brand-blue)] font-semibold hover:underline"
            >
              {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
