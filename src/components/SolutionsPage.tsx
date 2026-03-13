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
      className="fixed inset-0 z-[100] bg-doulia-night overflow-y-auto"
    >
      {/* Neural Background Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-mesh"></div>
        <div className="absolute inset-0 grid-pattern opacity-40"></div>
        <div className="scanline"></div>
      </div>

      {/* Floating Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[400px] h-[400px] bg-doulia-lime/5 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-doulia-turquoise/5 rounded-full blur-[100px] pointer-events-none animate-pulse delay-1000"></div>

      {/* Close Button */}
      <button 
        onClick={onClose}
        className="fixed top-8 right-8 z-[110] p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white border border-white/10 backdrop-blur-md"
      >
        <X size={32} />
      </button>

      {/* Packs Solutions */}
      <section className="py-24 px-4 bg-white/[0.02] mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-4">Nos Packs <span className="text-gradient">Solutions</span></h2>
            <p className="text-doulia-lime/50 uppercase tracking-[0.5em] font-bold text-sm">L'EXCELLENCE OPÉRATIONNELLE</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Pack 1 */}
            <motion.article 
              whileHover={{ y: -10 }}
              className="glass-panel rounded-3xl overflow-hidden group border-white/5 hover:border-doulia-lime/30 transition-all flex flex-col"
            >
              <div className="h-56 overflow-hidden relative">
                <img 
                  src="https://i.postimg.cc/kX1fmzXD/Doulia_Connect.jpg" 
                  alt="Doulia Connect" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-doulia-night to-transparent opacity-60"></div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-display font-bold text-doulia-lime mb-2">1. DOULIA Connect</h3>
                <p className="text-white/40 italic mb-6 text-sm">Le service client qui ne dort jamais.</p>
                <ul className="space-y-4 mb-8">
                  {[
                    { label: "Automatisation 24/7", desc: "Assistants WhatsApp & Web intelligents." },
                    { label: "Lead Scoring", desc: "Qualification automatique des prospects." },
                    { label: "Support Multilingue", desc: "Français, Anglais et Pidgin." },
                    { label: "Réservations", desc: "Synchronisation agenda 24h/24." }
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <ChevronRight size={16} className="text-doulia-lime shrink-0" />
                      <p><span className="font-bold text-white/90">{item.label} :</span> <span className="text-white/50">{item.desc}</span></p>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => onSelectSolution("DOULIA Connect")}
                  className="mt-auto w-full py-4 bg-doulia-lime/10 hover:bg-doulia-lime text-doulia-lime hover:text-doulia-night rounded-2xl font-bold text-sm transition-all border border-doulia-lime/20 flex items-center justify-center gap-2 group/btn"
                >
                  En savoir plus ?
                  <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.article>

            {/* Pack 2 */}
            <motion.article 
              whileHover={{ y: -10 }}
              className="glass-panel rounded-3xl overflow-hidden group border-white/5 hover:border-doulia-lime/30 transition-all flex flex-col"
            >
              <div className="h-56 overflow-hidden relative">
                <img 
                  src="https://i.postimg.cc/YqsfVFbS/Doulia_Process.jpg" 
                  alt="Doulia Process" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-doulia-night to-transparent opacity-60"></div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-display font-bold text-doulia-lime mb-2">2. DOULIA Process</h3>
                <p className="text-white/40 italic mb-6 text-sm">L'automatisation de la routine.</p>
                <ul className="space-y-4 mb-8">
                  {[
                    { label: "Audit Processus", desc: "Identification des goulots d'étranglement." },
                    { label: "Agents IA Internes", desc: "Suppression des saisies manuelles." },
                    { label: "Rapports Auto", desc: "Génération de rapports complexes instantanés." },
                    { label: "Veille Stratégique", desc: "Surveillance continue du marché." }
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <ChevronRight size={16} className="text-doulia-lime shrink-0" />
                      <p><span className="font-bold text-white/90">{item.label} :</span> <span className="text-white/50">{item.desc}</span></p>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => onSelectSolution("DOULIA Process")}
                  className="mt-auto w-full py-4 bg-doulia-lime/10 hover:bg-doulia-lime text-doulia-lime hover:text-doulia-night rounded-2xl font-bold text-sm transition-all border border-doulia-lime/20 flex items-center justify-center gap-2 group/btn"
                >
                  En savoir plus ?
                  <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.article>

            {/* Pack 3 */}
            <motion.article 
              whileHover={{ y: -10 }}
              className="glass-panel rounded-3xl overflow-hidden group border-white/5 hover:border-doulia-lime/30 transition-all flex flex-col"
            >
              <div className="h-56 overflow-hidden relative">
                <img 
                  src="https://i.postimg.cc/Wz96sqVK/Doulia_Insight.jpg" 
                  alt="Doulia Insight" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-doulia-night to-transparent opacity-60"></div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-display font-bold text-doulia-lime mb-2">3. DOULIA Insight</h3>
                <p className="text-white/40 italic mb-6 text-sm">Décisions basées sur la donnée.</p>
                <ul className="space-y-4 mb-8">
                  {[
                    { label: "Data Mining", desc: "Valorisation des fichiers Excel dormants." },
                    { label: "Algorithmes Prédictifs", desc: "Anticipation de la demande." },
                    { label: "Segmentation Client", desc: "Offres ultra-personnalisées." },
                    { label: "Tableaux de Bord", desc: "Pilotage KPI en temps réel." }
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <ChevronRight size={16} className="text-doulia-lime shrink-0" />
                      <p><span className="font-bold text-white/90">{item.label} :</span> <span className="text-white/50">{item.desc}</span></p>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => onSelectSolution("DOULIA Insight")}
                  className="mt-auto w-full py-4 bg-doulia-lime/10 hover:bg-doulia-lime text-doulia-lime hover:text-doulia-night rounded-2xl font-bold text-sm transition-all border border-doulia-lime/20 flex items-center justify-center gap-2 group/btn"
                >
                  En savoir plus ?
                  <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* Services Sur-Mesure */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel p-8 md:p-16 rounded-[3rem] flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="w-full">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-doulia-lime mb-4 uppercase">Services Sur-Mesure</h2>
              <p className="text-white/60 mb-12">Nous construisons votre futur écosystème IA.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
                <div>
                  <h4 className="text-xl font-bold mb-2 flex items-center gap-3">
                    <Search className="text-doulia-lime" size={20} />
                    Audits IA
                  </h4>
                  <p className="text-sm text-white/40 leading-relaxed">Immersion totale pour définir votre feuille de route technologique.</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 flex items-center gap-3">
                    <Users className="text-doulia-lime" size={20} />
                    Formations
                  </h4>
                  <p className="text-sm text-white/40 leading-relaxed">Acculturation et montée en compétences sur les outils génératifs.</p>
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 flex items-center gap-3">
                    <Cpu className="text-doulia-lime" size={20} />
                    Développement
                  </h4>
                  <p className="text-sm text-white/40 leading-relaxed">ERP, CRM et Applications mobiles nativement dotés d'IA.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default SolutionsPage;
