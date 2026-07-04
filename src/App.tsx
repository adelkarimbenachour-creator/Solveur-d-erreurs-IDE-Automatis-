import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SkillGrid from './components/SkillGrid';
import ProjectShowcase from './components/ProjectShowcase';
import CareerTimeline from './components/CareerTimeline';
import AiCloneChat from './components/AiCloneChat';
import ProjectEstimator from './components/ProjectEstimator';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, Terminal, Activity, Sparkles, Code2, Globe } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor active sections on scroll using IntersectionObserver
  useEffect(() => {
    const handleScroll = () => {
      // Toggle scroll to top button
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    const sections = ['hero', 'skills', 'projects', 'experience', 'ai-clone', 'estimator'];
    const observers = sections.map((id) => {
      const element = document.getElementById(id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { threshold: 0.25, rootMargin: "-80px 0px -20px 0px" }
      );
      observer.observe(element);
      return { element, observer };
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.element);
      });
    };
  }, []);

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of fixed header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  return (
    <div id="portfolio-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-cyan-500/30 selection:text-white">
      
      {/* Premium Navigation Header */}
      <Header onScrollTo={handleScrollTo} activeSection={activeSection} />

      {/* Main Page Layout Section Components */}
      <main className="flex-1 flex flex-col w-full relative">
        
        {/* Dynamic global ambient lighting nodes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full filter blur-[150px] pointer-events-none" />
        <div className="absolute top-[40%] left-0 w-[450px] h-[450px] bg-purple-500/5 rounded-full filter blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-teal-500/5 rounded-full filter blur-[150px] pointer-events-none" />

        {/* 1. HERO HOME SECTION */}
        <Hero onScrollTo={handleScrollTo} />

        {/* 2. DETAILED SKILL CATEGORIES */}
        <SkillGrid />

        {/* 3. DYNAMIC BENTO GRID SHOWCASE */}
        <ProjectShowcase />

        {/* 4. CHRONOLOGICAL MILESTONES */}
        <CareerTimeline />

        {/* 5. DYNAMIC INTERACTIVE GEMINI CHAT */}
        <AiCloneChat />

        {/* 6. PROJECT SOLUTIONS ARCHITECT ESTIMATOR */}
        <ProjectEstimator />

      </main>

      {/* Premium Professional Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-10 px-6 font-mono text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          
          {/* Copyrights */}
          <div className="space-y-1">
            <span className="text-white font-semibold font-display text-sm tracking-tight">Alex Mercer</span>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Solutions d'ingénierie et de développement full-stack d'élite.<br />
              Conception d'architectures sécurisées & agents intelligents.
            </p>
          </div>

          {/* Core metadata (Aesthetic tech accents) */}
          <div className="flex flex-col items-center justify-center space-y-1.5 font-mono text-[10px] text-slate-500">
            <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg">
              <Activity size={10} className="text-cyan-400 animate-pulse" />
              <span>COGNITIVE ENGINE : <strong className="text-cyan-400 font-extrabold uppercase">GEMINI_READY</strong></span>
            </div>
            <span>Statut du serveur de clone : Opérationnel</span>
          </div>

          {/* Social and quick links */}
          <div className="flex flex-col md:items-end justify-center space-y-2 text-slate-500 text-[11px]">
            <span>© 2026 Alex Mercer // Tous droits réservés</span>
            <div className="flex justify-center md:justify-end gap-3.5">
              <a href="#hero" onClick={(e) => { e.preventDefault(); handleScrollTo('hero'); }} className="hover:text-cyan-400 transition-colors">Accueil</a>
              <a href="#projects" onClick={(e) => { e.preventDefault(); handleScrollTo('projects'); }} className="hover:text-cyan-400 transition-colors">Projets</a>
              <a href="#estimator" onClick={(e) => { e.preventDefault(); handleScrollTo('estimator'); }} className="hover:text-cyan-400 transition-colors">Simuler Devis</a>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating Scroll to Top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 p-3 rounded-full shadow-lg hover:shadow-cyan-500/10 active:scale-95 transition-all cursor-pointer"
            title="Retour en haut"
          >
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
