"use client";

import { useEffect, useState } from "react";
import { Activity, Filter, Calendar, User, ChevronLeft, ChevronRight, Search } from "lucide-react";
import PermissionGuard from "@/components/PermissionGuard";
import LoadingSpinner from "@/components/LoadingSpinner";
import AdminHeader from "@/components/AdminHeader";

interface AuditLog {
  id: string;
  action: string;
  target: string;
  targetType: string;
  details: any;
  createdAt: string;
  user: {
    name: string;
    image: string;
    id: string;
  };
}

interface AdminUser {
  id: string;
  user: {
    name: string;
    image: string;
  };
}

const ACTION_LABELS: Record<string, string> = {
  WHITELIST_APPROVED: "Zaakceptowano whitelist",
  WHITELIST_REJECTED: "Odrzucono whitelist",
  USER_ROLE_CHANGED: "Zmieniono rolę użytkownika",
  USER_DELETED: "Usunięto użytkownika",
  QUESTION_CREATED: "Utworzono pytanie",
  QUESTION_UPDATED: "Zaktualizowano pytanie",
  QUESTION_DELETED: "Usunięto pytanie",
  CONTENT_UPDATED: "Zaktualizowano treść strony",
  REGULATION_UPDATED: "Zaktualizowano regulamin",
  REGULATION_RESTORED: "Przywrócono wersję regulaminu",
};

const ACTION_COLORS: Record<string, string> = {
  WHITELIST_APPROVED: "green",
  WHITELIST_REJECTED: "red",
  USER_ROLE_CHANGED: "yellow",
  USER_DELETED: "red",
  QUESTION_CREATED: "green",
  QUESTION_UPDATED: "yellow",
  QUESTION_DELETED: "red",
  CONTENT_UPDATED: "blue",
  REGULATION_UPDATED: "blue",
  REGULATION_RESTORED: "yellow",
};

function JsonViewer({ data }: { data: any }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const renderValue = (value: any, path: string = ''): React.ReactNode => {
    if (value === null) {
      return <span className="text-gray-500">null</span>;
    }

    if (typeof value === 'boolean') {
      return <span className="text-orange-400">{value.toString()}</span>;
    }

    if (typeof value === 'number') {
      return <span className="text-blue-400">{value}</span>;
    }

    if (typeof value === 'string') {
      return <span className="text-green-400">"{value}"</span>;
    }

    if (Array.isArray(value)) {
      const isExpanded = expanded[path];
      return (
        <div>
          <button
            onClick={() => setExpanded({ ...expanded, [path]: !isExpanded })}
            className="text-gray-400 hover:text-white transition-colors"
          >
            [{value.length} {isExpanded ? '▼' : '▶'}]
          </button>
          {isExpanded && (
            <div className="ml-4 mt-1 border-l border-gray-700 pl-4">
              {value.map((item, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-500">{index}:</span>{' '}
                  {renderValue(item, `${path}.${index}`)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (typeof value === 'object') {
      const isExpanded = expanded[path];
      const keys = Object.keys(value);
      return (
        <div>
          <button
            onClick={() => setExpanded({ ...expanded, [path]: !isExpanded })}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {'{'}...{'}'} {isExpanded ? '▼' : '▶'}
          </button>
          {isExpanded && (
            <div className="ml-4 mt-1 border-l border-gray-700 pl-4">
              {keys.map((key) => (
                <div key={key} className="mb-1">
                  <span className="text-purple-400">{key}</span>
                  <span className="text-gray-500">: </span>
                  {renderValue(value[key], `${path}.${key}`)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return <span className="text-gray-400">{String(value)}</span>;
  };

  return (
    <div className="bg-gray-900/50 rounded-lg p-4 font-mono text-sm">
      {renderValue(data, 'root')}
    </div>
  );
}

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<AdminUser[]>([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    loadLogs();
  }, [currentPage, filter, selectedUser]);

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  const loadLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });
      
      if (filter !== "all") {
        params.append("filter", filter);
      }
      
      if (selectedUser !== "all") {
        params.append("userId", selectedUser);
      }

      const response = await fetch(`/api/admin/audit?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
        setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
      }
    } catch (error) {
      console.error("Failed to load logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActionLabel = (action: string) => ACTION_LABELS[action] || action;
  const getActionColor = (action: string) => ACTION_COLORS[action] || "gray";

  const filteredUsers = users.filter((user) =>
    searchQuery
      ? user.user.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  if (loading && logs.length === 0) {
    return (
      <PermissionGuard permission="view_audit_logs">
        <LoadingSpinner fullScreen text="Ładowanie logów..." />
      </PermissionGuard>
    );
  }

  return (
    <PermissionGuard permission="view_audit_logs">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <AdminHeader
          icon={Activity}
          title="Logi Audytu"
          description="Historia wszystkich działań w systemie"
        />

        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
            {["all", "whitelist", "user", "question", "content", "regulation", "system"].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  filter === f
                    ? "bg-[#26a69a] text-white"
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
                }`}
              >
                {f === "all" ? "Wszystkie" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-md">
            <User className="w-5 h-5 text-gray-400" />
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Szukaj użytkownika..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none"
              />
            </div>
            {searchQuery && (
              <select
                value={selectedUser}
                onChange={(e) => {
                  setSelectedUser(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 bg-gray-800/50 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none"
              >
                <option value="all">Wszyscy</option>
                {filteredUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.user.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="bg-gray-900/40 backdrop-blur-sm border border-[#26a69a]/20 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center">
              <LoadingSpinner size="md" />
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="min-w-full divide-y divide-[#26a69a]/20">
                <thead className="bg-gray-800/50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Użytkownik
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Akcja
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Szczegóły
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#26a69a]/10">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-800/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-gray-400 text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(log.createdAt).toLocaleString("pl-PL")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={log.user.image}
                            alt={log.user.name}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <span className="text-white text-sm">{log.user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${getActionColor(
                            log.action
                          )}-500/20 text-${getActionColor(log.action)}-400`}
                        >
                          <Activity className="w-3 h-3 mr-1" />
                          {getActionLabel(log.action)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300 text-sm max-w-md">
                          {log.details && (
                            <details className="cursor-pointer group">
                              <summary className="text-[#26a69a] hover:text-[#00897b] transition-colors list-none flex items-center gap-2">
                                <span className="group-open:rotate-90 transition-transform">▶</span>
                                Pokaż szczegóły
                              </summary>
                              <div className="mt-2">
                                <JsonViewer data={log.details} />
                              </div>
                            </details>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {logs.length === 0 && !loading && (
            <div className="p-12 text-center text-gray-400">Brak logów do wyświetlenia</div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Strona {currentPage} z {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Poprzednia
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                Następna
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </PermissionGuard>
  );
}