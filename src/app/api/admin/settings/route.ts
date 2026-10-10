import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission, logAudit, authErrorResponse } from '@/lib/permissions';
import { z } from 'zod';

const settingsSchema = z.object({
  settings: z.record(z.any()),
});

// PUT /api/admin/settings - Update system settings
export async function PUT(request: NextRequest) {
  try {
    const admin = await requirePermission('manage_system');
    const body = await request.json();
    
    const validation = settingsSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const { settings } = validation.data;
    
    const updates = await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        prisma.systemSettings.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );
    
    await logAudit(
      admin.userId,
      'SYSTEM_SETTINGS_CHANGED',
      undefined,
      'SystemSettings',
      {
        changedSettings: Object.keys(settings),
      },
      request.headers.get('x-forwarded-for') || undefined,
      request.headers.get('user-agent') || undefined
    );
    
    return NextResponse.json({ success: true, settings: updates });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
