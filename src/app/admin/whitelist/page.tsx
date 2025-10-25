"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Eye, Filter } from "lucide-react";

interface Application {
  id: string;
  discordTag: string;
  status: string;
  createdAt: string;
  reviewedAt?: string;
  priority: boolean;
  answers: Array<{ questionId: string; answer: string }>;
  rejectionReason?: string;
  reviewer?: {
    discordTag: string;
  };
}

export default function AdminWhitelistPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadApplications();
  }, [filter]);

  const loadApplications = async () => {
    try {
      const response = await fetch(`/api/admin/whitelist?status=${filter}`);
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications);
      }
    } catch (error) {
      console.error("Failed to load applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    id: string,
    status: "APPROVED" | "REJECTED",
    rejectionReason?: string
  ) => {
    setProcessing(true);
    try {
      const response = await fetch(`/api/whitelist/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectionReason }),
      });

      if (response.ok) {
        alert(`Podanie ${status === "APPROVED" ? "zaakceptowane" : "odrzucone"}`);
        setSelectedApp(null);
        loadApplications();
      } else {
        alert("Błąd podczas zmiany statusu");
      }
    } catch (error) {
      console.error("Error changing status:", error);
      alert("Wystąpił błąd");
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
            <CheckCircle className="w-4 h-4 mr-1" />
            Zaakceptowane
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400">
            <XCircle className="w-4 h-4 mr-1" />
            Odrzucone
          </span>
        );
      case "IN_REVIEW":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400">
            <Clock className="w-4 h-4 mr-1" />
            W trakcie
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400">
            <Clock className="w-4 h-4 mr-1" />
            Oczekuje
          </span>
        );
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Whitelist Management
        </h1>
        <p className="text-gray-400">Zarządzaj podaniami whitelist</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <Filter className="w-5 h-5 text-gray-400" />
        {["all", "SENT", "IN_REVIEW", "APPROVED", "REJECTED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === f
                ? "bg-[#26a69a] text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {f === "all" ? "Wszystkie" : f}
          </button>
        ))}
      </div>

      {/* Applications Table */}
      <div className="bg-gray-900/80 backdrop-blur-sm border border-[#26a69a]/20 rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-[#26a69a]/20">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Użytkownik
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#26a69a]/10">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-800/30">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">
                    {app.discordTag}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(app.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {new Date(app.createdAt).toLocaleDateString("pl-PL")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="text-[#26a69a] hover:text-[#00897b] transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-[#26a69a]/30 rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              Podanie - {selectedApp.discordTag}
            </h2>

            <div className="space-y-6">
              {selectedApp.answers.map((answer, index) => (
                <div key={index}>
                  <p className="text-gray-400 text-sm mb-2">
                    Pytanie {index + 1}
                  </p>
                  <p className="text-white bg-gray-800/50 p-4 rounded-lg">
                    {answer.answer}
                  </p>
                </div>
              ))}
            </div>

            {selectedApp.status === "SENT" && (
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() =>
                    handleStatusChange(selectedApp.id, "APPROVED")
                  }
                  disabled={processing}
                  className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  Zaakceptuj
                </button>
                <button
                  onClick={() => {
                    const reason = prompt("Podaj powód odrzucenia:");
                    if (reason) {
                      handleStatusChange(selectedApp.id, "REJECTED", reason);
                    }
                  }}
                  disabled={processing}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  Odrzuć
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedApp(null)}
              className="w-full mt-4 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Zamknij
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
