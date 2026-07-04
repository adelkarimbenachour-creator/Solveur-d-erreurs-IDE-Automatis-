import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Server, Layers, Sparkles, Network, ArrowRight, Activity, Zap, CheckCircle } from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';

// Available architectural topologies for the interactive flowchart
interface ArchitectureNode {
  id: string;
  label: string;
  type: 'client' | 'routing' | 'compute' | 'cache' | 'storage' | 'ai';
  description: string;
}

interface Topology {
  id: string;
  name: string;
  description: string;
  nodes: string[]; // Active node IDs
  flow: string[];  // Flow path (node IDs sequentially)
}

const ARCHITECTURE_NODES: ArchitectureNode[] = [
  { id: 'client', label: 'Client (Next.js/SPA)', type: 'client', description: 'Interface réactive optimisée pour le SEO avec rendu hybride SSR.' },
  { id: 'cdn', label: 'Edge CDN (Vercel)', type: 'routing', description: 'Mise en cache globale et routage géographique des ressources statiques.' },
  { id: 'alb', label: 'Load Balancer (AWS ALB)', type: 'routing', description: 'Distribution intelligente du trafic vers les conteneurs actifs.' },
  { id: 'api', label: 'API Gateway (Go / Node)', type: 'compute', description: 'Validation des jetons JWT, limitation du débit et routage unifié.' },
  { id: 'micro', label: 'Microservices (Go)', type: 'compute', description: 'Services métier découplés avec concurrence gérée par Goroutines.' },
  { id: 'redis', label: 'Redis Cache Layer', type: 'cache', description: 'Cache mémoire ultra-rapide (latence < 1ms) pour sessions et débits.' },
  { id: 'postgres', label: 'PostgreSQL DB', type: 'storage', description: 'Base de données relationnelle principale avec indexation sémantique.' },
  { id: 'vector', label: 'Pinecone Vector DB', type: 'ai', description: 'Base sémantique stockant les plongements (embeddings) vectoriels.' },
  { id: 'gemini', label: 'Modèles IA (Gemini 3.5)', type: 'ai', description: 'Traitement de langage, agents autonomes et orchestration RAG.' }
];

const TOPOLOGIES: Topology[] = [
  {
    id: 'saas',
    name: 'SaaS Multi-utilisateurs Classique',
    description: 'Une architecture sécurisée et scalable, idéale pour les plateformes SaaS collaboratives avec base de données relationnelle et cache.',
    nodes: ['client', 'cdn', 'alb', 'api', 'redis', 'postgres'],
    flow: ['client', 'cdn', 'alb', 'api', 'redis', 'postgres']
  },
  {
    id: 'ai-rag',
    name: 'Système d\'IA & RAG Temps Réel',
    description: 'Conçu pour les moteurs de recherche sémantique et assistants intelligents d\'entreprise, avec vectorisation de documents et contextualisation.',
    nodes: ['client', 'cdn', 'api', 'redis', 'vector', 'gemini'],
    flow: ['client', 'cdn', 'api', 'vector', 'gemini']
  },
  {
    id: 'high-perf',
    name: 'Microservices Haute Performance',
    description: 'Une architecture microservices distribuée en Go, conçue pour les hauts débits d\'événements et une résilience maximale.',
    nodes: ['client', 'cdn', 'alb', 'api', 'micro', 'redis', 'postgres'],
    flow: ['client', 'cdn', 'alb', 'api', 'micro', 'redis', 'postgres']
  }
];

export default function SkillGrid() {
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [activeTopology, setActiveTopology] = useState<string>('saas');
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(ARCHITECTURE_NODES[0]);

  const currentTopology = TOPOLOGIES.find(t => t.id === activeTopology) || TOPOLOGIES[0];

  return (
    <section id="skills" className="py-20 bg-slate-950 border-t border-slate-900 px-4 relative">
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Title */}
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[10px] uppercase tracking-wider font-semibold">
            <Activity size={10} />
            Stack Technique & Excellence
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Compétences Techniques & Architectures
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl font-sans">
            Mes compétences de niveau senior ne se résument pas à l'écriture de code, mais s'étendent à la construction de systèmes informatiques distribués, sécurisés et performants.
          </p>
        </div>

        {/* Outer Grid: Skill Inventory Left, Interactive Visualizer Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Skill categories navigation & Skill Cards (Col-span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/60 border border-slate-800/80 rounded-2xl select-none">
              {SKILL_CATEGORIES.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(idx)}
                  className={`flex-1 text-[11px] font-mono font-medium px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeCategory === idx
                      ? 'bg-gradient-to-r from-cyan-500/15 to-purple-500/15 border border-cyan-500/30 text-cyan-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            {/* Selected Skill Category Cards */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  {SKILL_CATEGORIES[activeCategory].skills.map((skill, sIdx) => (
                    <div 
                      key={sIdx}
                      className="bg-slate-900/40 border border-slate-900 hover:border-slate-800/80 p-4 rounded-xl transition-all duration-300 group hover:bg-slate-900/60"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 flex items-center justify-center border border-cyan-500/20">
                            <span className="text-cyan-400 text-xs font-mono font-bold">#</span>
                          </div>
                          <div>
                            <h4 className="text-white text-xs font-semibold group-hover:text-cyan-400 transition-colors font-mono">{skill.name}</h4>
                            <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{skill.desc}</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-cyan-400 font-semibold">{skill.level}%</span>
                      </div>
                      
                      {/* Progress Bar with glow indicator */}
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="bg-gradient-to-r from-cyan-500 to-purple-600 h-full rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Dynamic Flowchart Architecture Visualizer (Col-span 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-2xl relative overflow-hidden glow-box-purple">
              {/* Header banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <Network className="text-cyan-400 animate-pulse" size={16} />
                  <div>
                    <h3 className="text-white text-xs font-bold font-mono">Simulateur d'Architecture</h3>
                    <p className="text-[10px] text-slate-500">Visualisez les flux de données de mes topologies phares.</p>
                  </div>
                </div>

                {/* Topology Selectors */}
                <div className="flex gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80 select-none">
                  {TOPOLOGIES.map((topo) => (
                    <button
                      key={topo.id}
                      onClick={() => {
                        setActiveTopology(topo.id);
                        // Reset node selection to first active node in topology
                        const firstNode = ARCHITECTURE_NODES.find(n => topo.nodes.includes(n.id));
                        if (firstNode) setSelectedNode(firstNode);
                      }}
                      className={`text-[9px] font-mono font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                        activeTopology === topo.id
                          ? 'bg-slate-950 border border-slate-800 text-cyan-400 font-extrabold shadow-sm'
                          : 'text-slate-500 hover:text-white hover:bg-slate-800/30'
                      }`}
                    >
                      {topo.id === 'saas' ? 'SaaS' : topo.id === 'ai-rag' ? 'RAG IA' : 'Microservices'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topology Description */}
              <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-3 text-[11px] text-slate-400 leading-relaxed mb-6 font-sans">
                <span className="font-mono text-[10px] font-bold text-cyan-400 block mb-1 uppercase tracking-wider">Topologie Active : {currentTopology.name}</span>
                {currentTopology.description}
              </div>

              {/* Node Layout Topology (Flex Container representing structure) */}
              <div className="bg-slate-950 border border-slate-900/80 rounded-xl p-4 min-h-48 flex flex-col justify-center items-center relative gap-6">
                
                {/* Node Grid Row 1 (Client & Cloud Routing) */}
                <div className="flex flex-wrap justify-center gap-4 w-full relative z-10">
                  {ARCHITECTURE_NODES.filter(n => ['client', 'cdn', 'alb'].includes(n.id)).map((node) => {
                    const isActive = currentTopology.nodes.includes(node.id);
                    const isSelected = selectedNode?.id === node.id;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => isActive && setSelectedNode(node)}
                        className={`text-[10px] font-mono font-medium px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                          !isActive 
                            ? 'opacity-20 border-slate-900 text-slate-600 bg-slate-950/40 cursor-not-allowed'
                            : isSelected
                              ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 font-semibold shadow-md shadow-cyan-500/10 scale-105'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`} />
                        {node.label.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>

                {/* Simulated connecting arrow 1 */}
                <div className="flex items-center justify-center text-slate-800 pointer-events-none select-none h-2">
                  <ArrowRight size={14} className="rotate-90 animate-pulse text-cyan-500/40" />
                </div>

                {/* Node Grid Row 2 (APIs & Compute Nodes) */}
                <div className="flex flex-wrap justify-center gap-4 w-full relative z-10">
                  {ARCHITECTURE_NODES.filter(n => ['api', 'micro', 'redis'].includes(n.id)).map((node) => {
                    const isActive = currentTopology.nodes.includes(node.id);
                    const isSelected = selectedNode?.id === node.id;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => isActive && setSelectedNode(node)}
                        className={`text-[10px] font-mono font-medium px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                          !isActive 
                            ? 'opacity-20 border-slate-900 text-slate-600 bg-slate-950/40 cursor-not-allowed'
                            : isSelected
                              ? 'bg-purple-500/10 border-purple-400 text-purple-400 font-semibold shadow-md shadow-purple-500/10 scale-105'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-purple-400 animate-ping' : 'bg-slate-600'}`} />
                        {node.label.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>

                {/* Simulated connecting arrow 2 */}
                <div className="flex items-center justify-center text-slate-800 pointer-events-none select-none h-2">
                  <ArrowRight size={14} className="rotate-90 animate-pulse text-purple-500/40" />
                </div>

                {/* Node Grid Row 3 (Storage, Vector & AI) */}
                <div className="flex flex-wrap justify-center gap-4 w-full relative z-10">
                  {ARCHITECTURE_NODES.filter(n => ['postgres', 'vector', 'gemini'].includes(n.id)).map((node) => {
                    const isActive = currentTopology.nodes.includes(node.id);
                    const isSelected = selectedNode?.id === node.id;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => isActive && setSelectedNode(node)}
                        className={`text-[10px] font-mono font-medium px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                          !isActive 
                            ? 'opacity-20 border-slate-900 text-slate-600 bg-slate-950/40 cursor-not-allowed'
                            : isSelected
                              ? 'bg-emerald-500/10 border-emerald-400 text-emerald-400 font-semibold shadow-md shadow-emerald-500/10 scale-105'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
                        {node.label.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Node Detail Cards Panel (Dynamic inspection) */}
              <AnimatePresence mode="wait">
                {selectedNode && (
                  <motion.div
                    key={selectedNode.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-4 mt-4"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                        <CheckCircle size={12} className="text-cyan-400" />
                        {selectedNode.label}
                      </span>
                      <span className="font-mono text-[9px] text-slate-500 uppercase px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800">
                        Type: {selectedNode.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      {selectedNode.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
