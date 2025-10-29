import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const current = await prisma.regulationVersion.findFirst({
      orderBy: {
        version: 'desc',
      },
    });
    
    return NextResponse.json({
      content: current?.content || "",
      version: current?.version || 0,
    });
  } catch (error) {
    console.error('Error fetching current regulation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch regulation' },
      { status: 500 }
    );
  }
}