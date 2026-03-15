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
  onOpenExternal: (url: string) => void;
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

const ContactPage: React.FC<ContactPageProps> = ({ onClose, lang, onNavigate, onOpenExternal }) => {
  const t = translations[lang];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-doulia-night/95 backdrop-blur-2xl flex flex-col overflow-hidden"
    >
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-20" />
      <div className="scanline" />
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-doulia-night/50 backdrop-blur-md border-b border-white/5 px-6 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
            >
              <Home size={14} />
              {t.goHome}
            </button>
            <button 
              onClick={() => onNavigate('solutions')}
              className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
            >
              <Layers size={14} />
              {t.solutions}
            </button>
            <button 
              onClick={() => onNavigate('audit')}
              className="flex items-center gap-1.5 text-doulia-lime hover:text-doulia-gold transition-colors text-[10px] font-bold uppercase tracking-widest"
            >
              <Activity size={14} />
              {t.audit}
            </button>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
      </nav>

      <section className="flex-1 py-12 px-4 overflow-y-auto flex items-center justify-center text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl md:text-4xl font-display font-bold text-doulia-lime mb-3 uppercase tracking-tighter">
              {t.title}
            </h2>
            <p className="text-base text-white/60 mb-8 max-w-xl mx-auto font-light">
              {t.subtitle}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
              {/* Site Web */}
              <button 
                onClick={() => onOpenExternal("https://douliacameroun-825a6.web.app/")}
                className="glass-panel p-4 md:p-5 rounded-2xl hover:border-doulia-lime/30 transition-all group text-center"
              >
                <div className="w-10 h-10 bg-doulia-lime/10 rounded-xl flex items-center justify-center text-doulia-lime mb-3 mx-auto group-hover:scale-110 transition-transform">
                  <Globe size={20} />
                </div>
                <p className="font-bold text-white mb-0.5 text-xs md:text-sm">{t.website}</p>
                <p className="text-[9px] md:text-xs text-white/40">www.doulia.cm</p>
              </button>

              {/* Email */}
              <a 
                href="mailto:douliacameroun@gmail.com"
                className="glass-panel p-4 md:p-5 rounded-2xl hover:border-doulia-lime/30 transition-all group text-center"
              >
                <div className="w-10 h-10 bg-doulia-lime/10 rounded-xl flex items-center justify-center text-doulia-lime mb-3 mx-auto group-hover:scale-110 transition-transform">
                  <Mail size={20} />
                </div>
                <p className="font-bold text-white mb-0.5 text-xs md:text-sm">{t.email}</p>
                <p className="text-[9px] md:text-xs text-white/40">contact@doulia.cm</p>
              </a>

              {/* LinkedIn */}
              <button 
                onClick={() => onOpenExternal("https://www.linkedin.com/company/doulia/")}
                className="glass-panel p-4 md:p-5 rounded-2xl hover:border-doulia-lime/30 transition-all group text-center"
              >
                <div className="w-10 h-10 bg-doulia-lime/10 rounded-xl flex items-center justify-center text-doulia-lime mb-3 mx-auto group-hover:scale-110 transition-transform">
                  <Linkedin size={20} />
                </div>
                <p className="font-bold text-white mb-0.5 text-xs md:text-sm">{t.linkedin}</p>
                <p className="text-[9px] md:text-xs text-white/40">Doulia</p>
              </button>

              {/* Facebook */}
              <button 
                onClick={() => onOpenExternal("https://web.facebook.com/profile.php?id=61583620293750&locale=fr_FR")}
                className="glass-panel p-4 md:p-5 rounded-2xl hover:border-doulia-lime/30 transition-all group text-center"
              >
                <div className="w-10 h-10 bg-doulia-lime/10 rounded-xl flex items-center justify-center text-doulia-lime mb-3 mx-auto group-hover:scale-110 transition-transform">
                  <Facebook size={20} />
                </div>
                <p className="font-bold text-white mb-0.5 text-xs md:text-sm">{t.facebook}</p>
                <p className="text-[9px] md:text-xs text-white/40">Doulia</p>
              </button>
            </div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-block glass-panel border-doulia-lime/30 p-6 md:p-8 rounded-[2rem] shadow-glow-lime/10"
            >
              <div className="flex items-center justify-center gap-2 text-doulia-lime mb-3">
                <MessageSquare size={20} />
                <p className="font-bold uppercase tracking-widest text-xs md:text-sm">{t.whatsapp}</p>
              </div>
              <p className="text-xl md:text-2xl text-white font-display font-bold tracking-tight mb-1">
                (+237) 6 73 04 31 27
              </p>
              <p className="text-base text-white/60 tracking-wide">
                6 56 30 48 18 | 6 88 95 40 53
              </p>
            </motion.div>

            <p className="mt-8 text-[10px] text-white/20 uppercase tracking-[0.3em] leading-relaxed max-w-md mx-auto">
              {t.footer}
            </p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default ContactPage;