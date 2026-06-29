import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // In-memory logs & configuration state
  const systemLogs: Array<{ id: string; timestamp: string; level: 'info' | 'warn' | 'error' | 'success'; message: string }> = [
    {
      id: "init-log",
      timestamp: new Date().toLocaleTimeString(),
      level: "success",
      message: "Système de Résolution d'Erreurs initialisé sur le port 3000"
    }
  ];

  // List of connected SSE clients (e.g. browser clients)
  let clients: any[] = [];

  // Helper to append server log and broadcast to frontend if connected
  function addLog(level: 'info' | 'warn' | 'error' | 'success', message: string) {
    const logItem = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    };
    systemLogs.push(logItem);
    if (systemLogs.length > 100) systemLogs.shift();
    
    // Broadcast log update to all connected browser clients via SSE
    clients.forEach(client => {
      client.write(`data: ${JSON.stringify({ type: 'log', log: logItem })}\n\n`);
    });
    console.log(`[${level.toUpperCase()}] ${message}`);
  }

  // --- API Routes ---

  // SSE stream for real-time browser updates
  app.get('/api/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Send initial logs
    res.write(`data: ${JSON.stringify({ type: 'init_logs', logs: systemLogs })}\n\n`);

    clients.push(res);

    req.on('close', () => {
      clients = clients.filter(c => c !== res);
    });
  });

  // Endpoint to clear logs
  app.post('/api/logs/clear', (req, res) => {
    systemLogs.length = 0;
    addLog('info', "Historique des logs réinitialisé par l'utilisateur.");
    res.json({ success: true });
  });

  // Local Receiver Endpoint: simulating error captured from IDE (extension or task runner)
  app.post('/api/submit-error', (req, res) => {
    const { error, context, language, source } = req.body;
    
    if (!error) {
      return res.status(400).json({ error: "Le champ 'error' est obligatoire." });
    }

    const errorSource = source || "VS Code Extension";
    addLog('info', `📥 Nouvelle erreur interceptée via [${errorSource}]`);
    addLog('info', `Type de fichier détecté: ${language || 'Inconnu'}`);
    
    // Broadcast error packet to React frontend via SSE
    clients.forEach(client => {
      client.write(`data: ${JSON.stringify({ 
        type: 'error_captured', 
        payload: { error, context, language: language || 'typescript', source: errorSource } 
      })}\n\n`);
    });

    res.json({ 
      success: true, 
      message: "Erreur reçue et transmise au coordinateur de l'application." 
    });
  });

  // Secure Backend Proxy for Gemini AI Solver
  app.post('/api/solve', async (req, res) => {
    const { error, context, language } = req.body;
    
    if (!error) {
      return res.status(400).json({ error: "Erreur manquante pour l'analyse." });
    }

    addLog('info', "🧠 Lancement de l'analyse avec le modèle gemini-3.5-flash...");

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
      addLog('error', "Clé API Gemini non configurée dans l'environnement !");
      return res.status(500).json({ 
        error: "Clé API manquante. Veuillez ajouter votre clé 'GEMINI_API_KEY' dans l'onglet Secrets de Google AI Studio pour tester l'intégration réelle." 
      });
    }

    try {
      const systemPrompt = `Tu es un expert en développement logiciel et en débogage de code.
Ton rôle est de résoudre des erreurs rapportées par l'IDE de l'utilisateur de manière pragmatique.

CONSIGNES STRICTES :
1. Explique brièvement la cause de l'erreur dans un langage clair et pédagogique (en français).
2. Propose la correction de manière précise.
3. À la fin de ta réponse, tu dois ABSOLUMENT inclure la solution de code corrigée enfermée exactement entre les balises spéciales suivantes. Ne mets rien d'autre que le code corrigé (avec son bloc markdown de langage) à l'intérieur de ces balises :

[START_SOLUTION]
\`\`\`${language || 'typescript'}
// Ton code corrigé complet et fonctionnel ici
\`\`\`
[END_SOLUTION]

Sois direct et évite les bavardages superflus.`;

      const userPrompt = `Voici l'erreur détectée dans mon IDE :
\`\`\`
${error}
\`\`\`

Voici le contexte de mon fichier (code source actuel) :
\`\`\`${language || 'typescript'}
${context || '// Aucun contexte fourni'}
\`\`\`

Donne-moi l'analyse de l'erreur et la correction de code complète en respectant le format requis.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.1,
        }
      });

      const explanation = response.text || "";
      addLog('success', "✨ Analyse complétée par Gemini. Solution générée.");
      
      res.json({ solution: explanation });
    } catch (err: any) {
      addLog('error', `Échec de l'appel API Gemini : ${err.message || err}`);
      res.status(500).json({ 
        error: `Une erreur est survenue lors de l'appel à l'API Gemini : ${err.message || err}` 
      });
    }
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
