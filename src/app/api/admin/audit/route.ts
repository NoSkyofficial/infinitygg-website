import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, authErrorResponse } from '@/lib/permissions';

export async function GET(request: NextRequest) {
  try {
    await requirePermission('view_audit_logs');
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const filter = searchParams.get('filter');
    const userId = searchParams.get('userId');
    
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (filter && filter !== 'all') {
      where.action = {
        contains: filter.toUpperCase(),
      };
    }
    
    if (userId && userId !== 'all') {
      where.userId = userId;
    }
    
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);
    
    return NextResponse.json({ logs, total, page, limit });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}