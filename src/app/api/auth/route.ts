import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

const hashPassword = (password: string) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
    }

    if (action === 'register') {
      if (!name) {
        return NextResponse.json({ error: 'Nama wajib diisi untuk registrasi' }, { status: 400 });
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
      }

      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashPassword(password),
        }
      });

      const { password: _, ...userData } = user;
      return NextResponse.json(userData, { status: 201 });
    } 
    
    if (action === 'login') {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json({ error: 'Email tidak ditemukan' }, { status: 401 });
      }

      if (user.password !== hashPassword(password)) {
        return NextResponse.json({ error: 'Password salah' }, { status: 401 });
      }

      const { password: _, ...userData } = user;
      return NextResponse.json(userData, { status: 200 });
    }

    return NextResponse.json({ error: 'Action tidak valid' }, { status: 400 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
