import React, { useState } from 'react';
import {
  Users,
  Shield,
  Briefcase,
  MapPin,
  Clock,
  Plus,
  Filter,
  CheckCircle2,
  Mail,
  Activity,
  Layers,
} from 'lucide-react';
import { TeamMember, UserRole } from '../../types/nexus';
import { sounds } from '../../utils/audio';

interface TeamViewProps {
  team: TeamMember[];
  onAddMember: (member: TeamMember) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({ team, onAddMember }) => {
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name: '',
    email: '',
    role: 'Developer',
    department: 'Engineering',
    location: 'Dhaka HQ',
    status: 'ONLINE',
    activeTasks: 2,
    currentProject: 'NEXUS Module Integration',
  });

  const departments = ['Engineering', 'Security Ops', 'Media & TV', 'Marketing', 'Research', 'Operations'];

  const filteredTeam = selectedDept === 'ALL'
    ? team
    : team.filter((m) => m.department === selectedDept);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;

    sounds.playExecute();
    const created: TeamMember = {
      id: `tm-${Date.now().toString().slice(-4)}`,
      name: newMember.name!,
      email: newMember.email!,
      role: (newMember.role as UserRole) || 'Developer',
      department: (newMember.department as any) || 'Engineering',
      location: newMember.location || 'Remote',
      status: 'ONLINE',
      activeTasks: 1,
      currentProject: newMember.currentProject || 'NEXUS Operations',
      lastActive: 'Just now',
    };

    onAddMember(created);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0b0e14] border border-cyan-500/30 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-zinc-100 font-mono">
                Nationwide Team Command Center
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                DISTRIBUTED SQUAD
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Coordinating engineers, cyber specialists, journalists, and operators across Bangladesh
            </p>
          </div>
        </div>

        <button
          onClick={() => { sounds.playClick(); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold font-mono transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Department filters */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono border-b border-zinc-800 pb-3">
        <button
          onClick={() => setSelectedDept('ALL')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            selectedDept === 'ALL'
              ? 'bg-cyan-500 text-zinc-950 font-bold'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          ALL DEPARTMENTS ({team.length})
        </button>
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedDept === dept
                ? 'bg-cyan-500 text-zinc-950 font-bold'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {dept} ({team.filter((m) => m.department === dept).length})
          </button>
        ))}
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeam.map((member) => (
          <div
            key={member.id}
            className="p-5 rounded-2xl bg-[#0b0e14] border border-zinc-800 hover:border-cyan-500/40 transition-all space-y-4 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-zinc-100 font-mono">{member.name}</h3>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      member.status === 'ONLINE'
                        ? 'bg-emerald-400'
                        : member.status === 'BUSY'
                        ? 'bg-amber-400'
                        : 'bg-zinc-600'
                    }`}
                  />
                </div>
                <p className="text-xs text-cyan-400 font-mono mt-0.5">{member.role}</p>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                {member.department}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-1.5 text-xs font-mono">
              <div className="text-zinc-400 truncate">
                Project: <strong className="text-zinc-200">{member.currentProject}</strong>
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-500">
                <span>Active Tasks: {member.activeTasks}</span>
                <span>Active: {member.lastActive}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-1 border-t border-zinc-900">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span>{member.location}</span>
              </span>
              <span className="text-zinc-400">{member.email}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Member */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#0b0e14] border border-cyan-500/40 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-100 font-mono">
              Add New Team Member
            </h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-zinc-400">Full Name:</label>
                <input
                  type="text"
                  required
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Email Address:</label>
                <input
                  type="email"
                  required
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400">Role:</label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value as any })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-100"
                  >
                    {[
                      'Developer',
                      'Designer',
                      'Marketer',
                      'Editor',
                      'Journalist',
                      'Researcher',
                      'Cyber Team',
                      'Hunter Team',
                      'Worker',
                      'Sales',
                    ].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400">Department:</label>
                  <select
                    value={newMember.department}
                    onChange={(e) => setNewMember({ ...newMember, department: e.target.value as any })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-100"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Location Node:</label>
                <input
                  type="text"
                  value={newMember.location}
                  onChange={(e) => setNewMember({ ...newMember, location: e.target.value })}
                  placeholder="e.g. Dhaka HQ or Sylhet Node"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-100"
                />
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
                  Register Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
