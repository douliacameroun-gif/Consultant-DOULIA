import React from 'react';
import { motion } from 'motion/react';
import { X, HelpCircle, Info, CheckCircle2, MessageSquare, Zap, Shield, Globe } from 'lucide-react';

interface AboutFAQPageProps {
  onClose: () => void;
}

const AboutFAQPage: React.FC<AboutFAQPageProps> = ({ onClose }) => {
  const faqs = [
    {
      question: "Qu'est-ce que DOULIA ?",
      answer: "DOULIA est une agence de conseil en transformation digitale et intelligence artificielle basée à Douala, au Cameroun. Nous aidons les PME et grandes entreprises à intégrer l'IA pour automatiser leurs processus, améliorer leur service client et analyser leurs données."
    },
    {
      question: "Comment fonctionne l'audit IA gratuit ?",
      answer: "Notre IA analyse vos besoins en temps réel à travers une discussion interactive. Elle identifie vos points de douleur (perte de temps, paperasse, attente client) et vous propose une solution sur-mesure parmi nos offres Connect, Process ou Insight."
    },
    {
      question: "Vos solutions sont-elles adaptées au marché camerounais ?",
      answer: "Absolument. Nous prenons en compte les réalités locales comme l'importance de WhatsApp, les défis de connectivité et le besoin de solutions pragmatiques et rentables pour les entrepreneurs de Douala, Yaoundé et Kribi."
    },
    {
      question: "Qu'est-ce que DOULIA Connect ?",
      answer: "C'est notre solution d'automatisation du service client. Elle permet de répondre à vos clients 24h/24 et 7j/7 sur WhatsApp et votre site web, sans intervention humaine, tout en captant des prospects qualifiés."
    },
    {
      question: "Comment puis-je contacter la direction technique ?",
      answer: "À la fin de votre audit avec notre IA, vous recevrez un résumé de votre dossier et un lien direct pour discuter avec nos experts sur WhatsApp ou via un formulaire dédié."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute inset-0 z-[110] bg-doulia-night/95 backdrop-blur-3xl flex flex-col overflow-hidden"
    >
      {/* Background AI Effects */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-30"></div>
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        
        {/* Animated Labyrinth/Neural Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bef264" stopOpacity="0" />
              <stop offset="50%" stopColor="#bef264" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#bef264" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[...Array(6)].map((_, i) => (
            <motion.path
              key={i}
              d={`M ${-100 + i * 50} ${200 + i * 100} Q ${400 + i * 50} ${100 - i * 50} ${1200} ${400 + i * 100}`}
              stroke="url(#lineGradient)"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 0],
                opacity: [0, 1, 0],
                x: [0, 50, 0],
                y: [0, -30, 0]
              }}
              transition={{ 
                duration: 10 + i * 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 1.5
              }}
            />
          ))}
        </svg>

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-doulia-lime rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.5, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}

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

      <div className="relative z-10 flex flex-col h-full">
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-doulia-lime/20 rounded-xl text-doulia-lime">
            <Info size={24} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-xl font-black text-white tracking-tight">À Propos & FAQ</h2>
            <p className="text-[10px] sm:text-[10px] text-white/40 uppercase tracking-widest font-bold">Tout savoir sur DOULIA</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 sm:space-y-12 pb-20">
        {/* Section À Propos */}
        <section className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-6 sm:w-8 h-1 bg-doulia-lime rounded-full"></div>
            <h3 className="text-lg sm:text-2xl font-bold text-white">L'Expertise IA au Cameroun</h3>
          </div>
          <p className="text-white/70 leading-relaxed text-sm sm:text-lg mb-4 sm:mb-6">
            Basée au cœur de Douala, <strong>DOULIA</strong> est le partenaire stratégique des entreprises camerounaises qui souhaitent franchir le cap de la modernité. Nous croyons que l'Intelligence Artificielle n'est pas réservée aux géants de la tech, mais doit être un levier de croissance pour chaque PME locale.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <Zap className="text-doulia-lime mb-2 sm:mb-3 sm:w-6 sm:h-6" size={20} />
              <h4 className="text-white font-bold mb-1 text-sm sm:text-base">Innovation Locale</h4>
              <p className="text-white/50 text-[12px] sm:text-sm">Des solutions pensées pour le climat des affaires au Cameroun.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <Shield className="text-doulia-lime mb-2 sm:mb-3 sm:w-6 sm:h-6" size={20} />
              <h4 className="text-white font-bold mb-1 text-sm sm:text-base">Confiance & Proximité</h4>
              <p className="text-white/50 text-[12px] sm:text-sm">Un accompagnement humain de Douala à Yaoundé.</p>
            </div>
          </div>
        </section>

        {/* Section Nos Valeurs */}
        <section className="max-w-3xl mx-auto bg-doulia-lime/5 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-doulia-lime/20">
          <h3 className="text-lg sm:text-xl font-black text-doulia-lime mb-4 sm:mb-6 flex items-center gap-2">
            <Globe size={18} className="sm:w-5 sm:h-5" />
            LE DOULIA LOVE
          </h3>
          <p className="text-white/80 italic mb-4 sm:mb-6 text-sm sm:text-base">
            "Notre mission est de faire grandir les entreprises camerounaises en rendant la technologie accessible, chaleureuse et extrêmement pragmatique."
          </p>
          <ul className="space-y-2 sm:space-y-3">
            {[
              "Empathie profonde envers les entrepreneurs",
              "Réactivité maximale sur WhatsApp",
              "Transparence totale sur les coûts",
              "Excellence technique bilingue"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 sm:gap-3 text-white/70 text-[12px] sm:text-sm">
                <CheckCircle2 size={14} className="text-doulia-lime shrink-0 sm:w-4 sm:h-4" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Section FAQ */}
        <section className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-6 sm:w-8 h-1 bg-doulia-lime rounded-full"></div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Questions Fréquentes</h3>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="p-4 sm:p-6 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 hover:border-doulia-lime/30 transition-colors group"
              >
                <h4 className="text-white font-bold mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                  <HelpCircle size={16} className="text-doulia-lime sm:w-[18px] sm:h-[18px]" />
                  {faq.question}
                </h4>
                <p className="text-white/50 text-[12px] sm:text-sm leading-relaxed ml-6 sm:ml-7">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Contact */}
        <section className="max-w-3xl mx-auto text-center py-8">
          <p className="text-white/40 text-sm mb-4">Besoin d'une réponse plus spécifique ?</p>
          <a 
            href="https://wa.me/237673043127" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full transition-all font-bold"
          >
            <MessageSquare size={18} />
            Contactez-nous directement
          </a>
        </section>
      </div>
    </div>
    </motion.div>
  );
};

export default AboutFAQPage;
