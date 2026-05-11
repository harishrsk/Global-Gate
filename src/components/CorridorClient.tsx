'use client';

import { useState } from 'react';
import { Globe, Plus, X, ShieldCheck, FileWarning, Info, Trash2, Loader2 } from 'lucide-react';
import { createCorridor, deleteCorridor } from '@/actions/corridor';

const REGULATIONS_DATA: Record<string, any> = {
  'Capsicum': {
    title: 'Capsicum Import Regulations (UAE)',
    standards: [
      'Maximum Residue Limit (MRL) for Chlorpyrifos: 0.01 mg/kg',
      'Phytosanitary Certificate from origin NPPO is MANDATORY',
      'ESMA Food Safety Mark required on retail packaging'
    ],
    tariffs: '5% Unified GCC Customs Tariff',
    alerts: 'Increased inspection at Jebel Ali Port for Solanaceae family.'
  },
  'Default': {
    title: 'Standard Import Regulations',
    standards: [
      'Standard Health Certificate required',
      'General safety labeling standards apply',
      'Origin country verification'
    ],
    tariffs: 'Variable based on HTS code',
    alerts: 'No active alerts for this corridor.'
  }
};

export function CorridorClient({ initialCorridors }: { initialCorridors: any[] }) {
  const [corridors, setCorridors] = useState(initialCorridors);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await createCorridor(formData);
    if (res.success) {
      setIsAddModalOpen(false);
      window.location.reload(); // Refresh to get updated list from server
    } else {
      alert(res.error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this corridor?')) return;
    const res = await deleteCorridor(id);
    if (res.success) {
      setCorridors(corridors.filter(c => c.id !== id));
    } else {
      alert(res.error);
    }
  };

  const [filter, setFilter] = useState({ category: 'ALL', type: 'ALL' });

  const filteredCorridors = corridors.filter(c => {
    const categoryMatch = filter.category === 'ALL' || c.category === filter.category;
    const typeMatch = filter.type === 'ALL' || c.type === filter.type;
    return categoryMatch && typeMatch;
  });

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Global Trade Hub</h2>
          <p className="text-slate-500 font-bold">Multi-sector Import/Export Management</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-3xl font-black hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100"
        >
          <Plus size={20} />
          Launch New Corridor
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 p-4 bg-slate-50 rounded-[2rem] border border-slate-100">
        <select 
          value={filter.category}
          onChange={(e) => setFilter({...filter, category: e.target.value})}
          className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 outline-none focus:border-indigo-600"
        >
          <option value="ALL">All Categories</option>
          <option value="AGRICULTURE">Agriculture</option>
          <option value="ELECTRONICS">Electronics</option>
          <option value="TEXTILES">Textiles</option>
          <option value="PHARMACEUTICALS">Pharmaceuticals</option>
          <option value="AUTOMOTIVE">Automotive</option>
          <option value="CHEMICALS">Chemicals</option>
          <option value="OTHER">Other</option>
        </select>
        <select 
          value={filter.type}
          onChange={(e) => setFilter({...filter, type: e.target.value})}
          className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 outline-none focus:border-indigo-600"
        >
          <option value="ALL">All Types</option>
          <option value="IMPORT">Imports</option>
          <option value="EXPORT">Exports</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCorridors.map((corridor) => (
          <div key={corridor.id} className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 flex gap-2">
              <button 
                onClick={() => handleDelete(corridor.id)}
                className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                corridor.type === 'IMPORT' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {corridor.type}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors w-fit">
                <Globe className="text-indigo-600" size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{corridor.category}</p>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{corridor.product}</h3>
              </div>
            </div>
            
            <p className="text-slate-500 font-bold mb-8">{corridor.origin} → {corridor.destination}</p>
            
            <div className="flex justify-between items-center pt-6 border-t border-slate-50">
              <button 
                onClick={() => setSelectedProduct(corridor.product)}
                className="text-indigo-600 font-black text-sm hover:underline hover:text-indigo-800 transition-colors"
              >
                View Regulatory Feed
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Configure New Corridor</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleAdd} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Trade Type</label>
                  <select name="type" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold">
                    <option value="EXPORT">Exporting From</option>
                    <option value="IMPORT">Importing To</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Sector</label>
                  <select name="category" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold">
                    <option value="AGRICULTURE">Agriculture</option>
                    <option value="ELECTRONICS">Electronics</option>
                    <option value="TEXTILES">Textiles</option>
                    <option value="PHARMACEUTICALS">Pharmaceuticals</option>
                    <option value="AUTOMOTIVE">Automotive</option>
                    <option value="CHEMICALS">Chemicals</option>
                    <option value="OTHER">Other Sector</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Product / Commodity</label>
                <input name="product" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold" placeholder="e.g. Lithium-Ion Cells" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Origin</label>
                  <input name="origin" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. South Korea" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Destination</label>
                  <input name="destination" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. India" />
                </div>
              </div>
              <button 
                disabled={isSubmitting}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
                {isSubmitting ? 'Establishing Route...' : 'Initialize Corridor'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Regulation Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 text-white rounded-2xl">
                  <Globe size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{selectedProduct}</h3>
                  <p className="text-xs font-bold text-slate-500">Regulatory Insight</p>
                </div>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              {(() => {
                const data = REGULATIONS_DATA[selectedProduct] || REGULATIONS_DATA['Default'];
                return (
                  <>
                    <div>
                      <div className="flex items-center gap-2 mb-4 text-emerald-600">
                        <ShieldCheck size={20} />
                        <h4 className="font-bold">Compliance Standards</h4>
                      </div>
                      <ul className="space-y-3">
                        {data.standards.map((s: string, i: number) => (
                          <li key={i} className="flex gap-3 text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                        <div className="flex items-center gap-2 mb-2 text-indigo-700">
                          <Info size={16} />
                          <h4 className="text-xs font-black uppercase tracking-widest">Tariffs</h4>
                        </div>
                        <p className="text-sm font-bold text-indigo-900">{data.tariffs}</p>
                      </div>
                      <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100">
                        <div className="flex items-center gap-2 mb-2 text-rose-700">
                          <FileWarning size={16} />
                          <h4 className="text-xs font-black uppercase tracking-widest">Border Alerts</h4>
                        </div>
                        <p className="text-sm font-bold text-rose-900">{data.alerts || 'None'}</p>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setSelectedProduct(null)} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold">Understood</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
