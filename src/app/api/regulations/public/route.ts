// src/app/api/regulations/public/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const current = await prisma.regulationVersion.findFirst({
      orderBy: {
        version: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!current) {
      return NextResponse.json({
        content: '',
        version: 0,
        updatedAt: new Date().toISOString(),
        updatedBy: 'System',
      });
    }

    return NextResponse.json({
      content: current.content,
      version: current.version,
      updatedAt: current.createdAt.toISOString(),
      updatedBy: current.user.name || 'Admin',
      comment: current.notes, // ✅ Zwracamy notes jako comment dla kompatybilności z frontendem
    });
  } catch (error) {
    console.error('Error fetching public regulation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch regulation' },
      { status: 500 }
    );
  }
}