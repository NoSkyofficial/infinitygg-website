"use client";

import { useSession } from "next-auth/react";
import { Edit } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FloatingEditButton() {
  const { data: session } = useSession();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const admin = (session?.user as any)?.admin;
    const hasPermission =
      admin?.permissions?.includes("edit_regulations") ||
      admin?.permissions?.includes("all");
    
    setVisible(!!hasPermission);
  }, [session]);

  if (!visible) return null;

  return (
    <Link
      href="/admin/regulations/edit"
      className="fixed bottom-8 right-8 z-50 group"
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#26a69a] to-[#00897b] rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
        
        {/* Button */}
        <button className="relative w-16 h-16 bg-gradient-to-r from-[#26a69a] to-[#00897b] hover:from-[#00897b] hover:to-[#26a69a] text-white rounded-full shadow-2xl flex items-center justify-center transition-all transform group-hover:scale-110">
          <Edit className="w-6 h-6" />
        </button>
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
        <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-xl border border-[#26a69a]/30">
          Edytuj regulamin
          <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    </Link>
  );
}