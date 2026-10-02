import React, { useState } from 'react';
import {
  TrendingUp,
  Share2,
  DollarSign,
  BarChart2,
  Calendar,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Eye,
  MousePointer,
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export const MarketingView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CAMPAIGNS' | 'SOCIAL_PLANNER' | 'ANALYTICS'>('CAMPAIGNS');

  const campaigns = [
    {
      id: 'CMP-META-01',
      name: 'Neo Autumn Cyberwear Launch',
      platform: 'Meta Ads (Facebook & Instagram)',
      budget: '5,000 BDT/day',
      spent: '38,500 BDT',
      roas: '4.8x',
      leads: 312,
      cpc: '4.2 BDT',
      status: 'ACTIVE',
    },
    {
      id: 'CMP-FIT-02',
      name: 'Fitkart BD Pure Whey & Creatine Combo',
      platform: 'Meta Ads + TikTok BD',
      budget: '8,000 BDT/day',
      spent: '56,000 BDT',
      roas: '5.2x',
      leads: 580,
      cpc: '3.8 BDT',
      status: 'ACTIVE',
    },
  ];

  const scheduledPosts = [
    { id: 'pst-1', platform: 'Instagram', channel: '@neo.bd', title: 'Modular Waterproof Sling 4L Showcase Reel', time: 'Today 18:00', status: 'SCHEDULED' },
    { id: 'pst-2', platform: 'Facebook', channel: 'Fitkart Bangladesh', title: 'Why Micronized Creatine is Essential for Recovery', time: 'Tomorrow 10:00', status: 'DRAFT' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0b0e14] border border-cyan-500/30 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/40 flex items-center justify-center text-orange-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-zinc-100 font-mono">
                Marketing & Social Media Command
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-800">
                CAMPAIGN MATRIX
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Meta Ads budget monitoring, multi-platform publishing, and conversion analytics
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('New ad set workflow initiated via Browser Workspace.')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold font-mono transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 text-xs font-mono">
        {(['CAMPAIGNS', 'SOCIAL_PLANNER', 'ANALYTICS'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => { sounds.playClick(); setActiveTab(tab); }}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === tab
                ? 'bg-cyan-500 text-zinc-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {activeTab === 'CAMPAIGNS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((cmp) => (
            <div
              key={cmp.id}
              className="p-5 rounded-2xl bg-[#0b0e14] border border-zinc-800 hover:border-orange-500/40 transition-all space-y-4 shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-orange-400 font-bold">{cmp.platform}</span>
                  <h3 className="text-sm font-bold text-zinc-100 font-mono mt-0.5">{cmp.name}</h3>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">
                  {cmp.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-xl bg-zinc-950 border border-zinc-900 text-xs font-mono">
                <div>
                  <div className="text-[10px] text-zinc-500">ROAS</div>
                  <div className="text-base font-bold text-emerald-400">{cmp.roas}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500">DAILY BUDGET</div>
                  <div className="text-zinc-200 font-semibold">{cmp.budget}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500">ORDERS/LEADS</div>
                  <div className="text-cyan-400 font-semibold">{cmp.leads}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500">CPC</div>
                  <div className="text-zinc-300 font-semibold">{cmp.cpc}</div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-zinc-500 flex justify-between items-center pt-2 border-t border-zinc-900">
                <span>Total Spent: <strong className="text-zinc-200">{cmp.spent}</strong></span>
                <span className="text-cyan-400">Audited via Meta Graph API</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'SOCIAL_PLANNER' && (
        <div className="p-6 rounded-2xl bg-[#0b0e14] border border-zinc-800 space-y-4">
          <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">
            Social Media Content Pipeline
          </h3>
          <div className="divide-y divide-zinc-900 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 text-xs font-mono">
            {scheduledPosts.map((post) => (
              <div key={post.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-zinc-200 font-bold">{post.title}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{post.platform} • {post.channel}</div>
                </div>
                <div className="text-right">
                  <div className="text-cyan-400 font-bold">{post.time}</div>
                  <div className="text-[9px] text-zinc-400 uppercase">{post.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ANALYTICS' && (
        <div className="p-6 rounded-2xl bg-[#0b0e14] border border-zinc-800 space-y-3 font-mono text-xs text-zinc-300">
          <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">Marketing ROI Analytics</h3>
          <p>Combined blended return on ad spend across Neo and Fitkart BD is maintaining 5.0x average efficiency.</p>
        </div>
      )}
    </div>
  );
};
