'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Sidebar from './components/Sidebar';
import AccountDropdown from './components/AccountDropdown';
import { syncApi } from '@/lib/api';

export const dynamic = 'force-dynamic';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Detect login page (works for /en/admin/login, /am/admin/login, etc.)
  const isLoginPage = pathname.endsWith('/admin/login');

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      // Preserve locale prefix
      const locale = pathname.split('/')[1] || 'en';
      router.push(`/${locale}/admin/login`);
    }
  }, [isAuthenticated, isLoading, isLoginPage, router, pathname]);

  useEffect(() => {
    if (isAuthenticated && !isLoginPage) {
      const fetchLastSync = async () => {
        try {
          const data = await syncApi.getLastSync();
          setLastSyncTime(data.lastSyncAt);
        } catch {
          // silently ignore
        }
      };
      fetchLastSync();
      const interval = setInterval(fetchLastSync, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, isLoginPage]);

  const formatLastSync = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-customBlue/30 border-t-customBlue rounded-full animate-spin" />
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoginPage) return <>{children}</>;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-black">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-lg border-b border-gray-800">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-white/60 hover:bg-gray-800 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            <div className="flex-1 lg:flex-none" />
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1 sm:gap-2 text-white/60 text-xs sm:text-sm">
                <span className="material-symbols-outlined text-base sm:text-lg">sync</span>
                <span>{formatLastSync(lastSyncTime)}</span>
              </div>
              <AccountDropdown />
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}
