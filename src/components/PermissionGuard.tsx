"use client";

import { useSession } from "next-auth/react";
import { Shield, Lock } from "lucide-react";

interface PermissionGuardProps {
  permission: string | string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function PermissionGuard({
  permission,
  children,
  fallback,
}: PermissionGuardProps) {
  const { data: session } = useSession();
  const admin = (session?.user as any)?.admin;

  const hasPermission = () => {
    if (!admin) return false;
    if (admin.permissions?.includes("all")) return true;

    const requiredPermissions = Array.isArray(permission) ? permission : [permission];
    return requiredPermissions.some((perm) => admin.permissions?.includes(perm));
  };

  if (!hasPermission()) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-sm border border-red-500/20 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Brak Uprawnień</h2>
            <p className="text-gray-400 mb-6">
              Nie masz uprawnień do przeglądania tej strony. Skontaktuj się z administratorem,
              jeśli uważasz, że to błąd.
            </p>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-500 text-sm mb-2">Twoja rola:</p>
              <div className="flex items-center justify-center text-[#26a69a]">
                <Shield className="w-4 h-4 mr-2" />
                <span className="font-medium">{admin?.role || "Brak"}</span>
              </div>
            </div>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}