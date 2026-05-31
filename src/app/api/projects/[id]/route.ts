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

// [PUT] Memperbarui draf proyek
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { projectName, clientName, description, driveLink, userId } = body;

    if (!projectName || !clientName || !description || !driveLink || !userId) {
      return NextResponse.json(
        { error: 'Semua kolom formulir harus diisi!' },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) {
      return NextResponse.json({ error: 'Proyek tidak ditemukan.' }, { status: 404 });
    }

    if (project.status !== 'PENDING') {
      return NextResponse.json({ error: 'Hanya proyek berstatus PENDING yang dapat diubah.' }, { status: 400 });
    }
    
    if (project.userId !== userId) {
       return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        projectName,
        clientName,
        description,
        driveLink,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error saat memperbarui proyek:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui proyek.' },
      { status: 500 }
    );
  }
}
