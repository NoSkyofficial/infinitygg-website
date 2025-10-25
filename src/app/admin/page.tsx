"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Users,
  FileText,
  List,
  Settings,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
} from "lucide-react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    pendingApplications: 0,
    totalApplications: 0,
    approvedThisWeek: 0,
    rejectedThisWeek: 0,
    activeAdmins: 0,
    regulationVersions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      loadStats();
    }
  }, [status, router]);

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Ładowanie...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const admin = (session.user as any).admin;
  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Brak dostępu</h1>
          <p className="text-gray-400">Nie masz uprawnień admina.</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Oczekujące podania",
      value: stats.pendingApplications,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Wszystkie podania",
      value: stats.totalApplications,
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Zaakceptowane (7 dni)",
      value: stats.approvedThisWeek,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Odrzucone (7 dni)",
      value: stats.rejectedThisWeek,
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ];

  const quickActions = [
    {
      title: "Zarządzanie użytkownikami",
      description: "Zarządzaj rolami i uprawnieniami adminów",
      icon: Users,
      href: "/admin/users",
      color: "from-purple-500 to-purple-600",
      permission: "manage_users",
    },
    {
      title: "Whitelist Management",
      description: "Przeglądaj i zarządzaj podaniami",
      icon: List,
      href: "/admin/whitelist",
      color: "from-blue-500 to-blue-600",
      permission: "view_applications",
    },
    {
      title: "Pytania Whitelist",
      description: "Edytuj pytania w formularzu",
      icon: FileText,
      href: "/admin/questions",
      color: "from-green-500 to-green-600",
      permission: "manage_questions",
    },
    {
      title: "Edycja treści",
      description: "Regulamin, FAQ i inne strony",
      icon: FileText,
      href: "/admin/content",
      color: "from-teal-500 to-teal-600",
      permission: "edit_content",
    },
    {
      title: "Ustawienia systemu",
      description: "Konfiguracja serwera i funkcji",
      icon: Settings,
      href: "/admin/settings",
      color: "from-gray-500 to-gray-600",
      permission: "manage_system",
    },
    {
      title: "Logi audytu",
      description: "Historia działań adminów",
      icon: Activity,
      href: "/admin/audit",
      color: "from-orange-500 to-orange-600",
      permission: "view_audit_logs",
    },
  ];

  const hasPermission = (permission: string) => {
    if (admin.role === "root" || admin.permissions.includes("all")) {
      return true;
    }
    return admin.permissions.includes(permission);
  };

  const filteredActions = quickActions.filter((action) =>
    hasPermission(action.permission)
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-[#1a2f2a]" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#26a69a]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#00897b]/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="bg-gray-900/95 backdrop-blur-md border-b border-[#26a69a]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Panel <span className="text-[#26a69a]">Administratora</span>
              </h1>
              <p className="text-gray-400 mt-1">
                Witaj, {session.user?.name || "Admin"} ({admin.role})
              </p>
            </div>
            <a
              href="/"
              className="text-gray-400 hover:text-[#26a69a] transition-colors"
            >
              ← Strona główna
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-900/80 backdrop-blur-sm border border-[#26a69a]/20 rounded-2xl p-6 hover:border-[#26a69a]/40 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-400 text-sm">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Szybkie akcje</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="group bg-gray-900/80 backdrop-blur-sm border border-[#26a69a]/20 rounded-2xl p-6 hover:border-[#26a69a]/40 transition-all hover:scale-105"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#26a69a] transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Activity Overview */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-[#26a69a]/20 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <Activity className="w-5 h-5 text-[#26a69a] mr-2" />
            <h2 className="text-xl font-bold text-white">
              Aktywność systemu
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-800/50 rounded-xl">
              <p className="text-3xl font-bold text-[#26a69a] mb-1">
                {stats.pendingApplications}
              </p>
              <p className="text-gray-400 text-sm">Oczekujące podania WL</p>
            </div>
            <div className="text-center p-4 bg-gray-800/50 rounded-xl">
              <p className="text-3xl font-bold text-[#26a69a] mb-1">
                {stats.regulationVersions}
              </p>
              <p className="text-gray-400 text-sm">Wersje regulaminu</p>
            </div>
            <div className="text-center p-4 bg-gray-800/50 rounded-xl">
              <p className="text-3xl font-bold text-[#26a69a] mb-1">
                {stats.activeAdmins}
              </p>
              <p className="text-gray-400 text-sm">Aktywni adminowie</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
