import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic,
  Send, 
  Bot, 
  User, 
  MessageSquare, 
  Sparkles, 
  ArrowRight, 
  Phone, 
  Mail, 
  Globe,
  CheckCircle2,
  Menu,
  X,
  Zap,
  Shield,
  BarChart3,
  ClipboardList,
  Cpu,
  Activity,
  Layers
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getGeminiResponse } from './services/gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Widget } from '@typeform/embed-react';
import SolutionsPage from './components/SolutionsPage';
import ContactPage from './components/ContactPage';

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

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Bienvenue dans l'univers __DOULIA__. Je suis votre Expert Consultant Digital. \n\n❶ Prêt à propulser votre business au Cameroun vers le futur ? \n\n❷ Parlez-moi de vos ambitions ou de vos défis actuels."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTypeform, setShowTypeform] = useState(false);
  const [resumeCode, setResumeCode] = useState<string | null>(null);
  const [showSolutions, setShowSolutions] = useState(false);
  const [showContact, setShowContact] = useState(false);
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
  }, [messages]);

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
      // Construct history from current messages (excluding the one we just added if it's not a retry)
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
      
      let errorMessage = "Une erreur est survenue. Vérifiez votre connexion ou réessayez plus tard. On est ensemble !";
      
      // If the error has a specific message we want to show
      if (err.message && (
        err.message.includes("Clé API") || 
        err.message.includes("région") || 
        err.message.includes("invalide")
      )) {
        errorMessage = `__Oups !__ ${err.message}`;
      }
      
      setMessages(prev => [...prev, { role: 'model', content: errorMessage }]);
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

  return (
    <div className="min-h-screen bg-doulia-night text-white flex flex-col font-sans relative bg-mesh overflow-x-hidden">
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-40 z-0" />
      <div className="scanline" />
      <ParticleBackground />
      
      {/* Chat Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-0 sm:p-4 lg:p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col h-[calc(100vh-2rem)] glass-panel sm:rounded-[2.5rem] overflow-hidden relative glow-neon"
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-2xl sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden">
                  <img 
                    src="https://i.postimg.cc/Z5cbrHQb/LOGO_DOULIA.png" 
                    alt="DOULIA" 
                    className="w-10 h-10 object-contain filter drop-shadow-[0_0_8px_rgba(190,242,100,0.5)]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-doulia-lime border-2 border-doulia-night rounded-full shadow-[0_0_10px_#bef264]"></div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-lg text-white tracking-tight">DOULIA</span>
                  <span className="text-[10px] text-doulia-lime font-bold uppercase tracking-widest bg-doulia-lime/10 px-2 py-0.5 rounded-md">IA Expert</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-doulia-lime rounded-full animate-pulse"></div>
                  <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Système Actif • Douala</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={() => setShowSolutions(true)}
                className="hidden sm:block text-[11px] font-bold text-white/60 hover:text-doulia-lime transition-all px-3 py-2 rounded-lg hover:bg-white/5"
              >
                Solutions
              </button>
              <button 
                onClick={() => setShowContact(true)}
                className="hidden sm:block text-[11px] font-bold text-white/60 hover:text-doulia-lime transition-all px-3 py-2 rounded-lg hover:bg-white/5"
              >
                Contact
              </button>
              <button 
                onClick={() => openAudit()}
                className="flex text-[11px] font-bold text-doulia-night bg-gradient-to-r from-doulia-lime to-doulia-accent-blue px-4 py-2 rounded-xl hover:scale-105 transition-all shadow-[0_0_15px_rgba(190,242,100,0.3)] items-center gap-2 active:scale-95"
              >
                <Activity size={14} />
                <span className="hidden xs:inline">Audit IA</span>
                <span className="xs:hidden">Audit</span>
              </button>
              
              {/* Mobile Menu Toggle (if needed for very small screens) */}
              <button className="sm:hidden p-2 text-white/60" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Navigation Overlay */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="sm:hidden absolute top-20 left-4 right-4 z-50 glass-panel p-4 rounded-2xl border border-white/10 shadow-2xl"
              >
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => { setShowSolutions(true); setIsMenuOpen(false); }}
                    className="w-full text-left p-3 text-sm font-bold text-white/70 hover:text-doulia-lime hover:bg-white/5 rounded-xl transition-all"
                  >
                    Nos Solutions
                  </button>
                  <button 
                    onClick={() => { setShowContact(true); setIsMenuOpen(false); }}
                    className="w-full text-left p-3 text-sm font-bold text-white/70 hover:text-doulia-lime hover:bg-white/5 rounded-xl transition-all"
                  >
                    Contact
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 scrollbar-hide">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4 max-w-[90%] sm:max-w-[80%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border overflow-hidden",
                  msg.role === 'user' 
                    ? "bg-white/5 border-white/10 text-white/70" 
                    : "bg-white border-none"
                )}>
                  {msg.role === 'user' ? <User size={20} /> : (
                    <img 
                      src="https://i.postimg.cc/Y0nJdHW3/DOULIA_LOGO.jpg" 
                      alt="DOULIA" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <div className={cn(
                  "p-5 rounded-[1.5rem] text-base leading-relaxed shadow-2xl transition-all duration-300",
                  msg.role === 'user' 
                    ? "bg-white/10 text-white rounded-tr-none border border-white/10" 
                    : "bg-white/[0.03] text-white/90 border border-white/5 rounded-tl-none backdrop-blur-md hover:bg-white/[0.05]"
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
                                    <span key={i} className="text-doulia-lime font-bold inline-flex items-center justify-center mx-1 transform scale-125">
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
                                    <span key={i} className="text-doulia-lime font-bold inline-flex items-center justify-center mx-1 transform scale-125">
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
                              // Extract resume_chat from hash or query
                              const url = new URL(href || '');
                              const code = url.hash.split('resume_chat=')[1] || url.searchParams.get('resume_chat');
                              openAudit(code);
                            }
                          };

                          return (
                            <a 
                              href={href} 
                              target={isTypeform ? undefined : "_blank"} 
                              rel="noopener noreferrer"
                              onClick={handleClick}
                              className={cn(
                                "inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-sm transition-all my-3 group/link no-underline shadow-lg",
                                isWhatsApp 
                                  ? "bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-[#25D366]/20" 
                                  : isTypeform
                                    ? "bg-doulia-lime hover:bg-doulia-lime/80 text-doulia-night shadow-doulia-lime/20"
                                    : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                              )}
                            >
                              {isWhatsApp && <Phone size={16} />}
                              {isTypeform && <Activity size={16} />}
                              {children}
                              <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
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
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="flex gap-4 mr-auto"
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  <div className="absolute inset-0 bg-doulia-lime/20 animate-pulse" />
                  <img 
                    src="https://i.postimg.cc/Y0nJdHW3/DOULIA_LOGO.jpg" 
                    alt="DOULIA" 
                    className="w-full h-full object-cover relative z-10"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="bg-white/5 border border-white/10 p-5 rounded-[1.5rem] rounded-tl-none shadow-2xl backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute inset-0 shimmer opacity-30" />
                  <div className="flex flex-col gap-2 relative z-10">
                    <div className="flex items-center gap-2">
                      <Cpu size={12} className="text-doulia-lime animate-spin-slow" />
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-doulia-lime animate-pulse">
                        DOULIA analyse votre demande...
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ 
                            scale: [1, 1.4, 1], 
                            opacity: [0.3, 1, 0.3],
                            backgroundColor: i === 1 ? ["#bef264", "#a3ff33", "#bef264"] : "#bef264"
                          }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                          className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(190,242,100,0.5)]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
            
            {error && !isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center p-4"
              >
                <button 
                  onClick={() => handleSend(error, true)}
                  className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg"
                >
                  <Zap size={16} />
                  Réessayer la demande
                </button>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/5 border-t border-white/5 backdrop-blur-3xl">
            <div className="relative flex items-end gap-2">
              <div className="flex-1 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-doulia-lime/20 to-doulia-accent-blue/20 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                <textarea
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                    }
                  }}
                  placeholder="Posez votre question à DOULIA..."
                  rows={1}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-doulia-lime/50 transition-all relative z-10 resize-none min-h-[44px] max-h-[200px] overflow-y-auto"
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center gap-2 pb-0.5">
                <button
                  onClick={toggleListening}
                  disabled={isLoading}
                  className={cn(
                    "p-3 rounded-xl transition-all relative z-10 border border-white/10",
                    isListening 
                      ? "bg-doulia-lime text-doulia-night shadow-[0_0_20px_rgba(190,242,100,0.4)]" 
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  )}
                >
                  <Mic size={20} className={cn(isListening && "animate-pulse")} />
                </button>
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-doulia-lime to-doulia-accent-blue text-white p-3 rounded-xl hover:scale-105 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(190,242,100,0.4)] active:scale-95 relative z-10"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Shield size={8} /> Sécurisé par DOULIA
              </p>
              <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Cpu size={8} /> Moteur Gemini 3.1 Pro
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Typeform Overlay */}
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
          />
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
              className="bg-doulia-dark w-full max-w-6xl h-full max-h-[850px] rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(190,242,100,0.1)] border border-white/10 relative flex flex-col gemini-border-glow"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-doulia-lime/10 rounded-xl text-doulia-lime">
                    <ClipboardList size={24} />
                  </div>
                  <div>
                    <span className="font-display font-bold text-xl text-white block">Audit Stratégique</span>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Analyse de maturité digitale</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowTypeform(false)}
                  className="p-3 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
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
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-white/5 border-t border-white/5 py-3 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 opacity-80">
            <img 
              src="https://i.postimg.cc/Z5cbrHQb/LOGO_DOULIA.png" 
              alt="DOULIA" 
              className="w-8 h-8 object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="font-display font-bold tracking-tighter text-lg">DOULIA</span>
          </div>
          <p className="text-[9px] text-white/30 font-medium tracking-widest uppercase text-center">
            © 2026 DOULIA TECHNOLOGY • DOUALA • CAMEROUN • <span className="text-doulia-lime">DOULIA</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
