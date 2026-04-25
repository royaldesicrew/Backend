'use client';

import { Settings as SettingsIcon, Shield, Bell, Database, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">System Settings</h2>
        <p className="text-gray-400">Configure your admin portal and account preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl border-luxury-border space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold/10 rounded-lg">
              <Shield className="w-5 h-5 text-gold" />
            </div>
            <h3 className="font-bold text-white">Security</h3>
          </div>
          <div className="space-y-4">
            <button className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all text-sm text-gray-300">
              Change Admin Password
            </button>
            <button className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all text-sm text-gray-300">
              Two-Factor Authentication
            </button>
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border-luxury-border space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-400/10 rounded-lg">
              <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-bold text-white">Website Integration</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">API Endpoint</p>
              <code className="text-xs text-gold">https://backend-six-theta-99.vercel.app/api</code>
            </div>
            <button className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all text-sm text-gray-300">
              Regenerate API Keys
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
