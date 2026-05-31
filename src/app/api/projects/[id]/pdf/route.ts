import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateBASTPdf } from '@/lib/pdf-generator';

// [GET] Menghasilkan dan mengunduh PDF BAST dinamis
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Ambil data proyek dari SQLite
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

    // 2. Tentukan Host URL dinamis untuk ditanamkan pada QR Code
    const hostHeader = request.headers.get('host') || 'localhost:3000';
    const protocol = hostHeader.includes('localhost') ? 'http' : 'https';
    const hostUrl = `${protocol}://${hostHeader}`;

    // 3. Panggil generator PDF
    const pdfBuffer = await generateBASTPdf({
      id: project.id,
      projectName: project.projectName,
      clientName: project.clientName,
      description: project.description,
      driveLink: project.driveLink,
      status: project.status,
      createdAt: project.createdAt,
      approvedAt: project.securityLog?.timestamp,
      ipAddress: project.securityLog?.ipAddress,
      userAgent: project.securityLog?.userAgent,
      host: hostUrl,
    });

    // 4. Kirim respon PDF
    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="BAST-${project.projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('Error saat membuat PDF BAST:', error);
    return NextResponse.json(
      { error: 'Gagal membuat file PDF Berita Acara.' },
      { status: 500 }
    );
  }
}
