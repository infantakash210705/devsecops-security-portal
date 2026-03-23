"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Shield, Activity, Users, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    const authStorage = localStorage.getItem("securecorp_auth");
    if (!authStorage) {
      router.push("/login");
      return;
    }
    
    const data = JSON.parse(authStorage);
    if (data.role !== "admin") {
      router.push("/login");
      return;
    }
    
    setUserName(data.name || "Admin");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("securecorp_auth");
    router.push("/login");
  };

  const navLinks = [
    { name: "Monitoring", href: "/admin", icon: Activity },
    { name: "Employees", href: "/admin/employees", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-white/[0.02] flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Shield size={24} className="text-primary mr-2" />
          <h1 className="font-bold tracking-tight text-white text-lg">SecureCorp <span className="text-primary text-xs ml-1">ADMIN</span></h1>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${isActive ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <link.icon size={18} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <span className="text-xs font-bold">{userName.charAt(0)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-white font-medium">{userName}</span>
              <span className="text-xs text-slate-500">Security Team</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors text-sm font-semibold"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-white/10 bg-white/5 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-primary" />
            <h1 className="font-bold text-white">SecureCorp</h1>
          </div>
          <button onClick={handleLogout} className="text-red-400 p-2">
            <LogOut size={20} />
          </button>
        </header>

        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-[-200px] left-[-200px] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
