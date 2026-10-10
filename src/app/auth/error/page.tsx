"use client";

import { useSearchParams } from "next/navigation";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-md border border-red-500/30 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
        <p className="text-gray-400 mb-4">
          Error: {error || "Unknown error occurred"}
        </p>
        <a
          href="/auth/signin"
          className="block w-full text-center px-6 py-3 bg-[#26a69a] hover:bg-[#00897b] text-white rounded-lg transition-colors"
        >
          Try Again
        </a>
      </div>
    </div>
  );
}