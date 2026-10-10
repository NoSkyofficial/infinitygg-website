import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/permissions';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const versionId = Number(id);
  if (!Number.isInteger(versionId)) {
    return NextResponse.json(
      { error: 'Invalid version id' },
      { status: 400 }
    );
  }

  try {
    await requirePermission('edit_regulations');
    
    const version = await prisma.regulationVersion.findUnique({
      where: { id: versionId },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
    
    if (!version) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }
    
    // Mapujemy notes na comment
    const mappedVersion = {
      ...version,
      comment: version.notes, // ✅ Zwracamy notes jako comment
    };
    
    return NextResponse.json({ version: mappedVersion });
  } catch (error) {
    console.error('Error fetching version:', error);
    return NextResponse.json(
      { error: 'Failed to fetch version' },
      { status: 500 }
    );
  }
}