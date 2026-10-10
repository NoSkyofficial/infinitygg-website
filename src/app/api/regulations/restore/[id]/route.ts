import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { requirePermission, logAudit } from '@/lib/permissions';

export async function POST(
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
    const admin = await requirePermission('edit_regulations');
    
    const versionToRestore = await prisma.regulationVersion.findUnique({
      where: { id: versionId },
    });
    
    if (!versionToRestore) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }
    
    const maxVersion = await prisma.regulationVersion.findFirst({
      orderBy: { version: 'desc' },
      select: { version: true },
    });
    
    const newVersion = (maxVersion?.version || 0) + 1;
    
    // Używamy pola 'notes'
    const restored = await prisma.regulationVersion.create({
      data: {
        content: versionToRestore.content as Prisma.InputJsonValue,
        notes: `Przywrócono wersję ${versionToRestore.version}`, // ✅ ZMIANA: notes zamiast comment
        version: newVersion,
        updatedBy: admin.userId,
      },
    });
    
    await logAudit(
      admin.userId,
      'REGULATION_RESTORED',
      String(restored.id),
      'RegulationVersion',
      {
        restoredFrom: versionToRestore.version,
        newVersion: newVersion,
      },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );
    
    return NextResponse.json({ success: true, version: restored });
  } catch (error) {
    console.error('Error restoring version:', error);
    return NextResponse.json(
      { error: 'Failed to restore version' },
      { status: 500 }
    );
  }
}