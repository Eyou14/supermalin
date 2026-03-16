import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  X, 
  Send, 
  User, 
  ShieldCheck, 
  Check, 
  Minus,
  Maximize2,
  Headphones,
  Zap,
  Package,
  HelpCircle
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'expert';
  timestamp: Date;
}

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Bonjour ! Je suis Marc, votre expert SuperMalin. Comment puis-je vous aider aujourd'hui ?",
      sender: 'expert',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulated Expert Response
    setTimeout(() => {
      let expertText = "Je vais me renseigner pour vous. Avez-vous une référence de produit spécifique ?";
      
      if (inputValue.toLowerCase().includes('livraison')) {
        expertText = "Nos colis sont expédiés sous 24h/48h depuis notre entrepôt de Lille. Vous recevrez un lien de suivi dès l'envoi.";
      } else if (inputValue.toLowerCase().includes('état') || inputValue.toLowerCase().includes('condition')) {
        expertText = "Chaque produit est testé sur 25 points de contrôle. Les badges 'Testé' vous garantissent un fonctionnement parfait.";
      } else if (inputValue.toLowerCase().includes('vendre')) {
        expertText = "Pour vendre, utilisez notre simulateur dans l'onglet 'Vendre / Estimer'. Nous rachetons cash vos appareils !";
      }

      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: expertText,
        sender: 'expert',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const quickActions = [
    { label: "État d'un produit", icon: ShieldCheck, color: "text-green-600" },
    { label: "Suivi livraison", icon: Package, color: "text-blue-600" },
    { label: "Vendre un article", icon: Zap, color: "text-orange-600" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 20 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-orange-600/40 hover:bg-orange-700 transition-all group relative"
          >
            <MessageCircle size={28} />
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-500 border-2 border-white text-[10px] font-black items-center justify-center">1</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '550px'
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="w-[380px] bg-white rounded-[2.5rem] shadow-2xl shadow-gray-400/30 border border-gray-100 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gray-900 p-6 text-white shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white/10">
                       <Headphones size={24} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-black text-sm">Marc • Expert SuperMalin</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">En ligne - Répond en 2 min</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400"
                  >
                    {isMinimized ? <Maximize2 size={18} /> : <Minus size={18} />}
                  </button>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-red-500 rounded-xl transition-colors text-gray-400 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              
              {!isMinimized && (
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500/20 text-green-400 rounded-lg flex items-center justify-center">
                    <ShieldCheck size={18} />
                  </div>
                  <p className="text-[10px] font-bold text-gray-300">Vos échanges sont privés et sécurisés par cryptage.</p>
                </div>
              )}
            </div>

            {!isMinimized && (
              <div className="contents">
                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 no-scrollbar">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] space-y-1`}>
                        <div className={`p-4 rounded-[1.5rem] text-sm leading-relaxed shadow-sm ${
                          msg.sender === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                        }`}>
                          {msg.text}
                        </div>
                        <div className={`flex items-center gap-1 text-[9px] font-black uppercase text-gray-400 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {msg.sender === 'user' && <Check size={10} className="text-blue-500" />}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-gray-50 bg-white">
                  {quickActions.map((action, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        setInputValue(action.label);
                        handleSend();
                      }}
                      className="whitespace-nowrap flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-all text-[10px] font-black uppercase text-gray-600"
                    >
                      <action.icon size={12} className={action.color} />
                      {action.label}
                    </button>
                  ))}
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white border-t border-gray-50">
                  <form onSubmit={handleSend} className="relative">
                    <input 
                      type="text" 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Posez votre question..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all pr-14"
                    />
                    <button 
                      type="submit"
                      disabled={!inputValue.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all disabled:opacity-50 disabled:bg-gray-300 shadow-lg shadow-orange-600/20"
                    >
                      <Send size={18} />
                    </button>
                  </form>
                  <p className="mt-4 text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <HelpCircle size={12} /> Centre d'aide disponible 24/7
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
