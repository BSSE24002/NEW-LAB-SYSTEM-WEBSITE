import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Store,
  Package,
  LayoutDashboard,
  LogOut,
  FileText,
  Users,
} from "lucide-react";
import { POSProvider } from "../../context/POSContext";

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  const role = localStorage.getItem("userRole");
  const name = localStorage.getItem("userName") || "Admin";

  useEffect(() => {
    if (role !== "admin" && role !== "staff") {
      navigate("/");
    }
  }, [role, navigate]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navLinks =
    role === "admin"
      ? [
          { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
          { name: "Products", path: "/admin/products", icon: Package },
          { name: "Categories", path: "/admin/categories", icon: Package },
          { name: "Discounts", path: "/admin/discounts", icon: Store },
          { name: "Inventory", path: "/admin/inventory", icon: Package },
          { name: "Orders", path: "/admin/orders", icon: FileText },
          { name: "Register", path: "/admin/pos", icon: Store },
          { name: "Staff", path: "/admin/staffs", icon: Users },
        ]
      : [
          { name: "Register", path: "/admin/pos", icon: Store },
          { name: "Inventory", path: "/admin/inventory", icon: Package },
          { name: "Orders", path: "/admin/orders", icon: FileText },
        ];

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
  };

  if (role !== "admin" && role !== "staff") return null;

  return (
    <POSProvider>
      <div className="flex h-screen bg-[#FDFDFD] text-brand-obsidian overflow-hidden font-sans">
        {/* Sidebar */}
        <aside className="w-64 bg-white flex flex-col z-20 shrink-0 border-r border-gray-200">
          <div className="h-20 flex items-center px-8 border-b border-gray-100">
            <span className="font-sans font-black text-2xl tracking-tighter text-brand-obsidian uppercase">
              DRAPE<span className="text-red-500">.</span>
            </span>
          </div>

          <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
            {navLinks.map((link) => {
              const active =
                location.pathname === link.path ||
                (link.path !== "/admin" &&
                  location.pathname.startsWith(link.path));
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-4 px-4 py-3 rounded-md transition-all ${
                    active
                      ? "bg-gray-50 text-brand-obsidian font-bold"
                      : "text-gray-500 hover:bg-gray-50 hover:text-brand-obsidian"
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={active ? 2.5 : 1.5} />
                  <span className="font-sans text-xs tracking-[0.15em] uppercase mt-0.5">
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <Link
              onClick={handleLogout}
              to="/"
              className="flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-brand-obsidian hover:bg-gray-50 rounded-md transition-all"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              <span className="font-sans text-xs tracking-[0.15em] uppercase mt-0.5">
                Exit System
              </span>
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 shrink-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400 font-mono">
                TILL_01_NYC // LIVE
              </span>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-gray-400 text-xs tracking-widest font-mono">
                {time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-bold uppercase tracking-widest text-brand-obsidian leading-none">
                    {name}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">
                    {role}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-brand-obsidian text-white flex items-center justify-center font-bold text-[10px] uppercase">
                  {name.substring(0, 2)}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto no-scrollbar relative bg-[#FAFAFA]">
            <Outlet />
          </main>
        </div>
      </div>
    </POSProvider>
  );
}
