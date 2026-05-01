import React, { useState, useEffect } from "react";
import { ArrowRight, ShieldCheck, Zap, Package, RotateCcw, Cpu, Shirt, Home, Dumbbell } from "lucide-react";
import { motion } from "motion/react";
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e62e42f7`;

const CATEGORIES = [
  { icon: Cpu,      label: "High-Tech",      color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  { icon: Home,     label: "Électroménager", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  { icon: Shirt,    label: "Mode",           color: "bg-pink-500/20 text-pink-300 border-pink-500/30" },
  { icon: Dumbbell, label: "Sport",          color: "bg-green-500/20 text-green-300 border-green-500/30" },
];

export const Hero = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [bannerMessages, setBannerMessages] = useState({
    message1: 'Derniers arrivages : +250 produits cette semaine',
    message2: '120 MacBook Pro M3'
  });

  useEffect(() => {
    const loadBannerMessages = async () => {
      try {
        const response = await fetch(`${API_URL}/sections`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        });
        if (response.ok) {
          const config = await response.json();
          if (config.bannerMessage1 || config.bannerMessage2) {
            setBannerMessages({
              message1: config.bannerMessage1 || 'Derniers arrivages : +250 produits cette semaine',
              message2: config.bannerMessage2 || '120 MacBook Pro M3'
            });
          }
        }
      } catch (error) {
        console.error('Error loading banner messages:', error);
      }
    };
    loadBannerMessages();
  }, []);

  return (
    <div className="relative bg-gray-900 overflow-hidden min-h-[420px] md:min-h-[540px]">
      {/* Blobs d'arrière-plan */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 -left-8 w-96 h-96 bg-orange-700/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-800/20 rounded-full blur-3xl" />
      </div>

      {/* Hero image — Desktop, positionnée en arrière-plan à droite */}
      <div className="hidden lg:block absolute top-0 right-0 w-[50%] h-full">
        {/* Fondu gauche fort pour blend avec le texte */}
        <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent z-10" />
        {/* Fondu bas subtil */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900/60 to-transparent z-10" />
        {/* Fondu haut subtil */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-gray-900/40 to-transparent z-10" />

        <motion.img
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1400&auto=format&fit=crop"
          className="w-full h-full object-cover object-center"
          alt="MacBook et iPhone — SuperMalin"
        />

        {/* Badge arrivage flottant — discret et épuré */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="absolute top-12 left-12 z-20 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3"
        >
          <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
            <Package size={16} className="text-orange-600" />
          </div>
          <div>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Nouveau lot</p>
            <p className="text-xs font-black text-gray-900">{bannerMessages.message2}</p>
          </div>
        </motion.div>
      </div>

      {/* Contenu texte */}
      <div className="container mx-auto px-4 relative z-10 pt-10 pb-10 md:pt-24 md:pb-20">
        <div className="lg:max-w-[54%]">
          {/* Badge arrivage */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-orange-600/15 border border-orange-500/25 text-orange-400 px-4 py-1.5 rounded-full text-sm font-bold mb-6"
          >
            <Zap size={14} />
            <span>{bannerMessages.message1}</span>
          </motion.div>

          {/* Titre */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-tight mb-5"
          >
            Déstockage{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              Multi-Catégories
            </span>
            <br />
            <span className="text-gray-300 font-bold text-3xl md:text-4xl">
              Arrivages & Bons Plans.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-lg"
          >
            Produits neufs, retours clients ou fin de série — testés, garantis et livrés en 48h.
            Prix imbattables sur le High-Tech, l'Électroménager, la Mode et plus encore.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 mb-12"
          >
            <button
              onClick={() => onNavigate('shop')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-7 py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-orange-900/30"
            >
              Découvrir la boutique
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => onNavigate('new-arrivals')}
              className="bg-white/8 hover:bg-white/14 text-white border border-white/15 px-7 py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all"
            >
              <Package size={17} className="text-orange-400" />
              Nouveaux arrivages
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="flex gap-5 pb-2 overflow-x-auto md:grid md:grid-cols-4 md:overflow-visible scrollbar-none"
          >
            {[
              { icon: ShieldCheck, label: "Produits Testés",   sub: "Garantie 12 mois" },
              { icon: Zap,         label: "Paiement Sécurisé", sub: "CB, Apple Pay" },
              { icon: Package,     label: "Livraison 48h",     sub: "Colissimo & Relay" },
              { icon: RotateCcw,   label: "Retours 14j",       sub: "Satisfait ou remboursé" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1.5 shrink-0 min-w-[110px] md:min-w-0">
                <item.icon className="text-orange-500" size={20} />
                <p className="text-white font-bold text-sm whitespace-nowrap md:whitespace-normal">{item.label}</p>
                <p className="text-gray-500 text-xs">{item.sub}</p>
              </div>
            ))}
          </motion.div>

          {/* Catégories — mobile uniquement */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-8 flex flex-wrap gap-2 lg:hidden"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => onNavigate('shop')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${cat.color} transition-all hover:scale-105`}
              >
                <cat.icon size={12} />
                {cat.label}
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
