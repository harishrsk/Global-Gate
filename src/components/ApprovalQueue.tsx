'use client';

import { useState } from 'react';
import { ShieldCheck, XCircle, Eye, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { approveReport } from '@/actions/analyze-and-report';

interface Report {
  id: string;
  title: string;
  status: string;
  content: any;
  imageUrl?: string;
  author: { name: string | null };
}

export function ApprovalQueue({ initialReports, managerId }: { initialReports: any[], managerId: string }) {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async (id: string) => {
    setIsProcessing(true);
    const res = await approveReport(id, managerId);
    if (res.success) {
      setReports(reports.filter(r => r.id !== id));
      setSelectedReport(null);
    } else {
      alert(res.error);
    }
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
            <ShieldCheck className="text-indigo-600" />
            HITL Approval Queue
          </h3>
          <span className="px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black">
            {reports.length} PENDING REVIEW
          </span>
        </div>

        <div className="divide-y divide-slate-50">
          {reports.length === 0 ? (
            <div className="p-20 text-center text-slate-400 font-bold">
              All reports verified. Queue empty.
            </div>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-indigo-50 rounded-2xl group-hover:bg-indigo-100 transition-colors">
                    <ImageIcon className="text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{report.title}</h4>
                    <p className="text-xs text-slate-400">By {report.author?.name || 'Exporter'} • AI Analyzed</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedReport(report)}
                  className="flex items-center gap-2 px-6 py-2 bg-white border border-slate-200 rounded-xl font-bold text-sm hover:border-indigo-600 hover:text-indigo-600 transition-all"
                >
                  <Eye size={16} />
                  Review Details
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Human-in-the-Loop Verification</h3>
                <p className="text-xs font-bold text-slate-400">Comparing AI Model Insights vs Ground Truth Image</p>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="p-3 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 grid md:grid-cols-2 gap-10">
              {/* Left: AI Insights */}
              <div className="space-y-8">
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">AI Grading Logic</h4>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-600">Quality Score</span>
                      <span className="text-2xl font-black text-indigo-600">{selectedReport.content.quality_score}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-600">Grading Class</span>
                      <span className="px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black">
                        {selectedReport.content.grading_class}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-600 block mb-2">Analysis Summary</span>
                      <p className="text-sm text-slate-500 italic leading-relaxed">
                        "{selectedReport.content.analysis_summary}"
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Compliance Status</h4>
                  <div className={`p-6 rounded-3xl border ${
                    selectedReport.content.compliance_status === 'COMPLIANT' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'
                  }`}>
                    <div className="flex items-center gap-3">
                      <AlertCircle className={selectedReport.content.compliance_status === 'COMPLIANT' ? 'text-emerald-600' : 'text-rose-600'} />
                      <span className={`font-black uppercase tracking-widest text-sm ${
                        selectedReport.content.compliance_status === 'COMPLIANT' ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {selectedReport.content.compliance_status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Source Image */}
              <div className="space-y-6">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Source Inspection Image</h4>
                <div className="aspect-[4/3] bg-slate-200 rounded-[2rem] overflow-hidden border-4 border-white shadow-lg flex items-center justify-center text-slate-400">
                  <ImageIcon size={48} />
                </div>
                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4">
                  <AlertCircle className="text-amber-600 flex-shrink-0" />
                  <p className="text-xs text-amber-700 font-bold leading-relaxed">
                    IMPORTANT: Manager must verify that the image matches the physical batch before unlocking the PQC Signature module.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
              <button 
                onClick={() => setSelectedReport(null)}
                className="px-8 py-3 font-bold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button 
                disabled={isProcessing}
                onClick={() => handleApprove(selectedReport.id)}
                className="px-10 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
              >
                {isProcessing ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />}
                {isProcessing ? 'Signing...' : 'Approve & Sign with PQC'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
