"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, X, Clock, Eye, Info, BookOpen } from "lucide-react";
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
  const [showHelp, setShowHelp] = useState(true);

  useEffect(() => {
    loadCurrentRegulation();
  }, []);

  const loadCurrentRegulation = async () => {
    try {
      const response = await fetch("/api/regulations/current");
      if (response.ok) {
        const data = await response.json();
        setContent(data.content || getTemplateContent());
      }
    } catch (error) {
      console.error("Failed to load regulation:", error);
      setContent(getTemplateContent());
    } finally {
      setLoading(false);
    }
  };

  const getTemplateContent = () => {
    return `<h1>Regulamin Serwera InfinityGG</h1>

<h2>1. Postanowienia ogólne</h2>
<p>Niniejszy regulamin określa zasady korzystania z serwera GTA V RolePlay prowadzonego przez InfinityGG.</p>

<h3>1.1 Definicje</h3>
<p>Serwer - platforma multiplayer GTA V RolePlay zarządzana przez InfinityGG.</p>
<p>Użytkownik/Gracz - osoba korzystająca z serwera InfinityGG.</p>

<h3>1.2 Wymagania</h3>
<p>Gracz musi posiadać oryginalną kopię gry Grand Theft Auto V oraz zainstalowany FiveM.</p>

<h2>2. Zasady RolePlay</h2>
<p>Wszelkie działania na serwerze muszą być wykonywane zgodnie z zasadami RolePlay.</p>

<h3>2.1 Podstawy RolePlay</h3>
<p>Gracz zobowiązany jest do odgrywania swojej postaci w sposób realistyczny i zgodny z logiką świata przedstawionego.</p>

<h2>3. Zakazy i ograniczenia</h2>
<p>Na serwerze obowiązują surowe zasady dotyczące niedozwolonych zachowań.</p>`;
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
          notes: comment.trim() || "Aktualizacja regulaminu",
        }),
      });

      if (response.ok) {
        alert("Regulamin zapisany pomyślnie!");
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
          {/* Help Section */}
          {showHelp && (
            <div className="mb-6 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 relative">
              <button
                onClick={() => setShowHelp(false)}
                className="absolute top-4 right-4 text-blue-400 hover:text-blue-300"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-blue-400 font-bold text-lg mb-3">
                    Jak strukturyzować regulamin?
                  </h3>
                  <div className="space-y-3 text-blue-200 text-sm">
                    <div className="bg-blue-500/10 rounded-lg p-3">
                      <p className="font-semibold mb-1">📌 Główne sekcje (Nagłówek 1 lub 2):</p>
                      <p className="text-blue-300">
                        Używaj <code className="bg-blue-500/20 px-2 py-0.5 rounded">H1</code> lub{" "}
                        <code className="bg-blue-500/20 px-2 py-0.5 rounded">H2</code> dla głównych
                        rozdziałów, np. "1. Postanowienia ogólne"
                      </p>
                    </div>
                    <div className="bg-blue-500/10 rounded-lg p-3">
                      <p className="font-semibold mb-1">📋 Podsekcje (Nagłówek 3):</p>
                      <p className="text-blue-300">
                        Używaj <code className="bg-blue-500/20 px-2 py-0.5 rounded">H3</code> dla
                        podrozdziałów, np. "1.1 Definicje"
                      </p>
                    </div>
                    <div className="bg-blue-500/10 rounded-lg p-3">
                      <p className="font-semibold mb-1">📝 Treść:</p>
                      <p className="text-blue-300">
                        Zwykły tekst, listy punktowane, pogrubienia - wszystko będzie wyglądać
                        profesjonalnie na stronie publicznej
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-blue-300">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-xs">
                      Regulamin zostanie automatycznie podzielony na sekcje podczas wyświetlania
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comment Input */}
          <div className="mb-6 bg-gray-900/40 backdrop-blur-sm border border-[#26a69a]/20 rounded-2xl p-6">
            <label className="block text-white font-medium mb-2">
              Komentarz do wersji (opcjonalnie)
            </label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Np. Dodano sekcję o zakazie griefingu, zaktualizowano zasady RolePlay"
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none"
            />
            <p className="text-gray-500 text-sm mt-2">
              Opisz, co zmieniłeś w tej wersji regulaminu
            </p>
          </div>

          {/* Editor / Preview */}
          {preview ? (
            <div className="bg-gray-900/40 backdrop-blur-sm border border-[#26a69a]/20 rounded-2xl p-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg">Podgląd regulaminu</h3>
                <span className="text-gray-400 text-sm">
                  Tak będzie wyglądać na stronie publicznej
                </span>
              </div>
              <div
                className="prose prose-invert max-w-none prose-headings:text-[#26a69a] prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h2:border-b prose-h2:border-[#26a69a]/20 prose-h2:pb-2 prose-h2:mb-4"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          ) : (
            <div className="bg-gray-900/40 backdrop-blur-sm border border-[#26a69a]/20 rounded-2xl p-6">
              <div className="mb-4">
                <h3 className="text-white font-semibold text-lg mb-2">Edytor regulaminu</h3>
                <p className="text-gray-400 text-sm">
                  Używaj przycisków powyżej edytora do formatowania tekstu
                </p>
              </div>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Wpisz treść regulaminu..."
              />
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => setShowHelp(true)}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center"
            >
              <Info className="w-5 h-5 mr-2" />
              Pokaż pomoc
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-4 bg-gradient-to-r from-[#26a69a] to-[#00897b] hover:from-[#00897b] hover:to-[#26a69a] text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg shadow-[#26a69a]/30"
            >
              <Save className="w-5 h-5 mr-2" />
              {saving ? "Zapisywanie..." : "Zapisz regulamin"}
            </button>
          </div>

          {/* Quick Preview Info */}
          <div className="mt-6 bg-gray-900/40 backdrop-blur-sm border border-[#26a69a]/20 rounded-xl p-4">
            <p className="text-gray-400 text-sm text-center">
              💡 Podpowiedź: Użyj przycisku "Podgląd" aby zobaczyć jak regulamin będzie wyglądał
              na stronie publicznej. Struktura z nagłówkami zostanie automatycznie przekonwertowana
              na spis treści.
            </p>
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}