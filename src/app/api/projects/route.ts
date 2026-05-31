import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

// Helper untuk menghasilkan ID pendek unik (12 karakter hex)
const generateShortId = () => crypto.randomBytes(6).toString('hex');

// [POST] Membuat proyek baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectName, clientName, description, driveLink, userId } = body;

    // Validasi data
    if (!projectName || !clientName || !description || !driveLink) {
      return NextResponse.json(
        { error: 'Semua kolom formulir harus diisi!' },
        { status: 400 }
      );
    }

    // Buat ID unik dan pastikan belum ada di database
    let id = generateShortId();
    let exists = await prisma.project.findUnique({ where: { id } });
    while (exists) {
      id = generateShortId();
      exists = await prisma.project.findUnique({ where: { id } });
    }

    // Buat entri proyek baru di SQLite
    const newProject = await prisma.project.create({
      data: {
        id,
        projectName,
        clientName,
        description,
        driveLink,
        status: 'PENDING',
        userId: userId || null,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error('Error saat membuat proyek:', error);
    return NextResponse.json(
      { error: 'Gagal membuat proyek baru.' },
      { status: 500 }
    );
  }
}

// [GET] Mengambil semua proyek untuk Dashboard Freelancer
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const whereClause = userId ? { userId } : {};

    const projects = await prisma.project.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: { securityLog: true }
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error saat mengambil daftar proyek:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil daftar proyek.' },
      { status: 500 }
    );
  }
}
