'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  Bell,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { authAPI } from '@/lib/api';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Photos Manager', href: '/admin/photos', icon: ImageIcon },
  { name: 'Blog Writing', href: '/admin/blogs', icon: FileText },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        await authAPI.verifyToken();
        setLoading(false);
      } catch (err) {
        localStorage.removeItem('adminToken');
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-luxury-gray border-r border-luxury-border transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gold flex items-center justify-center flex-shrink-0">
              <span className="text-luxury-black font-bold text-xl">R</span>
            </div>
            {isSidebarOpen && (
              <span className="text-white font-bold tracking-tight whitespace-nowrap overflow-hidden animate-fade-in">
                ROYAL DESI
              </span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                    isActive 
                      ? "bg-gold/10 text-gold border border-gold/20" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-gold" : "group-hover:text-gold")} />
                  {isSidebarOpen && (
                    <span className="text-sm font-medium animate-fade-in">{item.name}</span>
                  )}
                  {isActive && isSidebarOpen && (
                    <ChevronRight className="w-4 h-4 ml-auto animate-fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Logout */}
          <div className="p-4 border-t border-luxury-border">
            <button
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all group",
                !isSidebarOpen && "justify-center"
              )}
            >
              <LogOut className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
              {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 bg-gold text-luxury-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg border border-luxury-black hover:scale-110 transition-transform"
        >
          {isSidebarOpen ? <X className="w-3 h-3" /> : <Menu className="w-3 h-3" />}
        </button>
      </aside>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300",
          isSidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        {/* Header */}
        <header className="h-20 glass sticky top-0 z-40 px-8 flex items-center justify-between border-b border-luxury-border">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {navItems.find(i => pathname === i.href)?.name || 'Admin Panel'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full" />
            </button>
            <div className="h-8 w-px bg-luxury-border mx-2" />
            <div className="flex items-center gap-3 bg-white/5 pl-2 pr-4 py-1.5 rounded-full border border-white/10">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center border border-gold/30">
                <User className="w-4 h-4 text-gold" />
              </div>
              <span className="text-sm font-medium text-white">Admin</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
