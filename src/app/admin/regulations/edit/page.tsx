"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, X, Clock, Eye } from "lucide-react";
import PermissionGuard from "@/components/PermissionGuard";
import LoadingSpinner from "@/components/LoadingSpinner";
import AdminHeader from "@/components/AdminHeader";
import RichTextEditor from "@/components/RichTextEditor";
import { Edit } from "lucide-react";

export default function EditRegulationsPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    loadCurrentRegulation();
  }, []);

  const loadCurrentRegulation = async () => {
    try {
      const response = await fetch("/api/regulations/current");
      if (response.ok) {
        const data = await response.json();
        setContent(data.content || "<h1>Regulamin</h1><p>Wpisz treść regulaminu...</p>");
      }
    } catch (error) {
      console.error("Failed to load regulation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      alert("Regulamin nie może być pusty!");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/regulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          comment: comment.trim() || "Aktualizacja regulaminu",
        }),
      });

      if (response.ok) {
        alert("Regulamin zapisany!");
        router.push("/admin/regulations/history");
      } else {
        const error = await response.json();
        alert(error.error || "Błąd podczas zapisywania");
      }
    } catch (error) {
      console.error("Error saving regulation:", error);
      alert("Wystąpił błąd");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PermissionGuard permission="edit_regulations">
        <LoadingSpinner fullScreen text="Ładowanie regulaminu..." />
      </PermissionGuard>
    );
  }

  return (
    <PermissionGuard permission="edit_regulations">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <AdminHeader
          icon={Edit}
          title="Edycja Regulaminu"
          description="Edytuj treść regulaminu serwera"
          actions={
            <div className="flex gap-3">
              <button
                onClick={() => setPreview(!preview)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                {preview ? "Edycja" : "Podgląd"}
              </button>
              <button
                onClick={() => router.push("/admin/regulations/history")}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center"
              >
                <Clock className="w-4 h-4 mr-2" />
                Historia
              </button>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          }
        />

        <div className="max-w-6xl mx-auto">
          {/* Comment Input */}
          <div className="mb-6 bg-gray-900/40 backdrop-blur-sm border border-[#26a69a]/20 rounded-2xl p-6">
            <label className="block text-white font-medium mb-2">
              Komentarz do wersji (opcjonalnie)
            </label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Np. Dodano sekcję o zakazie griefingu"
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none"
            />
          </div>

          {/* Editor / Preview */}
          {preview ? (
            <div className="bg-gray-900/40 backdrop-blur-sm border border-[#26a69a]/20 rounded-2xl p-8">
              <div
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          ) : (
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Wpisz treść regulaminu..."
            />
          )}

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-4 bg-gradient-to-r from-[#26a69a] to-[#00897b] hover:from-[#00897b] hover:to-[#26a69a] text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Save className="w-5 h-5 mr-2" />
              {saving ? "Zapisywanie..." : "Zapisz regulamin"}
            </button>
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}