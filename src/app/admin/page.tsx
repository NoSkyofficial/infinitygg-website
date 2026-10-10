"use client";

import { useEffect, useState } from "react";
import {
  Users,
  FileText,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/LoadingSpinner";
import AdminHeader from "@/components/AdminHeader";

interface Stats {
  totalUsers: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  recentActivity: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

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

  if (loading) {
    return <LoadingSpinner fullScreen text="Ładowanie dashboardu..." />;
  }

  const admin = (session?.user as any)?.admin;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <AdminHeader
        icon={LayoutDashboard}
        title="Dashboard"
        description="Przegląd systemu i statystyki"
      />

      <div className="mb-8 bg-gradient-to-br from-[#26a69a]/20 via-gray-900/40 to-transparent backdrop-blur-sm border border-[#26a69a]/30 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <img
            src={session?.user?.image || ""}
            alt={session?.user?.name || "User"}
            className="w-16 h-16 rounded-full ring-2 ring-[#26a69a]/50"
          />
          <div>
            <h2 className="text-2xl font-bold text-white">
              Witaj, {session?.user?.name}! 👋
            </h2>
            <p className="text-gray-400">
              Rola: <span className="text-[#26a69a] font-medium">{admin?.role}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900/40 backdrop-blur-sm border border-[#26a69a]/20 rounded-2xl p-6 hover:border-[#26a69a]/40 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-gray-500 text-sm">Total</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            {stats?.totalUsers || 0}
          </h3>
          <p className="text-gray-400 text-sm">Administratorzy</p>
        </div>

        <div className="bg-gray-900/40 backdrop-blur-sm border border-[#26a69a]/20 rounded-2xl p-6 hover:border-[#26a69a]/40 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-gray-500 text-sm">Total</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            {stats?.totalApplications || 0}
          </h3>
          <p className="text-gray-400 text-sm">Wszystkie podania</p>
        </div>

        <div className="bg-gray-900/40 backdrop-blur-sm border border-[#26a69a]/20 rounded-2xl p-6 hover:border-[#26a69a]/40 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#26a69a]/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-[#26a69a]" />
            </div>
            <span className="text-gray-500 text-sm">24h</span>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            {stats?.recentActivity || 0}
          </h3>
          <p className="text-gray-400 text-sm">Aktywność</p>
        </div>

        <div className="bg-gray-900/40 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6 hover:border-yellow-500/40 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <TrendingUp className="w-4 h-4 text-yellow-400" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            {stats?.pendingApplications || 0}
          </h3>
          <p className="text-gray-400 text-sm">Oczekujące</p>
        </div>

        <div className="bg-gray-900/40 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 hover:border-green-500/40 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            {stats?.approvedApplications || 0}
          </h3>
          <p className="text-gray-400 text-sm">Zaakceptowane</p>
        </div>

        <div className="bg-gray-900/40 backdrop-blur-sm border border-red-500/20 rounded-2xl p-6 hover:border-red-500/40 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
            <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            {stats?.rejectedApplications || 0}
          </h3>
          <p className="text-gray-400 text-sm">Odrzucone</p>
        </div>
      </div>

      <div className="bg-gray-900/40 backdrop-blur-sm border border-[#26a69a]/20 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#26a69a]" />
          Szybkie akcje
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/users"
            className="p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all group"
          >
            <Users className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-medium mb-1">Użytkownicy</h3>
            <p className="text-gray-400 text-sm">Zarządzaj adminami</p>
          </Link>

          <Link
            href="/admin/whitelist"
            className="p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all group"
          >
            <FileText className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-medium mb-1">Podania</h3>
            <p className="text-gray-400 text-sm">Sprawdź whitelist</p>
          </Link>

          <Link
            href="/admin/audit"
            className="p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all group"
          >
            <Activity className="w-6 h-6 text-[#26a69a] mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-medium mb-1">Logi</h3>
            <p className="text-gray-400 text-sm">Historia zmian</p>
          </Link>

          <Link
            href="/admin/settings"
            className="p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all group"
          >
            <AlertCircle className="w-6 h-6 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-medium mb-1">Ustawienia</h3>
            <p className="text-gray-400 text-sm">Konfiguracja</p>
          </Link>
        </div>
      </div>
    </div>
  );
}