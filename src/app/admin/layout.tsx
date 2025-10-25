"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Users,
  FileText,
  List,
  Settings,
  Activity,
  LogOut,
  LayoutDashboard,
  HelpCircle,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Użytkownicy", href: "/admin/users", icon: Users },
  { name: "Whitelist", href: "/admin/whitelist", icon: List },
  { name: "Pytania", href: "/admin/questions", icon: HelpCircle },
  { name: "Treść", href: "/admin/content", icon: FileText },
  { name: "Ustawienia", href: "/admin/settings", icon: Settings },
  { name: "Audyt", href: "/admin/audit", icon: Activity },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex w-64 flex-col">
            <div className="flex min-h-0 flex-1 flex-col border-r border-[#26a69a]/20 bg-gray-900/50">
              <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                <div className="flex flex-shrink-0 items-center px-4 mb-8">
                  <h2 className="text-xl font-bold text-white">
                    <span className="text-[#26a69a]">Admin</span> Panel
                  </h2>
                </div>
                <nav className="mt-5 flex-1 space-y-1 px-2">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? "bg-[#26a69a]/20 text-[#26a69a]"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        <item.icon
                          className={`mr-3 h-5 w-5 flex-shrink-0 ${
                            isActive ? "text-[#26a69a]" : "text-gray-500"
                          }`}
                        />
                        {item.name}
                      </a>
                    );
                  })}
                </nav>
              </div>
              <div className="flex flex-shrink-0 border-t border-[#26a69a]/20 p-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    {session?.user?.image && (
                      <img
                        className="inline-block h-9 w-9 rounded-full"
                        src={session.user.image}
                        alt=""
                      />
                    )}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">
                        {session?.user?.name}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                    title="Wyloguj"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
