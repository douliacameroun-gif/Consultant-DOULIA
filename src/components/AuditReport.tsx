import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { TrendingUp, Clock, Users, ArrowRight, Download, Share2 } from 'lucide-react';
import { AuditData } from './AuditForm';

interface AuditReportProps {
  data: AuditData;
  onClose: () => void;
}

const AuditReport: React.FC<AuditReportProps> = ({ data, onClose }) => {
  // Mock calculations based on audit data
  const timeLossMapping: Record<string, number> = { 'A': 15, 'B': 25, 'C': 10, 'D': 20 };
  const hLoss = timeLossMapping[data.challenge] || 15;
  
  const chartData = [
    { name: 'Actuel', temps: hLoss, color: '#ff4444' },
    { name: 'Avec DOULIA', temps: hLoss * 0.2, color: '#bef264' },
  ];

  const distributionData = [
    { name: 'Tâches Manuelles', value: hLoss, color: '#ff4444' },
    { name: 'Gestion Client', value: 15, color: '#3b82f6' },
    { name: 'Analyse', value: 5, color: '#bef264' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[120] bg-doulia-night/98 backdrop-blur-2xl flex flex-col overflow-hidden"
    >
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-block p-1 px-3 bg-doulia-lime/20 rounded-full border border-doulia-lime/30">
               <p className="text-[10px] font-bold text-doulia-lime uppercase tracking-widest">Rapport Stratégique IA</p>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white">
              Analyse DOULIA Insight pour <span className="text-doulia-lime">{data.company}</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base">
              Ravi de faire votre connaissance, ___{data.name}___. Voici votre feuille de route vers l'excellence opérationnelle.
            </p>
          </div>

          {/* Grid Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-500/20 rounded-lg text-red-500">
                    <Clock size={20} />
                  </div>
                  <h4 className="font-bold text-sm">Temps Perdu</h4>
               </div>
               <div className="text-3xl font-bold mb-1">{hLoss}h<span className="text-sm text-white/40 font-normal"> / semaine</span></div>
               <p className="text-[10px] text-white/40 uppercase tracking-wider">Sur des tâches à faible valeur</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-doulia-lime/20 bg-doulia-lime/5">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-doulia-lime/20 rounded-lg text-doulia-lime">
                    <TrendingUp size={20} />
                  </div>
                  <h4 className="font-bold text-sm text-doulia-lime">Potentiel Gain</h4>
               </div>
               <div className="text-3xl font-bold mb-1 text-doulia-lime">+ 80%</div>
               <p className="text-[10px] text-doulia-lime/40 uppercase tracking-wider">D'efficacité opérationnelle</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
                    <Users size={20} />
                  </div>
                  <h4 className="font-bold text-sm">Satisfaction Client</h4>
               </div>
               <div className="text-3xl font-bold mb-1">x 2.5</div>
               <p className="text-[10px] text-white/40 uppercase tracking-wider">Accélération des réponses</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/[0.03]">
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <TrendingUp size={18} className="text-doulia-lime" />
                Impact sur le temps (Heures/Semaine)
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#252525" vertical={false} />
                    <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                      itemStyle={{ color: '#bef264' }}
                    />
                    <Bar dataKey="temps" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-white/40 mt-4 leading-relaxed">
                Une réduction de {hLoss - (hLoss * 0.2)}h par semaine permet à votre équipe de se concentrer sur la stratégie commerciale.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-white/[0.03]">
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <TrendingUp size={18} className="text-doulia-lime" />
                Répartition de la productivité
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="glass-panel p-8 rounded-3xl border border-doulia-lime font-display bg-gradient-to-br from-doulia-night to-doulia-lime/10 flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold mb-4">Votre dossier d'audit est prêt à Douala.</h3>
            <p className="text-white/60 mb-8 max-w-xl text-sm leading-relaxed">
              Pour recevoir le rapport complet détaillé et planifier votre session stratégique de 15 minutes avec notre direction technique :
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => {
                     const resumeCode = `AUDIT_${data.company.replace(/\s+/g, '_').toUpperCase()}`;
                     window.open(`https://wa.me/237673043127?text=Bonjour_Doulia_je_viens_de_terminer_mon_audit_Voici_mon_code:${resumeCode}`, '_blank');
                  }}
                  className="px-8 py-3 bg-doulia-lime text-doulia-night rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-glow-lime/20"
                >
                  <ArrowRight size={20} />
                  Valider sur WhatsApp
                </button>
                <div className="flex gap-2">
                    <button className="p-3 bg-white/5 rounded-xl text-white/60 hover:text-white border border-white/10 transition-all">
                        <Download size={20} />
                    </button>
                    <button className="p-3 bg-white/5 rounded-xl text-white/60 hover:text-white border border-white/10 transition-all">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full text-white/40 hover:text-white py-4 transition-colors font-bold text-xs uppercase tracking-widest"
          >
            Fermer le rapport
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AuditReport;
