'use client';

import { useState } from 'react';
import { submitFeedback } from '@/actions/feedback';
import { Send, Loader2, Sparkles } from 'lucide-react';

export function FeedbackForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await submitFeedback(formData);
    
    if (res.success) {
      setSent(true);
      setTimeout(() => setSent(false), 5000);
      (e.target as HTMLFormElement).reset();
    } else {
      alert(res.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
      <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
        <Sparkles className="text-indigo-600" size={20} />
        Share Insight
      </h3>
      <p className="text-xs text-slate-400 font-bold mb-6 uppercase tracking-widest">Help us refine the platform</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Category</label>
          <select 
            name="category"
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:border-indigo-600 transition-all"
          >
            <option value="GENERAL">General Feedback</option>
            <option value="UI">User Interface</option>
            <option value="FEATURE_REQUEST">Feature Request</option>
            <option value="PERFORMANCE">Performance</option>
            <option value="BUG">Bug Report</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 block">Your Thoughts</label>
          <textarea 
            name="content"
            required
            placeholder="How can we make your trade operations smoother?"
            className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[2rem] font-bold text-slate-700 outline-none focus:border-indigo-600 transition-all min-h-[150px] resize-none"
          />
        </div>

        <button 
          disabled={isSubmitting || sent}
          className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 ${
            sent ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : (sent ? <Send size={20} /> : <Send size={20} />)}
          {isSubmitting ? 'Sending...' : (sent ? 'Suggestion Received!' : 'Submit Feedback')}
        </button>
      </form>
    </div>
  );
}
