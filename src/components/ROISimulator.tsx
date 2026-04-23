import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  Zap, 
  ArrowRight,
  BarChart3,
  PieChart,
  Target,
  X,
  Activity
} from 'lucide-react';

interface ROISimulatorProps {
  onClose: () => void;
  onOpenAudit: () => void;
}

const ROISimulator: React.FC<ROISimulatorProps> = ({ onClose, onOpenAudit }) => {
  const [employees, setEmployees] = useState(5);
  const [hourlyRate, setHourlyRate] = useState(2500); // FCFA
  const [repetitiveHours, setRepetitiveHours] = useState(2);
  const [missedLeads, setMissedLeads] = useState(10);
  const [leadValue, setLeadValue] = useState(50000); // FCFA

  const [results, setResults] = useState({
    monthlyTimeSaved: 0,
    monthlyMoneySaved: 0,
    recoveredRevenue: 0,
    totalMonthlyGain: 0,
    yearlyGain: 0
  });

  useEffect(() => {
    const monthlyTimeSaved = employees * repetitiveHours * 20; // 20 working days
    const monthlyMoneySaved = monthlyTimeSaved * hourlyRate;
    const recoveredRevenue = missedLeads * 0.3 * leadValue; // Assuming 30% recovery rate with AI
    const totalMonthlyGain = monthlyMoneySaved + recoveredRevenue;
    const yearlyGain = totalMonthlyGain * 12;

    setResults({
      monthlyTimeSaved,
      monthlyMoneySaved,
      recoveredRevenue,
      totalMonthlyGain,
      yearlyGain
    });
  }, [employees, hourlyRate, repetitiveHours, missedLeads, leadValue]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-doulia-night flex flex-col overflow-hidden"
    >
      {/* Background Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-mesh"></div>
        <div className="absolute inset-0 grid-pattern opacity-40"></div>
        <div className="scanline"></div>
        
        {/* Animated Data Streams */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-doulia-lime to-transparent h-64"
              style={{
                left: `${20 + i * 15}%`,
                top: '-20%'
              }}
              animate={{
                top: ['-20%', '120%'],
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                ease: "linear",
                delay: i * 2
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-xl relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-doulia-lime/10 rounded-xl text-doulia-lime">
            <TrendingUp size={24} />
          </div>
          <div>
            <span className="font-display font-bold text-lg sm:text-xl text-white block">Simulateur de ROI</span>
            <span className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-widest font-bold">Estimation de croissance par l'IA</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 sm:p-3 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
        >
          <X size={32} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl sm:text-4xl font-display font-bold text-doulia-lime mb-3 uppercase tracking-tight">
                Simulateur de Gains IA
              </h1>
              <p className="text-white/60 text-base max-w-xl mx-auto">
                Estimez l'impact concret de l'Intelligence Artificielle sur votre rentabilité.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inputs Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10"
            >
              <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                <Zap className="text-doulia-lime" size={24} />
                Vos Données Actuelles
              </h2>

              <div className="space-y-8">
                {/* Employees */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-white/80 flex items-center gap-2">
                      <Users size={14} className="text-doulia-lime" />
                      Nombre d'employés
                    </label>
                    <span className="text-doulia-lime font-bold text-sm">{employees}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={employees}
                    onChange={(e) => setEmployees(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-doulia-lime"
                  />
                </div>

                {/* Hourly Rate */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-white/80 flex items-center gap-2">
                      <DollarSign size={14} className="text-doulia-lime" />
                      Coût horaire (FCFA)
                    </label>
                    <span className="text-doulia-lime font-bold text-sm">{formatCurrency(hourlyRate)}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="20000"
                    step="500"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-doulia-lime"
                  />
                </div>

                {/* Repetitive Hours */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-white/80 flex items-center gap-2">
                      <Clock size={14} className="text-doulia-lime" />
                      Heures répétitives/jour
                    </label>
                    <span className="text-doulia-lime font-bold text-sm">{repetitiveHours}h</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="8"
                    step="0.5"
                    value={repetitiveHours}
                    onChange={(e) => setRepetitiveHours(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-doulia-lime"
                  />
                </div>

                {/* Missed Leads */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-white/80 flex items-center gap-2">
                      <Target size={14} className="text-doulia-lime" />
                      Prospects manqués/mois
                    </label>
                    <span className="text-doulia-lime font-bold text-sm">{missedLeads}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={missedLeads}
                    onChange={(e) => setMissedLeads(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-doulia-lime"
                  />
                </div>

                {/* Lead Value */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-medium text-white/80 flex items-center gap-2">
                      <BarChart3 size={14} className="text-doulia-lime" />
                      Valeur prospect (FCFA)
                    </label>
                    <span className="text-doulia-lime font-bold text-sm">{formatCurrency(leadValue)}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="500000"
                    step="5000"
                    value={leadValue}
                    onChange={(e) => setLeadValue(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-doulia-lime"
                  />
                </div>
              </div>
            </motion.div>

            {/* Results Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-4"
            >
              <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-doulia-lime/20 bg-doulia-lime/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <TrendingUp size={80} />
                </div>
                
                <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Gain Annuel Estimé</h3>
                <div className="text-3xl sm:text-5xl font-display font-bold text-doulia-lime mb-2">
                  {formatCurrency(results.yearlyGain)}
                </div>
                <p className="text-white/40 text-[10px] italic">
                  *Basé sur une optimisation prudente de vos processus.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="glass-panel p-4 rounded-xl border border-white/5">
                  <Clock className="text-doulia-lime mb-2" size={20} />
                  <div className="text-lg font-bold">{results.monthlyTimeSaved}h</div>
                  <div className="text-white/50 text-[10px] uppercase tracking-wider">Temps libéré / mois</div>
                </div>
                
                <div className="glass-panel p-4 rounded-xl border border-white/5">
                  <DollarSign className="text-doulia-lime mb-2" size={20} />
                  <div className="text-lg font-bold">{formatCurrency(results.monthlyMoneySaved)}</div>
                  <div className="text-white/50 text-[10px] uppercase tracking-wider">Économie / mois</div>
                </div>

                <div className="glass-panel p-4 rounded-xl border border-white/5">
                  <PieChart className="text-doulia-lime mb-2" size={20} />
                  <div className="text-lg font-bold">{formatCurrency(results.recoveredRevenue)}</div>
                  <div className="text-white/50 text-[10px] uppercase tracking-wider">Revenu récupéré / mois</div>
                </div>

                <div className="glass-panel p-4 rounded-xl border border-white/5">
                  <TrendingUp className="text-doulia-lime mb-2" size={20} />
                  <div className="text-lg font-bold">{formatCurrency(results.totalMonthlyGain)}</div>
                  <div className="text-white/50 text-[10px] uppercase tracking-wider">Gain total / mois</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-doulia-lime to-emerald-500 text-doulia-night">
                <h4 className="text-lg font-bold mb-1">Prêt à transformer ces chiffres ?</h4>
                <p className="text-xs text-doulia-night/80 mb-4 font-medium">
                  Nos experts valident ces estimations gratuitement.
                </p>
                <button 
                  onClick={() => { onClose(); onOpenAudit(); }}
                  className="w-full py-4 bg-doulia-night text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl text-base"
                >
                  Lancer mon Audit Gratuit
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Comparison Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-doulia-lime/10 rounded-2xl flex items-center justify-center text-doulia-lime mx-auto mb-4">
                <Zap size={32} />
              </div>
              <h4 className="font-bold mb-2">DOULIA Connect</h4>
              <p className="text-sm text-white/50">Récupérez jusqu'à 80% de vos prospects WhatsApp qui ne reçoivent pas de réponse immédiate.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-doulia-lime/10 rounded-2xl flex items-center justify-center text-doulia-lime mx-auto mb-4">
                <Activity size={32} />
              </div>
              <h4 className="font-bold mb-2">DOULIA Process</h4>
              <p className="text-sm text-white/50">Automatisez vos devis, factures et rapports pour gagner 2h de concentration par jour.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-doulia-lime/10 rounded-2xl flex items-center justify-center text-doulia-lime mx-auto mb-4">
                <BarChart3 size={32} />
              </div>
              <h4 className="font-bold mb-2">DOULIA Insight</h4>
              <p className="text-sm text-white/50">Prenez des décisions basées sur des données réelles, pas sur des suppositions.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ROISimulator;
