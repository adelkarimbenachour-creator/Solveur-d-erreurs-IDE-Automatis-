import React, { useState } from 'react';
import { ProjectConfig, EstimateResult } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Cpu, Layers, FileText, CheckCircle2, ChevronRight, RefreshCw, Sliders, DollarSign, Clock } from 'lucide-react';

const PROJECT_TYPES = [
  "Plateforme SaaS",
  "Site E-Commerce Premium",
  "Application Mobile Native/Hybride",
  "Système d'IA ou RAG",
  "CRM / ERP Sur Mesure",
  "Dashboard IoT / Temps Réel"
];

const PLATFORMS = [
  { id: "web", label: "Web (Desktop & Mobile)" },
  { id: "ios", label: "iOS App" },
  { id: "android", label: "Android App" },
  { id: "desktop", label: "Logiciel Desktop" }
];

const TECHS = [
  "React / TypeScript",
  "Next.js App Router",
  "Node.js (Express/NestJS)",
  "Go (Microservices)",
  "Python (FastAPI)",
  "PostgreSQL / MySQL",
  "Redis (Cache)",
  "Pinecone / pgvector (Vector DB)"
];

const FEATURES = [
  "Authentification Sécurisée (JWT / OAuth)",
  "Paiements Stripe (Abonnements & Unique)",
  "Chatbot d'IA Intégré",
  "Notifications & Chat Temps Réel",
  "Dashboard de Données Analytiques",
  "Système d'administration CMS"
];

const TIMELINES = [
  { id: "flexible", label: "Souple (3+ mois) - Priorise le budget" },
  { id: "standard", label: "Standard (1-2 mois) - Cadence recommandée" },
  { id: "express", label: "Express (Moins de 4 semaines) - Livraison accélérée" }
];

export default function ProjectEstimator() {
  const [config, setConfig] = useState<ProjectConfig>({
    type: "Plateforme SaaS",
    platforms: ["web"],
    stack: ["React / TypeScript", "Node.js (Express/NestJS)", "PostgreSQL / MySQL"],
    features: ["Authentification Sécurisée (JWT / OAuth)"],
    timeline: "standard",
    complexity: "medium"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Toggle multiple options in array helper
  const handleTogglePlatform = (id: string) => {
    setConfig(prev => {
      const existing = prev.platforms.includes(id);
      const updated = existing 
        ? prev.platforms.filter(p => p !== id) 
        : [...prev.platforms, id];
      // Keep at least one platform
      return updated.length > 0 ? { ...prev, platforms: updated } : prev;
    });
  };

  const handleToggleTech = (tech: string) => {
    setConfig(prev => {
      const existing = prev.stack.includes(tech);
      const updated = existing 
        ? prev.stack.filter(t => t !== tech) 
        : [...prev.stack, tech];
      return { ...prev, stack: updated };
    });
  };

  const handleToggleFeature = (feat: string) => {
    setConfig(prev => {
      const existing = prev.features.includes(feat);
      const updated = existing 
        ? prev.features.filter(f => f !== feat) 
        : [...prev.features, feat];
      return { ...prev, features: updated };
    });
  };

  const calculateEstimate = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    // Compute basic complexity based on selected options count
    let complexity: 'simple' | 'medium' | 'complex' | 'enterprise' = 'simple';
    const totalSelected = config.platforms.length + config.stack.length + config.features.length;
    if (totalSelected <= 4) complexity = 'simple';
    else if (totalSelected <= 8) complexity = 'medium';
    else if (totalSelected <= 12) complexity = 'complex';
    else complexity = 'enterprise';

    const finalConfig = { ...config, complexity };

    try {
      const response = await fetch('/api/project-estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: finalConfig })
      });

      if (!response.ok) {
        throw new Error("Impossible de calculer la proposition.");
      }

      const data = await response.json();
      setResult(data.estimate);
    } catch (err: any) {
      setError("Un problème est survenu lors de l'estimation IA. Veuillez réessayer.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="estimator" className="py-20 bg-slate-950 border-t border-slate-900 px-4 relative">
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[10px] uppercase tracking-wider font-semibold">
            <Sliders size={10} />
            CONCEPTEUR DE SYSTEME INTÉGRÉ
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Estimateur de Projet Intelligent (IA)
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto font-sans">
            Configurez les spécifications de votre application ou SaaS. Notre architecte IA (Gemini) concevra une proposition technique complète et une estimation budgétaire correspondante.
          </p>
        </div>

        {/* Form & Results Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          
          {/* Left Column: Form Configuration Options (Col-span 7) */}
          <div className="lg:col-span-7 bg-slate-900/30 border border-slate-900 p-6 rounded-2xl space-y-6 shadow-xl glow-box-purple">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3 mb-2">
              <Cpu className="text-cyan-400 animate-pulse" size={16} />
              <span className="font-mono text-xs font-bold text-white uppercase">Sélecteurs de Spécification</span>
            </div>

            {/* 1. Project Type */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">1. Type de Produit :</span>
              <div className="grid grid-cols-2 gap-2">
                {PROJECT_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setConfig(prev => ({ ...prev, type }))}
                    className={`text-left text-[11px] px-3 py-2.5 rounded-xl border transition-all cursor-pointer font-sans truncate ${
                      config.type === type
                        ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400 font-bold'
                        : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-white hover:border-slate-800'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Target Platforms */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">2. Plateformes Cibles :</span>
              <div className="grid grid-cols-2 gap-2">
                {PLATFORMS.map((platform) => {
                  const isSelected = config.platforms.includes(platform.id);
                  return (
                    <button
                      key={platform.id}
                      onClick={() => handleTogglePlatform(platform.id)}
                      className={`text-left text-[11px] px-3 py-2.5 rounded-xl border transition-all cursor-pointer font-sans ${
                        isSelected
                          ? 'bg-purple-500/10 border-purple-400 text-purple-400 font-bold'
                          : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-white hover:border-slate-800'
                      }`}
                    >
                      {platform.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Technologies Stack */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">3. Stack Technologique Souhaitée :</span>
              <div className="flex flex-wrap gap-1.5">
                {TECHS.map((tech) => {
                  const isSelected = config.stack.includes(tech);
                  return (
                    <button
                      key={tech}
                      onClick={() => handleToggleTech(tech)}
                      className={`text-[10px] font-mono px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 font-bold'
                          : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-slate-300 hover:border-slate-800'
                      }`}
                    >
                      {tech}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Features Selection */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">4. Fonctionnalités Requises :</span>
              <div className="grid grid-cols-2 gap-2">
                {FEATURES.map((feat) => {
                  const isSelected = config.features.includes(feat);
                  return (
                    <button
                      key={feat}
                      onClick={() => handleToggleFeature(feat)}
                      className={`text-left text-[11px] px-3 py-2 rounded-xl border transition-all cursor-pointer font-sans ${
                        isSelected
                          ? 'bg-purple-500/10 border-purple-500/40 text-purple-400 font-bold'
                          : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-white hover:border-slate-800'
                      }`}
                    >
                      {feat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Timeline Selection */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">5. Calendrier Souhaité :</span>
              <div className="space-y-2">
                {TIMELINES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setConfig(prev => ({ ...prev, timeline: t.id }))}
                    className={`w-full text-left text-[11px] px-4 py-2.5 rounded-xl border transition-all cursor-pointer font-sans ${
                      config.timeline === t.id
                        ? 'bg-cyan-500/15 border-cyan-400 text-cyan-400 font-bold'
                        : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-white hover:border-slate-800'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Submit */}
            <div className="pt-4">
              <button
                onClick={calculateEstimate}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-mono text-xs font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="animate-spin" size={13} />
                    Modélisation de l'Architecture par l'IA...
                  </>
                ) : (
                  <>
                    <Sparkles size={13} className="animate-pulse" />
                    Générer la Proposition Technique & Devis
                  </>
                )}
              </button>
              {error && (
                <p className="text-rose-400 text-[10px] mt-2 font-mono text-center">⚠ {error}</p>
              )}
            </div>
          </div>

          {/* Right Column: AI Estimate Proposal Output Screen (Col-span 5) */}
          <div className="lg:col-span-5 h-full min-h-[500px] flex flex-col">
            <AnimatePresence mode="wait">
              {!result && !isLoading ? (
                /* Initial empty state */
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 bg-slate-900/15 border border-dashed border-slate-800/80 rounded-2xl flex flex-col items-center justify-center text-center p-8 h-full"
                >
                  <FileText className="text-slate-700 mb-3 animate-pulse" size={32} />
                  <h4 className="text-slate-400 font-mono text-xs font-semibold">Aucun Devis Généré</h4>
                  <p className="text-[10px] text-slate-500 max-w-xs mt-1 leading-normal font-sans">
                    Configurez vos options à gauche et cliquez sur "Générer" pour obtenir un plan d'architecture rédigé en direct par l'intelligence artificielle.
                  </p>
                </motion.div>
              ) : isLoading ? (
                /* Loading system animation */
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 bg-slate-950 border border-slate-900 rounded-2xl flex flex-col items-center justify-center p-8 h-full min-h-[500px]"
                >
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center animate-spin relative mb-4">
                    <span className="absolute h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center text-white text-xs font-mono font-bold">IA</span>
                  </div>
                  <h4 className="text-white font-mono text-xs font-bold uppercase tracking-wider">Modélisation Cognitive...</h4>
                  <p className="text-[10px] text-slate-500 max-w-xs text-center mt-1 leading-normal font-mono animate-pulse">
                    Le modèle analyse les technologies, estime la complexité structurelle et dresse le plan de charge horaire...
                  </p>
                </motion.div>
              ) : (
                /* Beautiful returned Estimate proposal SOW */
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full glow-box-cyan"
                >
                  {/* Proposal Header */}
                  <div className="bg-slate-900 px-5 py-4 border-b border-slate-800/60 flex items-center justify-between shrink-0 select-none">
                    <div className="flex items-center gap-2">
                      <FileText className="text-cyan-400 animate-pulse" size={14} />
                      <span className="font-mono text-[10px] font-bold text-white uppercase tracking-wider">Plan de Solution IA / Mercer Consulting</span>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800">
                      PRÊT
                    </span>
                  </div>

                  {/* Proposal Document Body */}
                  <div className="p-5 overflow-y-auto space-y-5 flex-1 max-h-[550px] scrollbar">
                    
                    {/* Summary */}
                    <div className="space-y-1 bg-slate-900/30 p-3 rounded-xl border border-slate-900">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-semibold">SYNTHÈSE EXÉCUTIVE</span>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans italic">
                        "{result.summary}"
                      </p>
                    </div>

                    {/* Architecture description */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-semibold">ARCHITECTURE TECHNIQUE CONSEILLÉE</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-mono whitespace-pre-line bg-slate-900/60 p-3 rounded-xl border border-slate-900">
                        {result.architecture}
                      </p>
                    </div>

                    {/* Budget Metrics Card */}
                    <div className="grid grid-cols-2 gap-3 font-mono text-center select-none bg-slate-900/50 p-4 rounded-xl border border-slate-900">
                      <div className="space-y-1 border-r border-slate-900">
                        <span className="text-[9px] text-slate-500 uppercase flex items-center justify-center gap-1">
                          <Clock size={11} className="text-cyan-400" />
                          Charge Estimée
                        </span>
                        <span className="block text-lg font-bold text-white">{result.totalHours} heures</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-500 uppercase flex items-center justify-center gap-1">
                          <DollarSign size={11} className="text-purple-400" />
                          Budget Total
                        </span>
                        <span className="block text-lg font-bold text-cyan-400">{result.totalCost.toLocaleString('fr-FR')} €</span>
                      </div>
                    </div>

                    {/* Phase breakdowns */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-semibold">PLANIFICATION & JALONS DE CHARGE</span>
                      <div className="space-y-2">
                        {result.phases.map((phase, idx) => (
                          <div key={idx} className="bg-slate-900/40 border border-slate-900 p-3 rounded-xl space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-mono font-bold text-white flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                                {phase.name}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500 font-semibold">{phase.hours}h</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                              {phase.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Roadmap Steps */}
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-semibold">PLAN DE ROUTE JUSQU'AU LANCEMENT</span>
                      <div className="space-y-1.5">
                        {result.roadmap.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2 bg-slate-900/20 p-2 rounded-lg border border-slate-900/50">
                            <CheckCircle2 size={11} className="text-emerald-400 mt-0.5 shrink-0" />
                            <span className="text-[10px] text-slate-300 font-sans">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Operational third-party costs */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-semibold">ESTIMATION DES COÛTS TIERCS (CLOUD)</span>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-sans bg-slate-900/20 p-2.5 rounded-lg border border-slate-900/60">
                        {result.thirdPartyCosts}
                      </p>
                    </div>

                  </div>

                  {/* Proposal Footer */}
                  <div className="bg-slate-900/60 border-t border-slate-900 px-5 py-3 flex items-center justify-between shrink-0">
                    <span className="text-[9px] font-mono text-slate-500">Alex Mercer Solutions</span>
                    <button
                      onClick={() => setResult(null)}
                      className="text-[10px] font-mono font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                    >
                      [Effacer la simulation]
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
