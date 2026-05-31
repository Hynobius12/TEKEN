import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// [GET] Mengambil rincian proyek tertentu berdasarkan ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error saat mengambil detail proyek:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil detail proyek.' },
      { status: 500 }
    );
  }
}
