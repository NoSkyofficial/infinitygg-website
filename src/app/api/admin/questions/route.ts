import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, logAudit, authErrorResponse } from '@/lib/permissions';
import { z } from 'zod';

const questionSchema = z.object({
  question: z.string().min(1, 'Question cannot be empty'),
  order: z.number().int().positive(),
  active: z.boolean().default(true),
  required: z.boolean().default(true),
});

// GET /api/admin/questions - Get all questions
export async function GET() {
  try {
    const questions = await prisma.whitelistQuestion.findMany({
      orderBy: {
        order: 'asc',
      },
    });
    
    return NextResponse.json({ questions });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

// POST /api/admin/questions - Create new question
export async function POST(request: NextRequest) {
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
    
    const question = await prisma.whitelistQuestion.create({
      data,
    });
    
    await logAudit(
      admin.userId,
      'QUESTION_CREATED',
      question.id,
      'WhitelistQuestion',
      data,
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );
    
    return NextResponse.json({
      success: true,
      question,
    });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
}
