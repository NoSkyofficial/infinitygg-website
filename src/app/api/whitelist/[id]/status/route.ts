import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, logAudit } from '@/lib/permissions';
import { discordClient } from '@/lib/discord';
import { z } from 'zod';

const statusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'IN_REVIEW']),
  rejectionReason: z.string().optional(),
});

// PATCH /api/whitelist/[id]/status - Update application status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requirePermission('review_applications');
    const body = await request.json();
    
    // Validate input
    const validation = statusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const { status, rejectionReason } = validation.data;
    
    // Get application
    const application = await prisma.whitelistApplication.findUnique({
      where: { id: params.id },
    });
    
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }
    
    // Update application
    const updated = await prisma.whitelistApplication.update({
      where: { id: params.id },
      data: {
        status,
        reviewedBy: admin.id,
        reviewedAt: new Date(),
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
      },
    });
    
    // Handle Discord notifications and role assignment
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
    
    // Log audit
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
    console.error('Error updating application status:', error);
    return NextResponse.json(
      { error: 'Failed to update application status' },
      { status: 500 }
    );
  }
}
