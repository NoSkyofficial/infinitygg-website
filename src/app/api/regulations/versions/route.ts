import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, authErrorResponse } from '@/lib/permissions';

export async function GET() {
  try {
    await requirePermission('edit_regulations');
    
    const versions = await prisma.regulationVersion.findMany({
      orderBy: {
        version: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
    
    // Mapujemy notes na comment dla kompatybilności z frontendem
    const mappedVersions = versions.map(v => ({
      ...v,
      comment: v.notes, // ✅ Zwracamy notes jako comment
    }));
    
    return NextResponse.json({ versions: mappedVersions });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    console.error('Error fetching versions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch versions' },
      { status: 500 }
    );
  }
}