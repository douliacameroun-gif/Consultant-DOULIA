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
  const [isListening, setIsListening] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTypeform, setShowTypeform] = useState(false);
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

  const handleSend = async (customMessage?: string) => {
    const userMessage = customMessage || input.trim();
    if (!userMessage || isLoading) return;

    if (!customMessage) setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));
      
      const response = await getGeminiResponse(userMessage, history);
      setMessages(prev => [...prev, { role: 'model', content: response || "Désolé, j'ai rencontré une petite difficulté. Pouvons-nous reprendre ?" }]);
    } catch (error) {
      console.error(error);
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
      setShowTypeform(true);
    }
  };

  return (
    <div className="min-h-screen bg-doulia-night text-white flex flex-col font-sans relative bg-mesh overflow-x-hidden">
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-40 z-0" />
      <div className="scanline" />
      <ParticleBackground />
      
      {/* Navigation */}
      <nav className="glass-panel sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-20 h-20 flex items-center justify-center"
              >
                <img 
                  src="https://i.postimg.cc/Z5cbrHQb/LOGO_DOULIA.png" 
                  alt="DOULIA Logo" 
                  className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(0,242,234,0.7)]"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-2xl font-display font-bold tracking-tighter ai-gradient-text">
                  DOULIA
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-doulia-lime font-bold">Consultant Digital</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => setShowSolutions(true)}
                className="text-sm font-medium text-white/70 hover:text-doulia-turquoise transition-colors"
              >
                Solutions
              </button>
              <button 
                onClick={() => setShowContact(true)}
                className="text-sm font-medium text-white/70 hover:text-doulia-turquoise transition-colors"
              >
                Contact
              </button>
              <button 
                onClick={() => setShowTypeform(true)}
                className="bg-gradient-to-r from-doulia-turquoise to-doulia-lime text-doulia-night px-6 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,242,234,0.3)] active:scale-95 flex items-center gap-2"
              >
                <Activity size={16} />
                Audit IA
              </button>
            </div>

            <button className="md:hidden p-2 text-white/70" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass-panel p-6 absolute top-20 w-full z-40 shadow-2xl border-b border-white/10"
          >
            <div className="flex flex-col gap-6">
              <button 
                onClick={() => { setShowSolutions(true); setIsMenuOpen(false); }}
                className="text-xl font-medium text-white text-left"
              >
                Nos Solutions
              </button>
              <button 
                onClick={() => { setShowContact(true); setIsMenuOpen(false); }}
                className="text-xl font-medium text-white text-left"
              >
                Contact
              </button>
              <button 
                onClick={() => { setShowTypeform(true); setIsMenuOpen(false); }}
                className="bg-gradient-to-r from-doulia-turquoise to-doulia-lime text-doulia-night px-5 py-4 rounded-2xl text-center font-bold flex items-center justify-center gap-2"
              >
                <ClipboardList size={20} />
                Démarrer l'Audit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 p-0 sm:p-4 lg:p-8 relative z-10">
        
        {/* Left Sidebar */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-8 rounded-[2rem] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Layers size={80} className="text-doulia-turquoise" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2 ai-gradient-text">
              <Zap size={24} className="text-doulia-turquoise glow-pulse-turquoise" />
              L'Écosystème DOULIA
            </h2>
            <ul className="space-y-8">
              {[
                { 
                  title: "DOULIA Connect", 
                  desc: "Intelligence conversationnelle WhatsApp & Web.", 
                  icon: Phone, 
                  color: "text-doulia-turquoise",
                  solutions: ["Chatbot Omnicanal 24h/7", "Qualification & Scoring Prédictif", "Booking & Prise de RDV Autonome", "Fidélisation Émotionnelle", "Relance Mobile Money Intelligente", "Analyse de Sentiment Client", "Support Multilingue"]
                },
                { 
                  title: "DOULIA Process", 
                  desc: "Automatisation des flux opérationnels.", 
                  icon: Shield, 
                  color: "text-doulia-lime",
                  solutions: ["Conception d'Agents IA sur-Mesure", "ERP & CRM assistés par IA", "Automatisation Workflow RH & Admin", "Audit de processus algorithmique", "Automatisation Facturation OHADA", "Gestion Prédictive des stocks", "Contrôle Qualité IA Optique"]
                },
                { 
                  title: "DOULIA Insight", 
                  desc: "Analytique prédictive & Big Data.", 
                  icon: BarChart3, 
                  color: "text-white",
                  solutions: ["Tableaux de bord temps réel", "Prévision de la demande", "Segmentation client IA", "Analyse de Churn", "Optimisation des prix", "Détection de fraude", "Rapports automatisés"]
                },
              ].map((item, i) => (
                <li key={i} className="flex flex-col gap-3 group/item">
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex gap-4"
                  >
                    <div className={cn(
                      "mt-1 p-2 bg-white/5 rounded-xl transition-all group-hover/item:bg-white/10 group-hover/item:scale-110", 
                      item.color,
                      i === 0 ? "glow-pulse-turquoise" : i === 1 ? "glow-pulse-lime" : ""
                    )}>
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-base text-white group-hover/item:text-doulia-turquoise transition-colors">{item.title}</p>
                      <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                  
                  {/* Scrolling Solutions */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + (0.1 * i) }}
                    className="relative h-6 overflow-hidden bg-white/5 rounded-full border border-white/5 group-hover/item:border-white/20 transition-all"
                  >
                    <div className="animate-marquee whitespace-nowrap flex items-center gap-4 px-4">
                      {[...item.solutions, ...item.solutions].map((sol, idx) => (
                        <span key={idx} className="text-[10px] uppercase tracking-wider font-bold text-white/40 flex items-center gap-2">
                          <span className={cn("w-1.5 h-1.5 rounded-full", idx % 2 === 0 ? "bg-doulia-turquoise" : "bg-doulia-lime")} />
                          {sol}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </li>
              ))}
            </ul>
            
            <button 
              onClick={() => setShowTypeform(true)}
              className="mt-8 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all group"
            >
              <ClipboardList size={18} className="text-doulia-turquoise group-hover:scale-110 transition-transform" />
              Lancer l'Audit Digital
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-doulia-blue/40 to-doulia-night p-8 rounded-[2rem] border border-white/5 text-white relative overflow-hidden shadow-2xl shadow-doulia-blue/20"
          >
            <div className="relative z-10">
              <h3 className="font-display font-bold text-xl mb-3">Expertise Locale</h3>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">Nos ingénieurs à Douala déploient des solutions IA adaptées aux réalités du Cameroun.</p>
              <div className="space-y-3">
                <a href="mailto:contact@doulia.cm" className="flex items-center gap-3 text-sm text-doulia-turquoise hover:text-doulia-lime transition-colors">
                  <div className="p-2 bg-white/5 rounded-lg"><Mail size={16} /></div> contact@doulia.cm
                </a>
                <a href="https://www.doulia.cm" className="flex items-center gap-3 text-sm text-doulia-turquoise hover:text-doulia-lime transition-colors">
                  <div className="p-2 bg-white/5 rounded-lg"><Globe size={16} /></div> www.doulia.cm
                </a>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-5">
              <Sparkles size={160} />
            </div>
          </motion.div>
        </div>

        {/* Chat Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-8 flex flex-col h-[calc(100vh-5rem)] sm:h-[calc(100vh-12rem)] glass-panel sm:rounded-[2.5rem] overflow-hidden relative"
        >
          {/* Chat Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-2xl sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden">
                  <img 
                    src="https://i.postimg.cc/Z5cbrHQb/LOGO_DOULIA.png" 
                    alt="DOULIA" 
                    className="w-12 h-12 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-doulia-lime border-2 border-doulia-night rounded-full shadow-[0_0_10px_#a3ff33]"></div>
              </div>
              <div>
                <p className="font-bold text-lg text-white tracking-tight">Expert DOULIA</p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-doulia-lime rounded-full animate-pulse"></div>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Système Actif • Douala</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowTypeform(true)}
              className="hidden sm:flex text-xs font-bold text-doulia-turquoise bg-doulia-turquoise/10 px-4 py-2 rounded-xl hover:bg-doulia-turquoise/20 transition-all border border-doulia-turquoise/20 items-center gap-2"
            >
              <Activity size={14} />
              Diagnostic IA
            </button>
          </div>

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
                  "p-5 rounded-[1.5rem] text-base leading-relaxed shadow-2xl",
                  msg.role === 'user' 
                    ? "bg-white/10 text-white rounded-tr-none border border-white/10" 
                    : "bg-white/5 text-white/90 border border-white/10 rounded-tl-none backdrop-blur-md"
                )}>
                  <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-strong:text-doulia-lime prose-strong:font-black prose-a:text-doulia-lime">
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
                  <div className="absolute inset-0 bg-doulia-turquoise/20 animate-pulse" />
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
                      <Cpu size={12} className="text-doulia-turquoise animate-spin-slow" />
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-doulia-turquoise animate-pulse">
                        DOULIA Insight en cours...
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ 
                            scale: [1, 1.4, 1], 
                            opacity: [0.3, 1, 0.3],
                            backgroundColor: i === 1 ? ["#00f2ea", "#a3ff33", "#00f2ea"] : "#00f2ea"
                          }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                          className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,242,234,0.5)]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white/5 border-t border-white/5 backdrop-blur-3xl">
            <div className="relative flex items-center gap-3">
              <div className="flex-1 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-doulia-turquoise/20 to-doulia-lime/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Posez votre question à DOULIA..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-base text-white placeholder:text-white/20 focus:outline-none focus:border-doulia-turquoise/50 transition-all relative z-10"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={toggleListening}
                disabled={isLoading}
                className={cn(
                  "p-5 rounded-2xl transition-all relative z-10 border border-white/10",
                  isListening 
                    ? "bg-doulia-lime text-doulia-night shadow-[0_0_20px_rgba(163,255,51,0.4)]" 
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                )}
              >
                <Mic size={24} className={cn(isListening && "animate-pulse")} />
              </button>
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-doulia-turquoise to-doulia-lime text-doulia-night p-5 rounded-2xl hover:scale-105 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,242,234,0.4)] active:scale-95 relative z-10"
              >
                <Send size={24} />
              </button>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest flex items-center gap-2">
                <Shield size={10} /> Sécurisé par DOULIA
              </p>
              <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest flex items-center gap-2">
                <Cpu size={10} /> Moteur Gemini 3.1 Pro
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
              className="bg-doulia-dark w-full max-w-6xl h-full max-h-[850px] rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(0,242,234,0.1)] border border-white/10 relative flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-doulia-turquoise/10 rounded-xl text-doulia-turquoise">
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
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-white/5 border-t border-white/5 py-12 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 opacity-80">
            <img 
              src="https://i.postimg.cc/Z5cbrHQb/LOGO_DOULIA.png" 
              alt="DOULIA" 
              className="w-16 h-16 object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="font-display font-bold tracking-tighter text-2xl">DOULIA</span>
          </div>
          <p className="text-xs text-white/30 font-medium tracking-widest uppercase text-center">
            © 2026 DOULIA TECHNOLOGY • DOUALA • CAMEROUN • <span className="text-doulia-lime">DOULIA LOVE</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
