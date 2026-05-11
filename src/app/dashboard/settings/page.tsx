import { Settings, User, Shield, Bell } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Account Settings</h2>
        <p className="text-slate-500">Manage your profile and security preferences.</p>
      </div>

      <div className="space-y-6">
        <SettingsSection icon={<User size={20} />} title="Personal Information">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Full Name" className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
            <input placeholder="Email" className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </SettingsSection>

        <SettingsSection icon={<Shield size={20} />} title="Security & PQC">
          <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <div>
              <p className="font-bold text-indigo-900">Quantum-Safe Signing</p>
              <p className="text-xs text-indigo-700">Currently using ML-KEM with 256-bit entropy.</p>
            </div>
            <div className="w-12 h-6 bg-indigo-600 rounded-full relative p-1 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection icon={<Bell size={20} />} title="Notifications">
          <p className="text-sm text-slate-500 font-medium">Receive alerts for new regulations and analysis reports.</p>
        </SettingsSection>
      </div>

      <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
        <button className="px-6 py-3 text-slate-500 font-bold hover:text-slate-900">Cancel</button>
        <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all">Save Changes</button>
      </div>
    </div>
  );
}

function SettingsSection({ icon, title, children }: { icon: React.ReactNode, title: string, children?: React.ReactNode }) {
  return (
    <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
          {icon}
        </div>
        <h3 className="font-bold text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}
