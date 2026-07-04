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

  // --- NEW PORTFOLIO API ENDPOINTS ---

  // Endpoint 1: Chat with Alex's AI Clone
  app.post('/api/chat-clone', async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message manquant" });
    }

    addLog('info', `💬 Message clone IA d'Alex Mercer : "${message.substring(0, 45)}..."`);

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
      // High-quality simulated response when no API key is present
      return res.json({
        reply: "Bonjour ! Je suis ravi de faire votre connaissance. Je suis Alex Mercer, un architecte logiciel Full-Stack d'élite. 🚀\n\nPour me poser des questions complexes, configurer ma personnalité complète et débloquer toute la puissance cognitive de Gemini 3.5, veuillez configurer votre 'GEMINI_API_KEY' dans les Secrets d'AI Studio.\n\nEn attendant, je peux vous dire que je suis spécialisé dans la création d'architectures cloud scalables, de backends ultra-performants en Go/Node, et d'interfaces réactives haut de gamme en React/Tailwind. Je facture généralement un tarif journalier moyen (TJM) d'environ 800€ à 1000€ (ou 120€/h) pour les mandats de conseil ou de développement de pointe. Que puis-je vous présenter aujourd'hui ?"
      });
    }

    try {
      const systemInstruction = `Tu es l'intelligence artificielle de clone virtuel d'Alex Mercer (développeur Full Stack Elite & Solutions Architect). Tu réponds en français de manière professionnelle, charismatique et pragmatique.
Tu as 8+ ans d'expérience, expert en :
- Frontend : React, Next.js, Framer Motion, Tailwind CSS, Three.js, web performance.
- Backend : Node.js (NestJS, Express), Python (FastAPI), Go, GraphQL, microservices.
- DBs : PostgreSQL, MongoDB, Redis, vector databases.
- DevOps : Docker, Kubernetes, AWS, Terraform, CI/CD.
- AI : Pipelines RAG, intégration de modèles de langage (LLMs), agentic workflows.

Ton style est direct, amical, élégant et axé sur la valeur business et la propreté du code. Si on te demande tes tarifs, tu vaux environ 120€/h en freelance ou des forfaits sur-mesure pour les plateformes SaaS/IA.
Donne des conseils avisés et cite des exemples de patterns techniques lorsque pertinent.`;

      const contents = [];
      if (history && Array.isArray(history)) {
        history.forEach((msg: any) => {
          contents.push({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        });
      }
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const reply = response.text || "Désolé, je n'ai pas pu formuler de réponse pour le moment.";
      addLog('success', "✨ Réponse générée par le clone IA.");
      res.json({ reply });
    } catch (err: any) {
      addLog('error', `Échec Chat Clone Gemini : ${err.message || err}`);
      res.status(500).json({ error: `Erreur d'appel Gemini : ${err.message}` });
    }
  });

  // Endpoint 2: AI Solution & Budget Estimator for potential clients
  app.post('/api/project-estimate', async (req, res) => {
    const { config } = req.body;
    if (!config) {
      return res.status(400).json({ error: "Configuration manquante" });
    }

    addLog('info', `📊 Calcul d'estimation d'architecture pour projet : "${config.type}"`);

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
      // High-quality fallback proposal when API key is missing
      return res.json({
        estimate: {
          architecture: "Architecture Serverless Moderne :\n- Frontend : Single Page Application React (Vite/Tailwind) déployée sur Vercel Edge CDN\n- Backend : API REST Node.js Express hébergée sur conteneurs AWS Fargate scalables\n- Base de données : PostgreSQL managé (Supabase) avec clustering d'indexation et cache Redis",
          phases: [
            { name: "Spécifications & Maquettes UI/UX", hours: 40, description: "Cadrage fonctionnel complet, schématisation de base de données, prototypes Figma interactifs." },
            { name: "Développement Frontend & Éléments Réactifs", hours: 120, description: "Intégration responsive haute définition, animations de fluidité Framer Motion." },
            { name: "Développement API & Services Cloud", hours: 140, description: "Logique métier, passerelle de paiement Stripe, authentification JWT sécurisée." },
            { name: "Recette, QA, CI/CD & Déploiement", hours: 40, description: "Pipeline automatisé GitHub Actions, tests unitaires, basculement en production." }
          ],
          totalHours: 340,
          totalCost: 40800,
          thirdPartyCosts: "Environ 50$ à 150$/mois pour l'infrastructure Cloud managée.",
          roadmap: [
            "Semaine 1-2 : Spécifications, schémas DB et maquettage interactif",
            "Semaine 3-6 : Développement des modules critiques (Auth, Core Logic, Frontend)",
            "Semaine 7-8 : Intégrations de paiements, audit de sécurité et lancement en production"
          ],
          summary: "Cette estimation haut de gamme garantit un code ultra-propre, documenté et d'une évolutivité totale pour l'avenir."
        }
      });
    }

    try {
      const systemInstruction = `Tu es un architecte logiciel principal d'élite et directeur technique (CTO). Ton but est d'analyser les spécifications de projet de l'utilisateur et de générer une proposition d'architecture technique et d'estimation financière d'une précision chirurgicale.
Tu dois répondre STRICTEMENT avec un objet JSON respectant exactement le format ci-dessous. Ne mets aucune phrase d'introduction ni de conclusion, uniquement l'objet JSON valide :

{
  "architecture": "Explication claire de l'architecture serveur et client préconisée (paragraphe)",
  "phases": [
    { "name": "Nom de la phase", "hours": 80, "description": "Détail de ce qui est accompli (court)" }
  ],
  "totalHours": 320,
  "totalCost": 38400,
  "thirdPartyCosts": "Estimation des coûts récurrents d'infrastructure (hébergement, APIs, bases de données)",
  "roadmap": [
    "Étape 1 : Libellé de l'étape",
    "Étape 2 : Libellé de l'étape"
  ],
  "summary": "Résumé de la valeur ajoutée et des recommandations clés (court)"
}`;

      const userPrompt = `Voici les spécifications sélectionnées par mon client :
- Type de projet : ${config.type}
- Plateformes ciblées : ${config.platforms.join(', ')}
- Technologies souhaitées : ${config.stack.join(', ')}
- Fonctionnalités requises : ${config.features.join(', ')}
- Calendrier de livraison : ${config.timeline}
- Complexité générale estimée : ${config.complexity}

Génère une proposition technique d'architecture et de budget correspondante au taux standard d'Alex Mercer (120€/heure).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      });

      const rawJson = response.text || "{}";
      const result = JSON.parse(rawJson);

      addLog('success', "✨ Estimation financière et technique calculée avec succès !");
      res.json({ estimate: result });
    } catch (err: any) {
      addLog('error', `Échec Estimation Projet : ${err.message || err}`);
      res.status(500).json({ error: `Erreur d'évaluation : ${err.message}` });
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
