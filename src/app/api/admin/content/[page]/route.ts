import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, logAudit } from '@/lib/permissions';
import { z } from 'zod';

const contentSchema = z.object({
  content: z.any(),
});

// GET /api/admin/content/[page] - Get specific page content
export async function GET(
  request: NextRequest,
  { params }: { params: { page: string } }
) {
  try {
    await requirePermission('edit_content');
    
    const content = await prisma.pageContent.findUnique({
      where: { page: params.page },
    });
    
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/content/[page] - Update specific page content
export async function PUT(
  request: NextRequest,
  { params }: { params: { page: string } }
) {
  try {
    const admin = await requirePermission('edit_content');
    const body = await request.json();
    
    const validation = contentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const { content } = validation.data;
    
    // Upsert page content
    const updated = await prisma.pageContent.upsert({
      where: { page: params.page },
      update: {
        content,
        updatedBy: admin.userId,
      },
      create: {
        page: params.page,
        content,
        updatedBy: admin.userId,
      },
    });
    
    // Log audit
    await logAudit(
      admin.userId,
      'CONTENT_UPDATED',
      updated.id,
      'PageContent',
      {
        page: params.page,
      },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );
    
    return NextResponse.json({ success: true, content: updated });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}
