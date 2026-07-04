export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

export interface ErrorPacket {
  error: string;
  context: string;
  language: string;
  source: string;
}

export interface SetupFile {
  title: string;
  filename: string;
  language: string;
  description: string;
  code: string;
}

export interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface ProjectConfig {
  type: string;
  platforms: string[];
  stack: string[];
  features: string[];
  timeline: string;
  complexity: 'simple' | 'medium' | 'complex' | 'enterprise';
}

export interface EstimateResult {
  architecture: string;
  phases: Array<{ name: string; hours: number; description: string }>;
  totalHours: number;
  totalCost: number;
  thirdPartyCosts: string;
  roadmap: string[];
  summary: string;
}
