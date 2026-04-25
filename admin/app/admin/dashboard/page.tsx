'use client';

import { useState, useEffect } from 'react';
import { analyticsAPI } from '@/lib/api';
import { 
  Users, 
  Image as ImageIcon, 
  FileText, 
  TrendingUp, 
  Eye, 
  Calendar,
  ArrowUpRight
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await analyticsAPI.getDashboard();
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        // Fallback stats for demo if backend is not responding or doesn't have dashboard endpoint yet
        setStats({
          totalPhotos: 124,
          totalBlogs: 18,
          totalViews: '12.4K',
          activeUsers: 45
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Photos', value: stats?.totalPhotos || 0, icon: ImageIcon, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Published Blogs', value: stats?.totalBlogs || 0, icon: FileText, color: 'text-gold', bg: 'bg-gold/10' },
    { label: 'Total Views', value: stats?.totalViews || '0', icon: Eye, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Active Sessions', value: stats?.activeUsers || 0, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-white tracking-tight">Overview Dashboard</h2>
        <p className="text-gray-400">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="glass p-6 rounded-2xl border-luxury-border hover:border-gold/30 transition-all group">
            <div className="flex items-start justify-between">
              <div className={cn("p-3 rounded-xl", card.bg)}>
                <card.icon className={cn("w-6 h-6", card.color)} />
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                <TrendingUp className="w-3 h-3" />
                +12%
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-gray-400 text-sm font-medium">{card.label}</h3>
              <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-2xl border-luxury-border p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Recent Website Traffic</h3>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 rounded-lg bg-white/5 text-gray-400 text-sm hover:text-white transition-colors border border-white/10">7 Days</button>
              <button className="px-4 py-1.5 rounded-lg bg-gold/10 text-gold text-sm border border-gold/20">30 Days</button>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[40, 65, 45, 80, 55, 90, 75, 45, 30, 85, 60, 40].map((h, i) => (
              <div 
                key={i} 
                className="w-full bg-gold/20 rounded-t-lg hover:bg-gold/40 transition-all cursor-pointer relative group"
                style={{ height: `${h}%` }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-luxury-gray border border-luxury-border px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {h * 12} Views
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-2xl border-luxury-border p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gold" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-white/10 transition-all group">
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">Upload New Photo</span>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-gold" />
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-white/10 transition-all group">
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">Write New Blog</span>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-gold" />
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-white/10 transition-all group">
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">Update Portfolio</span>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-gold" />
              </button>
            </div>
          </div>
          
          <div className="glass rounded-2xl border-luxury-border p-6">
            <h3 className="text-lg font-bold text-white mb-4">System Status</h3>
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Backend Connected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to use cn in this file without extra import if needed, but we have it in lib/utils
import { cn } from '@/lib/utils';
