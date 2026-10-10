import { AdminRole } from '@prisma/client';
import { getServerSession } from './auth';
import { prisma } from './prisma';

/**
 * Błąd autoryzacji z kodem HTTP. Trasy API mapują go na 401/403 zamiast 500.
 */
export class AuthError extends Error {
  status: 401 | 403;
  constructor(status: 401 | 403, message: string) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

/**
 * Zwraca odpowiedź 401/403 dla AuthError, w pozostałych przypadkach null.
 */
export function authErrorResponse(error: unknown): Response | null {
  if (error instanceof AuthError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  return null;
}

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
  if (customPermissions.includes('all')) return true;
  
  if (customPermissions.includes(permission)) return true;
  
  return roleHasPermission(role, permission);
}

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

export async function requireAuth() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    throw new AuthError(401, 'Wymagane zalogowanie');
  }
  return session as typeof session & { user: { id: string } };
}

export async function requireAdmin() {
  const session = await requireAuth();
  const admin = await getCurrentAdmin();
  
  if (!admin || !admin.active) {
    throw new AuthError(403, 'Wymagany dostęp administratora');
  }
  
  return { session, admin };
}

export async function requirePermission(permission: Permission) {
  const { admin } = await requireAdmin();
  
  const hasPermission = userHasPermission(
    admin.role,
    admin.permissions,
    permission
  );
  
  if (!hasPermission) {
    throw new AuthError(403, `Brak uprawnienia: ${permission}`);
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

export function withAuth(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    try {
      await requireAuth();
      return await handler(req, ...args);
    } catch (error) {
      return Response.json(
        { error: 'Wymagane zalogowanie' },
        { status: 401 }
      );
    }
  };
}

export function withAdmin(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    try {
      const { admin } = await requireAdmin();
      return await handler(req, { admin }, ...args);
    } catch (error) {
      return Response.json(
        { error: 'Wymagany dostęp administratora' },
        { status: 403 }
      );
    }
  };
}

export function withPermission(permission: Permission, handler: Function) {
  return async (req: Request, ...args: any[]) => {
    try {
      const admin = await requirePermission(permission);
      return await handler(req, { admin }, ...args);
    } catch (error) {
      return Response.json(
        { error: `Brak uprawnienia: ${permission}` },
        { status: 403 }
      );
    }
  };
}
