"use client";

import { useEffect, useState } from "react";
import { Settings, Save, ToggleLeft, ToggleRight, Link as LinkIcon } from "lucide-react";
import PermissionGuard from "@/components/PermissionGuard";
import AdminHeader from "@/components/AdminHeader";
import LoadingSpinner from "@/components/LoadingSpinner";

interface SystemSettings {
  showProgressBar: boolean;
  progressValue: number;
  progressLabel: string;
  showStatus: boolean;
  showFAQ: boolean;
  showWhitelist: boolean;
  discordInvite: string;
  shopUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    showProgressBar: true,
    progressValue: 75,
    progressLabel: "Rozwój serwera",
    showStatus: true,
    showFAQ: true,
    showWhitelist: true,
    discordInvite: "https://discord.gg/infinitygg",
    shopUrl: "https://shop.infinitygg.pl",
    twitterUrl: "https://twitter.com/infinitygg",
    youtubeUrl: "https://youtube.com/@infinitygg",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        if (data.settings && data.settings.length > 0) {
          const loadedSettings: any = {};
          data.settings.forEach((setting: any) => {
            loadedSettings[setting.key] = setting.value;
          });
          setSettings({ ...settings, ...loadedSettings });
        }
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        alert("Ustawienia zapisane!");
      } else {
        alert("Błąd podczas zapisywania");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Wystąpił błąd");
    } finally {
      setSaving(false);
    }
  };

  const toggleSetting = (key: keyof SystemSettings) => {
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  if (loading) {
    return (
      <PermissionGuard permission="manage_system">
        <LoadingSpinner fullScreen text="Ładowanie ustawień..." />
      </PermissionGuard>
    );
  }

  return (
  <PermissionGuard permission="manage_system">
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <AdminHeader
        icon={Settings}
        title="Ustawienia Systemu"
        description="Konfiguruj funkcje i wygląd strony"
        actions={
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-[#26a69a] to-[#00897b] hover:from-[#00897b] hover:to-[#26a69a] text-white rounded-lg transition-all disabled:opacity-50 flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? "Zapisywanie..." : "Zapisz zmiany"}
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/80 backdrop-blur-sm border border-[#26a69a]/20 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Ogólne
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-800 rounded-lg">
              <button
                onClick={() => toggleSetting("showProgressBar")}
                className="flex items-center justify-between w-full mb-3"
              >
                <span className="text-white font-medium">Progress Bar</span>
                {settings.showProgressBar ? (
                  <ToggleRight className="w-8 h-8 text-[#26a69a]" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-500" />
                )}
              </button>
              {settings.showProgressBar && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={settings.progressLabel}
                    onChange={(e) =>
                      setSettings({ ...settings, progressLabel: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded text-sm"
                    placeholder="Etykieta"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.progressValue}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        progressValue: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded text-sm"
                    placeholder="Wartość %"
                  />
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <button
                onClick={() => toggleSetting("showStatus")}
                className="flex items-center justify-between w-full"
              >
                <span className="text-white font-medium">Status Serwera</span>
                {settings.showStatus ? (
                  <ToggleRight className="w-8 h-8 text-[#26a69a]" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-500" />
                )}
              </button>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <button
                onClick={() => toggleSetting("showFAQ")}
                className="flex items-center justify-between w-full"
              >
                <span className="text-white font-medium">Sekcja FAQ</span>
                {settings.showFAQ ? (
                  <ToggleRight className="w-8 h-8 text-[#26a69a]" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-500" />
                )}
              </button>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <button
                onClick={() => toggleSetting("showWhitelist")}
                className="flex items-center justify-between w-full"
              >
                <span className="text-white font-medium">Whitelist</span>
                {settings.showWhitelist ? (
                  <ToggleRight className="w-8 h-8 text-[#26a69a]" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-500" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-sm border border-[#26a69a]/20 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
            <LinkIcon className="w-5 h-5 mr-2" />
            Linki Społecznościowe
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Discord</label>
              <input
                type="text"
                value={settings.discordInvite}
                onChange={(e) =>
                  setSettings({ ...settings, discordInvite: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Sklep</label>
              <input
                type="text"
                value={settings.shopUrl}
                onChange={(e) =>
                  setSettings({ ...settings, shopUrl: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Twitter</label>
              <input
                type="text"
                value={settings.twitterUrl}
                onChange={(e) =>
                  setSettings({ ...settings, twitterUrl: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">YouTube</label>
              <input
                type="text"
                value={settings.youtubeUrl}
                onChange={(e) =>
                  setSettings({ ...settings, youtubeUrl: e.target.value })
                }
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-sm border border-[#26a69a]/20 rounded-xl p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Podgląd</h3>
          
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-gray-800 rounded-lg flex justify-between">
              <span className="text-gray-400">Progress Bar:</span>
              <span className={settings.showProgressBar ? "text-green-400" : "text-red-400"}>
                {settings.showProgressBar ? "Widoczny" : "Ukryty"}
              </span>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg flex justify-between">
              <span className="text-gray-400">Status Serwera:</span>
              <span className={settings.showStatus ? "text-green-400" : "text-red-400"}>
                {settings.showStatus ? "Widoczny" : "Ukryty"}
              </span>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg flex justify-between">
              <span className="text-gray-400">FAQ:</span>
              <span className={settings.showFAQ ? "text-green-400" : "text-red-400"}>
                {settings.showFAQ ? "Widoczny" : "Ukryty"}
              </span>
            </div>
            <div className="p-3 bg-gray-800 rounded-lg flex justify-between">
              <span className="text-gray-400">Whitelist:</span>
              <span className={settings.showWhitelist ? "text-green-400" : "text-red-400"}>
                {settings.showWhitelist ? "Dostępny" : "Niedostępny"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PermissionGuard>
  );
}
