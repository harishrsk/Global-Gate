import { BarChart3, Fingerprint } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Audit Trail | Global-Gate",
  description: "Cryptographically verified trade logs and sovereign audit trails.",
};

export default function AuditPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Sovereign Audit Trail</h2>
        <p className="text-slate-500">Every AI analysis and human signature is cryptographically logged.</p>
      </div>

      <div className="overflow-hidden bg-white border border-slate-100 rounded-3xl shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Event</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">User</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Integrity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AuditRow 
              action="HUMAN_APPROVAL" 
              user="Lead Systems Architect" 
              date="May 11, 2024" 
              pqc={true} 
            />
            <AuditRow 
              action="AI_ANALYSIS" 
              user="Gemini 1.5 Flash" 
              date="May 11, 2024" 
              pqc={false} 
            />
            <AuditRow 
              action="USER_SIGNUP" 
              user="New Exporter" 
              date="May 10, 2024" 
              pqc={false} 
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AuditRow({ action, user, date, pqc }: { action: string, user: string, date: string, pqc: boolean }) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-6">
        <p className="font-bold text-slate-900 text-sm">{action}</p>
        <p className="text-xs text-slate-400">Transaction ID: GG-TX-8821</p>
      </td>
      <td className="px-6 py-6 text-sm text-slate-600 font-medium">{user}</td>
      <td className="px-6 py-6 text-sm text-slate-600 font-medium">{date}</td>
      <td className="px-6 py-6 text-right">
        {pqc ? (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black">
            <Fingerprint size={12} />
            PQC SIGNED
          </div>
        ) : (
          <span className="text-[10px] font-black text-slate-300">STANDARD LOG</span>
        )}
      </td>
    </tr>
  );
}
