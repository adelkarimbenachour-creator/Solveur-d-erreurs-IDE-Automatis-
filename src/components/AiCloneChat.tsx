import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, AlertCircle, RefreshCw, HelpCircle, Terminal } from 'lucide-react';

const DEVELOPER_AVATAR = "/src/assets/images/developer_avatar_1783108213809.jpg";

const SUGGESTIONS = [
  "Quels sont tes tarifs et ta disponibilité ?",
  "Parle-moi de ton expérience avec Next.js et React",
  "Comment gères-tu la mise à l'échelle d'une base de données ?",
  "Es-tu ouvert à des postes en CDI ou freelance ?"
];

export default function AiCloneChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Bonjour ! Je suis le clone virtuel d'Alex Mercer. J'ai été entraîné sur son profil technique, ses architectures préférées et son éthique de travail.\n\nPosez-moi n'importe quelle question sur mes compétences, mes tarifs, mon code ou mes disponibilités !",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat-clone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-10) // Send last 10 messages for context
        })
      });

      if (!response.ok) {
        throw new Error("Impossible de joindre le serveur de clone IA.");
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        sender: 'ai',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      setError("Désolé, une erreur technique est survenue lors de la communication sémantique. Veuillez réessayer.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <section id="ai-clone" className="py-20 bg-slate-950 border-t border-slate-900 px-4 relative">
      {/* Background neon blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[10px] uppercase tracking-wider font-semibold">
            <Sparkles size={10} className="animate-pulse" />
            RAG cognitif & IA conversationnelle
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Discutez avec mon Clone IA
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto font-sans">
            Posez-moi des questions en direct. Ce clone virtuel est propulsé par l'API Gemini 3.5 Flash et utilise un modèle de personnalité calqué sur mes compétences.
          </p>
        </div>

        {/* Chat Widget Wrapper */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[500px] glow-box-cyan relative z-10">
          
          {/* Left Panel: Avatar & Info */}
          <div className="md:w-1/3 bg-slate-900/60 p-5 border-b md:border-b-0 md:border-r border-slate-900 flex flex-row md:flex-col items-center md:items-start gap-4 md:justify-between shrink-0">
            <div className="flex items-center md:items-start gap-3 md:flex-col">
              {/* Custom generated developer avatar */}
              <div className="relative">
                <img 
                  src={DEVELOPER_AVATAR} 
                  alt="Alex Mercer Avatar" 
                  className="h-14 w-14 rounded-2xl object-cover border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/5"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
              </div>

              <div className="space-y-1">
                <h3 className="text-white text-xs font-bold font-mono">Alex Mercer (AI Clone)</h3>
                <span className="text-[10px] font-mono text-cyan-400 block font-semibold">STATUS: EN LIGNE (GEMINI)</span>
                <p className="hidden md:block text-[10px] text-slate-500 leading-normal pt-1">
                  Je réponds aux questions techniques et de gestion de projet. Essayez d'être précis sur vos besoins !
                </p>
              </div>
            </div>

            {/* Suggestions Helper on Desktop */}
            <div className="hidden md:block w-full pt-4 border-t border-slate-900/80">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mb-2 font-bold">Questions Suggérées :</span>
              <div className="space-y-1.5">
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(s)}
                    disabled={isLoading}
                    className="w-full text-left bg-slate-950/80 hover:bg-slate-800 border border-slate-900 text-[10px] text-slate-400 hover:text-white p-2 rounded-lg transition-colors font-sans truncate block cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Active Chat Box */}
          <div className="flex-1 flex flex-col justify-between bg-slate-950 relative h-full">
            
            {/* Message Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={idx}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-sans leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-tr-none'
                        : 'bg-slate-900/60 border border-slate-900 text-slate-300 rounded-tl-none'
                    }`}>
                      {/* Formatted body text */}
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      
                      <span className={`block text-[8px] mt-1.5 text-right ${isUser ? 'text-white/60' : 'text-slate-500'} font-mono`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Loader */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900/60 border border-slate-900 text-slate-300 rounded-2xl rounded-tl-none p-3.5 max-w-[80%] flex items-center gap-2">
                    <div className="flex space-x-1.5 items-center h-4 py-1">
                      <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-bounce" />
                    </div>
                    <span className="font-mono text-[9px] text-slate-500 uppercase font-semibold">Alex compile une réponse...</span>
                  </div>
                </div>
              )}

              {/* Error block */}
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle size={12} className="shrink-0" />
                  <span className="font-sans">{error}</span>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleFormSubmit} className="p-4 border-t border-slate-900/80 bg-slate-900/20 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                placeholder="Posez une question à Alex (ex: Quels sont tes tarifs ?)..."
                className="flex-1 bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-40 text-white p-3 rounded-xl transition-all shadow-md active:scale-95 shrink-0 flex items-center justify-center cursor-pointer"
              >
                <Send size={14} />
              </button>
            </form>

          </div>
        </div>

      </div>
    </section>
  );
}
