import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Send, 
  CheckCircle2, 
  ClipboardList, 
  MessageSquare,
  Clock,
  Layout,
  Database,
  Search,
  Zap,
  Globe,
  Smile,
  Check
} from 'lucide-react';

interface AuditFormProps {
  onClose: () => void;
  onSubmit: (data: AuditData) => void;
}

export interface AuditData {
  name: string;
  company: string;
  whatsapp: string;
  challenge: string;
  volume?: string;
  software?: string;
  cahierCharges?: string;
  description: string;
  existingTools: string;
  priority: string;
}

const steps = [
  {
    id: 'intro',
    title: 'Bienvenue dans l\'espace diagnostic de DOULIA.',
    subtitle: 'Notre mission : comprendre vos défis actuels pour construire les solutions IA adaptées.',
    question: 'Prêt à nous parler de votre entreprise ?',
    type: 'welcome'
  },
  {
    id: 'name',
    question: 'Pour commencer, comment pouvons-nous vous appeler ?',
    placeholder: 'Votre prénom ou nom complet...',
    type: 'text'
  },
  {
    id: 'company',
    question: (name: string) => `Ravi de faire votre connaissance ${name}. Quel est le nom de votre entreprise ou de votre projet ?`,
    placeholder: 'Nom de votre organisation...',
    type: 'text'
  },
  {
    id: 'whatsapp',
    question: 'Quel est votre numéro WhatsApp direct pour que nos experts vous fassent un retour rapide ?',
    placeholder: '+237 ...',
    type: 'tel'
  },
  {
    id: 'challenge',
    question: 'Si vous deviez pointer votre plus grand défi opérationnel actuel, lequel serait-ce ?',
    options: [
      { id: 'A', text: 'Nous perdons trop de temps à gérer les messages clients ou les réservations.', icon: <MessageSquare size={20} />, value: 'service_client' },
      { id: 'B', text: 'Nous sommes noyés sous les tâches administratives, la paperasse et les fichiers Excel.', icon: <Layout size={20} />, value: 'admin' },
      { id: 'C', text: 'Nous manquons de visibilité sur nos chiffres, nos stocks ou les prédictions de nos ventes.', icon: <Database size={20} />, value: 'data' },
      { id: 'D', text: 'Nous voulons un outil sur-mesure (Site Web IA, ERP, CRM) ou former nos équipes.', icon: <Search size={20} />, value: 'dev' }
    ],
    type: 'choice'
  },
  {
    id: 'volume',
    question: 'Environ combien de messages ou de réservations traitez-vous par jour sur WhatsApp et les réseaux sociaux ?',
    placeholder: 'Ex: 50, 100, 500...',
    type: 'text',
    condition: (data: any) => data.challenge === 'service_client'
  },
  {
    id: 'software',
    question: 'Quels logiciels utilisez-vous actuellement pour vos tâches administratives (Excel, logiciel métier, rien) ?',
    placeholder: 'Citez vos outils actuels...',
    type: 'text',
    condition: (data: any) => data.challenge === 'admin'
  },
  {
    id: 'cahierCharges',
    question: 'Avez-vous déjà une liste précise de fonctionnalités ou un cahier des charges pour votre projet ?',
    options: [
      { id: 'yes', text: 'Oui, c\'est déjà prêt.', value: 'oui' },
      { id: 'no', text: 'Non, j\'ai besoin d\'aide pour le définir.', value: 'non' }
    ],
    type: 'choice',
    condition: (data: any) => data.challenge === 'dev'
  },
  {
    id: 'description',
    question: 'Décrivez-nous ce problème avec vos propres mots. Plus vous donnerez de détails, plus notre proposition sera précise :',
    placeholder: 'Expliquez votre situation ici...',
    type: 'textarea'
  },
  {
    id: 'existingTools',
    question: 'Avez-vous déjà des outils en place pour gérer cela aujourd\'hui ?',
    placeholder: 'Racontez-nous ce que vous avez essayé...',
    type: 'textarea'
  },
  {
    id: 'priority',
    question: 'Quelle est la priorité de ce chantier pour vous ?',
    options: [
      { id: 'low', text: 'Exploration / Veille', value: 'faible' },
      { id: 'medium', text: 'Importance moyenne (3-6 mois)', value: 'moyenne' },
      { id: 'high', text: 'Urgent (maintenant / prochain mois)', value: 'haute' }
    ],
    type: 'choice'
  }
];

export default function AuditForm({ onClose, onSubmit }: AuditFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<AuditData>>({});
  const [inputValue, setInputValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const step = steps[currentStep];

  // Skip steps based on conditions
  useEffect(() => {
    if (step.condition && !step.condition(formData)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }
  }, [currentStep, formData, step]);

  const handleNext = () => {
    if (step.type === 'text' || step.type === 'tel' || step.type === 'textarea') {
      if (!inputValue.trim()) return;
      setFormData(prev => ({ ...prev, [step.id]: inputValue }));
      setInputValue('');
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleChoice = (value: string) => {
    setFormData(prev => ({ ...prev, [step.id]: value }));
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleFinalSubmit();
      }
    }, 400);
  };

  const handleFinalSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      onSubmit(formData as AuditData);
    }, 2000);
  };

  const currentQuestionText = typeof step.question === 'function' 
    ? step.question(formData.name || '') 
    : step.question;

  const progress = ((currentStep + 1) / steps.length) * 100;

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full gap-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10 }}
          className="w-20 h-20 bg-doulia-lime rounded-full flex items-center justify-center text-doulia-night"
        >
          <Check size={40} strokeWidth={3} />
        </motion.div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 font-display">Analyse en cours...</h2>
          <p className="text-white/60">Merci pour votre confiance. L\'équipe DOULIA revient vers vous très vite.</p>
        </div>
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 bg-doulia-lime rounded-full"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto w-full relative">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-doulia-lime shadow-[0_0_10px_rgba(190,242,100,0.5)]"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {step.type === 'welcome' && (
              <div className="space-y-4">
                <div className="p-2 bg-doulia-lime/10 rounded-xl w-fit text-doulia-lime">
                  <ClipboardList size={24} />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-display leading-tight">
                    {step.title}
                  </h2>
                  <p className="text-base text-white/60 mb-1">
                    {step.subtitle}
                  </p>
                </div>
                <div className="pt-2">
                  <div className="text-lg font-medium text-white mb-6 border-l-2 border-doulia-lime pl-4">
                    {currentQuestionText}
                  </div>
                  <button
                    onClick={handleNext}
                    className="group bg-doulia-lime text-doulia-night px-6 py-3 rounded-xl font-bold text-base flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-doulia-lime/20"
                  >
                    C'est parti !
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {(step.type === 'text' || step.type === 'tel' || step.type === 'textarea') && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-doulia-lime font-bold tracking-widest text-[10px] uppercase">Question {currentStep}</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight font-display">
                    {currentQuestionText}
                  </h2>
                </div>

                <div className="relative group">
                  {step.type === 'textarea' ? (
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={step.placeholder}
                      autoFocus
                      className="w-full bg-white/5 border-2 border-white/10 rounded-xl p-4 text-lg text-white placeholder:text-white/20 focus:border-doulia-lime focus:outline-none transition-all h-32 resize-none"
                    />
                  ) : (
                    <input
                      type={step.type}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                      placeholder={step.placeholder}
                      autoFocus
                      className="w-full bg-white/5 border-2 border-white/10 rounded-xl p-4 text-lg text-white placeholder:text-white/20 focus:border-doulia-lime focus:outline-none transition-all"
                    />
                  )}
                  <div className="absolute right-4 bottom-4 flex items-center gap-2 text-white/20 text-[10px] font-bold pointer-events-none group-focus-within:text-doulia-lime/40 transition-colors">
                    Pressez Entrée <ChevronRight size={12} />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button 
                    onClick={handlePrev}
                    className="flex items-center gap-2 text-white/40 hover:text-white transition-colors py-1 text-sm"
                  >
                    <ChevronLeft size={18} />
                    Retour
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!inputValue.trim()}
                    className="bg-doulia-lime text-doulia-night px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 disabled:opacity-30 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-doulia-lime/10 text-sm"
                  >
                    Suivant
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {step.type === 'choice' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-doulia-lime font-bold tracking-widest text-[10px] uppercase">Choix stratégique</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight font-display">
                    {currentQuestionText}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {step.options?.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleChoice(option.value)}
                      className="group relative flex items-center gap-4 p-4 bg-white/5 border-2 border-white/10 rounded-xl hover:bg-white/10 hover:border-doulia-lime/50 text-left transition-all active:scale-[0.98]"
                    >
                      {option.icon && (
                        <div className="p-2 bg-white/5 rounded-lg text-white/40 group-hover:bg-doulia-lime/10 group-hover:text-doulia-lime transition-all">
                          {option.icon}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-base font-bold text-white group-hover:text-doulia-lime transition-colors">
                          {option.text}
                        </p>
                      </div>
                      <div className="w-6 h-6 rounded-full border-2 border-white/10 flex items-center justify-center group-hover:border-doulia-lime transition-all shrink-0">
                        <div className="w-3 h-3 rounded-full bg-doulia-lime scale-0 group-hover:scale-100 transition-transform shadow-[0_0_10px_rgba(190,242,100,0.5)]" />
                      </div>
                      <div className="absolute top-2 right-4 text-[8px] font-black text-white/5 uppercase">Option {option.id}</div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button 
                    onClick={handlePrev}
                    className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm"
                  >
                    <ChevronLeft size={18} />
                    Retour
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-6 border-t border-white/5 bg-black/20 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-widest">
          <Zap size={12} />
          Powered by DOULIA AI Vision
        </div>
      </div>
    </div>
  );
}
