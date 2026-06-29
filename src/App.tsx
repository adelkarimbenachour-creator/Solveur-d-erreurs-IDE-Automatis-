import React, { useState, useEffect } from 'react';
import { Terminal, ShieldCheck, Play, BookOpen, Layers, Check, ExternalLink, HelpCircle, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PanelCoordinator from './components/PanelCoordinator';
import PanelExecutor from './components/PanelExecutor';
import GuideInstallation from './components/GuideInstallation';
import { SystemLog, ErrorPacket } from './types';

export default function App() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [activePacket, setActivePacket] = useState<ErrorPacket | null>(null);
  const [workflowStep, setWorkflowStep] = useState<number>(0);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [solutionText, setSolutionText] = useState<string | null>(null);
  const [extractedCode, setExtractedCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Synchronize system logs & captured events with the Express server via SSE
  useEffect(() => {
    const eventSource = new EventSource('/api/events');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'init_logs') {
          setLogs(data.logs);
        } else if (data.type === 'log') {
          setLogs((prev) => {
            const updated = [...prev, data.log];
            return updated.slice(-100); // keep last 100
          });
        } else if (data.type === 'error_captured') {
          // Live interception of error sent from external shell script/extension
          const packet: ErrorPacket = data.payload;
          setActivePacket(packet);
          setWorkflowStep(2); // Step 2: Error received & interpreted
        }
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Submit error manually via form simulator
  const handleLocalSubmitError = async (packet: ErrorPacket) => {
    setActivePacket(packet);
    setWorkflowStep(2); // Step 2: Error received / interpreted locally

    try {
      await fetch('/api/submit-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packet)
      });
    } catch (err) {
      console.error("Failed to submit error to local API:", err);
    }
  };

  // Trigger Gemini resolution
  const handleSolve = async () => {
    if (!activePacket) return;

    setIsSolving(true);
    setErrorMsg(null);
    setSolutionText(null);
    setExtractedCode(null);
    setWorkflowStep(3); // Step 3: Consulting Reasoner (Gemini)

    try {
      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: activePacket.error,
          context: activePacket.context,
          language: activePacket.language
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Une erreur serveur est survenue.");
      }

      const data = await res.json();
      setWorkflowStep(4); // Step 4: Cognitive Analysis completed / response rendering
      setSolutionText(data.solution);

      // Extract solution semsantical block
      // Look for [START_SOLUTION] and [END_SOLUTION] tags
      const rawText = data.solution;
      if (rawText.includes('[START_SOLUTION]')) {
        setWorkflowStep(5); // Step 5: Parsing response / Extracting block
        const startTag = '[START_SOLUTION]';
        const endTag = '[END_SOLUTION]';
        const startIndex = rawText.indexOf(startTag) + startTag.length;
        const endIndex = rawText.indexOf(endTag);
        
        if (endIndex > startIndex) {
          let codeBlock = rawText.substring(startIndex, endIndex).trim();
          
          // Clean possible markdown wrapper if any e.g. ```typescript ... ```
          if (codeBlock.startsWith('```')) {
            const firstNewLine = codeBlock.indexOf('\n');
            if (firstNewLine !== -1) {
              codeBlock = codeBlock.substring(firstNewLine + 1);
            }
            if (codeBlock.endsWith('```')) {
              codeBlock = codeBlock.substring(0, codeBlock.length - 3).trim();
            }
          }

          setExtractedCode(codeBlock);
          
          // Copy to clipboard automatically!
          navigator.clipboard.writeText(codeBlock);
          setWorkflowStep(6); // Step 6: Code extracted and synchronized in clipboard
          
          // Log completion
          await appendLogToBackend('success', '✨ Le Coordinateur a lu le raisonneur, extrait le code corrigé, et l\'a synchronisé dans le presse-papier.');
        } else {
          setWorkflowStep(4); // Stay on step 4 if extraction failed
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Impossible de se connecter au serveur.");
      setWorkflowStep(0);
    } finally {
      setIsSolving(false);
    }
  };

  const appendLogToBackend = async (level: 'info' | 'warn' | 'error' | 'success', message: string) => {
    // Simply logging locally to update logs via the SSE listener
    console.log(`[${level.toUpperCase()}] ${message}`);
  };

  // Copy extracted code manually
  const handleCopyCode = () => {
    if (!extractedCode) return;
    navigator.clipboard.writeText(extractedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Clear system logs
  const handleClearLogs = async () => {
    try {
      await fetch('/api/logs/clear', { method: 'POST' });
    } catch (err) {
      console.error("Failed to clear logs on server:", err);
    }
  };

  // Reset current packet & solver state
  const handleReset = () => {
    setActivePacket(null);
    setWorkflowStep(0);
    setSolutionText(null);
    setExtractedCode(null);
    setErrorMsg(null);
  };

  return (
    <div id="app-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Upper Brand Bar */}
      <header id="main-header" className="bg-slate-900/60 border-b border-slate-800/80 px-6 py-4 sticky top-0 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-lg">
                <Layers size={18} />
              </span>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                Solveur d'Erreurs IDE Automatisé
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Système cognitif d'orchestration pour intercepter, analyser et résoudre vos erreurs de code avec Gemini.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400">
              <Activity size={12} className="text-emerald-500 animate-pulse" />
              <span>LIAISON_IDE : <strong className="text-emerald-400">ACTIVE</strong></span>
            </div>

            <button
              id="btn-toggle-guide"
              onClick={() => setShowGuide(!showGuide)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                showGuide
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              <BookOpen size={14} />
              {showGuide ? "Masquer le Guide" : "Afficher le Guide de Config"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6 overflow-hidden">
        
        {/* Connection Notice / Warning if API key is not configured */}
        {process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY" && (
          <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
            <HelpCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider font-mono">
                [ALERTE_CONFIGURATION_SECRETS]
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Votre clé API Gemini n'est pas encore enregistrée. Veuillez ouvrir l'onglet <strong>Secrets</strong> de l'interface Google AI Studio (bouton engrenage ou panneau latéral) et y enregistrer votre variable <code className="text-amber-200 bg-amber-500/10 px-1 py-0.5 rounded">GEMINI_API_KEY</code> avec votre clé gratuite de Google AI Studio pour activer l'analyse en temps réel.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
          {/* Side-by-side Panel Layout */}
          <div className={`col-span-12 ${showGuide ? 'lg:col-span-8' : 'lg:col-span-12'} grid grid-cols-1 md:grid-cols-2 gap-6`}>
            {/* Left Column: PanelCoordinator */}
            <PanelCoordinator
              logs={logs}
              onClearLogs={handleClearLogs}
              onSubmitError={handleLocalSubmitError}
              activePacket={activePacket}
              workflowStep={workflowStep}
              isSolving={isSolving}
              onSolve={handleSolve}
              onReset={handleReset}
              extractedCode={extractedCode}
            />

            {/* Right Column: PanelExecutor */}
            <PanelExecutor
              solutionText={solutionText}
              isSolving={isSolving}
              errorMsg={errorMsg}
              extractedCode={extractedCode}
              onCopyCode={handleCopyCode}
              copied={copied}
            />
          </div>

          {/* Persistent Guide Tab on the right if toggled open */}
          {showGuide && (
            <div className="col-span-12 lg:col-span-4 h-full">
              <GuideInstallation />
            </div>
          )}
        </div>
      </main>

      {/* Aesthetic Margins Footer */}
      <footer id="main-footer" className="bg-slate-950/80 border-t border-slate-900 py-3.5 px-6 font-mono text-[10px] text-slate-500 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>COORDINATEUR COGNITIF & RESIDU LOGIQUE © 2026 // LOCAL_MODE_STRICT</span>
          <div className="flex items-center gap-3">
            <span>PORT_RESEAU: 3000</span>
            <span className="text-emerald-500">● SYSTÈME EN LIGNE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
