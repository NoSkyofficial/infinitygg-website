import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, logAudit, authErrorResponse } from '@/lib/permissions';
import { z } from 'zod';

const regulationSchema = z.object({
  content: z.string().min(1, 'Content cannot be empty'),
  comment: z.string().optional(), // Frontend wysyła 'comment'
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
    
    const maxVersion = await prisma.regulationVersion.findFirst({
      orderBy: { version: 'desc' },
      select: { version: true },
    });
    
    const newVersion = (maxVersion?.version || 0) + 1;
    
    // Używamy 'notes' zamiast 'comment'
    const regulation = await prisma.regulationVersion.create({
      data: {
        content,
        notes: comment || null, // ✅ ZMIANA: notes zamiast comment
        version: newVersion,
        updatedBy: admin.userId,
      },
    });
    
    await logAudit(
      admin.userId,
      'REGULATION_UPDATED',
      String(regulation.id),
      'RegulationVersion',
      {
        version: newVersion,
        comment: comment, // W audit logu pozostawiamy 'comment' dla czytelności
      },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );
    
    return NextResponse.json({ success: true, version: regulation });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    console.error('Error creating regulation version:', error);
    return NextResponse.json(
      { error: 'Failed to save regulation' },
      { status: 500 }
    );
  }
}