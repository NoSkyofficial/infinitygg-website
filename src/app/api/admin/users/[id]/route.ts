import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, logAudit } from '@/lib/permissions';
import { z } from 'zod';

const updateUserSchema = z.object({
  role: z.enum(['root', 'contentEditor', 'InfinityGG_Team', 'Whitelist_Checker']).optional(),
  permissions: z.array(z.string()).optional(),
  active: z.boolean().optional(),
});

// PATCH /api/admin/users/[id] - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requirePermission('manage_users');
    const body = await request.json();
    
    const validation = updateUserSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const data = validation.data;
    
    const currentUser = await prisma.adminUser.findUnique({
      where: { id: params.id },
    });
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const updated = await prisma.adminUser.update({
      where: { id: params.id },
      data,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    
    await logAudit(
      admin.userId,
      'USER_ROLE_CHANGED',
      updated.id,
      'AdminUser',
      {
        previousRole: currentUser.role,
        newRole: data.role,
        previousPermissions: currentUser.permissions,
        newPermissions: data.permissions,
        previousActive: currentUser.active,
        newActive: data.active,
      },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );
    
    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requirePermission('manage_users');
    
    const user = await prisma.adminUser.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    await prisma.adminUser.delete({
      where: { id: params.id },
    });
    
    await logAudit(
      admin.userId,
      'USER_DELETED',
      params.id,
      'AdminUser',
      {
        deletedUser: user.user.name,
        role: user.role,
      },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}