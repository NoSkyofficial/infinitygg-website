import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/permissions';

export async function GET() {
  try {
    await requireAdmin();
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const [
      pendingApplications,
      totalApplications,
      approvedThisWeek,
      rejectedThisWeek,
      activeAdmins,
      regulationVersions,
    ] = await Promise.all([
      // Pending applications
      prisma.whitelistApplication.count({
        where: {
          status: {
            in: ['SENT', 'IN_REVIEW'],
          },
        },
      }),
      // Total applications
      prisma.whitelistApplication.count(),
      // Approved this week
      prisma.whitelistApplication.count({
        where: {
          status: 'APPROVED',
          reviewedAt: {
            gte: sevenDaysAgo,
          },
        },
      }),
      // Rejected this week
      prisma.whitelistApplication.count({
        where: {
          status: 'REJECTED',
          reviewedAt: {
            gte: sevenDaysAgo,
          },
        },
      }),
      // Active admins
      prisma.adminUser.count({
        where: {
          active: true,
        },
      }),
      // Regulation versions
      prisma.regulationVersion.count(),
    ]);
    
    return NextResponse.json({
      pendingApplications,
      totalApplications,
      approvedThisWeek,
      rejectedThisWeek,
      activeAdmins,
      regulationVersions,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
