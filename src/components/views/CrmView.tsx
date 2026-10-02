import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  Filter,
  Phone,
  Mail,
  Globe,
} from 'lucide-react';
import { ClientRecord } from '../../types/nexus';
import { sounds } from '../../utils/audio';

interface CrmViewProps {
  clients: ClientRecord[];
  onUpdateClientStage: (clientId: string, newStage: ClientRecord['stage']) => void;
  onAddClient: (client: ClientRecord) => void;
}

export const CrmView: React.FC<CrmViewProps> = ({
  clients,
  onUpdateClientStage,
  onAddClient,
}) => {
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState<Partial<ClientRecord>>({
    name: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    budget: '$10,000',
    stage: 'LEAD',
    assignedTeam: 'Engineering Core',
    deadline: '2026-12-01',
    paymentStatus: 'PENDING',
    services: ['Web Architecture'],
    notes: 'Initial client contact established.',
  });

  const stages: ClientRecord['stage'][] = [
    'LEAD',
    'ONBOARDING',
    'ACTIVE',
    'REVIEW',
    'APPROVED',
    'DELIVERED',
    'COMPLETED',
  ];

  const filteredClients = selectedStage === 'ALL'
    ? clients
    : clients.filter((c) => c.stage === selectedStage);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.company) return;

    sounds.playExecute();
    const created: ClientRecord = {
      id: `cli-${Date.now().toString().slice(-4)}`,
      name: newClient.name!,
      company: newClient.company!,
      email: newClient.email || 'client@nexus.corp',
      phone: newClient.phone || '+880 1700-000000',
      website: newClient.website || 'https://client.com',
      budget: newClient.budget || '$5,000',
      services: newClient.services || ['Digital System'],
      stage: (newClient.stage as any) || 'LEAD',
      assignedTeam: newClient.assignedTeam || 'Core Devs',
      deadline: newClient.deadline || '2026-11-30',
      paymentStatus: (newClient.paymentStatus as any) || 'PENDING',
      notes: newClient.notes || 'Created via NEXUS CRM',
    };

    onAddClient(created);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0b0e14] border border-cyan-500/30 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-zinc-100 font-mono">
                Enterprise Client CRM
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                PIPELINE VELOCITY
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Client lifecycle tracking from Lead acquisition to Delivery & Approval
            </p>
          </div>
        </div>

        <button
          onClick={() => { sounds.playClick(); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold font-mono transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard Client</span>
        </button>
      </div>

      {/* Stage filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono border-b border-zinc-800 pb-3">
        <button
          onClick={() => setSelectedStage('ALL')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            selectedStage === 'ALL'
              ? 'bg-cyan-500 text-zinc-950 font-bold'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          ALL ({clients.length})
        </button>
        {stages.map((stg) => (
          <button
            key={stg}
            onClick={() => setSelectedStage(stg)}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedStage === stg
                ? 'bg-cyan-500 text-zinc-950 font-bold'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {stg} ({clients.filter((c) => c.stage === stg).length})
          </button>
        ))}
      </div>

      {/* Pipeline Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="p-5 rounded-2xl bg-[#0b0e14] border border-zinc-800 hover:border-cyan-500/40 transition-all space-y-4 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400">{client.company}</span>
                <h3 className="text-base font-bold text-zinc-100 font-mono mt-0.5">{client.name}</h3>
              </div>
              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  client.stage === 'ACTIVE'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : client.stage === 'REVIEW'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : client.stage === 'ONBOARDING'
                    ? 'bg-blue-950 text-blue-400 border border-blue-800'
                    : 'bg-zinc-800 text-zinc-300'
                }`}
              >
                {client.stage}
              </span>
            </div>

            <div className="text-xs text-zinc-300 bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80 leading-relaxed font-sans">
              {client.notes}
            </div>

            <div className="space-y-1.5 text-xs font-mono text-zinc-400">
              <div className="flex items-center justify-between">
                <span>Budget: <strong className="text-zinc-100">{client.budget}</strong></span>
                <span className={`text-[10px] font-bold ${client.paymentStatus === 'PAID' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {client.paymentStatus}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span>Assigned: {client.assignedTeam}</span>
                <span className="text-zinc-500">Due: {client.deadline}</span>
              </div>
            </div>

            {/* Stage selector dropdown */}
            <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500 text-[10px] uppercase">Advance Stage:</span>
              <select
                value={client.stage}
                onChange={(e) => onUpdateClientStage(client.id, e.target.value as any)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-cyan-300 text-xs focus:outline-none"
              >
                {stages.map((stg) => (
                  <option key={stg} value={stg}>{stg}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Client */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0b0e14] border border-cyan-500/40 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-100 font-mono">
              Onboard New Client to NEXUS CRM
            </h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400">Contact Person:</label>
                  <input
                    type="text"
                    required
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400">Company Name:</label>
                  <input
                    type="text"
                    required
                    value={newClient.company}
                    onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400">Email Address:</label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400">Phone Number:</label>
                  <input
                    type="text"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400">Contract Budget:</label>
                  <input
                    type="text"
                    value={newClient.budget}
                    onChange={(e) => setNewClient({ ...newClient, budget: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400">Initial Stage:</label>
                  <select
                    value={newClient.stage}
                    onChange={(e) => setNewClient({ ...newClient, stage: e.target.value as any })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-100"
                  >
                    {stages.map((stg) => (
                      <option key={stg} value={stg}>{stg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
