import React from 'react';
import { Cpu, Copy, Check, Info, FileCode2, Sparkles, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

interface PanelExecutorProps {
  solutionText: string | null;
  isSolving: boolean;
  errorMsg: string | null;
  extractedCode: string | null;
  onCopyCode: () => void;
  copied: boolean;
}

export default function PanelExecutor({
  solutionText,
  isSolving,
  errorMsg,
  extractedCode,
  onCopyCode,
  copied
}: PanelExecutorProps) {

  // Custom renderer for Gemini's markdown explanation to display beautiful text blocks
  const renderResponseContent = (text: string) => {
    if (!text) return null;

    const lines = text.split('\n');
    let inCodeBlock = false;
    let codeContent = '';
    let codeLanguage = '';

    return lines.map((line, idx) => {
      // Check for code block boundary
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          inCodeBlock = false;
          const currentCode = codeContent;
          codeContent = '';
          return (
            <div key={idx} className="my-3 rounded-lg overflow-hidden border border-slate-800 font-mono text-xs bg-slate-950">
              <div className="bg-slate-900 px-3 py-1.5 text-[10px] text-slate-400 flex items-center justify-between border-b border-slate-800">
                <span>{codeLanguage || 'CODE'}</span>
              </div>
              <pre className="p-3 overflow-x-auto text-emerald-400 select-all leading-relaxed">
                <code>{currentCode}</code>
              </pre>
            </div>
          );
        } else {
          inCodeBlock = true;
          codeLanguage = line.trim().substring(3) || 'code';
          return null;
        }
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        return null;
      }

      // Check for Special extraction tags and highlight them!
      if (line.includes('[START_SOLUTION]') || line.includes('[END_SOLUTION]')) {
        return (
          <div key={idx} className="my-2 bg-blue-950/40 border border-blue-500/30 px-3 py-1.5 rounded font-mono text-[11px] text-blue-300 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span>Balise Coordinateur détectée : <strong>{line.trim()}</strong></span>
          </div>
        );
      }

      // Headers
      if (line.trim().startsWith('###')) {
        return (
          <h4 key={idx} className="text-sm font-semibold text-slate-100 mt-4 mb-2 border-l-2 border-blue-500 pl-2">
            {line.replace('###', '').trim()}
          </h4>
        );
      }
      if (line.trim().startsWith('##')) {
        return (
          <h3 key={idx} className="text-base font-bold text-slate-50 mt-5 mb-2.5">
            {line.replace('##', '').trim()}
          </h3>
        );
      }

      // Bullet points
      if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
        return (
          <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 ml-2 my-1 leading-relaxed">
            <span className="text-blue-500 mt-1 select-none">•</span>
            <span>{line.substring(1).trim()}</span>
          </div>
        );
      }

      // Standard text with bold inline styling
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      // Bold formatter **text**
      const parts = line.split('**');
      if (parts.length > 1) {
        return (
          <p key={idx} className="text-xs text-slate-300 my-1 leading-relaxed">
            {parts.map((part, i) => (
              i % 2 === 1 ? <strong key={i} className="text-slate-100 font-semibold">{part}</strong> : part
            ))}
          </p>
        );
      }

      return (
        <p key={idx} className="text-xs text-slate-300 my-1 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div id="panel-executor" className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
      {/* Header */}
      <div className="bg-slate-950/60 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="font-mono text-xs text-slate-400 font-semibold uppercase tracking-wider">PANEL_EXECUTOR // RAISONNEUR GEMINI</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-blue-400 font-mono">
          <Sparkles size={11} className="animate-pulse text-blue-400" />
          <span>gemini-3.5-flash</span>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-5">
        {isSolving ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 space-y-4">
            <div className="relative">
              <Cpu size={40} className="text-blue-500 animate-spin duration-1000" />
              <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl animate-ping" />
            </div>
            <div className="text-center">
              <p className="text-xs font-mono text-slate-400 animate-pulse">Calcul de la solution cognitive...</p>
              <p className="text-[10px] text-slate-600 mt-1 max-w-xs">Analyse sémantique de l'erreur et génération du code correcteur</p>
            </div>
          </div>
        ) : errorMsg ? (
          <div className="bg-rose-950/20 border border-rose-900/40 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-semibold">
              <Info size={14} />
              <span>ALERTE_DE_SERVICE</span>
            </div>
            <p className="text-xs text-slate-300 leading-normal">{errorMsg}</p>
          </div>
        ) : solutionText ? (
          <div className="space-y-4">
            {/* Real-time reasoning */}
            <section className="bg-slate-950/40 p-4 rounded-lg border border-slate-800/60 space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1.5 flex items-center gap-2">
                <Cpu size={12} className="text-blue-400" />
                Détail du Raisonnement Cognitive
              </h3>
              <div className="space-y-1.5">
                {renderResponseContent(solutionText)}
              </div>
            </section>

            {/* Auto Extracted section by the Coordinator */}
            {extractedCode && (
              <motion.section 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between border-b border-emerald-500/10 pb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />
                    <h3 className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider">
                      SOLUTION_EXTRAITE (COORDINATEUR)
                    </h3>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono">
                    Copie Auto Active
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-normal">
                  Le Coordinateur a lu le contenu ci-dessus, repéré les balises, extrait le code corrigé, et l'a copié dans votre presse-papier local pour injection immédiate.
                </p>

                <div className="relative rounded-lg overflow-hidden border border-emerald-500/20 bg-slate-950">
                  <div className="bg-emerald-950/40 px-3 py-1.5 text-[10px] text-emerald-400 font-mono flex items-center justify-between border-b border-emerald-500/15">
                    <span className="flex items-center gap-1">
                      <FileCode2 size={11} />
                      CODE_CORRIGE_PRET
                    </span>
                    <button
                      id="btn-copy-solution"
                      onClick={onCopyCode}
                      className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-mono text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded"
                    >
                      {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                      {copied ? "Copié !" : "Copier"}
                    </button>
                  </div>
                  <pre className="p-3 overflow-x-auto text-emerald-400 select-all font-mono text-xs max-h-64 leading-relaxed">
                    <code>{extractedCode}</code>
                  </pre>
                </div>
              </motion.section>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-600">
            <Cpu size={36} className="text-slate-700 mb-2" />
            <p className="text-xs font-mono">Raisonneur inactif</p>
            <p className="text-[10px] text-slate-500 text-center mt-1 max-w-xs">Sélectionnez une erreur et lancez la résolution pour démarrer la pensée cognitive de l'IA.</p>
          </div>
        )}
      </div>
    </div>
  );
}
