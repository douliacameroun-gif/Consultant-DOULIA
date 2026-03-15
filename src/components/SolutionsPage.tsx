import React from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  ChevronRight,
  Users,
  Search,
  Cpu
} from 'lucide-react';

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
      </div>

      {/* Floating Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[400px] h-[400px] bg-doulia-gold/5 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-doulia-lime/5 rounded-full blur-[100px] pointer-events-none animate-pulse delay-1000"></div>

      {/* Close Button */}
      <button 
        onClick={onClose}
        className="fixed top-3 right-3 sm:top-8 sm:right-8 z-[110] p-2 sm:p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white border border-white/10 backdrop-blur-md"
      >
        <X size={20} className="sm:hidden" />
        <X size={32} className="hidden sm:block" />
      </button>

      <div className="flex-1 overflow-y-auto">
        {/* Packs Solutions */}
        <section className="py-8 sm:py-24 px-4 bg-white/[0.02] mt-14 sm:mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-20">
            <h2 className="text-2xl sm:text-6xl font-display font-bold mb-2 sm:mb-4">Nos Packs <span className="text-gradient">Solutions</span></h2>
            <p className="text-doulia-lime/50 uppercase tracking-[0.3em] sm:tracking-[0.5em] font-bold text-[10px] sm:text-sm">L'EXCELLENCE OPÉRATIONNELLE</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Pack 1 */}
            <motion.article 
              whileHover={{ y: -10 }}
              className="glass-panel rounded-2xl sm:rounded-3xl overflow-hidden group border-white/5 hover:border-doulia-lime/50 hover:bg-white/5 active:bg-white/5 active:border-doulia-lime/50 transition-all duration-300 flex flex-col"
            >
              <div className="h-40 sm:h-56 overflow-hidden relative">
                <img 
                  src="https://i.postimg.cc/kX1fmzXD/Doulia_Connect.jpg" 
                  alt="Doulia Connect" 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:brightness-125 group-active:grayscale-0 group-active:opacity-100 group-active:brightness-125 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-doulia-night via-doulia-night/50 to-transparent opacity-80 group-hover:opacity-40 group-active:opacity-40 transition-opacity duration-500"></div>
              </div>
              <div className="p-5 sm:p-8 flex-1 flex flex-col relative z-10 group-hover:brightness-110 group-active:brightness-110 transition-all duration-300">
                <h3 className="text-xl sm:text-2xl font-display font-bold text-doulia-lime mb-1 sm:mb-2 drop-shadow-lg">1. DOULIA Connect</h3>
                <p className="text-white/60 italic mb-4 sm:mb-6 text-[12px] sm:text-sm">Le service client qui ne dort jamais.</p>
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {[
                    { label: "Automatisation 24/7", desc: "Assistants WhatsApp & Web." },
                    { label: "Lead Scoring", desc: "Qualification automatique." },
                    { label: "Support Multilingue", desc: "Français, Anglais et Pidgin." },
                    { label: "Réservations", desc: "Synchronisation agenda." }
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2 sm:gap-3 text-[12px] sm:text-sm">
                      <ChevronRight size={14} className="text-doulia-lime shrink-0" />
                      <p><span className="font-bold text-white">{item.label} :</span> <span className="text-white/70">{item.desc}</span></p>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => onSelectSolution("DOULIA Connect")}
                  className="mt-auto w-full py-3 sm:py-4 bg-doulia-lime/10 hover:bg-doulia-lime text-doulia-lime hover:text-doulia-night rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all border border-doulia-lime/20 flex items-center justify-center gap-2 group/btn shadow-[0_0_15px_rgba(190,242,100,0.1)] group-hover:shadow-[0_0_20px_rgba(190,242,100,0.3)]"
                >
                  En savoir plus ?
                  <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.article>

            {/* Pack 2 */}
            <motion.article 
              whileHover={{ y: -10 }}
              className="glass-panel rounded-2xl sm:rounded-3xl overflow-hidden group border-white/5 hover:border-doulia-lime/50 hover:bg-white/5 active:bg-white/5 active:border-doulia-lime/50 transition-all duration-300 flex flex-col"
            >
              <div className="h-40 sm:h-56 overflow-hidden relative">
                <img 
                  src="https://i.postimg.cc/YqsfVFbS/Doulia_Process.jpg" 
                  alt="Doulia Process" 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:brightness-125 group-active:grayscale-0 group-active:opacity-100 group-active:brightness-125 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-doulia-night via-doulia-night/50 to-transparent opacity-80 group-hover:opacity-40 group-active:opacity-40 transition-opacity duration-500"></div>
              </div>
              <div className="p-5 sm:p-8 flex-1 flex flex-col relative z-10 group-hover:brightness-110 group-active:brightness-110 transition-all duration-300">
                <h3 className="text-xl sm:text-2xl font-display font-bold text-doulia-lime mb-1 sm:mb-2 drop-shadow-lg">2. DOULIA Process</h3>
                <p className="text-white/60 italic mb-4 sm:mb-6 text-[12px] sm:text-sm">L'automatisation de la routine.</p>
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {[
                    { label: "Audit Processus", desc: "Identification des goulots." },
                    { label: "Agents IA Internes", desc: "Suppression des saisies manuelles." },
                    { label: "Rapports Auto", desc: "Génération instantanée." },
                    { label: "Veille Stratégique", desc: "Surveillance continue." }
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2 sm:gap-3 text-[12px] sm:text-sm">
                      <ChevronRight size={14} className="text-doulia-lime shrink-0" />
                      <p><span className="font-bold text-white">{item.label} :</span> <span className="text-white/70">{item.desc}</span></p>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => onSelectSolution("DOULIA Process")}
                  className="mt-auto w-full py-3 sm:py-4 bg-doulia-lime/10 hover:bg-doulia-lime text-doulia-lime hover:text-doulia-night rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all border border-doulia-lime/20 flex items-center justify-center gap-2 group/btn shadow-[0_0_15px_rgba(190,242,100,0.1)] group-hover:shadow-[0_0_20px_rgba(190,242,100,0.3)]"
                >
                  En savoir plus ?
                  <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.article>

            {/* Pack 3 */}
            <motion.article 
              whileHover={{ y: -10 }}
              className="glass-panel rounded-2xl sm:rounded-3xl overflow-hidden group border-white/5 hover:border-doulia-lime/50 hover:bg-white/5 active:bg-white/5 active:border-doulia-lime/50 transition-all duration-300 flex flex-col"
            >
              <div className="h-40 sm:h-56 overflow-hidden relative">
                <img 
                  src="https://i.postimg.cc/Wz96sqVK/Doulia_Insight.jpg" 
                  alt="Doulia Insight" 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:brightness-125 group-active:grayscale-0 group-active:opacity-100 group-active:brightness-125 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-doulia-night via-doulia-night/50 to-transparent opacity-80 group-hover:opacity-40 group-active:opacity-40 transition-opacity duration-500"></div>
              </div>
              <div className="p-5 sm:p-8 flex-1 flex flex-col relative z-10 group-hover:brightness-110 group-active:brightness-110 transition-all duration-300">
                <h3 className="text-xl sm:text-2xl font-display font-bold text-doulia-lime mb-1 sm:mb-2 drop-shadow-lg">3. DOULIA Insight</h3>
                <p className="text-white/60 italic mb-4 sm:mb-6 text-[12px] sm:text-sm">Décisions basées sur la donnée.</p>
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {[
                    { label: "Data Mining", desc: "Valorisation des fichiers Excel." },
                    { label: "Algorithmes", desc: "Anticipation de la demande." },
                    { label: "Segmentation", desc: "Offres ultra-personnalisées." },
                    { label: "Tableaux de Bord", desc: "Pilotage KPI temps réel." }
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2 sm:gap-3 text-[12px] sm:text-sm">
                      <ChevronRight size={14} className="text-doulia-lime shrink-0" />
                      <p><span className="font-bold text-white">{item.label} :</span> <span className="text-white/70">{item.desc}</span></p>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => onSelectSolution("DOULIA Insight")}
                  className="mt-auto w-full py-3 sm:py-4 bg-doulia-lime/10 hover:bg-doulia-lime text-doulia-lime hover:text-doulia-night rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all border border-doulia-lime/20 flex items-center justify-center gap-2 group/btn shadow-[0_0_15px_rgba(190,242,100,0.1)] group-hover:shadow-[0_0_20px_rgba(190,242,100,0.3)]"
                >
                  En savoir plus ?
                  <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* Services Sur-Mesure */}
      <section className="py-12 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel p-6 sm:p-16 rounded-[2rem] sm:rounded-[3rem] flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="w-full">
              <h2 className="text-2xl sm:text-4xl font-display font-bold text-doulia-lime mb-2 sm:mb-4 uppercase">Services Sur-Mesure</h2>
              <p className="text-white/60 mb-8 sm:mb-12 text-sm sm:text-base">Nous construisons votre futur écosystème IA.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 text-left">
                <div className="flex flex-col">
                  <h4 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
                    <Search className="text-doulia-lime" size={18} />
                    Audits IA
                  </h4>
                  <p className="text-[12px] sm:text-sm text-white/40 leading-relaxed mb-4 sm:mb-6">Immersion totale pour définir votre feuille de route technologique.</p>
                  <button 
                    onClick={() => onSelectSolution("Audit IA Stratégique")}
                    className="mt-auto text-[10px] sm:text-xs font-bold text-doulia-lime border border-doulia-lime/30 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl hover:bg-doulia-lime hover:text-doulia-night transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    Réserver mon Audit
                    <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
                    <Users className="text-doulia-lime" size={18} />
                    Formations
                  </h4>
                  <p className="text-[12px] sm:text-sm text-white/40 leading-relaxed mb-4 sm:mb-6">Acculturation et montée en compétences sur les outils génératifs.</p>
                  <button 
                    onClick={() => onSelectSolution("Formation IA sur-mesure")}
                    className="mt-auto text-[10px] sm:text-xs font-bold text-doulia-lime border border-doulia-lime/30 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl hover:bg-doulia-lime hover:text-doulia-night transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    Réserver ma Formation
                    <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
                    <Cpu className="text-doulia-lime" size={18} />
                    Développement
                  </h4>
                  <p className="text-[12px] sm:text-sm text-white/40 leading-relaxed mb-4 sm:mb-6">ERP, CRM et Applications mobiles nativement dotés d'IA.</p>
                  <button 
                    onClick={() => onSelectSolution("Développement IA & Logiciel")}
                    className="mt-auto text-[10px] sm:text-xs font-bold text-doulia-lime border border-doulia-lime/30 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl hover:bg-doulia-lime hover:text-doulia-night transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    Réserver mon Projet
                    <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
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