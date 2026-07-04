import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Terminal, Cpu, Sparkles, ChevronRight, ArrowRight, Play, CheckCircle2, Globe, FileCode2 } from 'lucide-react';
import { STATS } from '../data/portfolioData';

// Custom images
const WORKSPACE_IMAGE = "/src/assets/images/developer_workspace_1783108200574.jpg";

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'success' | 'info' | 'error';
}

export default function Hero({ onScrollTo }: { onScrollTo: (id: string) => void }) {
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([
    { text: "System MercerOS // v1.2.5 initialized", type: "success" },
    { text: "Tapez 'help' ou cliquez sur un bouton d'action ci-dessous.", type: "info" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    const newHistory = [...terminalHistory, { text: `mercer@portfolio ~ % ${cmd}`, type: 'input' as const }];

    if (trimmed === 'help') {
      newHistory.push(
        { text: "Commandes disponibles :", type: 'output' },
        { text: "  about    - En savoir plus sur mon profil et ma vision", type: 'output' },
        { text: "  skills   - Lister mes compétences techniques clés", type: 'output' },
        { text: "  projects - Afficher mes projets technologiques phares", type: 'output' },
        { text: "  stats    - Afficher mes statistiques opérationnelles", type: 'output' },
        { text: "  clear    - Effacer l'écran du terminal", type: 'output' }
      );
    } else if (trimmed === 'about') {
      newHistory.push(
        { text: "👤 Profil d'Alex Mercer :", type: 'success' },
        { text: "Ingénieur d'élite Full-Stack & Architecte Solutions Cloud avec 8+ ans d'expérience.", type: 'output' },
        { text: "Spécialisé dans les architectures à haute performance, la mise à l'échelle cloud (AWS/K8s)", type: 'output' },
        { text: "et le développement d'agents sémantiques IA connectés.", type: 'output' },
        { text: "📍 Basé à Paris, disponible pour des projets à fort enjeu dans le monde entier.", type: 'output' }
      );
    } else if (trimmed === 'skills') {
      newHistory.push(
        { text: "⚙️ Compétences principales :", type: 'success' },
        { text: "  React/Next.js   [████████████████████] 95%", type: 'output' },
        { text: "  TypeScript      [████████████████████] 98%", type: 'output' },
        { text: "  NodeJS/NestJS   [██████████████████] 92%", type: 'output' },
        { text: "  Go (Golang)     [███████████████] 85%", type: 'output' },
        { text: "  Docker & AWS    [██████████████████] 90%", type: 'output' },
        { text: "  Intégration IA  [██████████████████] 90%", type: 'output' }
      );
    } else if (trimmed === 'projects') {
      newHistory.push(
        { text: "🚀 Projets en vedette :", type: 'success' },
        { text: "  1. Aetheria SaaS - Observabilité IA en temps réel (Go/React/AWS)", type: 'output' },
        { text: "  2. NeuroFlow RAG - Moteur de recherche sémantique (Next.js/Pinecone)", type: 'output' },
        { text: "  3. OmniOps       - Déploiement GitOps Cloud K8s (Terraform/Go)", type: 'output' },
        { text: "Tapez le bouton 'Projets' en haut pour voir le Bento Grid complet.", type: 'info' }
      );
    } else if (trimmed === 'stats') {
      newHistory.push(
        { text: "📊 Données opérationnelles d'Alex :", type: 'success' },
        { text: "  - Uptime global : 99.99%", type: 'output' },
        { text: "  - Lignes de code en prod : ~2.4M", type: 'output' },
        { text: "  - Tasses de café consommées : ~3,480", type: 'output' },
        { text: "  - Projets d'IA déployés : 12+", type: 'output' }
      );
    } else if (trimmed === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else {
      newHistory.push({ text: `Commande non reconnue: '${cmd}'. Tapez 'help' pour les commandes disponibles.`, type: 'error' });
    }

    setTerminalHistory(newHistory);
    setTerminalInput('');
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(terminalInput);
  };

  // Typing simulation
  const simulateType = (cmd: string) => {
    if (isTyping) return;
    setIsTyping(true);
    setTerminalInput('');
    let index = 0;
    const interval = setInterval(() => {
      setTerminalInput((prev) => prev + cmd[index]);
      index++;
      if (index >= cmd.length) {
        clearInterval(interval);
        setTimeout(() => {
          executeCommand(cmd);
          setIsTyping(false);
        }, 200);
      }
    }, 40);
  };

  return (
    <section id="hero" className="relative min-h-screen pt-24 pb-16 flex items-center justify-center overflow-hidden bg-slate-950 px-4">
      {/* Background radial gradient highlights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column - Branding & Highlights */}
        <div className="lg:col-span-6 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider"
          >
            <Sparkles size={12} className="animate-pulse" />
            Architecte Solutions & Full-Stack Elite
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-tight">
              Je construis des systèmes web <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-400 to-purple-500">robustes, haut de gamme</span> et intelligents.
            </h1>
            <p className="text-sm sm:text-base text-slate-400 font-sans max-w-xl leading-relaxed">
              Spécialisé dans le développement full-stack d'élite, l'orchestration cloud et l'automatisation d'agents d'intelligence artificielle. Je traduis les visions d'ingénierie complexes en produits performants et épurés.
            </p>
          </motion.div>

          {/* Key Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <button
              onClick={() => onScrollTo('projects')}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-mono text-xs font-bold px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 group cursor-pointer shadow-lg shadow-cyan-500/10"
            >
              Découvrir mes projets
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onScrollTo('ai-clone')}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-mono text-xs font-bold px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 border border-slate-800 cursor-pointer"
            >
              <Cpu size={13} className="text-purple-400 animate-pulse" />
              Discuter avec mon clone IA
            </button>
          </motion.div>

          {/* Quick Metrics display */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-900/80"
          >
            {STATS.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <span className="block text-2xl font-display font-extrabold text-white bg-clip-text bg-gradient-to-r from-white to-slate-300">
                  {stat.value}
                </span>
                <span className="block text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                  {stat.label}
                </span>
                <span className="block text-[10px] text-slate-500 leading-tight">
                  {stat.desc}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right Column - Interactive Live Shell & Floating Art */}
        <div className="lg:col-span-6 relative flex flex-col justify-center">
          {/* Decorative glowing card border behind the terminal */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 rounded-2xl filter blur-xl pointer-events-none" />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="w-full bg-slate-950/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col glow-box-cyan"
          >
            {/* Terminal Window Header */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800/60 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                <Terminal size={12} className="text-cyan-400 animate-pulse" />
                alex@mercerOS: ~ (Liaison Interactive)
              </span>
              <div className="w-12" />
            </div>

            {/* Terminal Body */}
            <div className="p-4 font-mono text-[11px] h-72 overflow-y-auto space-y-2 leading-relaxed bg-slate-950">
              {terminalHistory.map((line, idx) => {
                let color = "text-slate-300";
                if (line.type === 'input') color = "text-cyan-400 font-semibold";
                if (line.type === 'success') color = "text-emerald-400 font-semibold";
                if (line.type === 'info') color = "text-purple-400 italic";
                if (line.type === 'error') color = "text-rose-400";
                return (
                  <div key={idx} className={`${color} break-words whitespace-pre-wrap`}>
                    {line.text}
                  </div>
                );
              })}
              {isTyping && (
                <div className="text-cyan-400">
                  mercer@portfolio ~ % {terminalInput}
                  <span className="h-3 w-1.5 bg-cyan-400 inline-block animate-pulse ml-0.5" />
                </div>
              )}
              <div ref={terminalEndRef} />
            </div>

            {/* Interactive Pre-click Shell Commands */}
            <div className="bg-slate-900/60 px-4 py-3 border-t border-slate-900/80 flex flex-wrap gap-2 shrink-0 select-none items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Clics Rapides :</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => simulateType('about')}
                  disabled={isTyping}
                  className="bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 text-[10px] font-mono px-2.5 py-1 rounded transition-colors cursor-pointer"
                >
                  about
                </button>
                <button
                  type="button"
                  onClick={() => simulateType('skills')}
                  disabled={isTyping}
                  className="bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 text-[10px] font-mono px-2.5 py-1 rounded transition-colors cursor-pointer"
                >
                  skills
                </button>
                <button
                  type="button"
                  onClick={() => simulateType('projects')}
                  disabled={isTyping}
                  className="bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 text-[10px] font-mono px-2.5 py-1 rounded transition-colors cursor-pointer"
                >
                  projects
                </button>
                <button
                  type="button"
                  onClick={() => simulateType('stats')}
                  disabled={isTyping}
                  className="bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 text-[10px] font-mono px-2.5 py-1 rounded transition-colors cursor-pointer"
                >
                  stats
                </button>
                <button
                  type="button"
                  onClick={() => simulateType('clear')}
                  disabled={isTyping}
                  className="bg-slate-950/40 text-slate-500 hover:text-rose-400 border border-transparent text-[10px] font-mono px-2.5 py-1 rounded transition-colors cursor-pointer"
                >
                  [clear]
                </button>
              </div>
            </div>

            {/* Custom Interactive Input form */}
            <form onSubmit={handleTerminalSubmit} className="flex border-t border-slate-900 bg-slate-950">
              <span className="pl-4 py-3 select-none text-cyan-500 font-mono text-[11px] flex items-center shrink-0">
                mercer@portfolio ~ %
              </span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                disabled={isTyping}
                className="flex-1 bg-transparent px-2 py-3 border-none outline-none font-mono text-[11px] text-white placeholder-slate-600 focus:ring-0"
                placeholder="Tapez 'about', 'skills', 'projects', 'stats' ou 'clear'..."
              />
            </form>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
