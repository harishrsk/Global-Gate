import { getFeedbacks } from '@/actions/feedback';
import { FeedbackForm } from '@/components/FeedbackForm';
import { MessageSquare, Star, Lightbulb, Bug } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Improvement Lab | Global-Gate",
  description: "Collaborate and share feedback to improve the Global-Gate trade platform.",
};

export default async function FeedbackPage() {
  const feedbacks = await getFeedbacks();

  return (
    <div className="space-y-10 pb-20">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Improvement Lab</h2>
        <p className="text-slate-500 font-bold mt-2">Help us build the future of Global Trade. Your insights directly shape our AI models and PQC protocols.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Star className="text-amber-400 fill-amber-400" />
              Community Suggestions
            </h3>
            <div className="space-y-6">
              {feedbacks.length === 0 ? (
                <div className="py-10 text-center text-slate-400 italic">No suggestions yet. Be the first!</div>
              ) : (
                feedbacks.map((f) => (
                  <div key={f.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 relative">
                    <span className="absolute top-4 right-6 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      {f.category}
                    </span>
                    <p className="text-slate-700 font-bold leading-relaxed mb-4">"{f.content}"</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-[10px] font-bold text-indigo-600">
                        {f.user.name?.[0] || 'U'}
                      </div>
                      <span className="text-xs text-slate-400 font-bold">{f.user.name || 'Anonymous User'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <FeedbackForm />
          
          {/* Feedback Stats */}
          <div className="bg-indigo-900 rounded-[3rem] p-8 text-white">
            <h4 className="font-black text-lg mb-4">Contribution Impact</h4>
            <div className="space-y-4">
              <ImpactItem icon={<Lightbulb size={16} />} label="Features Shipped" value="12" />
              <ImpactItem icon={<Bug size={16} />} label="Bugs Squashed" value="48" />
              <ImpactItem icon={<MessageSquare size={16} />} label="User Insights" value={feedbacks.length.toString()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImpactItem({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <span className="font-black text-white">{value}</span>
    </div>
  );
}
