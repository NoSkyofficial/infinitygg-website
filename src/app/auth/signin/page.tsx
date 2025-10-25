"use client";

import { signIn } from "next-auth/react";
import { SiDiscord } from "react-icons/si";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-[#1a2f2a]" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#26a69a]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#00897b]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-md border border-[#26a69a]/30 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Zaloguj się do <span className="text-[#26a69a]">InfinityGG</span>
          </h1>
          <p className="text-gray-400">
            Użyj swojego konta Discord, aby kontynuować
          </p>
        </div>

        <button
          onClick={() => signIn("discord", { callbackUrl: "/admin" })}
          className="w-full group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#5865F2] to-[#4752C4] hover:from-[#4752C4] hover:to-[#5865F2] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#5865F2]/30 hover:shadow-[#5865F2]/50 hover:scale-105"
        >
          <SiDiscord className="w-6 h-6 mr-3" />
          Zaloguj przez Discord
        </button>

        <p className="text-gray-500 text-sm text-center mt-6">
          Logując się, akceptujesz nasz{" "}
          <a href="/tos" className="text-[#26a69a] hover:text-[#00897b]">
            Terms of Service
          </a>{" "}
          oraz{" "}
          <a href="/privacy" className="text-[#26a69a] hover:text-[#00897b]">
            Privacy Policy
          </a>
        </p>

        <div className="mt-8 pt-8 border-t border-[#26a69a]/20 text-center">
          <a
            href="/"
            className="text-gray-400 hover:text-[#26a69a] transition-colors text-sm"
          >
            ← Powrót na stronę główną
          </a>
        </div>
      </div>
    </div>
  );
}
