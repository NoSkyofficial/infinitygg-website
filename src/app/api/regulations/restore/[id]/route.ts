import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, logAudit } from '@/lib/permissions';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requirePermission('edit_regulations');
    
    // Get version to restore
    const versionToRestore = await prisma.regulationVersion.findUnique({
      where: { id: params.id },
    });
    
    if (!versionToRestore) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }
    
    // Get current max version
    const maxVersion = await prisma.regulationVersion.findFirst({
      orderBy: { version: 'desc' },
      select: { version: true },
    });
    
    const newVersion = (maxVersion?.version || 0) + 1;
    
    // Create new version with restored content
    const restored = await prisma.regulationVersion.create({
      data: {
        content: versionToRestore.content,
        comment: `Przywrócono wersję ${versionToRestore.version}`,
        version: newVersion,
        updatedBy: admin.userId,
      },
    });
    
    // Log audit
    await logAudit(
      admin.userId,
      'REGULATION_RESTORED',
      restored.id,
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