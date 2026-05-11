import { ShieldAlert, Info, AlertTriangle } from 'lucide-react';
import { getComplianceFeed } from '@/actions/compliance';
import { ComplianceItem } from '@/components/ComplianceItem';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Compliance Feed | Global-Gate",
  description: "Real-time regulatory alerts and trade compliance intelligence.",
};

export default async function CompliancePage() {
  const feed = await getComplianceFeed();
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Compliance Feed</h2>
        <p className="text-slate-500">Real-time regulatory alerts for your saved corridors.</p>
      </div>

      {feed.length > 0 && feed[0].severity === 'HIGH' && (
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl flex gap-4 items-start animate-pulse">
          <AlertTriangle className="text-rose-600 flex-shrink-0" size={24} />
          <div>
            <p className="font-bold text-rose-900">Urgent Alert: {feed[0].title}</p>
            <p className="text-rose-700 text-sm mt-1">{feed[0].description}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {feed.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-3xl text-slate-400 font-bold border-2 border-dashed border-slate-200">
            No compliance alerts found for your active corridors.
          </div>
        ) : (
          feed.map((item: any, index: number) => (
            <ComplianceItem 
              key={index}
              title={item.title} 
              corridor={item.corridor} 
              severity={item.severity}
              date={item.date}
              description={item.description}
            />
          ))
        )}
      </div>
    </div>
  );
}
