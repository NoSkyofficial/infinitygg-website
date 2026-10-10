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
      prisma.whitelistApplication.count({
        where: {
          status: {
            in: ['SENT', 'IN_REVIEW'],
          },
        },
      }),
      prisma.whitelistApplication.count(),
      prisma.whitelistApplication.count({
        where: {
          status: 'APPROVED',
          reviewedAt: {
            gte: sevenDaysAgo,
          },
        },
      }),
      prisma.whitelistApplication.count({
        where: {
          status: 'REJECTED',
          reviewedAt: {
            gte: sevenDaysAgo,
          },
        },
      }),
      prisma.adminUser.count({
        where: {
          active: true,
        },
      }),
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
