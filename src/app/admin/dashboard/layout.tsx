"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Truck, LayoutDashboard, Settings, LogOut, Users } from "lucide-react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <Truck className="h-6 w-6 text-blue-500" />
            <span className="font-bold tracking-tight text-xl">Admin Panel</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link 
            href="/admin/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              pathname === "/admin/dashboard" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Shipments
          </Link>
          <Link 
            href="/admin/dashboard/clients" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              pathname === "/admin/dashboard/clients" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Users className="h-5 w-5" />
            Clients
          </Link>
          <button className="w-full flex items-center gap-3 text-gray-400 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-lg font-medium transition-colors">
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button 
            className="w-full flex items-center gap-3 text-red-400 hover:bg-red-500/10 px-4 py-3 rounded-lg font-medium transition-colors"
            onClick={() => {
              document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              window.location.href = "/admin/login";
            }}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-8 shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">Shipments Management</h1>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
