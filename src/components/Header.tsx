import React from 'react';
import { Layers, Github, Linkedin, Mail, ExternalLink, Cpu } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  onScrollTo: (id: string) => void;
  activeSection: string;
}

export default function Header({ onScrollTo, activeSection }: HeaderProps) {
  const navItems = [
    { id: 'hero', label: 'Accueil' },
    { id: 'skills', label: 'Compétences' },
    { id: 'projects', label: 'Projets' },
    { id: 'experience', label: 'Expérience' },
    { id: 'ai-clone', label: 'Clone IA' },
    { id: 'estimator', label: 'Estimateur' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand logo */}
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onScrollTo('hero')}
        >
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white font-mono font-bold text-lg shadow-lg shadow-cyan-500/10">
            A
          </div>
          <div className="hidden sm:block">
            <span className="font-display font-bold text-white tracking-tight block text-sm">Alex Mercer</span>
            <span className="font-mono text-[10px] text-cyan-400 font-semibold uppercase tracking-widest block">Fullstack Engineer</span>
          </div>
        </motion.div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 p-1.5 rounded-full">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onScrollTo(item.id)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-mono transition-all duration-200 cursor-pointer ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-cyan-500/15 to-purple-500/15 border border-cyan-500/30 text-cyan-400 font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Social / CTA Links */}
        <motion.div 
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="flex items-center gap-2 text-slate-400">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1.5 hover:text-cyan-400 transition-colors"
              title="GitHub"
            >
              <Github size={16} />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1.5 hover:text-cyan-400 transition-colors"
              title="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
          </div>

          <button
            onClick={() => onScrollTo('estimator')}
            className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-mono text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-cyan-500/20 active:scale-95 group cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <Cpu size={12} className="animate-pulse" />
              Lancer un Projet
            </span>
            <div className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </motion.div>
      </div>
    </header>
  );
}
