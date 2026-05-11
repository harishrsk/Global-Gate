import { ApprovalQueue } from '@/components/ApprovalQueue';
import { getDashboardStats, getPendingReports } from '@/actions/stats';
import { getSession } from '@/lib/auth';

export default async function DashboardOverview() {
  const session = await getSession();
  const [stats, pendingReports] = await Promise.all([
    getDashboardStats(),
    getPendingReports()
  ]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard label="Active Corridors" value={stats.corridors.toString()} subValue="Live Routes" color="indigo" />
        <StatCard label="Reports Generated" value={stats.reports.toString()} subValue="AI Analyzed" color="emerald" />
        <StatCard label="Pending Approval" value={stats.pending.toString()} subValue="High Priority" color="amber" />
      </div>

      <ApprovalQueue 
        initialReports={pendingReports} 
        managerId={session?.user?.id || 'unknown'} 
      />

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Subscription Module */}
        <div className="bg-indigo-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-2">Enterprise Intelligence</h3>
            <p className="text-indigo-200 text-sm mb-8 max-w-xs">Subscribe to get monthly PQC-signed regulatory forecasts for your corridors.</p>
            <div className="flex gap-2 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <input 
                type="email" 
                placeholder="your@email.com" 
                className="bg-transparent flex-1 px-4 outline-none text-white placeholder:text-indigo-300 font-bold"
              />
              <button className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-black hover:bg-indigo-50 transition-all">
                Subscribe
              </button>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>
        </div>

        {/* Contact Us Module */}
        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-center">
          <h3 className="text-2xl font-black text-slate-900 mb-2">Direct Architect Support</h3>
          <p className="text-slate-500 text-sm mb-8">Need custom PQC integration or a private trade corridor? Contact us directly.</p>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 font-black">@</div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Email</p>
                <a href="mailto:harishrsk@gmail.com" className="font-bold text-slate-900 hover:text-indigo-600 transition-all">harishrsk@gmail.com</a>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600 font-black">#</div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Phone</p>
                <a href="tel:+917502940397" className="font-bold text-slate-900 hover:text-emerald-600 transition-all">+91 7502940397</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ label, value, subValue, color }: { label: string, value: string, subValue: string, color: 'indigo' | 'emerald' | 'amber' }) {
  const colors = {
    indigo: 'border-l-indigo-600',
    emerald: 'border-l-emerald-600',
    amber: 'border-l-amber-600'
  };

  return (
    <div className={`bg-white p-6 rounded-3xl shadow-sm border border-slate-100 border-l-[6px] ${colors[color]} hover:shadow-xl hover:shadow-slate-200/50 transition-all`}>
      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-4xl font-black text-slate-900 tracking-tight">{value}</span>
        <span className="text-xs text-slate-400 font-bold uppercase">{subValue}</span>
      </div>
    </div>
  );
}
