import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, logAudit } from '@/lib/permissions';
import { z } from 'zod';

const regulationSchema = z.object({
  content: z.string().min(1, 'Content cannot be empty'),
  comment: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const admin = await requirePermission('edit_regulations');
    const body = await request.json();
    
    const validation = regulationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const { content, comment } = validation.data;
    
    // Get current max version
    const maxVersion = await prisma.regulationVersion.findFirst({
      orderBy: { version: 'desc' },
      select: { version: true },
    });
    
    const newVersion = (maxVersion?.version || 0) + 1;
    
    // Create new version
    const regulation = await prisma.regulationVersion.create({
      data: {
        content,
        comment: comment || null,
        version: newVersion,
        updatedBy: admin.userId,
      },
    });
    
    // Log audit
    await logAudit(
      admin.userId,
      'REGULATION_UPDATED',
      regulation.id,
      'RegulationVersion',
      {
        version: newVersion,
        comment,
      },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );
    
    return NextResponse.json({ success: true, version: regulation });
  } catch (error) {
    console.error('Error creating regulation version:', error);
    return NextResponse.json(
      { error: 'Failed to save regulation' },
      { status: 500 }
    );
  }
}