"use client";

import { useEffect, useState } from "react";
import { FileText, Check, X, Search, Calendar, User, MessageCircle } from "lucide-react";
import PermissionGuard from "@/components/PermissionGuard";
import AdminHeader from "@/components/AdminHeader";
import LoadingSpinner from "@/components/LoadingSpinner";

interface WhitelistApplication {
  id: string;
  userId: string;
  discordId: string;
  discordTag: string;
  answers: any[];
  status: string;
  priority: boolean;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  SENT: "Wysłane",
  IN_REVIEW: "W trakcie",
  APPROVED: "Zaakceptowane",
  REJECTED: "Odrzucone",
};

const STATUS_COLORS: Record<string, string> = {
  SENT: "blue",
  IN_REVIEW: "yellow",
  APPROVED: "green",
  REJECTED: "red",
};

export default function AdminWhitelistPage() {
  const [applications, setApplications] = useState<WhitelistApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("SENT");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<WhitelistApplication | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await fetch("/api/admin/whitelist");
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error("Failed to load applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = (app: WhitelistApplication) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const handleApprove = async (id: string) => {
    if (!confirm("Czy na pewno chcesz zaakceptować to podanie?")) return;

    try {
      const response = await fetch(`/api/whitelist/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED" }),
      });

      if (response.ok) {
        alert("Podanie zaakceptowane!");
        setShowModal(false);
        loadApplications();
      } else {
        alert("Błąd podczas akceptacji");
      }
    } catch (error) {
      console.error("Error approving application:", error);
      alert("Wystąpił błąd");
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectionReason.trim()) {
      alert("Podaj powód odrzucenia");
      return;
    }

    try {
      const response = await fetch(`/api/whitelist/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "REJECTED",
          rejectionReason,
        }),
      });

      if (response.ok) {
        alert("Podanie odrzucone!");
        setShowModal(false);
        setRejectionReason("");
        loadApplications();
      } else {
        alert("Błąd podczas odrzucania");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      alert("Wystąpił błąd");
    }
  };

  const filteredApplications = applications
    .filter((app) => (filter === "ALL" ? true : app.status === filter))
    .filter((app) =>
      searchQuery
        ? app.discordId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.discordTag.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

  if (loading && applications.length === 0) {
  return (
    <PermissionGuard permission="view_applications">
      <LoadingSpinner fullScreen text="Ładowanie podań..." />
    </PermissionGuard>
  );
}

  return (
  <PermissionGuard permission="view_applications">
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <AdminHeader
        icon={FileText}
        title="Zarządzanie Whitelist"
        description="Przeglądaj i zarządzaj podaniami"
      />

        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex gap-2">
            {["ALL", "SENT", "IN_REVIEW", "APPROVED", "REJECTED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === status
                    ? "bg-[#26a69a] text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {status === "ALL" ? "Wszystkie" : STATUS_LABELS[status] || status}
              </button>
            ))}
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Szukaj po Discord ID lub nick..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-sm border border-[#26a69a]/20 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#26a69a]/20">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Discord ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Nick
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Data utworzenia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26a69a]/10">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <code className="text-[#26a69a]">{app.discordId}</code>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-white font-medium">{app.discordTag}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${
                          STATUS_COLORS[app.status]
                        }-500/20 text-${STATUS_COLORS[app.status]}-400`}
                      >
                        {STATUS_LABELS[app.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(app.createdAt).toLocaleString("pl-PL", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewApplication(app)}
                        className="px-4 py-2 bg-[#26a69a] hover:bg-[#00897b] text-white rounded-lg transition-colors text-sm"
                      >
                        Podgląd
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="p-12 text-center text-gray-400">Brak podań do wyświetlenia</div>
          )}
        </div>

        {showModal && selectedApp && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-[#26a69a]/30 rounded-2xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Podanie Whitelist</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedApp(null);
                    setRejectionReason("");
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Discord ID</p>
                    <code className="text-[#26a69a] font-mono">{selectedApp.discordId}</code>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Nick</p>
                    <p className="text-white font-medium">{selectedApp.discordTag}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Data utworzenia</p>
                    <p className="text-white">
                      {new Date(selectedApp.createdAt).toLocaleString("pl-PL")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Status</p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${
                        STATUS_COLORS[selectedApp.status]
                      }-500/20 text-${STATUS_COLORS[selectedApp.status]}-400`}
                    >
                      {STATUS_LABELS[selectedApp.status]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Odpowiedzi
                </h3>
                <div className="space-y-4">
                  {selectedApp.answers.map((answer: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-gray-400 text-sm mb-2">
                        Pytanie {index + 1}
                      </p>
                      <p className="text-white">{answer.answer || answer.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedApp.status === "REJECTED" && selectedApp.rejectionReason && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 font-medium mb-2">Powód odrzucenia:</p>
                  <p className="text-gray-300">{selectedApp.rejectionReason}</p>
                </div>
              )}

              {selectedApp.status === "SENT" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Powód odrzucenia (opcjonalnie)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none resize-none"
                      rows={3}
                      placeholder="Podaj powód odrzucenia..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleApprove(selectedApp.id)}
                      className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Zaakceptuj
                    </button>
                    <button
                      onClick={() => handleReject(selectedApp.id)}
                      className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center"
                    >
                      <X className="w-5 h-5 mr-2" />
                      Odrzuć
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PermissionGuard>
  );
}