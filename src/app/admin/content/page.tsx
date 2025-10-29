"use client";

import { useEffect, useState } from "react";
import { FileText, Save, Edit2, Plus, Trash2 } from "lucide-react";
import PermissionGuard from "@/components/PermissionGuard";
import AdminHeader from "@/components/AdminHeader";
import LoadingSpinner from "@/components/LoadingSpinner";

interface PageContent {
  id: string;
  page: string;
  content: any;
  updatedAt: string;
  updatedBy: string;
}

const PAGES = [
  { id: "faq", name: "FAQ", icon: FileText },
  { id: "rules", name: "Regulamin", icon: FileText },
  { id: "home", name: "Strona Główna", icon: FileText },
];

export default function AdminContentPage() {
  const [contents, setContents] = useState<PageContent[]>([]);
  const [selectedPage, setSelectedPage] = useState("faq");
  const [editingContent, setEditingContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch("/api/admin/content");
      if (response.ok) {
        const data = await response.json();
        setContents(data.contents || []);
        
        // Load first page content
        const firstContent = data.contents?.find((c: PageContent) => c.page === selectedPage);
        if (firstContent) {
          setEditingContent(JSON.stringify(firstContent.content, null, 2));
        }
      }
    } catch (error) {
      console.error("Failed to load content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: string) => {
    setSelectedPage(page);
    const content = contents.find((c) => c.page === page);
    if (content) {
      setEditingContent(JSON.stringify(content.content, null, 2));
    } else {
      setEditingContent("{}");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let parsedContent;
      try {
        parsedContent = JSON.parse(editingContent);
      } catch {
        alert("Nieprawidłowy format JSON!");
        setSaving(false);
        return;
      }

      const response = await fetch(`/api/admin/content/${selectedPage}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: parsedContent }),
      });

      if (response.ok) {
        alert("Treść zapisana!");
        loadContent();
      } else {
        alert("Błąd podczas zapisywania");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Wystąpił błąd");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PermissionGuard permission="edit_content">
        <LoadingSpinner fullScreen text="Ładowanie treści..." />
      </PermissionGuard>
    );
  }

  return (
    <PermissionGuard permission="edit_content">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <AdminHeader
          icon={FileText}
          title="Zarządzanie Treścią"
          description="Edytuj treść stron FAQ, Regulamin i inne"
        />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Page Selector */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900/80 backdrop-blur-sm border border-[#26a69a]/20 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-4">Strony</h3>
            <div className="space-y-2">
              {PAGES.map((page) => (
                <button
                  key={page.id}
                  onClick={() => handlePageChange(page.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                    selectedPage === page.id
                      ? "bg-[#26a69a] text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  <page.icon className="w-5 h-5 mr-3" />
                  {page.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <div className="bg-gray-900/80 backdrop-blur-sm border border-[#26a69a]/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">
                Edytuj:{" "}
                {PAGES.find((p) => p.id === selectedPage)?.name || selectedPage}
              </h3>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-[#26a69a] to-[#00897b] hover:from-[#00897b] hover:to-[#26a69a] text-white rounded-lg transition-all disabled:opacity-50 flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Zapisywanie..." : "Zapisz"}
              </button>
            </div>

            <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-400 text-sm">
                <strong>Uwaga:</strong> Edytujesz surowy JSON. Upewnij się, że
                format jest prawidłowy przed zapisaniem.
              </p>
            </div>

            <textarea
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              className="w-full h-[600px] px-4 py-3 bg-gray-800 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none font-mono text-sm resize-none"
              placeholder='{"key": "value"}'
            />

            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-white font-medium mb-2">Przykładowa struktura:</h4>
              <pre className="text-gray-400 text-xs overflow-x-auto">
{`{
  "sections": [
    {
      "id": "section1",
      "title": "Tytuł sekcji",
      "content": "Treść sekcji..."
    }
  ]
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PermissionGuard>
  );
}
