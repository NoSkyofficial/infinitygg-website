"use client";

export default function WipPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#26a69a]/20 text-[#26a69a] mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="animate-pulse">
            <path d="M3 21h18M4 17l8-12 8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">W trakcie tworzenia</h1>
        <p className="text-gray-300">
          Ta sekcja jest aktualnie przygotowywana. Wróć niebawem, pracujemy nad najlepszym doświadczeniem dla graczy.
        </p>
      </div>
    </main>
  );
}
