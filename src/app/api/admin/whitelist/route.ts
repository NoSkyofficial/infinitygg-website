import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, authErrorResponse } from '@/lib/permissions';

// GET /api/admin/whitelist - Get all applications (admin only)
export async function GET(request: NextRequest) {
  try {
    await requirePermission('view_applications');
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    
    const applications = await prisma.whitelistApplication.findMany({
      where,
      orderBy: {
        [sort]: order,
      },
      include: {
        reviewer: {
          select: {
            discordTag: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });
    
    return NextResponse.json({ applications });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
