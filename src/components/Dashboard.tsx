import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  PieChart, 
  Users, 
  Target, 
  Zap, 
  X,
  FileText,
  Activity
} from 'lucide-react';

interface DashboardProps {
  onClose: () => void;
  roiResults: any;
  auditSubmitted: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ onClose, roiResults, auditSubmitted }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-doulia-night flex flex-col overflow-hidden"
    >
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-doulia-lime/10 rounded-xl text-doulia-lime">
            <BarChart3 size={24} />
          </div>
          <div>
            <span className="font-display font-bold text-xl text-white block">DOULIA Insight</span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Tableau de Bord Stratégique</span>
          </div>
        </div>
        <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white">
          <X size={32} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
              <Activity className="text-doulia-lime mb-3" size={24} />
              <div className="text-sm text-white/40 mb-1">Statut Audit</div>
              <div className="text-xl font-bold">{auditSubmitted ? "Complété" : "En attente"}</div>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
              <TrendingUp className="text-doulia-accent-blue mb-3" size={24} />
              <div className="text-sm text-white/40 mb-1">Potentiel de Gain</div>
              <div className="text-xl font-bold text-doulia-lime">
                {roiResults ? formatCurrency(roiResults.yearlyGain) : "N/A"}
              </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
              <Clock className="text-emerald-500 mb-3" size={24} />
              <div className="text-sm text-white/40 mb-1">Temps Libérable</div>
              <div className="text-xl font-bold">
                {roiResults ? `${roiResults.monthlyTimeSaved}h / mois` : "N/A"}
              </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
              <Target className="text-amber-500 mb-3" size={24} />
              <div className="text-sm text-white/40 mb-1">Prospects Retrouvables</div>
              <div className="text-xl font-bold">
                {roiResults ? formatCurrency(roiResults.recoveredRevenue) : "N/A"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.03]">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-3 italic">
                <PieChart className="text-doulia-lime" size={20} />
                Répartition des Opportunités
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-white/60">Optimisation Process</span>
                    <span className="text-doulia-lime font-bold">65%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-doulia-lime w-[65%] rounded-full shadow-[0_0_10px_#bef264]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-white/60">Conversion Client (Connect)</span>
                    <span className="text-doulia-accent-blue font-bold">45%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-doulia-accent-blue w-[45%] rounded-full shadow-[0_0_10px_#3b82f6]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-white/60">Fiabilité des Décisions</span>
                    <span className="text-emerald-500 font-bold">90%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[90%] rounded-full shadow-[0_0_10px_#10b981]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-white/[0.03]">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-3 italic">
                <FileText className="text-doulia-lime" size={20} />
                Plan d'Action Proposé
              </h3>
              <div className="space-y-4">
                {[
                  { title: "Déploiement Connect", desc: "Configuration de votre assistant WhatsApp 24/7.", status: "Prêt" },
                  { title: "Audit Processus", desc: "Identification des goulots d'étranglement administratifs.", status: "Recommandé" },
                  { title: "Mise en place Dashboard", desc: "Centralisation de vos indicateurs clés.", status: "Optionnel" }
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
                    <div>
                      <div className="font-bold text-sm mb-1">{item.title}</div>
                      <div className="text-[10px] text-white/40">{item.desc}</div>
                    </div>
                    <span className="text-[9px] px-2 py-1 rounded bg-doulia-lime/10 text-doulia-lime font-bold uppercase tracking-widest">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[3rem] bg-gradient-to-br from-doulia-lime to-emerald-500 text-doulia-night flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2 italic">Prêt pour la Prochaine Étape ?</h2>
              <p className="max-w-md font-medium opacity-80">Nos consultants à Douala analysent vos résultats pour construire votre stratégie IA sur-mesure.</p>
            </div>
            <button className="px-8 py-4 bg-doulia-night text-white rounded-2xl font-bold shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
              Réserver une Consultation
              <Zap size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
