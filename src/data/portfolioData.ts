export interface Project {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  category: 'Fullstack' | 'AI' | 'DevOps' | 'Frontend';
  tags: string[];
  metrics: { label: string; value: string }[];
  architecture: string[];
  featured: boolean;
  link?: string;
  github?: string;
  imageAlt: string;
}

export interface SkillCategory {
  title: string;
  skills: { name: string; level: number; icon: string; desc: string }[];
}

export interface Experience {
  period: string;
  role: string;
  company: string;
  description: string;
  achievements: string[];
  tags: string[];
}

export interface Stat {
  value: string;
  label: string;
  desc: string;
}

export const STATS: Stat[] = [
  { value: "8+", label: "Années d'Expérience", desc: "Expertise Senior de bout en bout" },
  { value: "45+", label: "Projets Déployés", desc: "SaaS, mobile & IA mis en production" },
  { value: "99.99%", label: "Taux de Disponibilité", desc: "Moyenne SLA sur architectures gérées" },
  { value: "3.5M+", label: "Utilisateurs Actifs", desc: "Trafic cumulé sur les applications gérées" }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Frontend d'Élite",
    skills: [
      { name: "React / Next.js", level: 95, icon: "React", desc: "SSR/ISR, Routeurs App, Server Components, optimization SEO" },
      { name: "TypeScript", level: 98, icon: "TypeScript", desc: "Typage stricte, génériques avancés, type safety complète" },
      { name: "Tailwind CSS & Animations", level: 95, icon: "Paintbrush", desc: "Framer Motion, layouts complexes, design system sur-mesure" },
      { name: "Performance Web", level: 90, icon: "Zap", desc: "Core Web Vitals, réduction bundle sizes, lazy loading poussé" }
    ]
  },
  {
    title: "Backend & Architectures",
    skills: [
      { name: "Node.js (NestJS / Express)", level: 92, icon: "Server", desc: "APIs RESTful, GraphQL, WebSocket, architecture découplée" },
      { name: "Go (Golang)", level: 85, icon: "Cpu", desc: "Microservices haute performance, concurrence avancée avec goroutines" },
      { name: "Python (FastAPI / Django)", level: 88, icon: "Brain", desc: "Pipelines de traitement, scraping, intégration de modèles ML/LLM" },
      { name: "PostgreSQL & Redis", level: 90, icon: "Database", desc: "Optimisation de requêtes complexes, clustering, gestion du cache" }
    ]
  },
  {
    title: "DevOps & Infrastructure",
    skills: [
      { name: "Docker & Kubernetes", level: 88, icon: "Layers", desc: "Conteneurisation complète, orchestration de clusters, Helm" },
      { name: "Amazon Web Services (AWS)", level: 85, icon: "Cloud", desc: "ECS, Lambda serverless, VPC, IAM, S3, RDS, CloudFront" },
      { name: "CI/CD & automatisation", level: 92, icon: "GitBranch", desc: "GitHub Actions, Terraform (IaC), GitOps, déploiement continu" },
      { name: "Sécurité & Monitoring", level: 85, icon: "Shield", desc: "Certifications OWASP, monitoring Grafana, Prometheus, Datadog" }
    ]
  },
  {
    title: "IA & Génie Sémantique",
    skills: [
      { name: "Intégration d'Agents IA", level: 90, icon: "Sparkles", desc: "Pipelines RAG (Retrieval-Augmented Generation), APIs LLMs" },
      { name: "Bases de Données Vectorielles", level: 85, icon: "Compass", desc: "Pinecone, pgvector, ChromaDB pour l'indexation sémantique" },
      { name: "LangChain / LlamaIndex", level: 80, icon: "Workflow", desc: "Orchestration d'agents autonomes, chaînes de prompt engineering" }
    ]
  }
];

export const PROJECTS: Project[] = [
  {
    id: "project-1",
    title: "Aetheria SaaS : Plateforme de Monitoring IA",
    shortDesc: "Une suite cloud ultra-rapide surveillant les performances des modèles d'IA générative en production.",
    fullDesc: "Aetheria est une solution d'observabilité complète pour les entreprises déployant des agents IA. Elle capture les latences, les dérives sémantiques, les taux d'erreur, et le coût d'utilisation des jetons (tokens) en temps réel, offrant un tableau de bord analytique de niveau milliseconde.",
    category: "AI",
    tags: ["React", "Go", "Redis", "pgvector", "AWS Fargate", "Gemini API"],
    metrics: [
      { label: "Temps de réponse", value: "< 12ms" },
      { label: "Volume de données", value: "2.4B events/j" },
      { label: "Optimisation coûts IA", value: "-40%" }
    ],
    architecture: [
      "Pipeline de streaming d'événements développé en Go",
      "Indexation sémantique des requêtes utilisateurs avec pgvector",
      "Tableau de bord interactif en Next.js avec Recharts pour les graphiques fluides"
    ],
    featured: true,
    imageAlt: "Interface dashboard moderne sombre avec graphiques de latence"
  },
  {
    id: "project-2",
    title: "NeuroFlow : Moteur de Recherche Sémantique",
    shortDesc: "Recherche augmentée par IA dans des bases de connaissances d'entreprise de plusieurs millions de documents.",
    fullDesc: "NeuroFlow est un système RAG (Retrieval-Augmented Generation) de pointe conçu pour connecter en toute sécurité les bases de connaissances internes des clients (Confluence, Drive, PDF) à des modèles d'IA générative privés.",
    category: "Fullstack",
    tags: ["Next.js", "FastAPI", "Pinecone", "Docker", "Kubernetes"],
    metrics: [
      { label: "Précision RAG", value: "98.2%" },
      { label: "Documents indexés", value: "15M+" },
      { label: "Indexation initiale", value: "6 minutes" }
    ],
    architecture: [
      "Chunking intelligent et asynchrone des documents via Celery & Python",
      "Stockage vectoriel managé avec Pinecone",
      "Interface d'administration réactive et sécurisée avec SSO"
    ],
    featured: true,
    imageAlt: "Graphe de nœuds sémantiques connectés"
  },
  {
    id: "project-3",
    title: "OmniOps : Orchestrateur Cloud GitOps",
    shortDesc: "Automatisation et déploiement d'architectures Kubernetes via des commits Git, avec monitoring unifié.",
    fullDesc: "Un outil interne devenu open-source permettant de provisionner de manière déclarative des environnements de staging et production complexes sur AWS et GCP par simple push Git, intégrant des analyses de coûts proactives basées sur l'IA.",
    category: "DevOps",
    tags: ["Terraform", "ArgoCD", "Kubernetes", "Prometheus", "Golang"],
    metrics: [
      { label: "Délai de staging", value: "1.5 min" },
      { label: "Réduction facture AWS", value: "28%" },
      { label: "Crash Recovery", value: "Auto (10s)" }
    ],
    architecture: [
      "Définition d'infrastructure via modules Terraform réutilisables",
      "Déploiement synchronisé avec ArgoCD sur clusters Kubernetes de production",
      "Analyseur de coût LLM intégré pour alerter sur les fuites de ressources"
    ],
    featured: true,
    imageAlt: "Terminal de logs de déploiement et cartes de coûts cloud"
  },
  {
    id: "project-4",
    title: "Vortex : Design System & Canvas Interactif",
    shortDesc: "Une bibliothèque de composants WebGL / React et un éditeur de graphiques interactifs à haute fluidité.",
    fullDesc: "Vortex propose des composants visuels d'animation complexes pour le web moderne, utilisant WebGL et Three.js sous le capot, associés à un éditeur vectoriel ultra-performant fonctionnant à 60 images par seconde.",
    category: "Frontend",
    tags: ["React", "Three.js", "Zustand", "Tailwind v4", "WebGL"],
    metrics: [
      { label: "Frame Rate", value: "60 FPS stables" },
      { label: "Poids du bundle", value: "45KB gzipped" },
      { label: "Satisfaction Devs", value: "95%" }
    ],
    architecture: [
      "Architecture de rendu optimisée sur Canvas HTML5 & WebGL",
      "Gestion d'état réactive ultra-rapide avec Zustand",
      "Intégration d'ombrages GLSL personnalisés pour des effets organiques"
    ],
    featured: false,
    imageAlt: "Canvas interactif avec des nœuds connectés et animations fluides"
  }
];

export const TIMELINE: Experience[] = [
  {
    period: "2024 - Présent",
    role: "Architecte Solutions Cloud & Lead IA",
    company: "Aether Innovations (Paris / Remote)",
    description: "Direction technique de l'architecture d'un agent conversationnel de service client déployé pour des banques européennes.",
    achievements: [
      "Conception d'un middleware RAG hybride réduisant le taux d'hallucinations de l'IA de 95% à moins de 0.5%",
      "Migration de l'infrastructure vers AWS ECS / Fargate, réalisant une économie annuelle de 35 000$ sur les serveurs",
      "Encadrement d'une équipe de 5 développeurs full-stack seniors"
    ],
    tags: ["Architect", "AWS Fargate", "RAG", "Next.js", "NestJS", "Kubernetes"]
  },
  {
    period: "2021 - 2024",
    role: "Ingénieur Full-Stack Senior",
    company: "Synthetix Corp (San Francisco / Remote)",
    description: "Développement et mise à l'échelle d'une plateforme SaaS de traitement vidéo automatisé par IA.",
    achievements: [
      "Optimisation du pipeline de traitement multimédia en Go, divisant par 3 le temps de compression des vidéos",
      "Création d'un éditeur vidéo par glisser-déposer en React hautement fluide (60 FPS)",
      "Mise en place d'une architecture microservices solide et sécurisée"
    ],
    tags: ["Go", "React", "Docker", "Redis", "FFmpeg", "REST APIs"]
  },
  {
    period: "2019 - 2021",
    role: "Développeur Full-Stack & DevOps",
    company: "Novatech Solutions",
    description: "Conception d'applications web collaboratives en temps réel et automatisation de l'infrastructure.",
    achievements: [
      "Mise en œuvre de WebSockets pour une collaboration fluide à l'écran en temps réel",
      "Création de pipelines CI/CD complets réduisant les délais de déploiement de 40 minutes à 3 minutes",
      "Support technique et audit de sécurité des applications bancaires"
    ],
    tags: ["TypeScript", "Express", "PostgreSQL", "WebSockets", "GitHub Actions"]
  }
];
