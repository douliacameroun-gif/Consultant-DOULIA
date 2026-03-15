import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic,
  Send, 
  User, 
  ArrowRight, 
  Phone, 
  Menu,
  X,
  Zap,
  Shield,
  ClipboardList,
  Cpu,
  Activity,
  Layers,
  HelpCircle,
  Trash2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getGeminiResponse } from './services/gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Widget } from '@typeform/embed-react';
import SolutionsPage from './components/SolutionsPage';
import ContactPage from './components/ContactPage';
import AboutFAQPage from './components/AboutFAQPage';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: Math.random() * 4 + 'px',
            height: Math.random() * 4 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animationDuration: Math.random() * 10 + 10 + 's',
            animationDelay: Math.random() * 5 + 's',
            opacity: Math.random() * 0.5
          }}
        />
      ))}
    </div>
  );
};

const STORAGE_KEY = 'doulia_chat_history';

export default function App() {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse chat history', e);
        }
      }
    }
    return [
      {
        role: 'model',
        content: "Bienvenue dans l'univers __DOULIA__. Je suis votre Expert Consultant Digital. \n\n❶ Prêt à propulser votre business au Cameroun vers le futur ? \n\n❷ Parlez-moi de vos ambitions ou de vos défis actuels."
      }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTypeform, setShowTypeform] = useState(false);
  const [resumeCode, setResumeCode] = useState<string | null>(null);
  const [showSolutions, setShowSolutions] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [externalUrl, setExternalUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const typeformId = "xe2vUwE1";

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'fr-FR';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(prev => prev + (prev ? ' ' : '') + transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const clearHistory = () => {
    const initialMessage: Message[] = [
      {
        role: 'model',
        content: "Bienvenue dans l'univers __DOULIA__. Je suis votre Expert Consultant Digital. \n\n❶ Prêt à propulser votre business au Cameroun vers le futur ? \n\n❷ Parlez-moi de vos ambitions ou de vos défis actuels."
      }
    ];
    setMessages(initialMessage);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleSend = async (customMessage?: string, isRetry = false) => {
    const userMessage = customMessage || input.trim();
    if (!userMessage || (isLoading && !isRetry)) return;

    if (!isRetry) {
      if (!customMessage) setInput('');
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const currentMessages = isRetry ? messages : [...messages];
      const history = currentMessages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
      
      const response = await getGeminiResponse(userMessage, history);
      setMessages(prev => [...prev, { role: 'model', content: response || "Désolé, j'ai rencontré une petite difficulté. Pouvons-nous reprendre ?" }]);
    } catch (err: any) {
      console.error(err);
      setError(userMessage);
      setMessages(prev => [...prev, { role: 'model', content: "Une erreur est survenue. Vérifiez votre connexion ou réessayez plus tard. On est ensemble !" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSolution = (solutionName: string) => {
    setShowSolutions(false);
    handleSend(`Je souhaite en savoir plus sur la solution __${solutionName}__. Pouvez-vous m'expliquer comment cela peut aider mon entreprise ?`);
  };

  const handleNavigate = (page: 'home' | 'solutions' | 'audit') => {
    setShowContact(false);
    if (page === 'home') {
      setShowSolutions(false);
      setShowTypeform(false);
    } else if (page === 'solutions') {
      setShowSolutions(true);
      setShowTypeform(false);
    } else if (page === 'audit') {
      setShowSolutions(false);
      openAudit();
    }
  };

  const openAudit = (code: string | null = null) => {
    setResumeCode(code);
    setShowTypeform(true);
  };

  const openExternalLink = (url: string) => {
    // Check if it's a protocol link (WhatsApp, Email, Phone)
    if (url.startsWith('wa.me') || url.startsWith('https://wa.me') || url.startsWith('mailto:') || url.startsWith('tel:')) {
      window.open(url, '_blank');
      return;
    }
    setExternalUrl(url);
  };

  return (
    <div className="h-[100dvh] bg-doulia-night text-white flex flex-col font-sans relative bg-mesh overflow-hidden">
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-40 z-0" />
      <div className="scanline" />
      <ParticleBackground />
      
      <main className="flex-1 max-w-7xl mx-auto w-full p-0 sm:p-4 lg:p-6 relative z-10 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col h-full glass-panel sm:rounded-[2.5rem] overflow-hidden relative glow-neon"
        >
          {/* Chat Header Allégé et Organisé */}
          <div className="p-3.5 sm:p-4 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-2xl sticky top-0 z-10">
            <div className="flex items-center gap-3 sm:gap-3">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center overflow-hidden border border-white/10 shadow-lg">
                  <img 
                    src="https://i.postimg.cc/Y0nJdHW3/DOULIA_LOGO.jpg" 
                    alt="DOULIA" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-doulia-lime border-2 border-doulia-night rounded-full shadow-[0_0_10px_#bef264]"></div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-display font-bold text-lg sm:text-lg text-white tracking-tight leading-none mb-1 sm:mb-1">DOULIA</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-doulia-lime rounded-full animate-pulse"></div>
                  <p className="text-[9px] sm:text-[9px] text-white/40 font-bold uppercase tracking-widest leading-none">Système Actif</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                onClick={() => setShowSolutions(true)}
                className="hidden sm:block text-[11px] font-bold text-white/60 hover:text-doulia-lime transition-all px-3 py-2 rounded-lg hover:bg-white/5"
              >
                Solutions
              </button>
              <button 
                onClick={() => setShowAbout(true)}
                className="hidden sm:block text-[11px] font-bold text-white/60 hover:text-doulia-lime transition-all px-3 py-2 rounded-lg hover:bg-white/5"
              >
                À Propos
              </button>
              <button 
                onClick={() => setShowContact(true)}
                className="hidden sm:block text-[11px] font-bold text-white/60 hover:text-doulia-lime transition-all px-3 py-2 rounded-lg hover:bg-white/5"
              >
                Contact
              </button>
              
              {/* Bouton Audit mis en perspective (Call to Action) */}
              <button 
                onClick={() => openAudit()}
                className="flex text-[10px] sm:text-xs font-black text-doulia-night bg-doulia-lime px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(190,242,100,0.4)] items-center gap-1 active:scale-95 animate-[pulse_3s_ease-in-out_infinite]"
              >
                <Activity size={12} className="animate-bounce" />
                <span className="hidden xs:inline">Audit IA</span>
                <span className="xs:hidden">Audit</span>
              </button>

              <button className="sm:hidden p-1 text-white/80" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Overlay */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="sm:hidden absolute top-20 left-4 right-4 z-[100] bg-doulia-night/98 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
              >
                <div className="flex flex-col gap-3">
                  <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mb-2 ml-2">Navigation</div>
                  
                  <button 
                    onClick={() => { setShowSolutions(true); setIsMenuOpen(false); }}
                    className="w-full text-left p-3 text-sm font-bold text-white hover:text-doulia-lime bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-3 group"
                  >
                    <div className="p-1.5 bg-doulia-lime/10 rounded-lg text-doulia-lime">
                      <Layers size={18} />
                    </div>
                    <span className="flex-1">Nos Solutions</span>
                    <ArrowRight size={16} className="text-doulia-lime opacity-0 group-hover:opacity-100 transition-all" />
                  </button>

                  <button 
                    onClick={() => { setShowContact(true); setIsMenuOpen(false); }}
                    className="w-full text-left p-3 text-sm font-bold text-white hover:text-doulia-lime bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-3 group"
                  >
                    <div className="p-1.5 bg-doulia-accent-blue/10 rounded-lg text-doulia-accent-blue">
                      <Phone size={18} />
                    </div>
                    <span className="flex-1">Contact & Support</span>
                    <ArrowRight size={16} className="text-doulia-lime opacity-0 group-hover:opacity-100 transition-all" />
                  </button>

                  <button 
                    onClick={() => { setShowAbout(true); setIsMenuOpen(false); }}
                    className="w-full text-left p-3 text-sm font-bold text-white hover:text-doulia-lime bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-3 group"
                  >
                    <div className="p-1.5 bg-doulia-lime/10 rounded-lg text-doulia-lime">
                      <HelpCircle size={18} />
                    </div>
                    <span className="flex-1">À Propos & FAQ</span>
                    <ArrowRight size={16} className="text-doulia-lime opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                  
                  {/* Bouton Effacer Historique déplacé dans le menu */}
                  <button 
                    onClick={() => { clearHistory(); setIsMenuOpen(false); }}
                    className="w-full text-left p-3 text-[13px] font-bold text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 rounded-xl transition-all flex items-center gap-3"
                  >
                    <div className="p-1.5 bg-red-500/10 rounded-lg">
                      <Trash2 size={18} />
                    </div>
                    <span className="flex-1">Effacer l'historique</span>
                  </button>

                  <div className="mt-2 pt-4 border-t border-white/10 flex justify-between items-center">
                    <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">© DOULIA 2026</p>
                    <button 
                      onClick={() => setIsMenuOpen(false)}
                      className="text-doulia-lime text-[10px] font-bold uppercase tracking-widest"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-8 space-y-4 sm:space-y-8 scrollbar-hide">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-2 sm:gap-4 max-w-[98%] sm:max-w-[80%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                  "w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden",
                  msg.role === 'user' 
                    ? "bg-doulia-lime/20 border border-doulia-lime/30 text-white" 
                    : "bg-white"
                )}>
                  {msg.role === 'user' ? (
                    <img 
                      src="https://i.postimg.cc/T17Zt6Dc/DOULIA_LOGO_FOND_VERT.jpg" 
                      alt="User" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <img 
                      src="https://i.postimg.cc/Y0nJdHW3/DOULIA_LOGO.jpg" 
                      alt="DOULIA" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <div className={cn(
                  "p-3 sm:p-5 rounded-[1.25rem] text-[13px] sm:text-base leading-relaxed shadow-lg transition-all duration-300",
                  msg.role === 'user' 
                    ? "bg-doulia-lime/10 text-white rounded-tr-none border border-doulia-lime/20" 
                    : "bg-white/[0.03] text-white/90 border border-white/5 rounded-tl-none backdrop-blur-md"
                )}>
                  <div className="markdown-body">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => {
                          const processBubbles = (nodes: any): any => {
                            return React.Children.map(nodes, (node) => {
                              if (typeof node === 'string') {
                                const parts = node.split(/([❶-❿])/g);
                                return parts.map((part, i) => 
                                  /[❶-❿]/.test(part) ? (
                                    <span key={i} className="text-doulia-lime font-bold inline-flex items-center justify-center mx-1 transform scale-110 sm:scale-125">
                                      {part}
                                    </span>
                                  ) : part
                                );
                              }
                              return node;
                            });
                          };
                          return <p>{processBubbles(children)}</p>;
                        },
                        li: ({ children }) => {
                          const processBubbles = (nodes: any): any => {
                            return React.Children.map(nodes, (node) => {
                              if (typeof node === 'string') {
                                const parts = node.split(/([❶-❿])/g);
                                return parts.map((part, i) => 
                                  /[❶-❿]/.test(part) ? (
                                    <span key={i} className="text-doulia-lime font-bold inline-flex items-center justify-center mx-1 transform scale-110 sm:scale-125">
                                      {part}
                                    </span>
                                  ) : part
                                );
                              }
                              return node;
                            });
                          };
                          return <li>{processBubbles(children)}</li>;
                        },
                        a: ({ href, children }) => {
                          const isWhatsApp = href?.includes('wa.me');
                          const isTypeform = href?.includes('typeform.com');
                          
                          const handleClick = (e: React.MouseEvent) => {
                            if (isTypeform) {
                              e.preventDefault();
                              const url = new URL(href || '');
                              const code = url.hash.split('resume_chat=')[1] || url.searchParams.get('resume_chat');
                              openAudit(code);
                            } else if (href && !isWhatsApp) {
                              e.preventDefault();
                              openExternalLink(href);
                            }
                          };

                          return (
                            <a 
                              href={href} 
                              target={isTypeform || !isWhatsApp ? undefined : "_blank"} 
                              rel="noopener noreferrer"
                              onClick={handleClick}
                              className={cn(
                                "inline-flex items-center gap-2 px-3.5 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-2xl font-bold text-[11px] sm:text-sm transition-all my-1.5 sm:my-3 group/link no-underline",
                                isWhatsApp 
                                  ? "bg-[#25D366] text-white" 
                                  : isTypeform
                                    ? "bg-doulia-lime text-doulia-night"
                                    : "bg-white/10 text-white border border-white/10"
                              )}
                            >
                              {isWhatsApp && <Phone size={12} />}
                              {isTypeform && <Activity size={12} />}
                              {children}
                              <ArrowRight size={12} />
                            </a>
                          );
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Animation de chargement fixe, sobre et sans effets parasites */}
            {isLoading && (
              <div className="flex gap-2 sm:gap-4 mr-auto">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://i.postimg.cc/Y0nJdHW3/DOULIA_LOGO.jpg" 
                    alt="DOULIA" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="bg-white/5 border border-white/5 px-3 py-2 rounded-[1.25rem] rounded-tl-none flex items-center h-auto sm:h-10">
                  <span className="text-[11px] sm:text-xs text-white/50 italic">DOULIA analyse votre demande...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Placeholder sur une seule ligne */}
          <div className="p-2.5 sm:p-4 bg-white/5 border-t border-white/5 backdrop-blur-3xl">
            <div className="relative flex items-end gap-2">
              <div className="flex-1 relative group">
                <textarea
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Posez votre question à DOULIA..."
                  rows={1}
                  className="w-full bg-white/5 border border-white/10 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-[12px] sm:text-sm text-white placeholder:text-white/30 placeholder:whitespace-nowrap placeholder:overflow-hidden placeholder:text-ellipsis focus:outline-none focus:border-doulia-lime/50 transition-all resize-none min-h-[40px] max-h-[150px] overflow-y-auto"
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 pb-0.5">
                <button
                  onClick={toggleListening}
                  disabled={isLoading}
                  className={cn(
                    "p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all border border-white/10",
                    isListening 
                      ? "bg-doulia-lime text-doulia-night" 
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  )}
                >
                  <Mic size={18} />
                </button>
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="bg-doulia-lime text-doulia-night p-2.5 sm:p-3 rounded-lg sm:rounded-xl hover:scale-105 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <AnimatePresence>
        {showSolutions && (
          <SolutionsPage 
            onClose={() => setShowSolutions(false)} 
            onSelectSolution={handleSelectSolution}
          />
        )}
        {showContact && (
          <ContactPage 
            onClose={() => setShowContact(false)} 
            lang="fr"
            onNavigate={handleNavigate}
            onOpenExternal={openExternalLink}
          />
        )}
        {showAbout && (
          <AboutFAQPage onClose={() => setShowAbout(false)} />
        )}
        {showTypeform && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-doulia-night/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-doulia-dark w-full max-w-6xl h-full max-h-[850px] rounded-[2rem] sm:rounded-[3rem] overflow-hidden border border-white/10 relative flex flex-col"
            >
              <div className="p-4 sm:p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-doulia-lime/10 rounded-xl text-doulia-lime">
                    <ClipboardList size={24} />
                  </div>
                  <div>
                    <span className="font-display font-bold text-lg sm:text-xl text-white block">Audit Stratégique</span>
                    <span className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-widest font-bold">Analyse de maturité digitale</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowTypeform(false)}
                  className="p-2 sm:p-3 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
                >
                  <X size={32} />
                </button>
              </div>
              <div className="flex-1 relative">
                <Widget 
                  id={typeformId} 
                  style={{ width: '100%', height: '100%' }} 
                  className="my-form" 
                  hidden={{ resume_chat: resumeCode || '' }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
        {externalUrl && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-doulia-night/95 backdrop-blur-xl flex items-center justify-center p-0 sm:p-8"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-doulia-dark w-full h-full sm:max-h-[90vh] sm:rounded-[2rem] overflow-hidden border border-white/10 relative flex flex-col"
            >
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-white/5 rounded-lg text-white/60">
                    <Cpu size={18} />
                  </div>
                  <span className="text-xs font-bold text-white/60 truncate">{externalUrl}</span>
                </div>
                <div className="flex items-center gap-2">
                  <a 
                    href={externalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
                    title="Ouvrir dans un nouvel onglet"
                  >
                    <ArrowRight size={20} />
                  </a>
                  <button 
                    onClick={() => setExternalUrl(null)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-white">
                <iframe 
                  src={externalUrl} 
                  className="w-full h-full border-none"
                  title="External Content"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}