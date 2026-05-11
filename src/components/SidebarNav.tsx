'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Globe, ShieldAlert, BarChart3, Settings, Camera, MessageSquarePlus } from 'lucide-react';
import { ReactNode } from 'react';

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1">
      <NavItem 
        href="/dashboard" 
        icon={<LayoutDashboard size={20} />} 
        label="Overview" 
        active={pathname === '/dashboard'} 
      />
      <NavItem 
        href="/dashboard/analyze" 
        icon={<Camera size={20} />} 
        label="AI Vision Lab" 
        active={pathname === '/dashboard/analyze'} 
      />
      <NavItem 
        href="/dashboard/corridors" 
        icon={<Globe size={20} />} 
        label="Trade Corridors" 
        active={pathname === '/dashboard/corridors'} 
      />
      <NavItem 
        href="/dashboard/compliance" 
        icon={<ShieldAlert size={20} />} 
        label="Compliance Feed" 
        active={pathname === '/dashboard/compliance'} 
        badge="12" 
      />
      <NavItem 
        href="/dashboard/audit" 
        icon={<BarChart3 size={20} />} 
        label="Audit Trail" 
        active={pathname === '/dashboard/audit'} 
      />
      <NavItem 
        href="/dashboard/settings" 
        icon={<Settings size={20} />} 
        label="Settings" 
        active={pathname === '/dashboard/settings'} 
      />
      <NavItem 
        href="/dashboard/feedback" 
        icon={<MessageSquarePlus size={20} />} 
        label="Improvement Lab" 
        active={pathname === '/dashboard/feedback'} 
      />
    </nav>
  );
}

function NavItem({ href, icon, label, active = false, badge }: { href: string, icon: ReactNode, label: string, active?: boolean, badge?: string }) {
  return (
    <Link 
      href={href}
      className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all font-bold group ${
        active 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`${active ? 'text-white' : 'group-hover:text-indigo-600'} transition-colors`}>
          {icon}
        </span>
        {label}
      </div>
      {badge && (
        <span className={`px-2 py-0.5 text-xs rounded-full ${
          active ? 'bg-indigo-400 text-white' : 'bg-rose-100 text-rose-600'
        }`}>
          {badge}
        </span>
      )}
    </Link>
  );
}
