"use client";

import React, { useState } from 'react';
import { X, Edit2, Trash2, Plus } from 'lucide-react';
import { SiteConfig, FAQ, ConfigService } from '../page';

interface AdminPanelProps {
  config: SiteConfig;
  updateConfig: (config: SiteConfig) => void;
  onClose: () => void;
}

// Bezpieczniejsza weryfikacja hasła (SHA-256)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const ADMIN_PASS_HASH = process.env.NEXT_PUBLIC_ADMIN_PASS_HASH || '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

export default function AdminPanel({ config, updateConfig, onClose }: AdminPanelProps) {
  const [localConfig, setLocalConfig] = useState<SiteConfig>(config);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [editingFAQ, setEditingFAQ] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  
  const handleLogin = async () => {
    const hashedInput = await hashPassword(password);
    if (hashedInput === ADMIN_PASS_HASH) {
      setAuthenticated(true);
      setPassword('');
    } else {
      alert('Nieprawidłowe hasło');
      setPassword('');
    }
  };
  
  const handleSave = () => {
    updateConfig(localConfig);
    alert('Konfiguracja zapisana!');
  };
  
  const handleExport = () => {
    const json = ConfigService.exportConfig(localConfig);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'infinitygg-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = ConfigService.importConfig(event.target?.result as string);
          setLocalConfig(imported);
          alert('Konfiguracja zaimportowana!');
        } catch (error) {
          alert('Błąd importu: nieprawidłowy format pliku');
        }
      };
      reader.readAsText(file);
    }
  };
  
  const addFAQ = () => {
    if (newQuestion && newAnswer) {
      setLocalConfig({
        ...localConfig,
        faqs: [...localConfig.faqs, { id: Date.now().toString(), question: newQuestion, answer: newAnswer }]
      });
      setNewQuestion('');
      setNewAnswer('');
    }
  };
  
  const startEditFAQ = (faq: FAQ) => {
    setEditingFAQ(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };
  
  const saveEditFAQ = (id: string) => {
    setLocalConfig({
      ...localConfig,
      faqs: localConfig.faqs.map(faq => 
        faq.id === id 
          ? { ...faq, question: editQuestion, answer: editAnswer }
          : faq
      )
    });
    setEditingFAQ(null);
    setEditQuestion('');
    setEditAnswer('');
  };
  
  const cancelEditFAQ = () => {
    setEditingFAQ(null);
    setEditQuestion('');
    setEditAnswer('');
  };
  
  const removeFAQ = (id: string) => {
    if (confirm('Czy na pewno chcesz usunąć to pytanie?')) {
      setLocalConfig({
        ...localConfig,
        faqs: localConfig.faqs.filter(faq => faq.id !== id)
      });
    }
  };
  
  if (!authenticated) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-[#26a69a]/30 rounded-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-6">Panel Administratora</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Hasło"
            className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg mb-4 border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none"
          />
          <div className="flex gap-3">
            <button
              onClick={handleLogin}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#26a69a] to-[#00897b] hover:from-[#00897b] hover:to-[#26a69a] text-white font-semibold rounded-lg transition-all"
            >
              Zaloguj
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-[#26a69a]/20"
            >
              Anuluj
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Hasło znajduje się w zmiennych środowiskowych
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm overflow-y-auto z-50">
      <div className="min-h-screen p-4 py-8">
        <div className="bg-gray-900 border border-[#26a69a]/30 rounded-2xl max-w-4xl mx-auto p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Panel Administratora</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-[#26a69a] transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-[#26a69a]/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Progress Bar</h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={localConfig.showProgressBar}
                    onChange={(e) => setLocalConfig({ ...localConfig, showProgressBar: e.target.checked })}
                    className="w-4 h-4 accent-[#26a69a]"
                  />
                  <span className="text-gray-300">Pokaż progress bar</span>
                </label>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Wartość (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={localConfig.progressValue}
                    onChange={(e) => setLocalConfig({ ...localConfig, progressValue: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Etykieta</label>
                  <input
                    type="text"
                    value={localConfig.progressLabel}
                    onChange={(e) => setLocalConfig({ ...localConfig, progressLabel: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            
            {/* Hero Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-[#26a69a]/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Hero Section</h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={localConfig.showBetaBadge}
                    onChange={(e) => setLocalConfig({ ...localConfig, showBetaBadge: e.target.checked })}
                    className="w-4 h-4 accent-[#26a69a]"
                  />
                  <span className="text-gray-300">Pokaż badge "Serwer BETA dostępny"</span>
                </label>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Tytuł</label>
                  <input
                    type="text"
                    value={localConfig.heroTitle}
                    onChange={(e) => setLocalConfig({ ...localConfig, heroTitle: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Opis</label>
                  <textarea
                    value={localConfig.heroLead}
                    onChange={(e) => setLocalConfig({ ...localConfig, heroLead: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            
            {/* FAQ */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-[#26a69a]/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">FAQ</h3>
              <label className="flex items-center space-x-3 mb-4">
                <input
                  type="checkbox"
                  checked={localConfig.showFAQ}
                  onChange={(e) => setLocalConfig({ ...localConfig, showFAQ: e.target.checked })}
                  className="w-4 h-4 accent-[#26a69a]"
                />
                <span className="text-gray-300">Pokaż FAQ</span>
              </label>
              
              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {localConfig.faqs.map((faq) => (
                  <div key={faq.id} className="bg-gray-700 p-4 rounded-lg border border-[#26a69a]/20">
                    {editingFAQ === faq.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editQuestion}
                          onChange={(e) => setEditQuestion(e.target.value)}
                          placeholder="Pytanie"
                          className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none text-sm"
                        />
                        <textarea
                          value={editAnswer}
                          onChange={(e) => setEditAnswer(e.target.value)}
                          placeholder="Odpowiedź"
                          className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none text-sm"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEditFAQ(faq.id)}
                            className="flex-1 px-3 py-2 bg-gradient-to-r from-[#26a69a] to-[#00897b] hover:from-[#00897b] hover:to-[#26a69a] text-white text-sm rounded-lg transition-all"
                          >
                            Zapisz
                          </button>
                          <button
                            onClick={cancelEditFAQ}
                            className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded-lg transition-colors"
                          >
                            Anuluj
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-white font-medium mb-1">{faq.question}</p>
                          <p className="text-gray-300 text-sm">{faq.answer}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditFAQ(faq)}
                            className="text-[#26a69a] hover:text-[#00897b] transition-colors p-1"
                            title="Edytuj"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFAQ(faq.id)}
                            className="text-red-400 hover:text-red-300 transition-colors p-1"
                            title="Usuń"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 bg-gray-700 p-4 rounded-lg border border-[#26a69a]/20">
                <div className="flex items-center gap-2 mb-3">
                  <Plus className="w-5 h-5 text-[#26a69a]" />
                  <h4 className="text-white font-medium">Dodaj nowe pytanie</h4>
                </div>
                <input
                  type="text"
                  placeholder="Pytanie"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none"
                />
                <textarea
                  placeholder="Odpowiedź"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none"
                  rows={2}
                />
                <button
                  onClick={addFAQ}
                  className="w-full px-4 py-2 bg-gradient-to-r from-[#26a69a] to-[#00897b] hover:from-[#00897b] hover:to-[#26a69a] text-white rounded-lg transition-all"
                >
                  Dodaj FAQ
                </button>
              </div>
            </div>
            
            {/* Ustawienia */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-[#26a69a]/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Ustawienia</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={localConfig.showStatus}
                    onChange={(e) => setLocalConfig({ ...localConfig, showStatus: e.target.checked })}
                    className="w-4 h-4 accent-[#26a69a]"
                  />
                  <span className="text-gray-300">Pokaż status serwera</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={localConfig.showShopRedirect}
                    onChange={(e) => setLocalConfig({ ...localConfig, showShopRedirect: e.target.checked })}
                    className="w-4 h-4 accent-[#26a69a]"
                  />
                  <span className="text-gray-300">Pokaż sklep</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={localConfig.socialLinks.discord}
                    onChange={(e) => setLocalConfig({
                      ...localConfig,
                      socialLinks: { ...localConfig.socialLinks, discord: e.target.checked }
                    })}
                    className="w-4 h-4 accent-[#26a69a]"
                  />
                  <span className="text-gray-300">Discord</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={localConfig.socialLinks.twitter}
                    onChange={(e) => setLocalConfig({
                      ...localConfig,
                      socialLinks: { ...localConfig.socialLinks, twitter: e.target.checked }
                    })}
                    className="w-4 h-4 accent-[#26a69a]"
                  />
                  <span className="text-gray-300">Twitter</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={localConfig.socialLinks.youtube}
                    onChange={(e) => setLocalConfig({
                      ...localConfig,
                      socialLinks: { ...localConfig.socialLinks, youtube: e.target.checked }
                    })}
                    className="w-4 h-4 accent-[#26a69a]"
                  />
                  <span className="text-gray-300">YouTube</span>
                </label>
              </div>
            </div>
            
            {/* Akcje */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-semibold rounded-lg transition-all"
              >
                Zapisz zmiany
              </button>
              
              <button
                onClick={handleExport}
                className="px-6 py-3 bg-gradient-to-r from-[#26a69a] to-[#00897b] hover:from-[#00897b] hover:to-[#26a69a] text-white rounded-lg transition-all"
              >
                Eksportuj
              </button>
              
              <label className="px-6 py-3 bg-gradient-to-r from-[#26a69a] to-[#00897b] hover:from-[#00897b] hover:to-[#26a69a] text-white rounded-lg transition-all cursor-pointer text-center flex items-center">
                Importuj
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}