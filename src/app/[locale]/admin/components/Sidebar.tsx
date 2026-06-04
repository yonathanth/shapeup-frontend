'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

// Nav items use locale-prefixed paths — middleware handles /en/admin/*
const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/en/admin', icon: 'dashboard' },
  { name: 'Members', href: '/en/admin/members', icon: 'group' },
  { name: 'Attendance', href: '/en/admin/attendance', icon: 'fact_check' },
  { name: 'Staff', href: '/en/admin/staff', icon: 'badge' },
  { name: 'Transactions', href: '/en/admin/transactions', icon: 'payments' },
  { name: 'Services', href: '/en/admin/services', icon: 'category' },
  { name: 'Potential Customers', href: '/en/admin/potential-customers', icon: 'person_add' },
  { name: 'SMS', href: '/en/admin/sms', icon: 'sms' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-surface-dark border-r border-surface-dark-lighter z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-5 border-b border-surface-dark-lighter">
            <Link href="/en/admin" className="flex items-center" onClick={onClose}>
              <div>
                <span className="text-white font-bold text-xl">Admin Panel</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => {
                // Dashboard is exact-match only to avoid highlighting on every admin sub-page
                const isActive =
                  item.href.endsWith('/admin')
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[#F1AC17]/10 text-[#F1AC17]'
                          : 'text-white/60 hover:bg-surface-dark-lighter hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg mr-3">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom branding removed */}
        </div>
      </aside>
    </>
  );
}
