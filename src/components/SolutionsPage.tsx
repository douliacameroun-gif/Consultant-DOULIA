import React from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  ChevronRight,
  Users,
  Search,
  Cpu,
  Zap,
  Target,
  Clock,
  Shield
} from 'lucide-react';
import WhatsAppDemo from './WhatsAppDemo';

interface SolutionsPageProps {
  onClose: () => void;
  onSelectSolution: (solutionName: string) => void;
}

const SolutionsPage: React.FC<SolutionsPageProps> = ({ onClose, onSelectSolution }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-doulia-night flex flex-col overflow-hidden"
    >
      {/* Neural Background Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-mesh"></div>
        <div className="absolute inset-0 grid-pattern opacity-40"></div>
        <div className="scanline"></div>
        
        {/* Animated Neural Labyrinth */}
        <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bef264" stopOpacity="0" />
              <stop offset="50%" stopColor="#bef264" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#bef264" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[...Array(8)].map((_, i) => (
            <motion.path
              key={i}
              d={`M ${Math.random() * 1000} ${-100} L ${Math.random() * 1000} ${1200}`}
              stroke="url(#neuralGradient)"
              strokeWidth="0.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 0],
                opacity: [0, 0.8, 0],
                x: [0, Math.random() * 100 - 50, 0]
              }}
              transition={{ 
                duration: 15 + i * 3, 
                repeat: Infinity, 
                ease: "linear",
                delay: i * 2
              }}
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <motion.path
              key={`h-${i}`}
              d={`M ${-100} ${Math.random() * 1000} L ${1200} ${Math.random() * 1000}`}
              stroke="url(#neuralGradient)"
              strokeWidth="0.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 0],
                opacity: [0, 0.8, 0],
                y: [0, Math.random() * 100 - 50, 0]
              }}
              transition={{ 
                duration: 15 + i * 3, 
                repeat: Infinity, 
                ease: "linear",
                delay: i * 2 + 1
              }}
            />
          ))}
        </svg>

        {/* Data Streams */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-doulia-lime to-transparent h-48"
              style={{
                left: `${15 + i * 18}%`,
                top: '-20%'
              }}
              animate={{
                top: ['-20%', '120%'],
                opacity: [0, 0.4, 0]
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                ease: "linear",
                delay: i * 1.5
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[400px] h-[400px] bg-doulia-gold/5 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-doulia-lime/5 rounded-full blur-[100px] pointer-events-none animate-pulse delay-1000"></div>

      {/* Close Button */}
      <button 
        onClick={onClose}
        className="fixed top-2.5 right-2.5 sm:top-6 sm:right-6 z-[110] p-1.5 sm:p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white border border-white/10 backdrop-blur-md"
      >
        <X size={18} className="sm:hidden" />
        <X size={24} className="hidden sm:block" />
      </button>

      <div className="flex-1 overflow-y-auto">
        {/* Packs Solutions */}
        <section className="py-6 sm:py-16 px-4 bg-white/[0.02] mt-12 sm:mt-16">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-16">
              <h2 className="text-xl sm:text-4xl font-display font-bold mb-2 sm:mb-3">Nos Packs <span className="text-gradient">Solutions</span></h2>
              <p className="text-doulia-lime/50 uppercase tracking-[0.2em] sm:tracking-[0.4em] font-bold text-[8px] sm:text-xs">L'EXCELLENCE OPÉRATIONNELLE</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Pack 1 */}
              <motion.article 
                whileHover={{ y: -5 }}
                className="glass-panel rounded-xl sm:rounded-2xl overflow-hidden group border-white/5 hover:border-doulia-lime/50 transition-all duration-300 flex flex-col"
              >
                <div className="h-32 sm:h-44 overflow-hidden relative">
                  <img 
                    src="https://i.postimg.cc/kX1fmzXD/Doulia_Connect.jpg" 
                    alt="Doulia Connect" 
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-doulia-night via-doulia-night/50 to-transparent opacity-80 transition-opacity duration-500"></div>
                </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col relative z-10">
                  <h3 className="text-lg sm:text-xl font-display font-bold text-doulia-lime mb-0.5 sm:mb-1">1. DOULIA Connect</h3>
                  <p className="text-white/60 italic mb-2 sm:mb-3 text-[10px] sm:text-xs">Le service client qui ne dort jamais.</p>
                  <ul className="space-y-2 sm:space-y-2.5 mb-4 sm:mb-5">
                    {[
                      { label: "Automatisation 24/7", desc: "Assistants WhatsApp." },
                      { label: "Lead Scoring", desc: "Qualification automatique." },
                      { label: "Multilingue", desc: "Français, Anglais." }
                    ].map((item, i) => (
                      <li key={i} className="flex gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                        <ChevronRight size={12} className="text-doulia-lime shrink-0" />
                        <p><span className="font-bold text-white">{item.label} :</span> <span className="text-white/70">{item.desc}</span></p>
                      </li>
                    ))}
                  </ul>
                <button 
                  onClick={() => onSelectSolution("DOULIA Connect")}
                  className="mt-auto w-full py-2 bg-doulia-lime/10 hover:bg-doulia-lime text-doulia-lime hover:text-doulia-night rounded-lg font-bold text-[10px] transition-all border border-doulia-lime/20 flex items-center justify-center gap-1 group/btn"
                >
                  Détails
                  <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.article>

            {/* Pack 2 */}
            <motion.article 
              whileHover={{ y: -5 }}
              className="glass-panel rounded-xl sm:rounded-2xl overflow-hidden group border-white/5 hover:border-doulia-lime/50 transition-all duration-300 flex flex-col"
            >
              <div className="h-32 sm:h-44 overflow-hidden relative">
                <img 
                  src="https://i.postimg.cc/YqsfVFbS/Doulia_Process.jpg" 
                  alt="Doulia Process" 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-doulia-night via-doulia-night/50 to-transparent opacity-80 transition-opacity duration-500"></div>
              </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col relative z-10">
                  <h3 className="text-lg sm:text-xl font-display font-bold text-doulia-lime mb-0.5 sm:mb-1">2. DOULIA Process</h3>
                  <p className="text-white/60 italic mb-2 sm:mb-3 text-[10px] sm:text-xs">L'automatisation de la routine.</p>
                  <ul className="space-y-2 sm:space-y-2.5 mb-4 sm:mb-5">
                    {[
                      { label: "Audit Processus", desc: "Identifier les freins." },
                      { label: "Agents IA", desc: "Suppression saisies." },
                      { label: "Rapports Auto", desc: "Génération instantanée." }
                    ].map((item, i) => (
                      <li key={i} className="flex gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                        <ChevronRight size={12} className="text-doulia-lime shrink-0" />
                        <p><span className="font-bold text-white">{item.label} :</span> <span className="text-white/70">{item.desc}</span></p>
                      </li>
                    ))}
                  </ul>
                <button 
                  onClick={() => onSelectSolution("DOULIA Process")}
                  className="mt-auto w-full py-2 bg-doulia-lime/10 hover:bg-doulia-lime text-doulia-lime hover:text-doulia-night rounded-lg font-bold text-[10px] transition-all border border-doulia-lime/20 flex items-center justify-center gap-1 group/btn"
                >
                  Détails
                  <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.article>

            {/* Pack 3 */}
            <motion.article 
              whileHover={{ y: -5 }}
              className="glass-panel rounded-xl sm:rounded-2xl overflow-hidden group border-white/5 hover:border-doulia-lime/50 transition-all duration-300 flex flex-col"
            >
              <div className="h-32 sm:h-44 overflow-hidden relative">
                <img 
                  src="https://i.postimg.cc/Wz96sqVK/Doulia_Insight.jpg" 
                  alt="Doulia Insight" 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-doulia-night via-doulia-night/50 to-transparent opacity-80 transition-opacity duration-500"></div>
              </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col relative z-10">
                  <h3 className="text-lg sm:text-xl font-display font-bold text-doulia-lime mb-0.5 sm:mb-1">3. DOULIA Insight</h3>
                  <p className="text-white/60 italic mb-2 sm:mb-3 text-[10px] sm:text-xs">Décisions basées sur la donnée.</p>
                  <ul className="space-y-2 sm:space-y-2.5 mb-4 sm:mb-5">
                    {[
                      { label: "Data Mining", desc: "Valeur des fichiers Excel." },
                      { label: "Algorithmes", desc: "Anticiper la demande." },
                      { label: "KPI Live", desc: "Pilotage temps réel." }
                    ].map((item, i) => (
                      <li key={i} className="flex gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
                        <ChevronRight size={12} className="text-doulia-lime shrink-0" />
                        <p><span className="font-bold text-white">{item.label} :</span> <span className="text-white/70">{item.desc}</span></p>
                      </li>
                    ))}
                  </ul>
                <button 
                  onClick={() => onSelectSolution("DOULIA Insight")}
                  className="mt-auto w-full py-2 bg-doulia-lime/10 hover:bg-doulia-lime text-doulia-lime hover:text-doulia-night rounded-lg font-bold text-[10px] transition-all border border-doulia-lime/20 flex items-center justify-center gap-1 group/btn"
                >
                  Détails
                  <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.article>
          </div>

          {/* Doulia Mirror Section */}
          <div className="mt-16 sm:mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <WhatsAppDemo />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 space-y-6"
            >
              <div className="inline-block p-1 px-3 bg-doulia-lime/20 rounded-full border border-doulia-lime/30">
                 <p className="text-[10px] font-bold text-doulia-lime uppercase tracking-widest">En direct de Douala</p>
              </div>
              <h3 className="text-2xl sm:text-4xl font-display font-bold leading-tight">
                <span className="text-gradient">DOULIA Mirror</span> : <br />
                Le Miroir de votre Clientèle
              </h3>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed">
                Regardez comme il est simple de transformer chaque message WhatsApp en opportunité de vente. 
                Nos agents IA comprennent les besoins, vérifient vos stocks ou votre agenda, et valident les commandes 
                en quelques secondes. __Même à 3h du matin.__
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="text-doulia-lime font-bold text-lg mb-1">0s</h4>
                  <p className="text-[10px] text-white/40 uppercase">Temps de réponse</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="text-doulia-lime font-bold text-lg mb-1">100%</h4>
                  <p className="text-[10px] text-white/40 uppercase">Disponibilité</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Sur-Mesure */}
      <section className="py-12 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel p-5 sm:p-10 rounded-2xl sm:rounded-3xl flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="w-full">
              <h2 className="text-lg sm:text-3xl font-display font-bold text-doulia-lime mb-2 sm:mb-3 uppercase">Services Sur-Mesure</h2>
              <p className="text-white/60 mb-6 sm:mb-10 text-xs sm:text-sm">Nous construisons votre futur écosystème IA.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 text-left">
                <div className="flex flex-col">
                  <h4 className="text-base sm:text-lg font-bold mb-1 flex items-center gap-2">
                    <Search className="text-doulia-lime" size={16} />
                    Audits IA
                  </h4>
                  <p className="text-[10px] sm:text-xs text-white/40 leading-relaxed mb-3 sm:mb-4">Immersion totale pour votre feuille de route.</p>
                  <button 
                    onClick={() => onSelectSolution("Audit IA Stratégique")}
                    className="mt-auto text-[9px] sm:text-[10px] font-bold text-doulia-lime border border-doulia-lime/30 px-3 py-1.5 rounded-lg hover:bg-doulia-lime hover:text-doulia-night transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    Réserver
                    <ChevronRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-base sm:text-lg font-bold mb-1 flex items-center gap-2">
                    <Users className="text-doulia-lime" size={16} />
                    Formations
                  </h4>
                  <p className="text-[10px] sm:text-xs text-white/40 leading-relaxed mb-3 sm:mb-4">Acculturation et montée en compétences sur l'IA.</p>
                  <button 
                    onClick={() => onSelectSolution("Formation IA sur-mesure")}
                    className="mt-auto text-[9px] sm:text-[10px] font-bold text-doulia-lime border border-doulia-lime/30 px-3 py-1.5 rounded-lg hover:bg-doulia-lime hover:text-doulia-night transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    Réserver
                    <ChevronRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-base sm:text-lg font-bold mb-1 flex items-center gap-2">
                    <Cpu className="text-doulia-lime" size={16} />
                    Développement
                  </h4>
                  <p className="text-[10px] sm:text-xs text-white/40 leading-relaxed mb-3 sm:mb-4">Applications mobiles et logiciels nativement avec IA.</p>
                  <button 
                    onClick={() => onSelectSolution("Développement IA & Logiciel")}
                    className="mt-auto text-[9px] sm:text-[10px] font-bold text-doulia-lime border border-doulia-lime/30 px-3 py-1.5 rounded-lg hover:bg-doulia-lime hover:text-doulia-night transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    Réserver
                    <ChevronRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </motion.div>
  );
};

export default SolutionsPage;