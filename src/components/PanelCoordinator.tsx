import React, { useState } from 'react';
import { Terminal, Play, Clipboard, RotateCcw, ShieldCheck, AlertCircle, RefreshCw, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SystemLog, ErrorPacket } from '../types';

interface PanelCoordinatorProps {
  logs: SystemLog[];
  onClearLogs: () => void;
  onSubmitError: (packet: ErrorPacket) => void;
  activePacket: ErrorPacket | null;
  workflowStep: number; // 0: Idle, 1: Error Received, 2: Parsing, 3: Querying Gemini, 4: Parsing Response, 5: Code Extracted, 6: Synchronized
  isSolving: boolean;
  onSolve: () => void;
  onReset: () => void;
  extractedCode: string | null;
}

const ERROR_PRESETS = [
  {
    name: "🚫 React Hook Rule",
    language: "typescript",
    error: "React Hook \"useEffect\" is called conditionally. React Hooks must be called in the exact same order in every component render.",
    context: `export default function UserDashboard({ userId }) {
  if (!userId) {
    return <p>Veuillez vous connecter</p>;
  }

  // Erreur : Hook appelé de manière conditionnelle !
  useEffect(() => {
    fetchUserData(userId).then(data => setUser(data));
  }, [userId]);

  return <div>{/* UI content */}</div>;
}`
  },
  {
    name: "🚫 TypeScript Type Mismatch",
    language: "typescript",
    error: "Type '{ id: number; username: string; email: string; isActive: string; }' is not assignable to type 'User'. Types of property 'isActive' are incompatible. Type 'string' is not assignable to type 'boolean'.",
    context: `interface User {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
}

const newUser: User = {
  id: 104,
  username: "alex_dev",
  email: "alex@example.com",
  isActive: "true" // Devrait être un booléen
};`
  },
  {
    name: "🚫 Null Pointer / Map Error",
    language: "javascript",
    error: "TypeError: Cannot read properties of undefined (reading 'map')\n    at ProjectList (src/components/ProjectList.jsx:12:35)\n    at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:15486:18)",
    context: `export function ProjectList({ projects }) {
  // projects peut être undefined si l'API échoue ou charge encore
  return (
    <div className="grid gap-4">
      {projects.map((project) => (
        <div key={project.id} className="p-4 border rounded">
          <h3>{project.title}</h3>
        </div>
      ))}
    </div>
  );
}`
  }
];

export default function PanelCoordinator({
  logs,
  onClearLogs,
  onSubmitError,
  activePacket,
  workflowStep,
  isSolving,
  onSolve,
  onReset,
  extractedCode
}: PanelCoordinatorProps) {
  const [customError, setCustomError] = useState('');
  const [customContext, setCustomContext] = useState('');
  const [customLang, setCustomLang] = useState('typescript');
  const [activePresetIndex, setActivePresetIndex] = useState<number | null>(null);

  const applyPreset = (index: number) => {
    setActivePresetIndex(index);
    const preset = ERROR_PRESETS[index];
    setCustomError(preset.error);
    setCustomContext(preset.context);
    setCustomLang(preset.language);
  };

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customError.trim()) return;
    
    onSubmitError({
      error: customError,
      context: customContext,
      language: customLang,
      source: "Simulateur IDE"
    });
  };

  // Workflow step descriptions
  const steps = [
    { num: 1, label: "Capture de l'Erreur", desc: "En attente du signal d'erreur de l'IDE..." },
    { num: 2, label: "Interprétation Locale", desc: "Analyse lexicale et parsing du contexte de code." },
    { num: 3, label: "Consultation Raisonneur", desc: "Transmission au modèle Gemini pour analyse sémantique." },
    { num: 4, label: "Analyse Cognitive", desc: "Réception du raisonnement et explication logique." },
    { num: 5, label: "Extraction du Correcteur", desc: "Extraction automatique du bloc de code corrigé." },
    { num: 6, label: "Mise à Jour IDE", desc: "Solution injectée dans le presse-papier et prête à être appliquée." }
  ];

  return (
    <div id="panel-coordinator" className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
      {/* Header */}
      <div className="bg-slate-950/60 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-xs text-slate-400 font-semibold uppercase tracking-wider">PANEL_COORDINATOR // v1.0.0</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-mono border border-emerald-500/20">
          <Terminal size={12} />
          <span>STATUT: ECOUTE</span>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-6">
        
        {/* Simulator block */}
        <section className="space-y-3 bg-slate-950/40 p-4 rounded-lg border border-slate-800/80">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Play size={13} className="text-blue-400" />
              Simuler un Signal d'Erreur IDE
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">VS Code Input Simulation</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {ERROR_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                id={`preset-${idx}`}
                type="button"
                onClick={() => applyPreset(idx)}
                className={`text-xs px-3 py-1.5 rounded-md transition-all font-mono border ${
                  activePresetIndex === idx
                    ? 'bg-blue-600/20 text-blue-400 border-blue-500/40 font-medium'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-300 hover:border-slate-700'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>

          <form onSubmit={handleSimulateSubmit} className="space-y-3 pt-2">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Message d'Erreur :</label>
              <textarea
                id="input-error"
                rows={3}
                value={customError}
                onChange={(e) => {
                  setCustomError(e.target.value);
                  setActivePresetIndex(null);
                }}
                className="w-full text-xs font-mono bg-slate-950 text-slate-300 border border-slate-800 rounded p-2 focus:outline-none focus:border-blue-500/60 placeholder-slate-600"
                placeholder="Copiez-collez l'erreur de votre console ou IDE..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Contexte du Code (Facultatif) :</label>
              <textarea
                id="input-context"
                rows={4}
                value={customContext}
                onChange={(e) => {
                  setCustomContext(e.target.value);
                  setActivePresetIndex(null);
                }}
                className="w-full text-xs font-mono bg-slate-950 text-slate-300 border border-slate-800 rounded p-2 focus:outline-none focus:border-blue-500/60 placeholder-slate-600"
                placeholder="Collez le code source du fichier contenant l'erreur..."
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-500">Langage:</span>
                <select
                  id="input-lang"
                  value={customLang}
                  onChange={(e) => setCustomLang(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500/60"
                >
                  <option value="typescript">TypeScript (.ts/.tsx)</option>
                  <option value="javascript">JavaScript (.js/.jsx)</option>
                  <option value="python">Python (.py)</option>
                  <option value="rust">Rust (.rs)</option>
                </select>
              </div>

              <button
                id="btn-simulate"
                type="submit"
                disabled={!customError.trim() || isSolving}
                className="bg-blue-600 text-white hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 transition-colors px-4 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5"
              >
                <Send size={12} />
                Capturer
              </button>
            </div>
          </form>
        </section>

        {/* Workflow steps */}
        <section className="space-y-3 bg-slate-950/20 p-4 rounded-lg border border-slate-800/80">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <RefreshCw size={13} className={`text-emerald-400 ${isSolving ? 'animate-spin' : ''}`} />
              Cycle d'Analyse Automatisé
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Workflow Status</span>
          </div>

          <div className="relative pl-6 space-y-4">
            {/* Thread line */}
            <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-slate-800" />

            {steps.map((s) => {
              const isActive = workflowStep === s.num;
              const isCompleted = workflowStep > s.num;
              const isPending = workflowStep < s.num;

              let dotStyle = "bg-slate-900 border-slate-800 text-slate-600";
              let textStyle = "text-slate-500";
              
              if (isActive) {
                dotStyle = "bg-blue-600 border-blue-400 text-white ring-4 ring-blue-500/20 animate-pulse scale-110 z-10";
                textStyle = "text-white font-medium";
              } else if (isCompleted) {
                dotStyle = "bg-emerald-600 border-emerald-400 text-white z-10";
                textStyle = "text-slate-300";
              }

              return (
                <div key={s.num} className="relative flex gap-3 items-start text-xs transition-colors duration-200">
                  {/* Step bullet */}
                  <div className={`absolute -left-[23px] top-0.5 h-[16px] w-[16px] rounded-full border flex items-center justify-center text-[10px] font-mono ${dotStyle}`}>
                    {isCompleted ? <CheckCircle2 size={10} className="stroke-[3]" /> : s.num}
                  </div>

                  <div>
                    <span className={`${textStyle}`}>{s.label}</span>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {activePacket && (
            <div className="pt-2 flex items-center gap-2">
              <button
                id="btn-solve"
                onClick={onSolve}
                disabled={isSolving || workflowStep >= 3}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-2 rounded font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck size={13} />
                {isSolving ? "Analyse en cours..." : "Lancer la Résolution"}
              </button>
              <button
                id="btn-reset"
                onClick={onReset}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs p-2 rounded transition-colors"
                title="Réinitialiser l'état"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          )}
        </section>

        {/* Logs */}
        <section className="space-y-3 flex-1 flex flex-col min-h-[220px]">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Terminal size={13} className="text-slate-400" />
              Logs du Système (Cerveau)
            </h3>
            <button
              id="btn-clear-logs"
              onClick={onClearLogs}
              className="text-[10px] text-slate-500 hover:text-slate-400 font-mono transition-colors"
            >
              [EFFACER]
            </button>
          </div>

          <div id="logs-container" className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 font-mono text-[11px] leading-relaxed flex-1 overflow-y-auto max-h-[300px] space-y-1.5 scrollbar-thin">
            {logs.length === 0 ? (
              <span className="text-slate-600 block italic">Aucun log enregistré.</span>
            ) : (
              logs.map((log) => {
                let badgeColor = "text-blue-400 bg-blue-400/10";
                if (log.level === 'success') badgeColor = "text-emerald-400 bg-emerald-400/10 border-emerald-500/20";
                if (log.level === 'error') badgeColor = "text-rose-400 bg-rose-400/10 border-rose-500/20";
                if (log.level === 'warn') badgeColor = "text-amber-400 bg-amber-400/10 border-amber-500/20";

                return (
                  <div key={log.id} className="flex gap-2 items-start border-b border-slate-900/50 pb-1 last:border-0">
                    <span className="text-slate-600 shrink-0 text-[10px]">{log.timestamp}</span>
                    <span className={`px-1.5 rounded text-[9px] font-semibold tracking-wide border shrink-0 ${badgeColor}`}>
                      {log.level.toUpperCase()}
                    </span>
                    <span className="text-slate-300 break-all">{log.message}</span>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
