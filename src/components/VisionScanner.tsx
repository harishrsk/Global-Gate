'use client';

import { useState } from 'react';
import { analyzeAndReport } from '@/actions/analyze-and-report';
import { Upload, Camera, Loader2, CheckCircle2, AlertTriangle, FileText, TrendingUp, Globe } from 'lucide-react';
import Image from 'next/image';

export function VisionScanner({ initialCorridors }: { initialCorridors: any[] }) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedCorridor, setSelectedCorridor] = useState(initialCorridors[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [status, setStatus] = useState<'IDLE' | 'UPLOADING' | 'PROCESSING' | 'COMPLETED'>('IDLE');
  const [progress, setProgress] = useState(0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setStatus('IDLE');
      setProgress(0);
    }
  };

  const pollStatus = async (reportId: string) => {
    const { getReportStatus } = await import('@/actions/report');
    
    const interval = setInterval(async () => {
      const report = await getReportStatus(reportId);
      if (report?.status === 'PENDING_HUMAN_REVIEW' || report?.status === 'AI_ANALYZED') {
        setResult(report.content);
        setStatus('COMPLETED');
        setProgress(100);
        clearInterval(interval);
        setLoading(false);
      } else if (report?.status === 'PROCESSING') {
        setProgress(66);
      }
    }, 2000);

    // Timeout after 60 seconds
    setTimeout(() => clearInterval(interval), 60000);
  };

  const handleUpload = async () => {
    if (!image || !selectedCorridor) return;
    setLoading(true);
    setStatus('UPLOADING');
    setProgress(33);

    const formData = new FormData();
    formData.append('image', image);
    const corridorName = initialCorridors.find(c => c.id === selectedCorridor)?.name || 'General';
    formData.append('corridor', corridorName);

    const response = await analyzeAndReport(formData);
    
    if (response.success && response.reportId) {
      setStatus('PROCESSING');
      pollStatus(response.reportId);
    } else {
      const errorMsg = (response.error as any)?.detail || 'Upload failed';
      alert(errorMsg);
      setLoading(false);
      setStatus('IDLE');
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Upload Side */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Active Trade Corridor</label>
            <select 
              value={selectedCorridor}
              onChange={(e) => setSelectedCorridor(e.target.value)}
              className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-600 transition-all shadow-sm"
            >
              <option value="" disabled>Select a corridor...</option>
              {initialCorridors.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div 
            className={`relative h-[400px] rounded-[3rem] border-4 border-dashed transition-all flex flex-col items-center justify-center p-10 text-center ${
              preview ? 'border-indigo-600 bg-white' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-[2.5rem]" />
            ) : (
              <>
                <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-slate-400 mb-6">
                  <Camera size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Ready to Inspect?</h3>
                <p className="text-slate-500 mb-8 max-w-xs">Upload a product photo for AI grading and market intelligence.</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold">Select Image</div>
              </>
            )}
            
            {preview && (
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            )}
          </div>

          <button 
            onClick={handleUpload}
            disabled={!image || loading}
            className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-bold text-xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
            {loading ? 'AI analyzing...' : 'Start Vision Analysis'}
          </button>
        </div>

        {/* Results Side */}
        <div className="space-y-6">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50 border border-slate-100 rounded-[3rem] p-12">
              <Loader2 size={48} className="mb-4" />
              <p className="font-bold">Waiting for input...</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center bg-white border border-slate-100 rounded-[3rem] p-12">
              <div className="w-full max-w-xs space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">{status}</p>
                    <h4 className="font-bold text-slate-900">Processing Batch...</h4>
                  </div>
                  <span className="text-sm font-black text-slate-400">{progress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 italic">
                  {status === 'UPLOADING' && 'Encrypting and sending to sovereign vault...'}
                  {status === 'PROCESSING' && 'Gemini 1.5 Pro is synthesizing documents...'}
                </p>
              </div>
            </div>
          )}

          {result && (
            <div className="bg-white rounded-[3rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Quality Header */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Quality Score</p>
                  <span className="text-5xl font-black text-indigo-600 tracking-tight">{result.quality_score}%</span>
                </div>
                <div className={`px-6 py-2 rounded-2xl font-black text-sm ${
                  result.compliance_status === 'COMPLIANT' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {result.compliance_status}
                </div>
              </div>

              {/* Paperwork Section */}
              <section className="p-6 bg-slate-50 rounded-3xl">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={18} className="text-slate-900" />
                  <h4 className="font-bold text-slate-900">Required Paperwork</h4>
                </div>
                <div className="space-y-3">
                  {result.required_paperwork.map((doc: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <div className={`mt-1 ${doc.mandatory ? 'text-indigo-600' : 'text-slate-300'}`}>
                        <CheckCircle2 size={14} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{doc.document}</p>
                        <p className="text-slate-500 text-xs">{doc.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Market Intel Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 border border-slate-100 rounded-3xl">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={16} className="text-indigo-600" />
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">High Demand</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.market_intelligence.high_demand_countries.map((c: string) => (
                      <span key={c} className="text-xs font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-lg">{c}</span>
                    ))}
                  </div>
                </div>
                <div className="p-6 border border-slate-100 rounded-3xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe size={16} className="text-emerald-600" />
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Top Producers</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.market_intelligence.top_producers.map((c: string) => (
                      <span key={c} className="text-xs font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-lg">{c}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50">
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "{result.analysis_summary}"
                </p>
                <div className="mt-4 flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl text-xs font-bold">
                  <AlertTriangle size={14} />
                  Action: {result.suggested_action}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
