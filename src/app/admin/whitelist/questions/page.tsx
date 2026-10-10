"use client";

import { useEffect, useState } from "react";
import { GripVertical, Plus, Edit2, Trash2, Save, X, Eye, EyeOff } from "lucide-react";
import PermissionGuard from "@/components/PermissionGuard";
import AdminHeader from "@/components/AdminHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import { HelpCircle } from "lucide-react";

interface Question {
  id: string;
  question: string;
  questionType: string;
  minLength: number | null;
  maxLength: number | null;
  required: boolean;
  active: boolean;
  order: number;
  options: string[];
  createdAt: string;
  updatedAt: string;
}

const QUESTION_TYPES = [
  { value: "TEXT", label: "Krótki tekst" },
  { value: "TEXTAREA", label: "Długi tekst" },
  { value: "NUMBER", label: "Liczba" },
  { value: "SELECT", label: "Wybór z listy" },
];

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const response = await fetch("/api/admin/questions");
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
      }
    } catch (error) {
      console.error("Failed to load questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newQuestions = [...questions];
    const draggedItem = newQuestions[draggedIndex];
    newQuestions.splice(draggedIndex, 1);
    newQuestions.splice(index, 0, draggedItem);

    const reorderedQuestions = newQuestions.map((q, idx) => ({
      ...q,
      order: idx + 1,
    }));

    setQuestions(reorderedQuestions);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;

    try {
      await fetch("/api/admin/questions/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions: questions.map((q, idx) => ({
            id: q.id,
            order: idx + 1,
          })),
        }),
      });
    } catch (error) {
      console.error("Error saving order:", error);
    }

    setDraggedIndex(null);
  };

  const handleCreateQuestion = () => {
    setEditingQuestion({
      id: "",
      question: "",
      questionType: "TEXT",
      minLength: null,
      maxLength: null,
      required: true,
      active: true,
      order: questions.length + 1,
      options: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setShowModal(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setShowModal(true);
  };

  const handleSaveQuestion = async () => {
    if (!editingQuestion) return;

    try {
      const isNew = !editingQuestion.id;
      const url = isNew
        ? "/api/admin/questions"
        : `/api/admin/questions/${editingQuestion.id}`;
      const method = isNew ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: editingQuestion.question,
          questionType: editingQuestion.questionType,
          minLength: editingQuestion.minLength,
          maxLength: editingQuestion.maxLength,
          required: editingQuestion.required,
          active: editingQuestion.active,
          order: editingQuestion.order,
          options: editingQuestion.options,
        }),
      });

      if (response.ok) {
        alert(`Pytanie ${isNew ? "utworzone" : "zaktualizowane"}!`);
        setShowModal(false);
        setEditingQuestion(null);
        loadQuestions();
      } else {
        alert("Błąd podczas zapisywania");
      }
    } catch (error) {
      console.error("Error saving question:", error);
      alert("Wystąpił błąd");
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm("Czy na pewno chcesz usunąć to pytanie?")) return;

    try {
      const response = await fetch(`/api/admin/questions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Pytanie usunięte!");
        loadQuestions();
      } else {
        alert("Błąd podczas usuwania");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      alert("Wystąpił błąd");
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const response = await fetch(`/api/admin/questions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });

      if (response.ok) {
        loadQuestions();
      }
    } catch (error) {
      console.error("Error toggling active:", error);
    }
  };

  if (loading) {
    return (
      <PermissionGuard permission="manage_questions">
        <LoadingSpinner fullScreen text="Ładowanie pytań..." />
      </PermissionGuard>
    );
  }

  return (
    <PermissionGuard permission="manage_questions">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <AdminHeader
          icon={HelpCircle}
          title="Pytania Whitelist"
          description="Zarządzaj pytaniami w formularzu whitelist"
          actions={
            <button
              onClick={handleCreateQuestion}
              className="px-6 py-3 bg-gradient-to-r from-[#26a69a] to-[#00897b] hover:from-[#00897b] hover:to-[#26a69a] text-white rounded-lg transition-all flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Dodaj pytanie
            </button>
          }
        />

        <div className="bg-gray-900/80 backdrop-blur-sm border border-[#26a69a]/20 rounded-xl overflow-hidden">
          <div className="divide-y divide-[#26a69a]/10">
            {questions.map((question, index) => (
              <div
                key={question.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`p-6 hover:bg-gray-800/30 transition-colors cursor-move ${
                  draggedIndex === index ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-300 transition-colors">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  <div className="flex items-center justify-center w-10 h-10 bg-[#26a69a]/20 text-[#26a69a] rounded-lg font-bold">
                    {question.order}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-white font-medium text-lg mb-1">
                          {question.question}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            Typ: {QUESTION_TYPES.find((t) => t.value === question.questionType)?.label}
                          </span>
                          {question.minLength && (
                            <span className="text-xs text-gray-500">
                              • Min: {question.minLength} znaków
                            </span>
                          )}
                          {question.maxLength && (
                            <span className="text-xs text-gray-500">
                              • Max: {question.maxLength} znaków
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {question.required && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400">
                            Wymagane
                          </span>
                        )}
                        {question.active ? (
                          <button
                            onClick={() => toggleActive(question.id, false)}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Aktywne
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleActive(question.id, true)}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition-colors"
                          >
                            <EyeOff className="w-3 h-3 mr-1" />
                            Nieaktywne
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Utworzono: {new Date(question.createdAt).toLocaleDateString("pl-PL")}
                      {" • "}
                      Ostatnia edycja: {new Date(question.updatedAt).toLocaleDateString("pl-PL")}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditQuestion(question)}
                      className="p-2 bg-[#26a69a] hover:bg-[#00897b] text-white rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {questions.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              Brak pytań. Dodaj pierwsze pytanie!
            </div>
          )}
        </div>

        {showModal && editingQuestion && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-[#26a69a]/30 rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingQuestion.id ? "Edytuj pytanie" : "Nowe pytanie"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingQuestion(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Treść pytania <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={editingQuestion.question}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none resize-none"
                    rows={4}
                    placeholder="Wpisz treść pytania..."
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Typ pytania</label>
                  <select
                    value={editingQuestion.questionType}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        questionType: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none"
                  >
                    {QUESTION_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Min/Max Length (for TEXT/TEXTAREA) */}
                {(editingQuestion.questionType === "TEXT" ||
                  editingQuestion.questionType === "TEXTAREA") && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Min. ilość znaków
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editingQuestion.minLength || ""}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            minLength: e.target.value ? parseInt(e.target.value) : null,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none"
                        placeholder="np. 10"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Max. ilość znaków
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editingQuestion.maxLength || ""}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            maxLength: e.target.value ? parseInt(e.target.value) : null,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none"
                        placeholder="np. 500"
                      />
                    </div>
                  </div>
                )}

                {/* Options (for SELECT) */}
                {editingQuestion.questionType === "SELECT" && (
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Opcje (oddziel enterem)
                    </label>
                    <textarea
                      value={editingQuestion.options.join("\n")}
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          options: e.target.value
                            .split("\n")
                            .filter((opt) => opt.trim()),
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none resize-none"
                      rows={4}
                      placeholder="Opcja 1&#10;Opcja 2&#10;Opcja 3"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={editingQuestion.active}
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          active: e.target.checked,
                        })
                      }
                      className="mr-3 w-5 h-5 text-[#26a69a] bg-gray-700 border-gray-600 rounded focus:ring-[#26a69a]"
                    />
                    <div>
                      <span className="text-white font-medium block">Aktywne</span>
                      <span className="text-gray-400 text-sm">
                        Czy pytanie jest widoczne
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={editingQuestion.required}
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          required: e.target.checked,
                        })
                      }
                      className="mr-3 w-5 h-5 text-[#26a69a] bg-gray-700 border-gray-600 rounded focus:ring-[#26a69a]"
                    />
                    <div>
                      <span className="text-white font-medium block">Wymagane</span>
                      <span className="text-gray-400 text-sm">
                        Czy odpowiedź jest obowiązkowa
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleSaveQuestion}
                  disabled={!editingQuestion.question.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#26a69a] to-[#00897b] hover:from-[#00897b] hover:to-[#26a69a] text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Zapisz pytanie
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingQuestion(null);
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