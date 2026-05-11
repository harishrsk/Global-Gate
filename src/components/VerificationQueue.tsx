import { ShieldCheck, AlertCircle, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Report {
  id: string;
  title: string;
  status: 'PENDING_HUMAN_REVIEW' | 'APPROVED' | 'REJECTED';
  quality_score: number;
  grading_class: string;
  imageUrl: string;
  securityLevel?: string;
}

export function VerificationQueue({ reports }: { reports: Report[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Verification Queue</h2>
        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
          {reports.length} Pending Reviews
        </span>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <div 
            key={report.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                {/* Image Placeholder */}
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Eye size={24} />
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-800">{report.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs font-bold uppercase",
                    report.grading_class === 'PREMIUM' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                  )}>
                    {report.grading_class}
                  </span>
                  <span className="text-sm text-slate-500">
                    Quality: <span className="font-medium text-slate-700">{report.quality_score}%</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {report.securityLevel === 'QUANTUM_SAFE' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
                  <ShieldCheck size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Quantum Safe</span>
                </div>
              )}
              
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium">
                  <Eye size={18} />
                  Review
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  Quick Approve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reports.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <CheckCircle2 size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">All clear! No pending reports for verification.</p>
        </div>
      )}
    </div>
  );
}
