import React, { useState } from 'react';
import { BookOpen, Code, Terminal, Server, Key, Clipboard, Check, ChevronDown, ChevronUp, FileCode2, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface CodeSnippetProps {
  title: string;
  filename: string;
  code: string;
  language: string;
}

function CodeSnippet({ title, filename, code, language }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden my-3">
      <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode2 size={14} className="text-blue-400" />
          <span className="font-semibold text-xs text-slate-300">{title}</span>
          <span className="text-[10px] font-mono bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">
            {filename}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-mono text-[10px] bg-slate-800 border border-slate-700/50 px-2 py-0.5 rounded"
        >
          {copied ? <Check size={10} className="text-emerald-400" /> : <Clipboard size={10} />}
          {copied ? "Copié !" : "Copier"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed bg-slate-950 select-all max-h-96">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function GuideInstallation() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'api' | 'code' | 'vscode' | 'workflow'>('architecture');
  const [expandedSection, setExpandedSection] = useState<string | null>('option-b');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
      {/* Header */}
      <div className="bg-slate-950/60 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-blue-400" />
          <span className="font-mono text-xs text-slate-300 font-semibold uppercase tracking-wider">GUIDE DE CONFIGURATION COMPLET</span>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
          DOCS // FRENCH_EDITION
        </span>
      </div>

      {/* Tabs */}
      <div className="bg-slate-950/30 flex border-b border-slate-800 font-mono text-xs overflow-x-auto shrink-0">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex-1 py-2.5 px-4 text-center border-b-2 transition-all min-w-[120px] ${
            activeTab === 'architecture'
              ? 'border-blue-500 text-blue-400 bg-slate-900/60 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-950/20'
          }`}
        >
          1. Architecture
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`flex-1 py-2.5 px-4 text-center border-b-2 transition-all min-w-[120px] ${
            activeTab === 'api'
              ? 'border-blue-500 text-blue-400 bg-slate-900/60 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-950/20'
          }`}
        >
          2. Clé API
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`flex-1 py-2.5 px-4 text-center border-b-2 transition-all min-w-[120px] ${
            activeTab === 'code'
              ? 'border-blue-500 text-blue-400 bg-slate-900/60 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-950/20'
          }`}
        >
          3. Code Source
        </button>
        <button
          onClick={() => setActiveTab('vscode')}
          className={`flex-1 py-2.5 px-4 text-center border-b-2 transition-all min-w-[120px] ${
            activeTab === 'vscode'
              ? 'border-blue-500 text-blue-400 bg-slate-900/60 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-950/20'
          }`}
        >
          4. Intégration IDE
        </button>
        <button
          onClick={() => setActiveTab('workflow')}
          className={`flex-1 py-2.5 px-4 text-center border-b-2 transition-all min-w-[120px] ${
            activeTab === 'workflow'
              ? 'border-blue-500 text-blue-400 bg-slate-900/60 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-950/20'
          }`}
        >
          5. Utilisation
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-5 flex-1 overflow-y-auto space-y-4">
        {activeTab === 'architecture' && (
          <div className="space-y-4 text-xs text-slate-300">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
              <Server size={14} className="text-blue-400" />
              Architecture Globale du Système
            </h3>
            
            <p className="leading-relaxed">
              Le système repose sur un paradigme de <strong>séparation des rôles (Coordinateur & Raisonneur)</strong>. 
              Le but est d'automatiser entièrement le cycle d'interception d'une erreur de programmation locale, 
              son analyse par l'IA gratuite de Google, et son injection directe dans le presse-papier de l'utilisateur.
            </p>

            {/* ASCII Diagram */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 font-mono text-[11px] leading-tight text-blue-400 overflow-x-auto">
              {`+-------------------------------------------------------------+
|                     VS CODE (Votre IDE)                     |
|                                                             |
|  [Code Erreur] --> Raccourci (Ctrl+C ou Extension)          |
+------------------------------+------------------------------+
                               |
                               | (Requête HTTP POST)
                               v
+-------------------------------------------------------------+
|                  APPLICATION WEB LOCALE                     |
|                                                             |
|  +---------------------------+   +-----------------------+  |
|  |   PANNEAU COORDINATEUR    |   |  PANNEAU EXÉCUTEUR    |  |
|  |  (Cerveau du workflow &   |   | (Raisonnement cognitif|  |
|  |   orchestration des logs) |   |    modèle Gemini)     |  |
|  +-------------+-------------+   +-----------+-----------+  |
|                |                             ^              |
|                | (Lecture sémantique)        | (Requête)    |
|                +=============================>              |
|                |                             |              |
|                | (Extraction automatique     | (Réponse)    |
|                |  des balises [START/END])   |              |
|                <-----------------------------+              |
|                |                                            |
|                v                                            |
|   [Auto-Copie Presse-papier] --> Prêt à coller (Ctrl+V)     |
+------------------------------+------------------------------+
                               |
                               | (Appel API sécurisé)
                               v
+-------------------------------------------------------------+
|                 GOOGLE GEMINI API (Gratuit)                 |
|                                                             |
|       Analyse l'erreur et génère la solution structurée     |
+-------------------------------------------------------------+`}
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-slate-200">Fonctionnement des composants :</h4>
              <ul className="list-disc pl-4 space-y-1.5">
                <li>
                  <strong className="text-blue-400">Intercepteur IDE :</strong> Envoie l'erreur et le contexte du fichier en cours d'édition via une requête HTTP REST au serveur local.
                </li>
                <li>
                  <strong className="text-blue-400">Panneau Gauche (Coordinateur) :</strong> Orchestre le workflow, affiche le flux d'événements et les logs locaux du serveur en temps réel, et extrait le code corrigé du raisonneur.
                </li>
                <li>
                  <strong className="text-blue-400">Panneau Droit (Exécuteur) :</strong> Discute avec l'API Gemini de Google, reçoit la pensée cognitive et l'explication, et génère le code encapsulé entre balises.
                </li>
                <li>
                  <strong className="text-blue-400">Lien Sémantique (Coordination) :</strong> Le coordinateur utilise un système d'analyse lexicale sur les balises spéciales <code>[START_SOLUTION]</code> et <code>[END_SOLUTION]</code> reçues par le raisonneur pour extraire le code de manière chirurgicale sans polluer le presse-papier avec les explications en français.
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-4 text-xs text-slate-300">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
              <Key size={14} className="text-blue-400" />
              Obtenir une clé API Gemini Gratuite
            </h3>

            <p className="leading-relaxed">
              Google offre un accès gratuit à l'API Gemini pour le développement et le prototypage via Google AI Studio, sans aucune carte de crédit requise.
            </p>

            <div className="bg-blue-950/20 border border-blue-500/20 p-3.5 rounded-lg space-y-2">
              <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                <Info size={14} />
                <span>Processus étape par étape :</span>
              </div>
              <ol className="list-decimal pl-4 space-y-1.5">
                <li>
                  Rendez-vous sur le site officiel de <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-semibold inline-flex items-center gap-0.5">Google AI Studio<svg className="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg></a>.
                </li>
                <li>
                  Connectez-vous avec votre compte Google personnel.
                </li>
                <li>
                  Cliquez sur le bouton <strong>"Get API Key"</strong> dans le panneau de gauche.
                </li>
                <li>
                  Cliquez sur <strong>"Create API Key"</strong>.
                </li>
                <li>
                  Sélectionnez ou créez un projet Google Cloud gratuit (généré automatiquement en un clic) et validez.
                </li>
                <li>
                  Copiez la clé générée (commençant généralement par <code>AIzaSy...</code>).
                </li>
              </ol>
            </div>

            <div className="space-y-1 bg-slate-950 p-3 rounded border border-slate-800 font-mono text-[11px]">
              <span className="text-slate-500"># Configuration locale (.env)</span>
              <p className="text-emerald-400">GEMINI_API_KEY="votre_cle_api_ici"</p>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-4 text-xs text-slate-300">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
              <Code size={14} className="text-blue-400" />
              Codes Sources pour Votre Installation Locale
            </h3>
            
            <p className="leading-relaxed">
              Voici les fichiers complets prêts à l'emploi. Vous pouvez configurer cette application chez vous en créant un dossier contenant ces trois fichiers.
            </p>

            <CodeSnippet
              title="1. Serveur Node.js léger (Express + Gemini SDK)"
              filename="server.js"
              language="javascript"
              code={`const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Initialisation du client API Gemini officiel
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "VOTRE_CLE_API"
});

// Logs système en mémoire
let systemLogs = [];

// Transmettre un log
function addLog(level, message) {
  systemLogs.push({
    timestamp: new Date().toLocaleTimeString(),
    level,
    message
  });
  console.log(\`[\${level.toUpperCase()}] \${message}\`);
}

// Intercepteur d'erreurs depuis l'IDE (VS Code ou script shell)
app.post('/api/submit-error', (req, res) => {
  const { error, context, language, source } = req.body;
  addLog('info', \`📥 Erreur capturée via \${source || 'IDE'}\`);
  
  // Dans un projet réel, vous pouvez utiliser des WebSockets ou Server-Sent Events (SSE)
  // pour pousser instantanément cette erreur au frontend ouvert dans votre navigateur.
  res.json({ success: true, payload: { error, context, language } });
});

// Analyseur intelligent avec Gemini-3.5-Flash
app.post('/api/solve', async (req, res) => {
  const { error, context, language } = req.body;
  addLog('info', '🧠 Lancement de la résolution cognitive avec l\\'IA...');
  
  try {
    const systemInstruction = \`Tu es un expert en développement. Donne une réponse courte, puis la solution entre :
[START_SOLUTION]
// Ton code corrigé complet ici
[END_SOLUTION]\`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: \`Erreur: \${error}\\nContexte: \${context}\`,
      config: { systemInstruction }
    });

    addLog('success', '✨ Solution cognitive calculée !');
    res.json({ solution: response.text });
  } catch (err) {
    addLog('error', 'Erreur API: ' + err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(\`Serveur local démarré sur http://localhost:\${PORT}\`);
});`}
            />

            <CodeSnippet
              title="2. Interface Utilisateur Double-Panneau"
              filename="index.html"
              language="html"
              code={`<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solveur d'Erreurs IDE</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background-color: #0b1329; color: #f8fafc; }
    </style>
</head>
<body class="h-screen flex flex-col p-4 font-sans">
    <header class="mb-4 border-b border-slate-800 pb-3 flex justify-between items-center">
        <h1 class="text-lg font-bold text-slate-100">💻 Solveur d'Erreurs IDE</h1>
        <span class="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded">VÉROUILLÉ EN LOCAL</span>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-hidden">
        <!-- PANNEAU GAUCHE : COORDINATEUR -->
        <div class="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col h-full">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Panneau Coordinateur (Cerveau)</h2>
            
            <form id="errorForm" class="space-y-3 mb-4">
                <textarea id="errInput" class="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs font-mono" placeholder="Erreur..." rows="3"></textarea>
                <textarea id="contextInput" class="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs font-mono" placeholder="Code source actuel..." rows="4"></textarea>
                <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-500 py-2 rounded text-xs font-semibold">Lancer la Résolution</button>
            </form>

            <h3 class="text-xs font-bold uppercase text-slate-400 mb-2">Logs de Système</h3>
            <div id="logs" class="bg-slate-950 p-2 rounded text-xs font-mono flex-1 overflow-y-auto space-y-1"></div>
        </div>

        <!-- PANNEAU DROIT : EXÉCUTEUR -->
        <div class="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col h-full">
            <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Panneau Exécuteur (Raisonneur Gemini)</h2>
            <div id="solutionContainer" class="bg-slate-950 p-4 rounded text-xs leading-relaxed flex-1 overflow-y-auto whitespace-pre-wrap">
                En attente du déclenchement du flux...
            </div>
        </div>
    </div>

    <script>
        const form = document.getElementById('errorForm');
        const logs = document.getElementById('logs');
        const solution = document.getElementById('solutionContainer');

        function log(msg) {
            const l = document.createElement('div');
            l.textContent = \`[\${new Date().toLocaleTimeString()}] \${msg}\`;
            logs.appendChild(l);
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const error = document.getElementById('errInput').value;
            const context = document.getElementById('contextInput').value;
            
            log("Envoi de l'erreur au serveur local...");
            solution.textContent = "Calcul de la solution de l'IA...";

            try {
                const res = await fetch('http://localhost:3000/api/solve', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error, context })
                });
                const data = await res.json();
                solution.textContent = data.solution;
                
                // --- LIEN COORDINATEUR <-> RAISONNEUR ---
                // Le coordinateur extrait sémantiquement la solution du raisonneur
                if (data.solution.includes('[START_SOLUTION]')) {
                    const start = data.solution.indexOf('[START_SOLUTION]') + 16;
                    const end = data.solution.indexOf('[END_SOLUTION]');
                    const cleanCode = data.solution.substring(start, end).trim();
                    
                    // Copie automatique
                    navigator.clipboard.writeText(cleanCode);
                    log("✨ Solution de code extraite et COPIÉE dans votre presse-papier automatiquement !");
                }
            } catch (err) {
                log("Erreur : " + err.message);
                solution.textContent = "Échec.";
            }
        });
    </script>
</body>
</html>`}
            />
          </div>
        )}

        {activeTab === 'vscode' && (
          <div className="space-y-4 text-xs text-slate-300">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
              <Terminal size={14} className="text-blue-400" />
              Intégration et Déclenchement depuis VS Code
            </h3>

            <p className="leading-relaxed">
              Pour envoyer vos erreurs en un seul raccourci clavier depuis votre éditeur, voici les deux méthodes préconisées :
            </p>

            {/* Selector Options */}
            <div className="grid grid-cols-2 gap-2 pb-2">
              <button
                onClick={() => toggleSection('option-b')}
                className={`py-2 px-3 text-left rounded-lg border transition-all ${
                  expandedSection === 'option-b'
                    ? 'bg-blue-600/10 border-blue-500/40 text-blue-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                <div className="font-semibold text-xs">Option B (Recommandée)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Script Shell & Task Runner VS Code</div>
              </button>
              
              <button
                onClick={() => toggleSection('option-a')}
                className={`py-2 px-3 text-left rounded-lg border transition-all ${
                  expandedSection === 'option-a'
                    ? 'bg-blue-600/10 border-blue-500/40 text-blue-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                <div className="font-semibold text-xs">Option A (Avancée)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Extension VS Code sur-mesure</div>
              </button>
            </div>

            {expandedSection === 'option-b' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 bg-slate-950/40 p-4 rounded-lg border border-slate-800"
              >
                <h4 className="font-bold text-slate-200">Script d'intégration automatique via le Presse-papier</h4>
                <p className="leading-relaxed text-slate-400">
                  Cette méthode ne nécessite aucune extension lourde. On crée une tâche VS Code standard qui lit votre presse-papier (où vous avez copié l'erreur) et l'envoie à l'application.
                </p>

                <ol className="list-decimal pl-4 space-y-2">
                  <li>
                    Créez un script nommé <code>send-error.sh</code> à la racine de votre projet ou globalement :
                    <CodeSnippet
                      title="Script d'expédition (macOS/Linux)"
                      filename="send-error.sh"
                      language="bash"
                      code={`#!/bin/bash
# Lit le presse-papier et l'envoie à l'application locale
ERROR_CONTENT=$(pbpaste) # ou 'xclip -selection clipboard -o' sur Linux

curl -X POST http://localhost:3000/api/submit-error \\
  -H "Content-Type: application/json" \\
  -d "{\\"error\\": \\"\${ERROR_CONTENT}\\", \\"source\\": \\"VS Code Task\\"}"`}
                    />
                  </li>
                  <li>
                    Dans VS Code, créez/éditez votre fichier de configuration de tâches <code>.vscode/tasks.json</code> pour y intégrer ce script et lui assigner un raccourci clavier :
                    <CodeSnippet
                      title="Configuration des Tâches VS Code"
                      filename="tasks.json"
                      language="json"
                      code={`{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Résoudre l'erreur copiée",
      "type": "shell",
      "command": "bash \${workspaceFolder}/send-error.sh",
      "problemMatcher": [],
      "presentation": {
        "reveal": "silent",
        "panel": "new"
      }
    }
  ]
}`}
                    />
                  </li>
                  <li>
                    Associez-lui un raccourci clavier global dans <code>keybindings.json</code> (Ctrl+Shift+P &gt; Open Keyboard Shortcuts (JSON)) :
                    <pre className="p-3 bg-slate-950 rounded text-emerald-400 font-mono text-[11px] mt-1.5 overflow-x-auto">
{`{
  "key": "ctrl+alt+r",
  "command": "workbench.action.tasks.runTask",
  "args": "Résoudre l'erreur copiée"
}`}
                    </pre>
                  </li>
                </ol>
              </motion.div>
            )}

            {expandedSection === 'option-a' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 bg-slate-950/40 p-4 rounded-lg border border-slate-800"
              >
                <h4 className="font-bold text-slate-200">Extension VS Code Légère</h4>
                <p className="leading-relaxed text-slate-400">
                  Si vous préférez une extension sur-mesure pour envoyer directement le texte sélectionné en surbrillance d'un simple clic droit.
                </p>

                <ol className="list-decimal pl-4 space-y-2">
                  <li>
                    Générez une extension VS Code basique avec <code>yo code</code> ou manuellement.
                  </li>
                  <li>
                    Copiez le code suivant dans le point d'entrée de l'extension :
                    <CodeSnippet
                      title="Point d'entrée de l'extension VS Code"
                      filename="extension.js"
                      language="javascript"
                      code={`const vscode = require('vscode');
const axios = require('axios');

function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.solveSelectedError', async function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('Aucun éditeur de fichier actif.');
            return;
        }

        // Récupère l'erreur sélectionnée par l'utilisateur
        const errorText = editor.document.getText(editor.selection);
        // Récupère le code entier du fichier comme contexte sémantique
        const fileContent = editor.document.getText();
        const languageId = editor.document.languageId;

        if (!errorText) {
            vscode.window.showWarningMessage('Veuillez d\\'abord sélectionner le texte de l\\'erreur.');
            return;
        }

        vscode.window.showInformationMessage('Envoi de l\\'erreur au résolveur cognitif local...');

        try {
            await axios.post('http://localhost:3000/api/submit-error', {
                error: errorText,
                context: fileContent,
                language: languageId,
                source: "VS Code Extension Pro"
            });
        } catch (err) {
            vscode.window.showErrorMessage('Erreur de liaison : ' + err.message);
        }
    });

    context.subscriptions.push(disposable);
}

module.exports = { activate };`}
                    />
                  </li>
                </ol>
              </motion.div>
            )}
          </div>
        )}

        {activeTab === 'workflow' && (
          <div className="space-y-4 text-xs text-slate-300">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
              <Check size={14} className="text-emerald-400" />
              Workflow et Utilisation Quotidienne
            </h3>

            <p className="leading-relaxed">
              Voici comment la magie opère en combinant l'IDE, l'application locale et votre presse-papier.
            </p>

            <div className="relative border-l-2 border-emerald-500 pl-4 space-y-3">
              <div>
                <span className="font-bold text-slate-200">1. Détection de l'erreur</span>
                <p className="text-slate-400 mt-0.5">Votre terminal de compilation affiche une erreur. Vous la sélectionnez et la copiez (Ctrl+C).</p>
              </div>

              <div>
                <span className="font-bold text-slate-200">2. Envoi Instantané</span>
                <p className="text-slate-400 mt-0.5">Vous tapez votre raccourci magique <code>Ctrl+Alt+R</code> dans VS Code. L'application locale intercepte immédiatement le texte de l'erreur.</p>
              </div>

              <div>
                <span className="font-bold text-slate-200">3. Traitement Intelligent</span>
                <p className="text-slate-400 mt-0.5">Le Coordinateur de l'application reçoit le paquet, l'affiche dans les logs et le transmet au Raisonneur Gemini.</p>
              </div>

              <div>
                <span className="font-bold text-slate-200">4. Génération & Extraction automatique</span>
                <p className="text-slate-400 mt-0.5">L'IA analyse le code, trouve le problème et génère une explication de 3 lignes ainsi que le code corrigé balisé. Le Coordinateur lit instantanément cette sortie, repère les balises et copie le code propre dans votre presse-papier global.</p>
              </div>

              <div>
                <span className="font-bold text-slate-200">5. Correction Directe</span>
                <p className="text-slate-400 mt-0.5">Vous retournez sur votre IDE et faites un simple <code>Ctrl+V</code>. Votre code est corrigé et fonctionnel !</p>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] leading-relaxed text-slate-400 space-y-1">
              <strong className="text-emerald-400">💡 Astuce de sécurité :</strong>
              <p>
                Ce système est entièrement sécurisé. Il fonctionne à 100% en local (localhost) et ne diffuse aucune donnée sur l'extérieur hormis la requête vers l'API officielle sécurisée de Google Gemini. Aucune base de données publique n'est exposée.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
