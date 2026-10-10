import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, logAudit } from '@/lib/permissions';
import { z } from 'zod';

const questionSchema = z.object({
  question: z.string().min(1, 'Question cannot be empty').optional(),
  order: z.number().int().positive().optional(),
  active: z.boolean().optional(),
  required: z.boolean().optional(),
});

// PATCH /api/admin/questions/[id] - Update question
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const admin = await requirePermission('manage_questions');
    const body = await request.json();
    
    const validation = questionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const data = validation.data;
    
    const currentQuestion = await prisma.whitelistQuestion.findUnique({
      where: { id: id },
    });
    
    if (!currentQuestion) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }
    
    const updated = await prisma.whitelistQuestion.update({
      where: { id: id },
      data,
    });
    
    await logAudit(
      admin.userId,
      'QUESTION_UPDATED',
      updated.id,
      'WhitelistQuestion',
      {
        previous: currentQuestion,
        updated: data,
      },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );
    
    return NextResponse.json({ success: true, question: updated });
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/questions/[id] - Delete question
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const admin = await requirePermission('manage_questions');
    
    const question = await prisma.whitelistQuestion.findUnique({
      where: { id: id },
    });
    
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }
    
    await prisma.whitelistQuestion.delete({
      where: { id: id },
    });
    
    await logAudit(
      admin.userId,
      'QUESTION_DELETED',
      id,
      'WhitelistQuestion',
      {
        deletedQuestion: question.question,
        order: question.order,
      },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    );
  }
}
