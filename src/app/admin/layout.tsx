"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Activity,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
}

const navigation: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Użytkownicy", icon: Users, permission: "manage_users" },
  { href: "/admin/whitelist", label: "Podania WL", icon: FileText, permission: "view_applications" },
  { href: "/admin/whitelist/questions", label: "Pytania WL", icon: FileText, permission: "manage_questions" },
  { href: "/admin/regulations/history", label: "Regulamin", icon: FileText, permission: "edit_regulations" },
  { href: "/admin/audit", label: "Logi Audytu", icon: Activity, permission: "view_audit_logs" },
  { href: "/admin/settings", label: "Ustawienia", icon: Settings, permission: "manage_system" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <LoadingSpinner fullScreen />;
  }

  if (!session) {
    return null;
  }

  const admin = (session.user as any)?.admin;
  const hasPermission = (permission?: string) => {
    if (!permission) return true;
    if (!admin) return false;
    if (admin.permissions?.includes("all")) return true;
    return admin.permissions?.includes(permission);
  };

  const visibleNavigation = navigation.filter((item) => hasPermission(item.permission));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-gray-800 rounded-lg text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-900/95 backdrop-blur-sm border-r border-[#26a69a]/20 transform transition-transform duration-300 z-40 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6 border-b border-[#26a69a]/20 flex-shrink-0">
          <h1 className="text-2xl font-bold text-white mb-1">InfinityGG</h1>
          <p className="text-sm text-gray-400">Admin Panel</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {visibleNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-6 py-3 text-gray-300 hover:bg-[#26a69a]/10 hover:text-white transition-colors ${
                  isActive ? "bg-[#26a69a]/20 text-white border-r-2 border-[#26a69a]" : ""
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-[#26a69a]/20 flex-shrink-0">
          <div className="flex items-center mb-4">
            <img
              src={session.user?.image || ""}
              alt={session.user?.name || "User"}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{session.user?.name}</p>
              <p className="text-gray-400 text-xs truncate flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                {admin?.role || "User"}
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push("/api/auth/signout")}
            className="w-full flex items-center justify-center px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Wyloguj
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 min-h-screen">
        {children}
      </main>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}