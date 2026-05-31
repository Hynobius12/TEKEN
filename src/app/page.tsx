import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-24 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-4 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)] shadow-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-[var(--color-success-emerald)]"></span>
            Diakui UU ITE No. 1 Tahun 2024 (Perubahan UU ITE)
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-brand-navy)] sm:text-6xl max-w-4xl mx-auto leading-tight">
            Lindungi Hasil Pekerjaan Anda dari <span className="text-[var(--color-brand-blue)]">Revisi Abadi</span> & Scope Creep
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-text-secondary)] leading-relaxed">
            Platform Berita Acara & Serah Terima Proyek Digital yang sah. Kunci aset Google Drive Anda dan peroleh persetujuan klien secara instan lewat 
            <strong className="text-[var(--color-brand-navy)]"> Implicit Electronic Signature</strong> yang merekam sidik jari digital secara hukum.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="btn-primary py-3.5 px-8 text-base shadow-lg">
              Mulai Sekarang (Dashboard)
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <a href="#how-it-works" className="btn-secondary py-3.5 px-8 text-base">
              Pelajari Cara Kerja
            </a>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="how-it-works" className="border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-brand-navy)] sm:text-4xl">
                Bagaimana Teken Melindungi Anda?
              </h2>
              <p className="mt-4 text-[var(--color-text-secondary)]">
                Alur penyerahan proyek digital yang dirancang untuk kecepatan (UX mulus) sekaligus kekuatan hukum (UU ITE).
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {/* Step 1 */}
              <div className="glass-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-brand-blue-light)] text-[var(--color-brand-blue)] mb-4 font-bold text-lg">
                    1
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-brand-navy)] mb-2">Input Aset Proyek</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Freelancer mengunggah detail proyek, nama klien, deskripsi, dan tautan Google Drive yang berisi aset proyek final (ZIP, source code, desain, dll).
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="glass-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-brand-blue-light)] text-[var(--color-brand-blue)] mb-4 font-bold text-lg">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-brand-navy)] mb-2">Implicit Signature Klien</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Klien membuka halaman verifikasi dinamis tanpa perlu login/OTP. Cukup satu klik tombol "Setuju & Selesaikan", klien menyatakan proyek diterima.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="glass-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-[var(--color-success-emerald)] mb-4 font-bold text-lg">
                    3
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-brand-navy)] mb-2">Kunci & Terbitkan BAST</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    Seketika, data dikunci (Read-Only) permanen. Sistem secara otomatis merekam log sidik jari digital (IP, User-Agent, Waktu) dan menghasilkan PDF BAST resmi ber-QR Code.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Standing Section */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="glass-card p-8 bg-[var(--color-bg-surface-trans)] flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <span className="badge badge-approved mb-3">
                <span className="pulse-icon"></span>
                Kekuatan Hukum Sah
              </span>
              <h2 className="text-2xl font-bold text-[var(--color-brand-navy)] mb-4">
                Mengapa Tanda Tangan Implisit Teken Sah Secara Hukum?
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                Berdasarkan <strong>Pasal 1 angka 12 UU ITE</strong>, Tanda Tangan Elektronik adalah tanda tangan yang terdiri atas Informasi Elektronik yang dilekatkan, terasosiasi atau terkait dengan Informasi Elektronik lainnya yang digunakan sebagai alat verifikasi dan autentikasi.
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Tindakan aktif klien menekan tombol persetujuan yang terasosiasi dengan log sidik jari digital (Digital Footprint Autopsy: IP Address, User-Agent browser perangkat, dan Timestamp waktu presisi) di platform Teken memenuhi syarat sah alat bukti elektronik yang valid di pengadilan.
              </p>
            </div>
            <div className="w-full md:w-64 flex justify-center">
              <div className="rounded-2xl bg-[var(--color-brand-navy)] p-6 text-white text-center shadow-lg max-w-xs">
                <svg className="mx-auto h-12 w-12 text-[var(--color-success-emerald)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div className="font-bold text-base mb-1">Brankas Transit</div>
                <p className="text-xs text-slate-300">
                  Data Google Drive dikunci permanen agar freelancer terlindung dari tuduhan manipulasi aset pasca-persetujuan.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] py-8 text-center text-xs text-[var(--color-text-muted)]">
        <p>© {new Date().getFullYear()} Teken - Platform Serah Terima Proyek Digital Freelancer Indonesia. Dilindungi Hukum.</p>
      </footer>
    </>
  );
}
