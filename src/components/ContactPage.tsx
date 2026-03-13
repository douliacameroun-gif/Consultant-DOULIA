import React from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Globe, 
  Mail, 
  Linkedin,
  Phone,
  MessageSquare,
  Facebook,
  Home,
  Activity,
  Layers
} from 'lucide-react';

interface ContactPageProps {
  onClose: () => void;
  lang: 'fr' | 'en';
  onNavigate: (page: 'home' | 'solutions' | 'audit') => void;
}

const translations = {
  fr: {
    title: "CONTACTEZ-NOUS",
    subtitle: "Prêt à passer à l'étape supérieure ? Nos experts sont à votre écoute pour propulser votre business.",
    website: "Site Web",
    email: "Email",
    linkedin: "LinkedIn",
    facebook: "Facebook",
    whatsapp: "Téléphone / WhatsApp",
    footer: "DOULIA : L'Intelligence Artificielle qui parle votre langue et comprend vos défis au Cameroun.",
    goHome: "Accueil",
    solutions: "Solutions",
    audit: "Audit IA"
  },
  en: {
    title: "CONTACT US",
    subtitle: "Ready to take the next step? Our experts are listening to propel your business.",
    website: "Website",
    email: "Email",
    linkedin: "LinkedIn",
    facebook: "Facebook",
    whatsapp: "Phone / WhatsApp",
    footer: "DOULIA: Artificial Intelligence that speaks your language and understands your challenges in Cameroon.",
    goHome: "Home",
    solutions: "Solutions",
    audit: "AI Audit"
  }
};

const ContactPage: React.FC<ContactPageProps> = ({ onClose, lang, onNavigate }) => {
  const t = translations[lang];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-doulia-night/95 backdrop-blur-2xl overflow-y-auto"
    >
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-20" />
      <div className="scanline" />
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-doulia-night/50 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
            >
              <Home size={18} />
              {t.goHome}
            </button>
            <button 
              onClick={() => onNavigate('solutions')}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
            >
              <Layers size={18} />
              {t.solutions}
            </button>
            <button 
              onClick={() => onNavigate('audit')}
              className="flex items-center gap-2 text-doulia-turquoise hover:text-doulia-lime transition-colors text-sm font-bold uppercase tracking-widest"
            >
              <Activity size={18} />
              {t.audit}
            </button>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
          >
            <X size={32} />
          </button>
        </div>
      </nav>

      <section className="py-24 px-4 min-h-screen flex items-center justify-center text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-doulia-lime mb-6 uppercase tracking-tighter">
              {t.title}
            </h2>
            <p className="text-xl text-white/60 mb-16 max-w-2xl mx-auto font-light">
              {t.subtitle}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16">
              <a 
                href="https://www.doulia.cm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="glass-panel p-6 md:p-8 rounded-3xl hover:border-doulia-lime/30 transition-all group"
              >
                <div className="w-12 h-12 bg-doulia-lime/10 rounded-xl flex items-center justify-center text-doulia-lime mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Globe size={24} />
                </div>
                <p className="font-bold text-white mb-1 text-sm md:text-base">{t.website}</p>
                <p className="text-[10px] md:text-sm text-white/40">www.doulia.cm</p>
              </a>

              <a 
                href="mailto:contact@doulia.cm"
                className="glass-panel p-6 md:p-8 rounded-3xl hover:border-doulia-lime/30 transition-all group"
              >
                <div className="w-12 h-12 bg-doulia-lime/10 rounded-xl flex items-center justify-center text-doulia-lime mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <p className="font-bold text-white mb-1 text-sm md:text-base">{t.email}</p>
                <p className="text-[10px] md:text-sm text-white/40">contact@doulia.cm</p>
              </a>

              <a 
                href="https://www.linkedin.com/company/doulia"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel p-6 md:p-8 rounded-3xl hover:border-doulia-lime/30 transition-all group"
              >
                <div className="w-12 h-12 bg-doulia-lime/10 rounded-xl flex items-center justify-center text-doulia-lime mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Linkedin size={24} />
                </div>
                <p className="font-bold text-white mb-1 text-sm md:text-base">{t.linkedin}</p>
                <p className="text-[10px] md:text-sm text-white/40">Doulia</p>
              </a>

              <a 
                href="https://www.facebook.com/doulia"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel p-6 md:p-8 rounded-3xl hover:border-doulia-lime/30 transition-all group"
              >
                <div className="w-12 h-12 bg-doulia-lime/10 rounded-xl flex items-center justify-center text-doulia-lime mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Facebook size={24} />
                </div>
                <p className="font-bold text-white mb-1 text-sm md:text-base">{t.facebook}</p>
                <p className="text-[10px] md:text-sm text-white/40">Doulia</p>
              </a>
            </div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-block glass-panel border-doulia-lime/30 p-8 md:p-12 rounded-[2.5rem] shadow-glow-lime/10"
            >
              <div className="flex items-center justify-center gap-3 text-doulia-lime mb-4">
                <MessageSquare size={24} />
                <p className="font-bold uppercase tracking-widest text-sm md:text-base">{t.whatsapp}</p>
              </div>
              <p className="text-2xl md:text-3xl text-white font-display font-bold tracking-tight mb-2">
                (+237) 6 56 30 48 18
              </p>
              <p className="text-lg text-white/60 tracking-wide">
                6 73 04 31 27 | 6 88 95 40 53
              </p>
            </motion.div>

            <p className="mt-16 text-xs text-white/20 uppercase tracking-[0.3em] leading-relaxed max-w-lg mx-auto">
              {t.footer}
            </p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default ContactPage;
