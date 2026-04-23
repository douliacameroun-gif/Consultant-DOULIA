import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Phone, Video, MoreVertical, ChevronLeft, CheckCheck } from 'lucide-react';

const WhatsAppDemo: React.FC = () => {
  const [messages, setMessages] = useState<{ id: number; text: string; sender: 'client' | 'bot'; time: string }[]>([]);
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const scenario = [
    { text: "Bonjour, j'aimerais réserver une table pour 4 ce soir.", sender: 'client' as const, delay: 1000 },
    { text: "Bonjour ! Bienvenue chez DOULIA Grill. Je vérifie nos disponibilités... 🕒", sender: 'bot' as const, delay: 2000 },
    { text: "C'est parfait ! Nous avons une table à 19h ou 20h30. Laquelle préférez-vous ?", sender: 'bot' as const, delay: 1500 },
    { text: "19h c'est super. Est-ce que vous avez un parking ?", sender: 'client' as const, delay: 2000 },
    { text: "Oui, un parking sécurisé est à votre disposition gratuitement. ✅", sender: 'bot' as const, delay: 1500 },
    { text: "C'est noté ! Votre réservation pour 4 personnes à 19h est confirmée. À ce soir ! 👋", sender: 'bot' as const, delay: 1500 },
  ];

  useEffect(() => {
    if (step < scenario.length) {
      const current = scenario[step];
      const timer = setTimeout(() => {
        if (current.sender === 'bot') {
          setIsTyping(true);
          setTimeout(() => {
            setMessages(prev => [...prev, { ...current, id: Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
            setIsTyping(false);
            setStep(s => s + 1);
          }, 1500);
        } else {
          setMessages(prev => [...prev, { ...current, id: Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
          setStep(s => s + 1);
        }
      }, current.delay);
      return () => clearTimeout(timer);
    } else {
        // Reset after 5 seconds to loop
        const timer = setTimeout(() => {
            setMessages([]);
            setStep(0);
        }, 5000);
        return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="relative w-full max-w-[280px] h-[560px] mx-auto bg-black rounded-[3rem] border-[8px] border-white/10 shadow-2xl overflow-hidden font-sans">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20 flex items-center justify-center">
        <div className="w-10 h-1 bg-white/20 rounded-full" />
      </div>

      {/* Screen Content */}
      <div className="h-full flex flex-col bg-[#0b141a] text-white">
        {/* Header */}
        <div className="pt-8 pb-3 px-3 bg-[#202c33] flex items-center gap-2 border-b border-white/5">
          <ChevronLeft size={18} className="text-doulia-lime" />
          <div className="w-8 h-8 rounded-full bg-doulia-lime/20 flex items-center justify-center overflow-hidden">
             <img src="https://i.postimg.cc/kX1fmzXD/Doulia_Connect.jpg" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[10px] font-bold truncate">DOULIA Assistant</h4>
            <p className="text-[8px] text-white/40">En ligne</p>
          </div>
          <div className="flex gap-3 text-doulia-lime">
            <Video size={14} />
            <Phone size={14} />
            <MoreVertical size={14} />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[url('https://i.postimg.cc/K8J7P9jS/whats-bg.png')] bg-repeat bg-center bg-fixed custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-2 rounded-lg text-[10px] relative shadow-sm ${
                  msg.sender === 'client' 
                    ? 'bg-[#005c4b] border-t border-r border-white/10 rounded-tr-none' 
                    : 'bg-[#202c33] border-t border-l border-white/10 rounded-tl-none'
                }`}>
                  <p className="leading-tight">{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[7px] text-white/40">{msg.time}</span>
                    {msg.sender === 'client' && <CheckCheck size={10} className="text-doulia-lime" />}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-[#202c33] p-2 rounded-lg rounded-tl-none flex gap-1">
                <span className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Input */}
        <div className="p-2 bg-[#202c33] flex items-center gap-2">
          <div className="flex-1 bg-[#2a3942] rounded-full px-3 py-1.5 flex items-center gap-2">
             <div className="text-white/20 text-[10px]">Message...</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-doulia-lime flex items-center justify-center text-doulia-night">
            <Send size={14} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppDemo;
