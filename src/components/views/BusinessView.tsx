import React, { useState } from 'react';
import {
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  Plus,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Sparkles,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { BusinessEntity } from '../../types/nexus';
import { sounds } from '../../utils/audio';

interface BusinessViewProps {
  businesses: BusinessEntity[];
  onAddNewBusiness: (newBiz: Partial<BusinessEntity>) => void;
  selectedBizId?: string;
}

export const BusinessView: React.FC<BusinessViewProps> = ({
  businesses,
  onAddNewBusiness,
  selectedBizId,
}) => {
  const [activeBizId, setActiveBizId] = useState<string>(selectedBizId || businesses[0]?.id || '');
  const [activeSubTab, setActiveSubTab] = useState<'DASHBOARD' | 'ORDERS' | 'PRODUCTS' | 'ANALYTICS'>('DASHBOARD');
  const [isAddBizModalOpen, setIsAddBizModalOpen] = useState(false);
  const [newBizName, setNewBizName] = useState('');
  const [newBizTagline, setNewBizTagline] = useState('');

  const currentBiz = businesses.find((b) => b.id === activeBizId) || businesses[0];

  const handleCreateBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName.trim()) return;

    sounds.playExecute();
    const newEntity: Partial<BusinessEntity> = {
      id: `biz-${Date.now().toString().slice(-4)}`,
      name: newBizName,
      slug: newBizName.toLowerCase().replace(/\s+/g, '-'),
      tagline: newBizTagline || 'Custom Enterprise Venture',
      currency: 'BDT',
      todaySales: 0,
      yesterdaySales: 0,
      monthlyRevenue: 0,
      activeOrders: 0,
      pendingDeliveries: 0,
      totalCustomers: 1,
      inventoryCount: 0,
      growthRate: 5.0,
      recentOrders: [],
    };

    onAddNewBusiness(newEntity);
    setIsAddBizModalOpen(false);
    setNewBizName('');
    setNewBizTagline('');
    alert(`New business "${newBizName}" added to NEXUS Business Operating System.`);
  };

  return (
    <div className="space-y-6">
      {/* Business Switcher Strip */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <span className="text-zinc-500 text-[10px] uppercase mr-1">ACTIVE BUSINESS:</span>
          {businesses.map((biz) => {
            const isSelected = biz.id === currentBiz.id;
            return (
              <button
                key={biz.id}
                onClick={() => { sounds.playClick(); setActiveBizId(biz.id); }}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-cyan-500 text-zinc-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{biz.name}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-zinc-950 text-cyan-300' : 'bg-zinc-800 text-zinc-400'}`}>
                  +{biz.growthRate}%
                </span>
              </button>
            );
          })}

          <button
            onClick={() => { sounds.playClick(); setIsAddBizModalOpen(true); }}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-cyan-400 text-xs font-mono flex items-center gap-1.5"
            title="Register New Business"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Venture</span>
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
          {(['DASHBOARD', 'ORDERS', 'PRODUCTS', 'ANALYTICS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { sounds.playClick(); setActiveSubTab(tab); }}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeSubTab === tab ? 'bg-zinc-800 text-cyan-300 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Business Header Banner */}
      <div className="p-6 rounded-2xl bg-[#0b0e14] border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-zinc-100 font-mono">{currentBiz.name}</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              OPERATIONAL
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">{currentBiz.tagline}</p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800 text-right">
            <div className="text-[10px] text-zinc-500">TODAY'S GROSS</div>
            <div className="text-sm font-bold text-emerald-400">
              {currentBiz.todaySales.toLocaleString()} {currentBiz.currency}
            </div>
          </div>
          <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800 text-right">
            <div className="text-[10px] text-zinc-500">MONTHLY TRAJECTORY</div>
            <div className="text-sm font-bold text-cyan-400">
              {(currentBiz.monthlyRevenue / 1000000).toFixed(2)}M {currentBiz.currency}
            </div>
          </div>
        </div>
      </div>

      {/* Content depending on sub-tab */}
      {activeSubTab === 'DASHBOARD' && (
        <div className="space-y-6">
          {/* Key KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#0b0e14] border border-zinc-800 space-y-1">
              <div className="text-[10px] font-mono text-zinc-500 uppercase flex items-center justify-between">
                <span>Active Orders</span>
                <Package className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-xl font-bold font-mono text-zinc-100">{currentBiz.activeOrders}</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span>{currentBiz.pendingDeliveries} Pending Dispatch</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0b0e14] border border-zinc-800 space-y-1">
              <div className="text-[10px] font-mono text-zinc-500 uppercase flex items-center justify-between">
                <span>Customer Base</span>
                <Users className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="text-xl font-bold font-mono text-zinc-100">{currentBiz.totalCustomers.toLocaleString()}</div>
              <div className="text-[10px] text-zinc-400">+128 this week</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0b0e14] border border-zinc-800 space-y-1">
              <div className="text-[10px] font-mono text-zinc-500 uppercase flex items-center justify-between">
                <span>Inventory Units</span>
                <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="text-xl font-bold font-mono text-zinc-100">{currentBiz.inventoryCount.toLocaleString()}</div>
              <div className="text-[10px] text-zinc-400">Warehoused in Dhaka HQ</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0b0e14] border border-zinc-800 space-y-1">
              <div className="text-[10px] font-mono text-zinc-500 uppercase flex items-center justify-between">
                <span>YoY Velocity</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl font-bold font-mono text-emerald-400">+{currentBiz.growthRate}%</div>
              <div className="text-[10px] text-zinc-400">Above quarterly forecast</div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-2xl bg-[#0b0e14] border border-zinc-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">
                Recent Fulfillment Queue ({currentBiz.name})
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">LIVE FEED</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase">
                    <th className="pb-2">Order ID</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Line Items</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {currentBiz.recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-zinc-900/40">
                      <td className="py-2.5 text-cyan-400 font-bold">{ord.id}</td>
                      <td className="py-2.5 text-zinc-200 font-semibold">{ord.customer}</td>
                      <td className="py-2.5 text-zinc-400 truncate max-w-[240px]">{ord.items}</td>
                      <td className="py-2.5 text-zinc-100 font-bold">{ord.amount} {currentBiz.currency}</td>
                      <td className="py-2.5">
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                            ord.status === 'PAID'
                              ? 'bg-emerald-950 text-emerald-300'
                              : ord.status === 'PROCESSING'
                              ? 'bg-blue-950 text-blue-300'
                              : ord.status === 'SHIPPED'
                              ? 'bg-purple-950 text-purple-300'
                              : 'bg-zinc-800 text-zinc-300'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-zinc-500">{ord.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'ORDERS' && (
        <div className="p-6 rounded-2xl bg-[#0b0e14] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">
              All Orders Management & Courier Sync
            </h3>
            <button
              onClick={() => alert('Courier API synchronized with Steadfast & Pathao.')}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-cyan-300 flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Sync Couriers</span>
            </button>
          </div>
          <div className="text-xs text-zinc-400 leading-relaxed font-sans">
            Showing all synced order records for {currentBiz.name}. Order webhooks stream directly into the private database node.
          </div>
        </div>
      )}

      {activeSubTab === 'PRODUCTS' && (
        <div className="p-6 rounded-2xl bg-[#0b0e14] border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">
              Product Catalog & Stock Levels
            </h3>
            <button
              onClick={() => alert('New product ingestion form opened.')}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs font-mono flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add SKU</span>
            </button>
          </div>
          <div className="text-xs text-zinc-400">
            Catalog inventory tracked against low-stock threshold triggers.
          </div>
        </div>
      )}

      {activeSubTab === 'ANALYTICS' && (
        <div className="p-6 rounded-2xl bg-[#0b0e14] border border-zinc-800 space-y-4">
          <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">
            E-Commerce Growth & Customer Lifetime Value
          </h3>
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-mono space-y-2">
            <div>• Repeat purchase rate: 38.4%</div>
            <div>• Average Order Value (AOV): 3,840 BDT</div>
            <div>• ROAS on Meta Ads campaigns: 4.8x</div>
          </div>
        </div>
      )}

      {/* Modal: Add New Business */}
      {isAddBizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0b0e14] border border-cyan-500/40 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-100 font-mono">
              Register New Business in NEXUS
            </h3>
            <form onSubmit={handleCreateBusiness} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-zinc-400">Business / Venture Name:</label>
                <input
                  type="text"
                  required
                  value={newBizName}
                  onChange={(e) => setNewBizName(e.target.value)}
                  placeholder="e.g. CyberKraft Studios"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Tagline / Industry Focus:</label>
                <input
                  type="text"
                  value={newBizTagline}
                  onChange={(e) => setNewBizTagline(e.target.value)}
                  placeholder="e.g. High-tech 3D Game Design & VFX"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddBizModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold"
                >
                  Create Business
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
