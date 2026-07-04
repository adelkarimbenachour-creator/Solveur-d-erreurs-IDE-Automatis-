import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, Server, Cpu, Database, ExternalLink, Github, ArrowRight, X, Layers, LineChart, Code2 } from 'lucide-react';
import { PROJECTS, Project } from '../data/portfolioData';

export default function ProjectShowcase() {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Fullstack' | 'AI' | 'DevOps' | 'Frontend'>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = activeFilter === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeFilter);

  return (
    <section id="projects" className="py-20 bg-slate-950 border-t border-slate-900 px-4 relative">
      <div className="absolute top-1/3 left-10 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[10px] uppercase tracking-wider font-semibold">
              <Code2 size={10} />
              Bento Grid & Travaux phares
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Projets Récents & Réalisations
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl font-sans">
              Une sélection rigoureuse de projets démontrant mon savoir-faire technique en matière de performance, d'intelligence artificielle et de conception de systèmes.
            </p>
          </div>

          {/* Filters Selectors */}
          <div className="flex flex-wrap gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800/85 self-start select-none">
            {['All', 'Fullstack', 'AI', 'DevOps', 'Frontend'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as any)}
                className={`text-[10px] font-mono font-semibold px-3 py-2 rounded-lg transition-all cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-slate-950 border border-slate-800 text-cyan-400 font-extrabold shadow-sm'
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                {filter === 'All' ? 'Tous' : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {filteredProjects.map((project, idx) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-slate-900/30 border border-slate-900 hover:border-slate-800/80 rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 relative hover:bg-slate-900/50 glow-box-cyan"
            >
              {/* Dynamic tag decoration on the top corner */}
              <div className="absolute top-4 right-4 bg-slate-950/60 border border-slate-850 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold text-purple-400 uppercase tracking-widest z-10 select-none">
                {project.category}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg sm:text-xl font-display font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed font-sans">
                    {project.shortDesc}
                  </p>
                </div>

                {/* Performance Metrics inside bento */}
                <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-900/60 font-mono">
                  {project.metrics.map((metric, mIdx) => (
                    <div key={mIdx} className="space-y-0.5">
                      <span className="block text-[10px] text-slate-500 uppercase font-semibold">{metric.label}</span>
                      <span className="block text-[11px] font-bold text-cyan-400">{metric.value}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="bg-slate-950 text-slate-400 border border-slate-900 text-[9px] font-mono px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action CTA */}
                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1 hover:text-cyan-300 transition-colors group/btn cursor-pointer"
                  >
                    Examiner l'Architecture
                    <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center gap-2">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer" className="p-1.5 bg-slate-950/60 border border-slate-900 text-slate-400 hover:text-white hover:border-slate-800 rounded-lg transition-all" title="Code Source">
                        <Github size={13} />
                      </a>
                    )}
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noreferrer" className="p-1.5 bg-slate-950/60 border border-slate-900 text-slate-400 hover:text-white hover:border-slate-800 rounded-lg transition-all" title="Lien de démo">
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Architectural Inspection Modal (AnimatePresence) */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2 }}
                className="bg-slate-950 border border-slate-800/80 max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col glow-box-purple"
              >
                {/* Modal Header */}
                <div className="bg-slate-900 px-5 py-4 border-b border-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="text-purple-400" size={16} />
                    <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">Plan Architectural d'Ingénierie</span>
                  </div>
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">{selectedProject.category} / METRICS & TECH</span>
                    <h3 className="text-xl font-display font-extrabold text-white">{selectedProject.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">{selectedProject.fullDesc}</p>
                  </div>

                  {/* Architecture Checklist */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Choix & Stratégie d'Architecture :</span>
                    <div className="space-y-2.5">
                      {selectedProject.architecture.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 bg-slate-900/40 border border-slate-900 p-3 rounded-xl">
                          <span className="h-5 w-5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-mono text-[10px] text-cyan-400 shrink-0 mt-0.5">{idx + 1}</span>
                          <span className="text-[11px] text-slate-300 font-mono leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance stats inside modal */}
                  <div className="bg-slate-900/60 border border-slate-900 p-4 rounded-xl grid grid-cols-3 gap-4 font-mono text-center">
                    {selectedProject.metrics.map((metric, idx) => (
                      <div key={idx} className="space-y-1">
                        <span className="block text-[9px] text-slate-500 uppercase">{metric.label}</span>
                        <span className="block text-xs font-bold text-purple-400">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-slate-900/40 border-t border-slate-900 px-5 py-4 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">Alex Mercer © Portfolio</span>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-mono text-[11px] font-bold px-4 py-2 rounded-xl border border-slate-800 cursor-pointer"
                  >
                    Fermer l'Analyse
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
