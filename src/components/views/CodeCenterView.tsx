import React, { useState } from 'react';
import {
  Terminal,
  Code2,
  GitBranch,
  GitPullRequest,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  ExternalLink,
  FolderTree,
  FileCode,
} from 'lucide-react';
import { sounds } from '../../utils/audio';

export const CodeCenterView: React.FC = () => {
  const [activeFile, setActiveFile] = useState('server.ts');
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [isBuilding, setIsBuilding] = useState(false);

  const fileTree = [
    { name: 'server.ts', path: 'server.ts', lines: 180, lang: 'typescript' },
    { name: 'App.tsx', path: 'src/App.tsx', lines: 240, lang: 'typescript' },
    { name: 'nexus.ts', path: 'src/types/nexus.ts', lines: 195, lang: 'typescript' },
    { name: 'mockData.ts', path: 'src/data/mockData.ts', lines: 310, lang: 'typescript' },
    { name: 'docker-compose.yml', path: 'docker-compose.yml', lines: 45, lang: 'yaml' },
  ];

  const codeSnippets: Record<string, string> = {
    'server.ts': `// NEXUS MONSTER Central Control Plane Server
import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
});

app.post('/api/orchestrator/command', async (req, res) => {
  // Multilingual intent extraction (Bangla / English / Banglish)
  const result = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: req.body.query,
  });
  res.json(result);
});`,
    'src/App.tsx': `export default function NexusMonsterApp() {
  // Hybrid Command Center State Manager
  const [workspace, setWorkspace] = useState('OVERVIEW');
  return <CommandCenterLayout workspace={workspace} />;
}`,
    'src/types/nexus.ts': `export type AgentCapability =
  | 'FILES_READ' | 'FILES_WRITE'
  | 'PROCESS_READ' | 'PROCESS_CONTROL'
  | 'TERMINAL_EXECUTION' | 'VIRTUALBOX_CONTROL';`,
  };

  const currentCode = codeSnippets[activeFile] || '// Select a file to inspect source code.';

  const handleRunBuild = () => {
    sounds.playClick();
    setIsBuilding(true);
    setTimeout(() => {
      setIsBuilding(false);
      sounds.playExecute();
      alert('TypeScript compile & Vite production bundle test: SUCCESS (0 errors).');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0b0e14] border border-cyan-500/30 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-zinc-100 font-mono">
                NEXUS CODE & VS Code Workspace
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                BROWSER + LOCAL AGENT
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              VS Code editor bridge, GitHub repositories, and automated CI/CD deployment pipelines
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={handleRunBuild}
            disabled={isBuilding}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold transition-colors"
          >
            <Play className={`w-3.5 h-3.5 ${isBuilding ? 'animate-spin' : ''}`} />
            <span>{isBuilding ? 'Compiling Build...' : 'Test Build Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Git Grid */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0b0e14] overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-4 min-h-[550px]">
        {/* Sidebar: File Tree & Git */}
        <div className="p-4 border-r border-zinc-800/80 bg-zinc-950/60 space-y-4 text-xs font-mono">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="flex items-center gap-1.5 font-bold uppercase text-[10px]">
              <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
              BRANCH:
            </span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-zinc-200 text-xs"
            >
              <option value="main">main</option>
              <option value="dev-v2">dev-v2</option>
              <option value="feat/zero-trust">feat/zero-trust</option>
            </select>
          </div>

          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1 flex items-center gap-1">
              <FolderTree className="w-3 h-3" />
              Project Files
            </div>
            {fileTree.map((f) => (
              <div
                key={f.name}
                onClick={() => { sounds.playClick(); setActiveFile(f.name); }}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                  activeFile === f.name
                    ? 'bg-cyan-950/60 text-cyan-300 font-semibold border border-cyan-800/60'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <FileCode className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{f.name}</span>
                </div>
                <span className="text-[10px] text-zinc-600 shrink-0">{f.lines}L</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800 space-y-2">
            <div className="text-[10px] uppercase font-bold text-zinc-500">GitHub Pull Requests</div>
            <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-[11px] space-y-1">
              <div className="text-zinc-200 font-semibold flex items-center justify-between">
                <span>#42 Hardware Node Auth</span>
                <span className="text-emerald-400 text-[9px]">CI PASS</span>
              </div>
              <div className="text-zinc-500 text-[10px]">Author: Sabbir • 2 commits</div>
            </div>
          </div>
        </div>

        {/* Code Viewport */}
        <div className="lg:col-span-3 bg-black/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-950 text-xs font-mono text-zinc-400">
              <span className="text-cyan-300 font-bold">{activeFile}</span>
              <span className="text-[10px] text-zinc-500">UTF-8 • TypeScript • Read / Write Gated</span>
            </div>

            <pre className="p-4 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed selection:bg-cyan-500/30">
              <code>{currentCode}</code>
            </pre>
          </div>

          {/* Bottom Terminal Status */}
          <div className="p-3 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between text-xs font-mono text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>code-server Daemon: ACTIVE (Port 8080)</span>
            </div>
            <span className="text-cyan-400">Git commit: 7f89b4c (HEAD)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
