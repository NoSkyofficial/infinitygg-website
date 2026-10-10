import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, logAudit, authErrorResponse } from '@/lib/permissions';
import { discordClient } from '@/lib/discord';
import { z } from 'zod';

const statusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'IN_REVIEW']),
  rejectionReason: z.string().optional(),
});

// PATCH /api/whitelist/[id]/status - Update application status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const admin = await requirePermission('review_applications');
    const body = await request.json();
    
    const validation = statusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const { status, rejectionReason } = validation.data;
    
    const application = await prisma.whitelistApplication.findUnique({
      where: { id: id },
    });
    
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }
    
    const updated = await prisma.whitelistApplication.update({
      where: { id: id },
      data: {
        status,
        reviewedBy: admin.id,
        reviewedAt: new Date(),
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
      },
    });
    
    if (status === 'APPROVED') {
      await discordClient.approveWhitelist(
        application.discordId,
        application.discordTag
      );
    } else if (status === 'REJECTED') {
      await discordClient.rejectWhitelist(
        application.discordId,
        application.discordTag,
        rejectionReason || 'No reason provided'
      );
    }
    
    await logAudit(
      admin.userId,
      `WHITELIST_${status}`,
      application.id,
      'WhitelistApplication',
      {
        previousStatus: application.status,
        newStatus: status,
        rejectionReason,
        applicantId: application.userId,
      },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );
    
    return NextResponse.json({
      success: true,
      application: updated,
    });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    console.error('Error updating application status:', error);
    return NextResponse.json(
      { error: 'Failed to update application status' },
      { status: 500 }
    );
  }
}
