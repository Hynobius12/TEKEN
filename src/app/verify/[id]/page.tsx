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
        <div className="glass-card bg-white overflow-hidden shadow-lg border border-[var(--color-border-subtle)]">
          
          {/* Header Banner - Hijau jika disetujui, Biru Navy jika pending */}
          {isApproved ? (
            <div className="certified-banner">
              <ShieldCheck className="mx-auto h-12 w-12 text-white mb-2 animate-bounce" />
              <h2 className="text-xl font-bold uppercase tracking-wide">Pekerjaan Selesai & Disetujui secara Sah</h2>
              <p className="text-xs text-emerald-100 mt-1">
                Tercatat pada Lembar Berita Acara Hukum Platform TEKEN • ID: {project.id.toUpperCase()}
              </p>
            </div>
          ) : (
            <div className="bg-[var(--color-brand-navy)] text-white p-6 text-center">
              <Clock className="mx-auto h-12 w-12 text-blue-300 mb-2" />
              <h2 className="text-xl font-bold uppercase tracking-wide">Konfirmasi Serah Terima Pekerjaan</h2>
              <p className="text-xs text-slate-300 mt-1">
                Harap tinjau pekerjaan di bawah sebelum melakukan tanda tangan elektronik implisit.
              </p>
            </div>
          )}

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Warning Banner / Summary */}
            {!isApproved && (
              <div className="flex gap-3 bg-[var(--color-brand-blue-light)] border border-blue-200 text-[var(--color-brand-blue)] p-4 rounded-lg text-xs leading-relaxed">
                <Info className="h-5 w-5 shrink-0" />
                <div>
                  <strong>PENTING UNTUK KLIEN:</strong> Menekan tombol <strong>"Setuju & Selesaikan Proyek"</strong> di bagian bawah halaman ini merupakan wujud <strong>Tanda Tangan Elektronik Implisit yang Sah (UU ITE)</strong>. Setelah disetujui, data akan dikunci secara permanen, dan revisi di luar kesepakatan awal tidak dapat diajukan lagi secara gratis.
                </div>
              </div>
            )}

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

            {/* Digital Footprint Log / Autopsy */}
            {isApproved && project.securityLog && (
              <div className="space-y-3 bg-emerald-50/50 border border-[var(--color-success-border)] rounded-lg p-5">
                <h3 className="text-sm font-bold uppercase text-[var(--color-success-emerald)] flex items-center gap-2 border-b border-[var(--color-success-border)] pb-2">
                  <Fingerprint className="h-4.5 w-4.5" />
                  Digital Footprint Autopsy (Log Keamanan Legal)
                </h3>

                <div className="grid gap-3 sm:grid-cols-2 text-xs text-[var(--color-text-secondary)] mt-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
                    <span>IP Address: <strong>{project.securityLog.ipAddress}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
                    <span>Waktu Setuju: <strong>{new Date(project.securityLog.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })} WIB</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-[var(--color-text-muted)] shrink-0" />
                    <span>Resolusi Layar: <strong>{project.securityLog.screenResolution}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[var(--color-success-emerald)] shrink-0" />
                    <span>Timezone: <strong>{project.securityLog.timezone}</strong></span>
                  </div>
                  <div className="sm:col-span-2 border-t border-[var(--color-success-border)] pt-2.5 mt-1 flex gap-2">
                    <Fingerprint className="h-4 w-4 text-[var(--color-success-emerald)] shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <span className="block font-semibold text-[var(--color-brand-navy)] text-[10px] uppercase">User Agent Perangkat Klien</span>
                      <span className="font-mono text-[9px] text-[var(--color-text-secondary)] break-all">{project.securityLog.userAgent}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Approval / Download Action Area */}
            <div className="border-t border-[var(--color-border-subtle)] pt-6 mt-6 flex flex-col items-center justify-center gap-4">
              {isApproved ? (
                <div className="text-center w-full space-y-4">
                  <div className="inline-flex items-center gap-2 text-sm text-[var(--color-success-emerald)] bg-emerald-50 px-4 py-2 rounded border border-[var(--color-success-border)] font-bold">
                    <FileCheck2 className="h-5 w-5" />
                    Persetujuan Anda Berhasil Tercatat
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary)] max-w-md mx-auto">
                    Berita Acara ini telah sah ditandatangani secara elektronik. Anda dan freelancer dapat mengunduh dokumen resmi ber-QR Code di bawah ini.
                  </p>
                  
                  <a 
                    href={`/api/projects/${project.id}/pdf`}
                    className="btn-success py-3.5 px-8 w-full sm:w-auto text-base"
                  >
                    <Download className="h-5 w-5" />
                    Unduh Dokumen BAST Sah (PDF)
                  </a>
                </div>
              ) : (
                <div className="text-center w-full space-y-4">
                  <p className="text-xs text-[var(--color-text-secondary)] max-w-lg mx-auto">
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
              )}
            </div>

          </div>

        </div>

      </div>

      <footer className="mt-12 text-center text-[10px] text-[var(--color-text-muted)] space-y-1">
        <p>TEKEN - Platform Serah Terima Proyek Digital Mandiri. Hak Cipta Dilindungi.</p>
        <p>Alamat Verifikasi Publik Resmi: /verify/[id-proyek]</p>
      </footer>

    </div>
  );
}
