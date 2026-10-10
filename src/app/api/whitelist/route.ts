import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, logAudit } from '@/lib/permissions';
import { z } from 'zod';

const applicationSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string(),
    answer: z.string().min(1, 'Odpowiedź nie może być pusta'),
  })),
});

// GET /api/whitelist - Get user's applications
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    
    const applications = await prisma.whitelistApplication.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        reviewer: {
          select: {
            discordTag: true,
          },
        },
      },
    });
    
    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

// POST /api/whitelist - Submit new application
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    
    const validation = applicationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const { answers } = validation.data;
    
    const existingActive = await prisma.whitelistApplication.findFirst({
      where: {
        userId: session.user.id,
        status: {
          in: ['SENT', 'IN_REVIEW'],
        },
      },
    });
    
    if (existingActive) {
      return NextResponse.json(
        { error: 'You already have an active application' },
        { status: 400 }
      );
    }
    
    const adminProfile = await prisma.adminUser.findUnique({
      where: { userId: session.user.id },
    });
    
    if (!adminProfile) {
      return NextResponse.json(
        { error: 'Discord profile not found' },
        { status: 400 }
      );
    }
    
    const application = await prisma.whitelistApplication.create({
      data: {
        userId: session.user.id,
        discordId: adminProfile.discordId,
        discordTag: adminProfile.discordTag || 'Unknown',
        answers,
        status: 'SENT',
      },
    });
    
    await logAudit(
      session.user.id,
      'WHITELIST_APPLICATION_SUBMITTED',
      application.id,
      'WhitelistApplication',
      { answers },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );
    
    return NextResponse.json({ 
      success: true, 
      application 
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
