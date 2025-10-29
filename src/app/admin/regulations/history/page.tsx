"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, User, RotateCcw, GitCompare, Edit } from "lucide-react";
import PermissionGuard from "@/components/PermissionGuard";
import LoadingSpinner from "@/components/LoadingSpinner";
import AdminHeader from "@/components/AdminHeader";

interface RegulationVersion {
  id: string;
  version: number;
  content: string;
  comment: string | null;
  createdAt: string;
  updatedBy: string;
  user: {
    name: string;
    image: string;
  };
}

export default function RegulationsHistoryPage() {
  const router = useRouter();
  const [versions, setVersions] = useState<RegulationVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = async () => {
    try {
      const response = await fetch("/api/regulations/versions");
      if (response.ok) {
        const data = await response.json();
        setVersions(data.versions || []);
      }
    } catch (error) {
      console.error("Failed to load versions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (versionId: string) => {
    if (!confirm("Czy na pewno chcesz przywrócić tę wersję?")) return;

    try {
      const response = await fetch(`/api/regulations/restore/${versionId}`, {
        method: "POST",
      });

      if (response.ok) {
        alert("Wersja przywrócona!");
        loadVersions();
      } else {
        alert("Błąd podczas przywracania");
      }
    } catch (error) {
      console.error("Error restoring version:", error);
      alert("Wystąpił błąd");
    }
  };

  const handleCompare = () => {
    if (selectedVersions.length !== 2) {
      alert("Wybierz dokładnie 2 wersje do porównania");
      return;
    }
    router.push(`/admin/regulations/compare?v1=${selectedVersions[0]}&v2=${selectedVersions[1]}`);
  };

  const toggleVersionSelection = (versionId: string) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(selectedVersions.filter((id) => id !== versionId));
    } else {
      if (selectedVersions.length >= 2) {
        alert("Możesz wybrać maksymalnie 2 wersje");
        return;
      }
      setSelectedVersions([...selectedVersions, versionId]);
    }
  };

  if (loading) {
    return (
      <PermissionGuard permission="edit_regulations">
        <LoadingSpinner fullScreen text="Ładowanie historii..." />
      </PermissionGuard>
    );
  }

  return (
    <PermissionGuard permission="edit_regulations">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <AdminHeader
          icon={Clock}
          title="Historia Regulaminu"
          description="Przeglądaj wszystkie wersje regulaminu"
          actions={
            <div className="flex gap-3">
              <button
                onClick={handleCompare}
                disabled={selectedVersions.length !== 2}
                className="px-4 py-2 bg-[#26a69a] hover:bg-[#00897b] text-white rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <GitCompare className="w-4 h-4 mr-2" />
                Porównaj ({selectedVersions.length}/2)
              </button>
              <button
                onClick={() => router.push("/admin/regulations/edit")}
                className="px-4 py-2 bg-gradient-to-r from-[#26a69a] to-[#00897b] hover:from-[#00897b] hover:to-[#26a69a] text-white rounded-lg transition-all flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edytuj
              </button>
            </div>
          }
        />

        {/* Versions List */}
        <div className="max-w-6xl mx-auto space-y-4">
          {versions.map((version, index) => (
            <div
              key={version.id}
              className={`bg-gray-900/40 backdrop-blur-sm border rounded-2xl p-6 transition-all ${
                selectedVersions.includes(version.id)
                  ? "border-[#26a69a] ring-2 ring-[#26a69a]/50"
                  : "border-[#26a69a]/20 hover:border-[#26a69a]/40"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedVersions.includes(version.id)}
                    onChange={() => toggleVersionSelection(version.id)}
                    className="mt-1 w-5 h-5 text-[#26a69a] bg-gray-700 border-gray-600 rounded focus:ring-[#26a69a]"
                  />

                  {/* Version Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#26a69a] to-[#00897b] rounded-2xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">v{version.version}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-semibold text-lg">
                        Wersja {version.version}
                      </h3>
                      {index === 0 && (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                          Aktualna
                        </span>
                      )}
                    </div>

                    {version.comment && (
                      <p className="text-gray-300 mb-3">{version.comment}</p>
                    )}

                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <img
                          src={version.user.image}
                          alt={version.user.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span>{version.user.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(version.createdAt).toLocaleString("pl-PL")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {index !== 0 && (
                  <button
                    onClick={() => handleRestore(version.id)}
                    className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors flex items-center"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Przywróć
                  </button>
                )}
              </div>
            </div>
          ))}

          {versions.length === 0 && (
            <div className="bg-gray-900/40 backdrop-blur-sm border border-[#26a69a]/20 rounded-2xl p-12 text-center">
              <p className="text-gray-400">Brak wersji regulaminu</p>
            </div>
          )}
        </div>
      </div>
    </PermissionGuard>
  );
}