import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, logAudit } from '@/lib/permissions';
import { z } from 'zod';

const reorderSchema = z.object({
  questions: z.array(
    z.object({
      id: z.string(),
      order: z.number().int().positive(),
    })
  ),
});

// POST /api/admin/questions/reorder - Reorder questions
export async function POST(request: NextRequest) {
  try {
    const admin = await requirePermission('manage_questions');
    const body = await request.json();
    
    const validation = reorderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const { questions } = validation.data;
    
    // Update all questions in transaction
    await prisma.$transaction(
      questions.map((q) =>
        prisma.whitelistQuestion.update({
          where: { id: q.id },
          data: { order: q.order },
        })
      )
    );
    
    // Log audit
    await logAudit(
      admin.userId,
      'QUESTIONS_REORDERED',
      null,
      'WhitelistQuestion',
      {
        newOrder: questions,
      },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering questions:', error);
    return NextResponse.json(
      { error: 'Failed to reorder questions' },
      { status: 500 }
    );
  }
}
