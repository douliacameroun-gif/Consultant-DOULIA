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
  Trash2,
  TrendingUp,
  Volume2,
  VolumeX
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getGeminiResponse, saveAuditToAirtable } from './services/gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import AuditForm, { AuditData } from './components/AuditForm';
import AuditReport from './components/AuditReport';
import SolutionsPage from './components/SolutionsPage';
import ContactPage from './components/ContactPage';
import AboutFAQPage from './components/AboutFAQPage';
import ROISimulator from './components/ROISimulator';

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
      {/* Particles */}
      {[...Array(40)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animationDuration: Math.random() * 15 + 10 + 's',
            animationDelay: Math.random() * 10 + 's',
            opacity: Math.random() * 0.4 + 0.1,
            background: i % 3 === 0 ? '#bef264' : '#ffffff'
          }}
        />
      ))}
      
      {/* Neural Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        {[...Array(12)].map((_, i) => (
          <motion.line
            key={i}
            x1={Math.random() * 100 + "%"}
            y1={Math.random() * 100 + "%"}
            x2={Math.random() * 100 + "%"}
            y2={Math.random() * 100 + "%"}
            stroke="#bef264"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}
      </svg>

      {/* Floating Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-doulia-lime/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-doulia-lime/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
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
  const [showROI, setShowROI] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [submittedAuditData, setSubmittedAuditData] = useState<AuditData | null>(null);
  const [isAuditCompleted, setIsAuditCompleted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('doulia_audit_completed') === 'true';
    }
    return false;
  });

  const speak = (text: string) => {
    if (!isVoiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    const cleanText = text.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1').replace(/[#*`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    const frenchVoice = voices.find(v => v.lang.startsWith('fr') && v.name.includes('Google')) || voices.find(v => v.lang.startsWith('fr'));
    if (frenchVoice) utterance.voice = frenchVoice;
    
    window.speechSynthesis.speak(utterance);
  };
  const [externalUrl, setExternalUrl] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState<string>('');
  const [conversationId, setConversationId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let vid = localStorage.getItem('doulia_visitor_id');
      if (!vid) {
        vid = 'v_' + Math.random().toString(36).substring(2, 11);
        localStorage.setItem('doulia_visitor_id', vid);
      }
      setVisitorId(vid);

      // Unique Conversation ID for the session
      const cid = 'chat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      setConversationId(cid);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'fr-FR';

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setInput(prev => prev + (prev ? ' ' : '') + finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          if (event.error === 'not-allowed') {
            setIsListening(false);
            isListeningRef.current = false;
          }
        };

        recognitionRef.current.onend = () => {
          if (isListeningRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              // Ignore if already started
            }
          }
        };
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isFromAuditUrl = window.location.href.includes('presentationdoulia.vercel.app/#contact');
      if (isFromAuditUrl && messages.length === 1) {
        handleSend("Bonjour, je souhaite passer un audit IA pour mon entreprise.");
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      isListeningRef.current = false;
      setIsListening(false);
      recognitionRef.current?.stop();
    } else {
      isListeningRef.current = true;
      setIsListening(true);
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error('Failed to start recognition', e);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    // Disabled localStorage saving for chat history as per user request (Save to Airtable instead)
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
      // Generate new conversation ID on clear
      const cid = 'chat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      setConversationId(cid);
    }
  };

  const handleSend = async (customMessage?: string, isRetry = false) => {
    const userMessage = customMessage || input.trim();
    if (!userMessage || (isLoading && !isRetry)) return;

    // Stop listening when sending
    if (isListening) {
      isListeningRef.current = false;
      setIsListening(false);
      recognitionRef.current?.stop();
    }

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
      
      const hasPassedAudit = isAuditCompleted || !!submittedAuditData;
      
      const response = await getGeminiResponse(userMessage, history, visitorId, conversationId, hasPassedAudit);
      setMessages(prev => [...prev, { role: 'model', content: response || "Désolé, j'ai rencontré une petite difficulté. Pouvons-nous reprendre ?" }]);
      if (response) speak(response);
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

  const handleAuditSubmit = async (data: AuditData) => {
    setShowTypeform(false);
    setSubmittedAuditData(data);
    setIsAuditCompleted(true);
    localStorage.setItem('doulia_audit_completed', 'true');
    
    const summary = `Merci **${data.name}** ! J'ai bien reçu les informations pour **${data.company}**. 

Voici ce que j'ai retenu :
❶ Ton défi majeur : **${data.challenge === 'service_client' ? 'Gestion des messages clients' : data.challenge === 'admin' ? 'Automatisation administrative' : data.challenge === 'data' ? 'Analyse de données' : 'Besoin de sur-mesure'}**.
❷ Ton problème : "${data.description.substring(0, 80)}..."

Nos experts vont t'appeler sur WhatsApp au **${data.whatsapp}**.

En attendant, souhaite-tu que je t'explique comment nos solutions **DOULIA** peuvent résoudre ce problème spécifique ?`;

    setMessages(prev => [...prev, { role: 'model', content: summary }]);

    // Save to Airtable
    await saveAuditToAirtable(data, visitorId);
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
                onClick={() => setShowROI(true)}
                className="hidden sm:block text-[11px] font-bold text-doulia-lime border border-doulia-lime/20 px-3 py-2 rounded-lg hover:bg-doulia-lime/10 transition-all"
              >
                Simulateur ROI
              </button>
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

              <button 
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                title={isVoiceEnabled ? "Désactiver la voix" : "Activer la voix (TTS)"}
                className={cn(
                    "hidden sm:flex p-2 rounded-lg transition-all border border-white/5",
                    isVoiceEnabled ? "bg-doulia-lime/20 text-doulia-lime border-doulia-lime/30 shadow-[0_0_10px_rgba(190,242,100,0.2)]" : "text-white/30 hover:text-white"
                )}
              >
                {isVoiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              
              {/* Bouton Audit mis en perspective (Call to Action) */}
              <button 
                onClick={() => openAudit()}
                className="btn-modern-primary animate-[pulse_4s_ease-in-out_infinite]"
              >
                <Activity size={14} className="animate-bounce" />
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
                    onClick={() => { setShowROI(true); setIsMenuOpen(false); }}
                    className="w-full text-left p-4 text-base font-bold text-doulia-lime bg-doulia-lime/5 border border-doulia-lime/20 rounded-xl transition-all flex items-center gap-4 group"
                  >
                    <div className="p-2 bg-doulia-lime/20 rounded-lg text-doulia-lime">
                      <TrendingUp size={20} />
                    </div>
                    <span className="flex-1">Simulateur de Gains</span>
                    <ArrowRight size={18} className="text-doulia-lime opacity-0 group-hover:opacity-100 transition-all" />
                  </button>

                  <button 
                    onClick={() => { setShowSolutions(true); setIsMenuOpen(false); }}
                    className="w-full text-left p-4 text-base font-bold text-white hover:text-doulia-lime bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center gap-4 group"
                  >
                    <div className="p-2 bg-doulia-lime/10 rounded-lg text-doulia-lime">
                      <Layers size={20} />
                    </div>
                    <span className="flex-1">Nos Solutions</span>
                    <ArrowRight size={18} className="text-doulia-lime opacity-0 group-hover:opacity-100 transition-all" />
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
                  "p-4 sm:p-6 rounded-[1.5rem] text-[15px] sm:text-[17px] leading-relaxed shadow-xl transition-all duration-300",
                  msg.role === 'user' 
                    ? "bg-doulia-lime/10 text-white rounded-tr-none border border-doulia-lime/20" 
                    : "bg-white/[0.03] text-[#f3f4f6] border border-white/5 rounded-tl-none backdrop-blur-md"
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
                          return <p className="text-[#f3f4f6]">{processBubbles(children)}</p>;
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
                          return <li className="text-[#f3f4f6]">{processBubbles(children)}</li>;
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
                    "p-3 sm:p-3.5 rounded-xl transition-all border border-white/10",
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
                  className="bg-doulia-lime text-doulia-night p-3 sm:p-3.5 rounded-xl hover:scale-105 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 shadow-lg shadow-doulia-lime/20"
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
        {showROI && (
          <ROISimulator onClose={() => setShowROI(false)} onOpenAudit={() => openAudit()} />
        )}
        {submittedAuditData && (
          <AuditReport 
            data={submittedAuditData} 
            onClose={() => setSubmittedAuditData(null)} 
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
              className="bg-doulia-dark w-full max-w-4xl h-full max-h-[800px] rounded-[2rem] sm:rounded-[3rem] overflow-hidden border border-white/10 relative flex flex-col shadow-2xl"
            >
              <div className="absolute top-6 right-6 z-50">
                <button 
                  onClick={() => setShowTypeform(false)}
                  className="p-2 sm:p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>
              
              <AuditForm 
                onClose={() => setShowTypeform(false)} 
                onSubmit={handleAuditSubmit}
              />
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