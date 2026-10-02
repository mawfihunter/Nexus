import React, { useState } from 'react';
import {
  Video,
  Tv,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  Play,
  ArrowRight,
  Plus,
  Share2,
} from 'lucide-react';
import { MediaStory, TVProgram } from '../../types/nexus';
import { sounds } from '../../utils/audio';

interface MediaTvViewProps {
  stories: MediaStory[];
  programs: TVProgram[];
  onUpdateStoryStage: (storyId: string, stage: MediaStory['stage']) => void;
}

export const MediaTvView: React.FC<MediaTvViewProps> = ({
  stories,
  programs,
  onUpdateStoryStage,
}) => {
  const [activeTab, setActiveTab] = useState<'NEWSROOM' | 'TV_RUN_DOWN' | 'ASSETS'>('NEWSROOM');

  const storyStages: MediaStory['stage'][] = [
    'ASSIGNMENT',
    'RESEARCH',
    'DRAFT',
    'EDIT',
    'APPROVAL',
    'PUBLISH',
    'ARCHIVE',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0b0e14] border border-cyan-500/30 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/40 flex items-center justify-center text-pink-400">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-zinc-100 font-mono">
                Journalist Desk & TV Channel Operations
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800">
                LIVE BROADCAST HUB
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Newsroom assignment workflow, teleprompter scripts, and TV studio broadcast rundown
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('NEWSROOM')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'NEWSROOM'
                ? 'bg-cyan-500 text-zinc-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Newsroom Desk
          </button>
          <button
            onClick={() => setActiveTab('TV_RUN_DOWN')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'TV_RUN_DOWN'
                ? 'bg-cyan-500 text-zinc-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            TV Broadcast Rundown
          </button>
        </div>
      </div>

      {activeTab === 'NEWSROOM' && (
        <div className="space-y-4">
          <div className="text-xs font-mono text-zinc-400 flex items-center justify-between">
            <span className="uppercase tracking-wider font-bold">Publishing Pipeline Workflow</span>
            <span className="text-[10px] text-zinc-500">ASSIGNMENT → ARCHIVE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stories.map((story) => (
              <div
                key={story.id}
                className="p-5 rounded-2xl bg-[#0b0e14] border border-zinc-800 hover:border-pink-500/40 transition-all space-y-3 shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-pink-400 uppercase font-bold">
                      {story.channel}
                    </span>
                    <h3 className="text-sm font-bold text-zinc-100 font-mono">{story.title}</h3>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      story.priority === 'EXCLUSIVE'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {story.priority}
                  </span>
                </div>

                <div className="text-xs font-mono text-zinc-400 space-y-1 bg-zinc-950 p-3 rounded-xl border border-zinc-900">
                  <div>Beat Journalist: <strong className="text-zinc-200">{story.assignedTo}</strong></div>
                  <div>Editor in Charge: <strong className="text-zinc-200">{story.editor}</strong></div>
                  {story.scheduledAirTime && (
                    <div className="text-cyan-400">Scheduled: {story.scheduledAirTime}</div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-900 text-xs font-mono">
                  <span className="text-zinc-500 text-[10px] uppercase">Advance Stage:</span>
                  <select
                    value={story.stage}
                    onChange={(e) => onUpdateStoryStage(story.id, e.target.value as any)}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-pink-300 text-xs focus:outline-none"
                  >
                    {storyStages.map((stg) => (
                      <option key={stg} value={stg}>{stg}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'TV_RUN_DOWN' && (
        <div className="space-y-4">
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-bold">
            Studio Master Control & TV Rundown Schedule
          </div>

          <div className="space-y-3">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="p-5 rounded-2xl bg-[#0b0e14] border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-zinc-100 font-mono">{prog.title}</span>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        prog.status === 'UPCOMING'
                          ? 'bg-cyan-950 text-cyan-300'
                          : prog.status === 'ON_AIR'
                          ? 'bg-red-950 text-red-400 animate-pulse'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {prog.status}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    Air Time: <strong className="text-pink-400">{prog.showTime}</strong> • {prog.studio}
                  </div>
                  <div className="text-xs text-zinc-300 mt-1 font-mono">
                    Lead Segment: {prog.segmentTitle}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Broadcasting teleprompter cue loaded for ${prog.title}`)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono"
                  >
                    Load Teleprompter
                  </button>
                  <button
                    onClick={() => alert(`Studio Master Switcher synced.`)}
                    className="px-4 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs font-mono"
                  >
                    Sync Studio Feed
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
