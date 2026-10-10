"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, GitCompare } from "lucide-react";
import PermissionGuard from "@/components/PermissionGuard";
import LoadingSpinner from "@/components/LoadingSpinner";
import AdminHeader from "@/components/AdminHeader";
import VersionDiff from "@/components/VersionDiff";

interface RegulationVersion {
  id: string;
  version: number;
  content: string;
  createdAt: string;
  user: {
    name: string;
  };
}

export default function CompareRegulationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [version1, setVersion1] = useState<RegulationVersion | null>(null);
  const [version2, setVersion2] = useState<RegulationVersion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const v1Id = searchParams.get("v1");
    const v2Id = searchParams.get("v2");

    if (v1Id && v2Id) {
      loadVersions(v1Id, v2Id);
    } else {
      router.push("/admin/regulations/history");
    }
  }, [searchParams]);

  const loadVersions = async (v1Id: string, v2Id: string) => {
    try {
      const [res1, res2] = await Promise.all([
        fetch(`/api/regulations/version/${v1Id}`),
        fetch(`/api/regulations/version/${v2Id}`),
      ]);

      if (res1.ok && res2.ok) {
        const data1 = await res1.json();
        const data2 = await res2.json();
        setVersion1(data1.version);
        setVersion2(data2.version);
      }
    } catch (error) {
      console.error("Failed to load versions:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PermissionGuard permission="edit_regulations">
        <LoadingSpinner fullScreen text="Ładowanie porównania..." />
      </PermissionGuard>
    );
  }

  if (!version1 || !version2) {
    return (
      <PermissionGuard permission="edit_regulations">
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white text-xl mb-4">Nie znaleziono wersji</p>
            <button
              onClick={() => router.push("/admin/regulations/history")}
              className="px-6 py-3 bg-[#26a69a] hover:bg-[#00897b] text-white rounded-lg"
            >
              Powrót do historii
            </button>
          </div>
        </div>
      </PermissionGuard>
    );
  }

  return (
    <PermissionGuard permission="edit_regulations">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <AdminHeader
          icon={GitCompare}
          title="Porównanie Wersji"
          description={`Wersja ${version1.version} vs Wersja ${version2.version}`}
          actions={
            <button
              onClick={() => router.push("/admin/regulations/history")}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Powrót
            </button>
          }
        />

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900/40 backdrop-blur-sm border border-[#26a69a]/20 rounded-2xl p-6">
            <h3 className="text-white font-bold text-lg mb-3">Wersja {version1.version}</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Autor: {version1.user.name}</p>
              <p>Data: {new Date(version1.createdAt).toLocaleString("pl-PL")}</p>
            </div>
          </div>
          <div className="bg-gray-900/40 backdrop-blur-sm border border-[#26a69a]/20 rounded-2xl p-6">
            <h3 className="text-white font-bold text-lg mb-3">Wersja {version2.version}</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Autor: {version2.user.name}</p>
              <p>Data: {new Date(version2.createdAt).toLocaleString("pl-PL")}</p>
            </div>
          </div>
        </div>

        <VersionDiff
          oldContent={version1.content}
          newContent={version2.content}
          oldVersion={version1.version}
          newVersion={version2.version}
        />
      </div>
    </PermissionGuard>
  );
}