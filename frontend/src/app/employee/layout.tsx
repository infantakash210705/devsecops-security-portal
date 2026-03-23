"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, Bell } from "lucide-react";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userName, setUserName] = useState("Employee");

  useEffect(() => {
    const authStorage = localStorage.getItem("securecorp_auth");
    if (!authStorage) {
      router.push("/login");
      return;
    }

    const data = JSON.parse(authStorage);
    if (data.role !== "employee" && data.role !== "admin") {
      router.push("/login");
      return;
    }

    setUserName(data.name || "Employee");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("securecorp_auth");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-sans selection:bg-primary">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              <span className="font-bold text-white text-xs">SC</span>
            </div>
            <h1 className="font-bold text-xl text-white tracking-tight">
              SecureCorp
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
              <Bell size={20} className="text-slate-300" />
              <div className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#0A0A0B]"></div>
            </button>

            <div className="h-8 w-[1px] bg-white/10"></div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-white">{userName}</span>
                <span className="text-xs text-slate-400">Employee Portal</span>
              </div>

              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <User size={20} className="text-slate-300" />
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="ml-2 p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>

        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}