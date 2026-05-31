'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { 
  Plus, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  ExternalLink,
  Search,
  CheckCircle,
  AlertCircle,
  Edit2,
  X
} from 'lucide-react';

interface Project {
  id: string;
  projectName: string;
  clientName: string;
  description: string;
  driveLink: string;
  status: string;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Copy State
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch Projects
  const fetchProjects = async (userId: string) => {
    try {
      const res = await fetch(`/api/projects?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Gagal memuat proyek:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('teken_user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);
    fetchProjects(userData.id);
  }, [router]);

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!projectName || !clientName || !description || !driveLink) {
      setFormError('Semua kolom formulir wajib diisi!');
      return;
    }

    // Basic Google Drive URL check
    if (!driveLink.includes('drive.google.com')) {
      setFormError('Tautan harus berupa tautan Google Drive yang valid!');
      return;
    }

    setSubmitting(true);

    try {
      let res;
      if (editingProjectId) {
        res = await fetch(`/api/projects/${editingProjectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectName,
            clientName,
            description,
            driveLink,
            userId: user?.id,
          }),
        });
      } else {
        res = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectName,
            clientName,
            description,
            driveLink,
            userId: user?.id,
          }),
        });
      }

      if (res.ok) {
        setFormSuccess(true);
        // Reset form
        handleCancelEdit();
        // Refresh project list
        if (user) fetchProjects(user.id);
      } else {
        const errData = await res.json();
        setFormError(errData.error || (editingProjectId ? 'Gagal memperbarui draf.' : 'Gagal menambahkan proyek baru.'));
      }
    } catch (err) {
      setFormError('Terjadi kesalahan jaringan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditDraft = (project: Project) => {
    setEditingProjectId(project.id);
    setProjectName(project.projectName);
    setClientName(project.clientName);
    setDescription(project.description);
    setDriveLink(project.driveLink);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setProjectName('');
    setClientName('');
    setDescription('');
    setDriveLink('');
    setFormError('');
  };

  // Copy Clipboard Handler
  const handleCopyLink = (id: string) => {
    const origin = window.location.origin;
    const link = `${origin}/verify/${id}`;
    
    navigator.clipboard.writeText(link).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Filter projects by query
  const filteredProjects = projects.filter(p => 
    p.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-[var(--color-bg-base)] py-10 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-extrabold text-[var(--color-brand-navy)]">Dashboard Freelancer</h1>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                Kelola serah terima proyek, pantau persetujuan klien, dan unduh dokumen BAST sah.
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-[var(--color-bg-surface)] px-4 py-2 rounded-lg border border-[var(--color-border-subtle)] shadow-sm">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[var(--color-success-emerald)] pulse-icon"></span>
              <span className="text-xs font-bold text-[var(--color-brand-navy)]">
                {projects.filter(p => p.status === 'APPROVED').length} Selesai / {projects.length} Total
              </span>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            
            {/* Form Input Proyek */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 bg-white sticky top-24">
                <h2 className="text-lg font-bold text-[var(--color-brand-navy)] mb-4 flex items-center gap-2">
                  {editingProjectId ? (
                    <><Edit2 className="h-5 w-5" /> Edit Draf Proyek</>
                  ) : (
                    <><Plus className="h-5 w-5" /> Buat Serah Terima Baru</>
                  )}
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)] mb-6">
                  {editingProjectId ? 'Ubah detail proyek sebelum disetujui klien.' : 'Masukkan data aset final yang ingin Anda serahkan kepada klien.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--color-text-secondary)] mb-1.5">
                      Nama Proyek
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Website E-Commerce Hijab" 
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="tech-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--color-text-secondary)] mb-1.5">
                      Nama Klien
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. PT Maju Bersama" 
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="tech-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--color-text-secondary)] mb-1.5">
                      Deskripsi Proyek
                    </label>
                    <textarea 
                      rows={3} 
                      placeholder="Rincian scope pekerjaan yang diserahkan..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="tech-input resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[var(--color-text-secondary)] mb-1.5">
                      Tautan Google Drive (Aset Final)
                    </label>
                    <input 
                      type="url" 
                      placeholder="https://drive.google.com/drive/folders/..." 
                      value={driveLink}
                      onChange={(e) => setDriveLink(e.target.value)}
                      className="tech-input"
                    />
                    <p className="text-[10px] text-[var(--color-text-muted)] mt-1">
                      Pastikan setelan akses Drive sudah 'Pemberi Komentar' atau 'Pengakses Lihat-Saja'.
                    </p>
                  </div>

                  {/* Feedback */}
                  {formError && (
                    <div className="flex items-center gap-2 text-xs text-[var(--color-danger-red)] bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] p-3 rounded">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {formSuccess && (
                    <div className="flex items-center gap-2 text-xs text-[var(--color-success-emerald)] bg-[var(--color-success-bg)] border border-[var(--color-success-border)] p-3 rounded">
                      <CheckCircle className="h-4 w-4 shrink-0" />
                      <span>{editingProjectId ? 'Draf berhasil diperbarui!' : 'Proyek baru berhasil didaftarkan! Link verifikasi siap disalin.'}</span>
                    </div>
                  )}

                  <div className="flex gap-2 mt-2">
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="btn-primary flex-1 justify-center py-3"
                    >
                      {submitting ? 'Memproses...' : (editingProjectId ? 'Perbarui Draf' : 'Daftarkan & Generate Draft BAST')}
                    </button>
                    {editingProjectId && (
                      <button 
                        type="button" 
                        onClick={handleCancelEdit}
                        disabled={submitting}
                        className="btn-secondary py-3 px-4 flex items-center justify-center"
                        title="Batal Edit"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Daftar Proyek */}
            <div className="lg:col-span-2">
              <div className="glass-card p-6 bg-white min-h-[500px]">
                
                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-[var(--color-border-subtle)]">
                  <h2 className="text-lg font-bold text-[var(--color-brand-navy)] flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Daftar Dokumen Serah Terima
                  </h2>
                  
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
                    <input 
                      type="text" 
                      placeholder="Cari Proyek, Klien, atau ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="tech-input !pl-10 py-2"
                    />
                  </div>
                </div>

                {/* Table / List */}
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-[var(--color-text-muted)]">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-border-subtle)] border-t-[var(--color-brand-navy)] mb-4"></div>
                    <p className="text-sm">Memuat dokumen dari database...</p>
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-[var(--color-text-muted)]">
                    <FileText className="h-16 w-16 mb-4 stroke-1" />
                    <p className="text-base font-medium">Belum ada serah terima proyek</p>
                    <p className="text-xs mt-1 max-w-sm">
                      Mulai dengan membuat serah terima baru menggunakan formulir di sebelah kiri.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProjects.map((project) => {
                      const isApproved = project.status === 'APPROVED';
                      return (
                        <div 
                          key={project.id} 
                          className="border border-[var(--color-border-subtle)] rounded-lg p-5 bg-[var(--color-bg-base)] hover:bg-white hover:border-[var(--color-text-muted)] transition-all shadow-sm"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-mono font-semibold text-[var(--color-text-muted)]">
                                  ID: {project.id.toUpperCase()}
                                </span>
                                <span className={`badge ${isApproved ? 'badge-approved' : 'badge-pending'}`}>
                                  {!isApproved && <span className="pulse-icon"></span>}
                                  {isApproved ? 'APPROVED' : 'PENDING'}
                                </span>
                              </div>
                              <h3 className="text-base font-bold text-[var(--color-brand-navy)] mt-1.5">
                                {project.projectName}
                              </h3>
                              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                                Klien: <strong>{project.clientName}</strong> • Dibuat: {new Date(project.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                              </p>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              {!isApproved && (
                                <button
                                  onClick={() => handleEditDraft(project)}
                                  className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                  Edit Draf
                                </button>
                              )}
                              <a 
                                href={`/api/projects/${project.id}/pdf`}
                                className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5"
                                title="Unduh BAST PDF"
                              >
                                <Download className="h-3.5 w-3.5" />
                                {isApproved ? 'Unduh BAST Sah' : 'Unduh Draft'}
                              </a>
                            </div>
                          </div>

                          <div className="border-t border-[var(--color-border-subtle)] pt-4 mt-2 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                            <div className="text-xs text-[var(--color-text-secondary)] truncate max-w-md">
                              Link Drive: <a href={project.driveLink} target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand-blue)] hover:underline inline-flex items-center gap-0.5">
                                Aset Final
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {/* Copy Link Button */}
                              <button
                                onClick={() => handleCopyLink(project.id)}
                                className={`btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 ${copiedId === project.id ? 'bg-[var(--color-success-bg)] border-[var(--color-success-emerald)] text-[var(--color-success-emerald)]' : ''}`}
                              >
                                {copiedId === project.id ? (
                                  <>
                                    <Check className="h-3.5 w-3.5" />
                                    Tersalin!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3.5 w-3.5" />
                                    Salin Link Verifikasi
                                  </>
                                )}
                              </button>

                              <a 
                                href={`/verify/${project.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1.5"
                              >
                                Buka Link
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </main>

      <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] py-8 text-center text-xs text-[var(--color-text-muted)]">
        <p>© {new Date().getFullYear()} Teken - Platform Serah Terima Proyek Digital. Proteksi Hukum Freelancer Indonesia.</p>
      </footer>
    </>
  );
}
