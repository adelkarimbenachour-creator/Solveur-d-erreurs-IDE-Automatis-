import React from 'react';
import { motion } from 'motion/react';
import { Award, Briefcase, Calendar, CheckSquare, Sparkles } from 'lucide-react';
import { TIMELINE } from '../data/portfolioData';

export default function CareerTimeline() {
  return (
    <section id="experience" className="py-20 bg-slate-950 border-t border-slate-900 px-4 relative">
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[320px] h-[320px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Section Title */}
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[10px] uppercase tracking-wider font-semibold">
            <Award size={10} />
            Parcours & Chronologie Professionnelle
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Expérience & Jalons de Carrière
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto font-sans">
            Une trajectoire tournée vers la recherche de la performance technique, la mise à l'échelle des architectures cloud et le leadership technique.
          </p>
        </div>

        {/* Timeline Line & Node block */}
        <div className="relative border-l border-slate-900 pl-6 sm:pl-8 space-y-12 ml-4 sm:ml-6 py-2">
          {TIMELINE.map((item, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={idx}
              className="relative"
            >
              {/* Pulsing Timeline Node */}
              <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-4 w-4 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </span>

              {/* Milestones Card */}
              <div className="bg-slate-900/30 border border-slate-900 hover:border-slate-800/80 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:bg-slate-900/40 space-y-4 shadow-xl glow-box-purple">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900/60 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block sm:inline-block">
                      {item.company}
                    </span>
                    <h3 className="text-white text-sm sm:text-base font-display font-bold mt-0.5 sm:mt-0">
                      {item.role}
                    </h3>
                  </div>

                  <span className="inline-flex items-center gap-1 bg-slate-950 text-slate-400 border border-slate-900 text-[9px] font-mono px-2.5 py-1 rounded-full shrink-0 h-fit self-start sm:self-center">
                    <Calendar size={10} className="text-purple-400" />
                    {item.period}
                  </span>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed font-sans">
                  {item.description}
                </p>

                {/* Achievements list */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold block">Résultats techniques majeurs :</span>
                  <div className="space-y-1.5">
                    {item.achievements.map((achievement, aIdx) => (
                      <div key={aIdx} className="flex items-start gap-2">
                        <CheckSquare size={11} className="text-cyan-400 mt-1 shrink-0" />
                        <span className="text-[11px] text-slate-300 font-sans leading-relaxed">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="bg-slate-950/60 text-slate-500 border border-slate-900 text-[9px] font-mono px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
