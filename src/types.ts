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
