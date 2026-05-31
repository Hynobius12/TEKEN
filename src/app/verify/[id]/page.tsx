'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  ShieldCheck, 
  Download, 
  ExternalLink, 
  Clock, 
  AlertTriangle,
  Fingerprint,
  Info,
  Globe,
  Monitor,
  CheckCircle,
  FileCheck2
} from 'lucide-react';

interface SecurityLog {
  ipAddress: string;
  userAgent: string;
  timezone: string;
  screenResolution: string;
  timestamp: string;
}

interface Project {
  id: string;
  projectName: string;
  clientName: string;
  description: string;
  driveLink: string;
  status: string;
  createdAt: string;
  securityLog?: SecurityLog | null;
}

export default function VerifyClient() {
  const params = useParams();
  const id = params.id as string;

  // States
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approving, setApproving] = useState(false);
  const [justApproved, setJustApproved] = useState(false);

  // Load project details
  const fetchProjectDetails = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Proyek tidak ditemukan.');
      }
    } catch (err) {
      setError('Gagal menghubungkan ke server. Silakan muat ulang halaman.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  // Approval Handler
  const handleApprove = async () => {
    setApproving(true);
    
    // Digital Footprint Autopsy: Kumpulkan informasi browser & device
    const userAgent = window.navigator.userAgent;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    try {
      const res = await fetch(`/api/projects/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timezone,
          screenResolution,
        }),
      });

      if (res.ok) {
        setJustApproved(true);
        // Refresh project data to show approved state
        await fetchProjectDetails();
        
        // Dynamic confetti simulation or alert trigger
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      } else {
        const errData = await res.json();
        alert(errData.error || 'Gagal memproses persetujuan.');
      }
    } catch (err) {
      alert('Terjadi kesalahan jaringan saat menyetujui dokumen BAST.');
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-secondary)]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-border-subtle)] border-t-[var(--color-brand-navy)] mb-4"></div>
        <p className="text-sm font-medium">Memuat halaman sertifikasi Teken...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-bg-base)] p-4 text-center">
        <div className="glass-card p-8 max-w-md w-full bg-white flex flex-col items-center">
          <AlertTriangle className="h-16 w-16 text-[var(--color-danger-red)] mb-4" />
          <h1 className="text-xl font-bold text-[var(--color-brand-navy)] mb-2">Terjadi Kesalahan</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            {error || 'Dokumen yang Anda cari tidak terdaftar atau telah dihapus.'}
          </p>
          <a href="/" className="btn-primary w-full justify-center">
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  const isApproved = project.status === 'APPROVED';

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] py-12 px-4 sm:px-6 flex flex-col justify-between">
      
      <div className="mx-auto max-w-3xl w-full">
        
        {/* Logo Platform */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-2xl font-black uppercase tracking-tight text-[var(--color-brand-navy)]">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Teken
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 uppercase tracking-widest font-semibold">
            Platform Serah Terima Proyek Digital Resmi
          </p>
        </div>

        {/* Certified Card */}
        <div className="glass-card bg-white overflow-hidden shadow-lg border border-[var(--color-border-subtle)] animate-fade-in">
          
          {/* DYNAMIC VIEW BASED ON STATUS */}
          {isApproved ? (
            /* ==========================================
               APPROVED VIEW: SERTIFIKAT KEASLIAN DIGITAL
               ========================================== */
            <>
              {/* Banner Hijau Majestic */}
              <div className="certified-banner bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-8 text-center border-b-4 border-emerald-600">
                <ShieldCheck className="mx-auto h-16 w-16 text-white mb-3 animate-pulse" />
                <h2 className="text-2xl font-black uppercase tracking-wide">Sertifikat Keaslian Dokumen Digital</h2>
                <p className="text-xs text-emerald-100 mt-1.5 uppercase tracking-wider font-semibold">
                  Bukti Kelayakan Hukum Terverifikasi • Platform TEKEN • ID: {project.id.toUpperCase()}
                </p>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Deklarasi Resmi */}
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2 bg-emerald-50 text-[var(--color-success-emerald)] px-6 py-3 rounded-full border-2 border-[var(--color-success-border)] font-extrabold text-xs sm:text-sm uppercase tracking-widest shadow-sm">
                    <ShieldCheck className="h-5 w-5" />
                    Dokumen Ini Asli & Terverifikasi Legal
                  </div>
                </div>

                <p className="text-xs text-center text-[var(--color-text-secondary)] max-w-lg mx-auto leading-relaxed">
                  Menyatakan secara hukum bahwa seluruh hasil pekerjaan di bawah ini telah diserahkan secara digital oleh Pihak Pertama (Freelancer) dan disetujui tanpa syarat oleh Pihak Kedua (Klien) melalui persetujuan elektronik yang sah.
                </p>

                {/* Rincian Read-Only */}
                <div className="space-y-4 pt-4 border-t border-[var(--color-border-subtle)]">
                  <h3 className="text-sm font-bold uppercase text-[var(--color-text-secondary)] tracking-wider">
                    Rincian Aset & Hubungan Hukum
                  </h3>

                  <div className="grid gap-5 sm:grid-cols-2 text-sm bg-[var(--color-bg-base)] p-5 rounded-lg border border-[var(--color-border-subtle)] shadow-inner">
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-[var(--color-text-muted)]">Nama Proyek</span>
                      <span className="font-extrabold text-[var(--color-brand-navy)] text-base">{project.projectName}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-[var(--color-text-muted)]">Pihak Kedua (Klien)</span>
                      <span className="font-extrabold text-[var(--color-brand-navy)] text-base">{project.clientName}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-[var(--color-text-muted)]">Pihak Pertama (Freelancer)</span>
                      <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                        Terverifikasi Digital
                        <ShieldCheck className="h-3.5 w-3.5" />
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-[var(--color-text-muted)]">Tanggal Terbit BAST</span>
                      <span className="font-bold text-[var(--color-brand-navy)]">{new Date(project.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="block text-[10px] font-bold uppercase text-[var(--color-text-muted)]">Deskripsi Lingkup Pekerjaan</span>
                      <p className="text-xs text-[var(--color-text-secondary)] bg-white p-3 rounded border border-[var(--color-border-subtle)] mt-1 whitespace-pre-line leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Google Drive Link Aset Final - Locked & Safe */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase text-[var(--color-text-secondary)] tracking-wider">
                    Aset Final Terkunci (Transit Brankas)
                  </h3>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-emerald-50/30 border border-[var(--color-success-border)] p-4 rounded-lg">
                    <div className="truncate">
                      <span className="block text-[10px] font-bold uppercase text-emerald-700">Tautan Unduh Aset Final (Read-Only State)</span>
                      <a 
                        href={project.driveLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs sm:text-sm text-[var(--color-brand-blue)] font-bold hover:underline truncate block mt-0.5"
                      >
                        {project.driveLink}
                      </a>
                    </div>
                    <a 
                      href={project.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-success py-2 px-5 text-xs flex items-center justify-center gap-1.5 shrink-0"
                    >
                      Unduh Aset Final
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                {/* Digital Footprint Autopsy - Transparent Log */}
                {project.securityLog && (
                  <div className="space-y-3 bg-slate-900 text-slate-100 rounded-lg p-5 border border-slate-800 shadow-md">
                    <h3 className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-2 tracking-widest">
                      <Fingerprint className="h-4.5 w-4.5 animate-pulse text-emerald-400" />
                      Digital Footprint Autopsy (Audit Log UU ITE)
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>IP Address: <strong className="text-white font-mono">{project.securityLog.ipAddress}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>Timestamp Persetujuan: <strong className="text-white">{new Date(project.securityLog.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'medium' })} WIB</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>Resolusi Monitor: <strong className="text-white font-mono">{project.securityLog.screenResolution}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>Status Keabsahan: <strong className="text-emerald-400 font-bold uppercase">APPROVED & SAH</strong></span>
                      </div>
                      
                      <div className="sm:col-span-2 border-t border-slate-800 pt-3 mt-1 flex gap-2.5">
                        <Fingerprint className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div className="leading-relaxed">
                          <span className="block font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Fingerprint User Agent Perangkat Klien</span>
                          <span className="font-mono text-[9px] text-slate-300 break-all">{project.securityLog.userAgent}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PDF BAST Download */}
                <div className="border-t border-[var(--color-border-subtle)] pt-6 mt-6 flex flex-col items-center justify-center gap-3">
                  <p className="text-xs text-[var(--color-text-secondary)] text-center max-w-md">
                    Dokumen Berita Acara Serah Terima (BAST) fisik/digital berformat PDF resmi dapat diunduh di bawah ini.
                  </p>
                  <a 
                    href={`/api/projects/${project.id}/pdf`}
                    className="btn-success py-3 px-8 w-full sm:w-auto text-sm"
                  >
                    <Download className="h-4.5 w-4.5" />
                    Unduh Dokumen BAST Sah (PDF)
                  </a>
                </div>

              </div>
            </>
          ) : (
            /* ==========================================
               PENDING VIEW: HALAMAN PERSETUJUAN KLIEN
               ========================================== */
            <>
              <div className="bg-[var(--color-brand-navy)] text-white p-6 text-center">
                <Clock className="mx-auto h-12 w-12 text-blue-300 mb-2" />
                <h2 className="text-xl font-bold uppercase tracking-wide">Konfirmasi Serah Terima Pekerjaan</h2>
                <p className="text-xs text-slate-300 mt-1">
                  Harap tinjau pekerjaan di bawah sebelum melakukan tanda tangan elektronik implisit.
                </p>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex gap-3 bg-[var(--color-brand-blue-light)] border border-blue-200 text-[var(--color-brand-blue)] p-4 rounded-lg text-xs leading-relaxed">
                  <Info className="h-5 w-5 shrink-0" />
                  <div>
                    <strong>PENTING UNTUK KLIEN:</strong> Menekan tombol <strong>"Setuju & Selesaikan Proyek"</strong> di bagian bawah halaman ini merupakan wujud <strong>Tanda Tangan Elektronik Implisit yang Sah (UU ITE)</strong>. Setelah disetujui, data akan dikunci secara permanen, dan revisi di luar kesepakatan awal tidak dapat diajukan lagi secara gratis.
                  </div>
                </div>

                {/* Project Summary */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase text-[var(--color-text-secondary)] border-b border-[var(--color-border-subtle)] pb-2">
                    Detail Berita Acara Serah Terima (BAST)
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2 text-sm">
                    <div>
                      <span className="block text-xs font-semibold text-[var(--color-text-muted)]">Nama Proyek</span>
                      <span className="font-bold text-[var(--color-brand-navy)]">{project.projectName}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-[var(--color-text-muted)]">Pihak Kedua (Klien)</span>
                      <span className="font-bold text-[var(--color-brand-navy)]">{project.clientName}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="block text-xs font-semibold text-[var(--color-text-muted)]">Deskripsi Serah Terima Pekerjaan</span>
                      <p className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-bg-base)] p-3 rounded border border-[var(--color-border-subtle)] mt-1 whitespace-pre-line leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Aset Final Link */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase text-[var(--color-text-secondary)] border-b border-[var(--color-border-subtle)] pb-2">
                    Aset Final Pekerjaan
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[var(--color-bg-base)] border border-[var(--color-border-subtle)] p-4 rounded-lg shadow-sm">
                    <div className="truncate">
                      <span className="block text-[10px] font-bold uppercase text-[var(--color-text-muted)]">Tautan Google Drive (Aset Dokumen/Desain/Source Code)</span>
                      <a 
                        href={project.driveLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs sm:text-sm text-[var(--color-brand-blue)] font-medium hover:underline truncate block mt-0.5"
                      >
                        {project.driveLink}
                      </a>
                    </div>
                    <a 
                      href={project.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary py-2 px-4 text-xs flex items-center justify-center gap-1.5 shrink-0"
                    >
                      Buka & Tinjau Aset
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>

                {/* Approval Action Area */}
                <div className="border-t border-[var(--color-border-subtle)] pt-6 mt-6 flex flex-col items-center justify-center gap-4">
                  <p className="text-xs text-[var(--color-text-secondary)] max-w-lg text-center mx-auto">
                    Dengan mengklik tombol hijau di bawah, Anda secara sadar menyatakan <strong>SETUJU</strong> bahwa hasil pekerjaan telah selesai sesuai dengan deskripsi proyek di atas dan aset final yang dicantumkan telah Anda terima sepenuhnya.
                  </p>
                  
                  <button
                    onClick={handleApprove}
                    disabled={approving}
                    className="btn-success w-full py-4 text-base font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    {approving ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Memproses Tanda Tangan Elektronik...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-5 w-5" />
                        Setuju & Selesaikan Proyek (Teken BAST)
                      </>
                    )}
                  </button>
                  
                  <div className="text-[10px] text-[var(--color-text-muted)] flex items-center justify-center gap-1.5">
                    <ShieldCheck className="h-3 w-3 text-[var(--color-success-emerald)]" />
                    Tanda Tangan Elektronik Implisit Dilindungi UU ITE Republik Indonesia
                  </div>
                </div>
              </div>
            </>
          )}

        </div>

      </div>

      <footer className="mt-12 text-center text-[10px] text-[var(--color-text-muted)] space-y-1">
        <p>TEKEN - Platform Serah Terima Proyek Digital Mandiri. Hak Cipta Dilindungi.</p>
        <p>Alamat Verifikasi Publik Resmi: /verify/[id-proyek]</p>
      </footer>

    </div>
  );
}
