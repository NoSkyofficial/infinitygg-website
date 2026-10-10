"use client";

import { useEffect, useState } from "react";
import { Users, Shield, Edit2, Trash2, X, Check, Clock } from "lucide-react";
import PermissionGuard from "@/components/PermissionGuard";
import AdminHeader from "@/components/AdminHeader";
import LoadingSpinner from "@/components/LoadingSpinner";

interface AdminUser {
  id: string;
  userId: string;
  discordId: string;
  discordTag: string;
  role: string;
  permissions: string[];
  active: boolean;
  lastLogin: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    image: string;
  };
}

const ROLES = [
  { value: "root", label: "Root", color: "red" },
  { value: "contentEditor", label: "Content Editor", color: "blue" },
  { value: "InfinityGG_Team", label: "InfinityGG Team", color: "green" },
  { value: "Whitelist_Checker", label: "Whitelist Checker", color: "purple" },
];

const PERMISSIONS = [
  "edit_regulations",
  "edit_content",
  "manage_users",
  "manage_whitelist",
  "view_audit_logs",
  "manage_system",
  "manage_questions",
  "view_applications",
  "review_applications",
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  root: ["all"],
  contentEditor: ["edit_regulations", "edit_content", "view_audit_logs"],
  InfinityGG_Team: ["view_audit_logs", "view_applications"],
  Whitelist_Checker: ["view_applications", "review_applications", "manage_whitelist"],
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleRoleChange = (newRole: string) => {
    if (!editingUser) return;
    
    const basePermissions = ROLE_PERMISSIONS[newRole] || [];
    
    // Merge with existing extra permissions (not from role)
    const extraPermissions = editingUser.permissions.filter(
      (perm) => !ROLE_PERMISSIONS[editingUser.role]?.includes(perm)
    );
    
    setEditingUser({
      ...editingUser,
      role: newRole,
      permissions: [...basePermissions, ...extraPermissions],
    });
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: editingUser.role,
          permissions: editingUser.permissions,
          active: editingUser.active,
        }),
      });

      if (response.ok) {
        alert("Użytkownik zaktualizowany!");
        setShowModal(false);
        setEditingUser(null);
        loadUsers();
      } else {
        alert("Błąd podczas aktualizacji");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Wystąpił błąd");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Czy na pewno chcesz usunąć tego użytkownika?")) return;

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Użytkownik usunięty!");
        loadUsers();
      } else {
        alert("Błąd podczas usuwania");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Wystąpił błąd");
    }
  };

  const togglePermission = (permission: string) => {
    if (!editingUser) return;

    // Check if permission is from role (cannot be unchecked)
    const rolePermissions = ROLE_PERMISSIONS[editingUser.role] || [];
    if (rolePermissions.includes(permission) || rolePermissions.includes("all")) {
      return; // Cannot modify role-based permissions
    }

    const permissions = editingUser.permissions.includes(permission)
      ? editingUser.permissions.filter((p) => p !== permission)
      : [...editingUser.permissions, permission];

    setEditingUser({ ...editingUser, permissions });
  };

  const isPermissionFromRole = (permission: string) => {
    if (!editingUser) return false;
    const rolePermissions = ROLE_PERMISSIONS[editingUser.role] || [];
    return rolePermissions.includes(permission) || rolePermissions.includes("all");
  };

  const getRoleColor = (role: string) => {
    const roleConfig = ROLES.find((r) => r.value === role);
    return roleConfig?.color || "gray";
  };

  if (loading) {
    return (
      <PermissionGuard permission="manage_users">
        <LoadingSpinner fullScreen text="Ładowanie użytkowników..." />
      </PermissionGuard>
    );
  }

  return (
    <PermissionGuard permission="manage_users">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <AdminHeader
          icon={Users}
          title="Zarządzanie Użytkownikami"
          description="Zarządzaj rolami i uprawnieniami administratorów"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-gray-900/80 backdrop-blur-sm border border-[#26a69a]/20 rounded-xl p-6 hover:border-[#26a69a]/40 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={user.user.image}
                    alt={user.user.name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <h3 className="text-white font-semibold">{user.user.name}</h3>
                    <p className="text-gray-400 text-sm">{user.discordTag}</p>
                  </div>
                </div>
                {user.active ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                    <Check className="w-3 h-3 mr-1" />
                    Aktywny
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                    <X className="w-3 h-3 mr-1" />
                    Nieaktywny
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <span className="text-gray-400 text-sm">Rola:</span>
                  <span
                    className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${getRoleColor(
                      user.role
                    )}-500/20 text-${getRoleColor(user.role)}-400`}
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {ROLES.find((r) => r.value === user.role)?.label || user.role}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 text-sm">Uprawnienia:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {user.permissions.length > 0 ? (
                      user.permissions.slice(0, 3).map((perm) => (
                        <span
                          key={perm}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-800 text-gray-300"
                        >
                          {perm}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-xs">Z roli</span>
                    )}
                    {user.permissions.length > 3 && (
                      <span className="text-gray-400 text-xs">
                        +{user.permissions.length - 3} więcej
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center text-gray-400 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(user.lastLogin).toLocaleDateString("pl-PL")}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditUser(user)}
                  className="flex-1 px-4 py-2 bg-[#26a69a] hover:bg-[#00897b] text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edytuj
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showModal && editingUser && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-[#26a69a]/30 rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Edytuj użytkownika</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingUser(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center">
                  <img
                    src={editingUser.user.image}
                    alt={editingUser.user.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      {editingUser.user.name}
                    </h3>
                    <p className="text-gray-400">{editingUser.discordTag}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Rola</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none"
                  >
                    {ROLES.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-gray-500 text-sm mt-2">
                    Podstawowe uprawnienia z roli są automatycznie zaznaczone
                  </p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Dodatkowe uprawnienia
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PERMISSIONS.map((permission) => {
                      const fromRole = isPermissionFromRole(permission);
                      const checked =
                        editingUser.permissions.includes(permission) || fromRole;

                      return (
                        <label
                          key={permission}
                          className={`flex items-center p-3 bg-gray-800 rounded-lg ${
                            fromRole
                              ? "opacity-75 cursor-not-allowed"
                              : "cursor-pointer hover:bg-gray-700"
                          } transition-colors`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={fromRole}
                            onChange={() => togglePermission(permission)}
                            className="mr-3 w-4 h-4 text-[#26a69a] bg-gray-700 border-gray-600 rounded focus:ring-[#26a69a] disabled:opacity-50"
                          />
                          <span className="text-gray-300 text-sm">
                            {permission}
                            {fromRole && (
                              <span className="text-xs text-gray-500 ml-1">(z roli)</span>
                            )}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingUser.active}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, active: e.target.checked })
                      }
                      className="mr-3 w-5 h-5 text-[#26a69a] bg-gray-700 border-gray-600 rounded focus:ring-[#26a69a]"
                    />
                    <span className="text-white font-medium">Konto aktywne</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleSaveUser}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#26a69a] to-[#00897b] hover:from-[#00897b] hover:to-[#26a69a] text-white rounded-lg transition-all"
                >
                  Zapisz zmiany
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingUser(null);
                  }}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PermissionGuard>
  );
}