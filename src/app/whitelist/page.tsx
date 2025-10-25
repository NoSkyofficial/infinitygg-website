"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

interface WhitelistQuestion {
  id: string;
  question: string;
  required: boolean;
}

interface Application {
  id: string;
  status: string;
  createdAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export default function WhitelistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState<WhitelistQuestion[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      loadData();
    }
  }, [status, router]);

  const loadData = async () => {
    try {
      const [questionsRes, appsRes] = await Promise.all([
        fetch("/api/admin/questions"),
        fetch("/api/whitelist"),
      ]);

      if (questionsRes.ok) {
        const data = await questionsRes.json();
        setQuestions(data.questions.filter((q: any) => q.active));
      }

      if (appsRes.ok) {
        const data = await appsRes.json();
        setApplications(data.applications);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const answers = questions.map((q) => ({
        questionId: q.id,
        answer: data[`answer_${q.id}`] || "",
      }));

      const response = await fetch("/api/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (response.ok) {
        alert("Podanie zostało wysłane pomyślnie!");
        loadData();
      } else {
        const error = await response.json();
        alert(error.error || "Błąd podczas wysyłania podania");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Wystąpił błąd podczas wysyłania podania");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Ładowanie...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const hasActiveApplication = applications.some(
    (app) => app.status === "SENT" || app.status === "IN_REVIEW"
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
            <CheckCircle className="w-4 h-4 mr-1" />
            Zaakceptowane
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30">
            <XCircle className="w-4 h-4 mr-1" />
            Odrzucone
          </span>
        );
      case "IN_REVIEW":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Clock className="w-4 h-4 mr-1" />
            W trakcie weryfikacji
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            <Clock className="w-4 h-4 mr-1" />
            Oczekuje
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-[#1a2f2a]" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#26a69a]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#00897b]/10 rounded-full blur-3xl" />
      </div>

      <header className="bg-gray-900/95 backdrop-blur-md border-b border-[#26a69a]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                <span className="text-[#26a69a]">Whitelist</span> Application
              </h1>
              <p className="text-gray-400 mt-1">
                Wypełnij formularz, aby dołączyć do serwera
              </p>
            </div>
            <a
              href="/"
              className="text-gray-400 hover:text-[#26a69a] transition-colors"
            >
              ← Strona główna
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Previous Applications */}
        {applications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Twoje podania
            </h2>
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-gray-900/80 backdrop-blur-sm border border-[#26a69a]/20 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    {getStatusBadge(app.status)}
                    <span className="text-gray-400 text-sm">
                      {new Date(app.createdAt).toLocaleDateString("pl-PL")}
                    </span>
                  </div>
                  {app.rejectionReason && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-sm font-medium mb-1">
                        Powód odrzucenia:
                      </p>
                      <p className="text-gray-300 text-sm">
                        {app.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Application Form */}
        {hasActiveApplication ? (
          <div className="bg-gray-900/80 backdrop-blur-sm border border-[#26a69a]/20 rounded-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Masz aktywne podanie
            </h2>
            <p className="text-gray-400">
              Poczekaj na decyzję administracji. Po odrzuceniu będziesz mógł
              wysłać nowe podanie.
            </p>
          </div>
        ) : (
          <div className="bg-gray-900/80 backdrop-blur-sm border border-[#26a69a]/20 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Nowe podanie
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id}>
                  <label className="block text-white font-medium mb-2">
                    {index + 1}. {question.question}
                    {question.required && (
                      <span className="text-red-400 ml-1">*</span>
                    )}
                  </label>
                  <textarea
                    {...register(`answer_${question.id}`, {
                      required: question.required
                        ? "To pole jest wymagane"
                        : false,
                    })}
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-[#26a69a]/20 focus:border-[#26a69a]/50 focus:outline-none resize-none"
                    rows={4}
                    placeholder="Wpisz swoją odpowiedź..."
                  />
                  {errors[`answer_${question.id}`] && (
                    <p className="text-red-400 text-sm mt-1">
                      {(errors[`answer_${question.id}`] as any)?.message}
                    </p>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#26a69a] to-[#00897b] hover:from-[#00897b] hover:to-[#26a69a] text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Wysyłanie..." : "Wyślij podanie"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
