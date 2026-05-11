import { LogOut } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { logoutAction } from '@/actions/auth';
import Link from 'next/link';
import { ReactNode } from 'react';
import { SidebarNav } from '@/components/SidebarNav';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  const user = session.user;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 sticky top-0 h-screen">
        <Link href="/dashboard" className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            G
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">Global-Gate</span>
        </Link>

        <SidebarNav />

        <form action={logoutAction}>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors font-bold mt-auto outline-none focus:ring-2 focus:ring-rose-500">
            <LogOut size={20} />
            Log Out
          </button>
        </form>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">
              Agriculture Trade Hub
            </h1>
            <p className="text-slate-500 mt-1">Welcome back, <span className="text-indigo-600 font-bold">{user.name || user.email}</span>.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold text-slate-800">{user.name || 'User'}</p>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{user.role}</p>
            </div>
            <div className="w-12 h-12 bg-slate-200 rounded-2xl border-2 border-white shadow-sm flex items-center justify-center text-slate-500 font-bold">
              {(user.name || user.email)[0].toUpperCase()}
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
