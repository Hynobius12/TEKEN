import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// [POST] Verifikasi & Persetujuan Klien (Implicit Electronic Signature)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { timezone, screenResolution } = body;

    // 1. Dapatkan data proyek saat ini
    const project = await prisma.project.findUnique({
      where: { id },
      include: { securityLog: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Proyek tidak ditemukan.' },
        { status: 404 }
      );
    }

    // 2. Proteksi Brankas Transit (Lock State): Tolak jika sudah APPROVED
    if (project.status === 'APPROVED') {
      return NextResponse.json(
        { error: 'Proyek ini telah disetujui (APPROVED) sebelumnya dan datanya telah dikunci secara hukum.' },
        { status: 403 }
      );
    }

    // 3. Digital Footprint Autopsy: Kumpulkan data browser/klien
    // Mendeteksi IP Address dari headers (untuk development & production)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor 
      ? forwardedFor.split(',')[0].trim() 
      : request.headers.get('x-real-ip') || '127.0.0.1';

    const userAgent = request.headers.get('user-agent') || 'Unknown User Agent';

    // 4. Update status proyek dan simpan log audit ke database dalam transaksi atomik
    const updatedProject = await prisma.$transaction(async (tx) => {
      // Buat log sidik jari keamanan
      await tx.securityLog.create({
        data: {
          projectId: id,
          ipAddress,
          userAgent,
          timezone: timezone || 'Unknown',
          screenResolution: screenResolution || 'Unknown',
        },
      });

      // Kunci dan perbarui status proyek menjadi APPROVED
      return await tx.project.update({
        where: { id },
        data: {
          status: 'APPROVED',
        },
        include: {
          securityLog: true,
        },
      });
    });

    return NextResponse.json(updatedProject);
  } catch (error: any) {
    console.error('Error saat menyetujui proyek:', error);
    return NextResponse.json(
      { error: 'Gagal memproses persetujuan proyek.' },
      { status: 500 }
    );
  }
}
