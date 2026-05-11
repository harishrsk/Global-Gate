'use client';

import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';

interface ComplianceItemProps {
  title: string;
  corridor: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  date: string;
  description: string;
}

export function ComplianceItem({ title, corridor, severity, date, description }: ComplianceItemProps) {
  const [showDetails, setShowDetails] = useState(false);
  const colors = {
    HIGH: 'text-rose-600 bg-rose-50',
    MEDIUM: 'text-amber-600 bg-amber-50',
    LOW: 'text-indigo-600 bg-indigo-50'
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${colors[severity]}`}>
            <ShieldAlert size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">{title}</h4>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-tight">{corridor}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 font-bold">{date}</p>
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-indigo-600 font-black mt-1 hover:underline"
          >
            {showDetails ? 'HIDE' : 'DETAILS'}
          </button>
        </div>
      </div>
      
      {showDetails && (
        <div className="px-6 pb-6 pt-2 border-t border-slate-50 animate-in slide-in-from-top-2 duration-200">
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
