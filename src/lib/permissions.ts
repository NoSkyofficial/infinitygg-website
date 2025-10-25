import { AdminRole } from '@prisma/client';
import { getServerSession } from './auth';
import { prisma } from './prisma';

export type Permission =
  | 'edit_regulations'
  | 'edit_content'
  | 'manage_users'
  | 'manage_whitelist'
  | 'view_audit_logs'
  | 'manage_system'
  | 'manage_questions'
  | 'view_applications'
  | 'review_applications'
  | 'all';

export const RolePermissions: Record<AdminRole, Permission[]> = {
  root: ['all'],
  contentEditor: [
    'edit_regulations',
    'edit_content',
    'view_audit_logs',
  ],
  InfinityGG_Team: [
    'view_audit_logs',
    'view_applications',
  ],
  Whitelist_Checker: [
    'view_applications',
    'review_applications',
    'manage_whitelist',
  ],
};

/**
 * Check if a role has a specific permission
 */
export function roleHasPermission(role: AdminRole, permission: Permission): boolean {
  const permissions = RolePermissions[role];
  return permissions.includes('all') || permissions.includes(permission);
}

/**
 * Check if user has specific permission (including custom permissions)
 */
export function userHasPermission(
  role: AdminRole,
  customPermissions: string[],
  permission: Permission
): boolean {
  // Check if user has 'all' permission
  if (customPermissions.includes('all')) return true;
  
  // Check custom permissions
  if (customPermissions.includes(permission)) return true;
  
  // Check role permissions
  return roleHasPermission(role, permission);
}

/**
 * Get current user's admin profile
 */
export async function getCurrentAdmin() {
  const session = await getServerSession();
  if (!session?.user?.id) return null;

  const admin = await prisma.adminUser.findUnique({
    where: { userId: session.user.id },
    include: {
      user: true,
    },
  });

  return admin;
}

/**
 * Require authentication middleware
 */
export async function requireAuth() {
  const session = await getServerSession();
  if (!session?.user) {
    throw new Error('Authentication required');
  }
  return session;
}

/**
 * Require admin middleware
 */
export async function requireAdmin() {
  const session = await requireAuth();
  const admin = await getCurrentAdmin();
  
  if (!admin || !admin.active) {
    throw new Error('Admin access required');
  }
  
  return { session, admin };
}

/**
 * Require specific permission middleware
 */
export async function requirePermission(permission: Permission) {
  const { admin } = await requireAdmin();
  
  const hasPermission = userHasPermission(
    admin.role,
    admin.permissions,
    permission
  );
  
  if (!hasPermission) {
    throw new Error(`Permission denied: ${permission}`);
  }
  
  return admin;
}

/**
 * Check if current user has permission (returns boolean instead of throwing)
 */
export async function checkPermission(permission: Permission): Promise<boolean> {
  try {
    const admin = await getCurrentAdmin();
    if (!admin || !admin.active) return false;
    
    return userHasPermission(admin.role, admin.permissions, permission);
  } catch {
    return false;
  }
}

/**
 * Log audit event
 */
export async function logAudit(
  userId: string,
  action: string,
  target?: string,
  targetType?: string,
  details?: any,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        target,
        targetType,
        details: details || {},
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
}

/**
 * Middleware wrapper for API routes
 */
export function withAuth(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    try {
      await requireAuth();
      return handler(req, ...args);
    } catch (error) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  };
}

export function withAdmin(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    try {
      const { admin } = await requireAdmin();
      return handler(req, { admin }, ...args);
    } catch (error) {
      return Response.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
  };
}

export function withPermission(permission: Permission, handler: Function) {
  return async (req: Request, ...args: any[]) => {
    try {
      const admin = await requirePermission(permission);
      return handler(req, { admin }, ...args);
    } catch (error) {
      return Response.json(
        { error: `Permission denied: ${permission}` },
        { status: 403 }
      );
    }
  };
}
