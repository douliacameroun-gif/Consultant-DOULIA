import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  Users, 
  ArrowRight, 
  Download, 
  X,
  Cpu, 
  Zap, 
  Sparkles,
  ShieldCheck,
  Rocket,
  BarChart3,
  Database
} from 'lucide-react';
import { AuditData } from './AuditForm';

interface AuditReportProps {
  data: AuditData;
  onClose: () => void;
}

const AuditReport: React.FC<AuditReportProps> = ({ data, onClose }) => {
  // Real calculations based on user data
  const stats = useMemo(() => {
    const dailyVolume = parseInt(data.volume || '20');
    // On estime 5 minutes par message/réservation en manuel
    const currentWeeklyHours = (dailyVolume * 5 * 6) / 60; // 6 jours par semaine
    const aiWeeklyHours = currentWeeklyHours * 0.15; // 85% de réduction
    const gainPercentage = 85;
    
    // Impact financier (salaire moyen estimé 2500 FCFA/h)
    const weeklySaving = (currentWeeklyHours - aiWeeklyHours) * 2500;
    
    return {
      currentWeeklyHours: Math.round(currentWeeklyHours),
      aiWeeklyHours: Math.round(aiWeeklyHours),
      gainPercentage,
      weeklySaving: Math.round(weeklySaving),
      dailyVolume
    };
  }, [data.volume]);

  const chartData = [
    { name: 'Actuel', temps: stats.currentWeeklyHours, color: '#ff4444' },
    { name: 'DOULIA AI', temps: stats.aiWeeklyHours, color: '#bef264' },
  ];

  const savingsProjection = [
    { month: 'Mois 1', manual: stats.weeklySaving * 4, ai: stats.weeklySaving * 4 * 0.1 },
    { month: 'Mois 2', manual: stats.weeklySaving * 8, ai: stats.weeklySaving * 8 * 0.1 },
    { month: 'Mois 3', manual: stats.weeklySaving * 12, ai: stats.weeklySaving * 12 * 0.1 },
    { month: 'Mois 6', manual: stats.weeklySaving * 24, ai: stats.weeklySaving * 24 * 0.1 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[120] bg-doulia-night flex flex-col overflow-hidden"
    >
      {/* Animated Orbits */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#bef26422,_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-mesh opacity-30"></div>
        <div className="absolute inset-0 grid-pattern opacity-10"></div>
        
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] aspect-square border border-doulia-lime/5 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[5%] w-[50%] aspect-square border border-doulia-lime/10 rounded-full border-dashed"
        />
      </div>

      {/* Close Button UI */}
      <button 
        onClick={onClose}
        className="fixed top-4 right-4 sm:top-8 sm:right-8 z-[130] p-2 sm:p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-white/50 hover:text-white border border-white/10 backdrop-blur-md group"
      >
        <X size={24} className="sm:hidden" />
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Fermer le rapport</span>
          <X size={24} />
        </div>
      </button>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-16 space-y-12 sm:space-y-20">
          
          {/* Header Section */}
          <div className="text-center space-y-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 p-1.5 px-4 bg-white/5 backdrop-blur-xl rounded-full border border-white/10"
            >
               <Sparkles size={14} className="text-doulia-lime animate-pulse" />
               <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">IA Strategy Engine v3.0</p>
            </motion.div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="font-display tracking-tight leading-tight"
            >
              Rapport d'Impact IA pour <br />
              <span className="ai-gradient-text">{data.company}</span>
            </motion.h1>

            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-white/50 max-w-2xl mx-auto text-sm sm:text-lg leading-relaxed"
            >
              Analyse prédictive générée pour ___{data.name}___. <br className="hidden sm:block" />
              Basée sur vos {stats.dailyVolume} interactions quotidiennes et vos défis de type <span className="text-doulia-lime font-bold italic">{data.challenge}</span>.
            </motion.p>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: 'Efficacité', val: `+${stats.gainPercentage}%`, icon: <Zap />, color: 'text-doulia-lime', bg: 'bg-doulia-lime/10' },
              { label: 'Heures / Sem.', val: `-${stats.currentWeeklyHours - stats.aiWeeklyHours}h`, icon: <Clock />, color: 'text-orange-400', bg: 'bg-orange-400/10' },
              { label: 'Croissance Exp.', val: 'x2.8', icon: <TrendingUp />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
              { label: 'Score IA', val: '9.4/10', icon: <ShieldCheck />, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
            ].map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-panel p-6 rounded-3xl group border-white/5 hover:border-doulia-lime/30 transition-all"
              >
                <div className={`p-3 w-fit rounded-2xl ${m.bg} ${m.color} mb-4 group-hover:scale-110 transition-transform`}>
                  {React.cloneElement(m.icon as any, { size: 24 })}
                </div>
                <div className="text-3xl font-black mb-1 font-display tracking-tight">{m.val}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{m.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Deep Insight Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Visual Analytics 1 */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden"
            >
              <div className="relative z-10">
                <h3 className="flex items-center gap-3 mb-8 italic">
                  <BarChart3 size={24} className="text-doulia-lime" />
                  Optimisation du Temps Réel
                </h3>
                
                <div className="h-[300px] w-full relative" style={{ minWidth: 0 }}>
                  <ResponsiveContainer width="99%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#bef264" stopOpacity={1} />
                          <stop offset="100%" stopColor="#bef264" stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#252525" vertical={false} />
                      <XAxis dataKey="name" stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#070a10', border: '1px solid #ffffff10', borderRadius: '16px', backdropFilter: 'blur(10px)' }}
                        itemStyle={{ color: '#bef264', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="temps" radius={[12, 12, 0, 0]} barSize={60}>
                         <Cell fill="#ff4444" />
                         <Cell fill="url(#barGradient)" stroke="#bef264" strokeWidth={1} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                   <p className="text-xs text-white/60 leading-relaxed italic">
                    <span className="text-doulia-lime font-bold">Observation IA :</span> En automatisant vos {stats.dailyVolume} interactions quotidiennes, vous libérez l'équivalent de 1.5 employé à temps plein.
                   </p>
                </div>
              </div>
            </motion.div>

            {/* Visual Analytics 2 */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden"
            >
              <div className="relative z-10">
                <h3 className="flex items-center gap-3 mb-8 italic">
                  <TrendingUp size={24} className="text-blue-400" />
                  Projection Économique (FCFA)
                </h3>
                
                <div className="h-[300px] w-full relative" style={{ minWidth: 0 }}>
                  <ResponsiveContainer width="99%" height="100%">
                    <AreaChart data={savingsProjection} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="areaManual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ff4444" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="areaAI" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#252525" vertical={false} />
                      <XAxis dataKey="month" stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#070a10', border: '1px solid #ffffff10', borderRadius: '16px' }}
                      />
                      <Area type="monotone" dataKey="manual" name="Coût Manuel" stroke="#ff4444" fillOpacity={1} fill="url(#areaManual)" />
                      <Area type="monotone" dataKey="ai" name="Coût IA Doulia" stroke="#3b82f6" fillOpacity={1} fill="url(#areaAI)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-8 flex items-center justify-between">
                   <div>
                     <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Gain Annuel de Trésorerie</p>
                     <div className="text-2xl font-black text-blue-400">{new Intl.NumberFormat('fr-FR').format(stats.weeklySaving * 52)} FCFA</div>
                   </div>
                   <div className="p-3 bg-blue-400/10 rounded-2xl text-blue-400">
                      <Zap size={24} />
                   </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* AI Personalized Strategy Section */}
          <section className="relative p-1 px-1 bg-gradient-to-br from-doulia-lime/30 via-white/5 to-blue-500/30 rounded-[3rem]">
            <div className="bg-doulia-night/90 backdrop-blur-3xl p-8 sm:p-12 rounded-[3rem] overflow-hidden relative">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <Rocket size={200} />
               </div>

               <div className="max-w-3xl space-y-8 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-doulia-lime rounded-full flex items-center justify-center text-doulia-night">
                       <Sparkles size={24} />
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-display font-bold">Votre Stratégie de Transformation</h2>
                  </div>

                  <div className="space-y-6">
                     <p className="text-lg text-white/80 leading-relaxed">
                        Pour <span className="text-white font-bold">{data.company}</span>, notre moteur d'analyse préconise une approche axée sur 
                        <span className="text-doulia-lime font-bold"> {data.challenge === 'service_client' ? 'Doulia Connect' : 'Doulia Process'}</span>.
                     </p>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                           <h4 className="text-doulia-lime font-bold mb-2 flex items-center gap-2">
                             <Cpu size={16} /> 
                             Phase 1 : Capture
                           </h4>
                           <p className="text-xs text-white/60 leading-relaxed">Automatisation des {stats.dailyVolume} interactions entrantes pour ne perdre aucun prospect.</p>
                        </div>
                        <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                           <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                              <Database size={16} />
                              Phase 2 : Data
                           </h4>
                           <p className="text-xs text-white/60 leading-relaxed">Centralisation de vos données pour une visibilité totale sur vos performances.</p>
                        </div>
                     </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      onClick={() => {
                        const resumeCode = `REPORT_${data.company.replace(/\s+/g, '_').toUpperCase()}`;
                        window.open(`https://wa.me/237673043127?text=Bonjour_Doulia_je_viens_de_terminer_mon_audit_Voici_mon_code:${resumeCode}`, '_blank');
                      }}
                      className="btn-modern-primary w-full sm:w-auto h-14 px-10 text-base group"
                    >
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      Valider ma Transformation sur WhatsApp
                    </button>
                    <p className="mt-4 text-[10px] text-white/40 italic">Nos experts à Douala vous rappelleront sous 24h ouvrées.</p>
                  </div>
               </div>
            </div>
          </section>

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 border-t border-white/5 pb-12">
            <div className="flex items-center gap-4 text-white/30 text-[10px] uppercase font-bold tracking-widest">
               <ShieldCheck size={14} />
               Rapport Certifié DOULIA
            </div>
            <div className="flex gap-4">
               <button 
                onClick={() => window.print()}
                className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-white border border-white/10 transition-all flex items-center gap-2 text-xs font-bold"
               >
                  <Download size={16} />
                   PDF
               </button>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full text-white/20 hover:text-white pb-12 transition-colors font-bold text-xs uppercase tracking-widest"
          >
            Sortir du rapport interactif
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AuditReport;
