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
    <div className="relative bg-gray-900 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div className="absolute top-0 -left-8 w-80 h-80 bg-orange-600 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-700 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-orange-800 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative pt-16 pb-10 md:pt-24 md:pb-20 lg:pb-32">
        <div className="lg:max-w-[52%]">
          {/* Badge arrivage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-orange-600/15 border border-orange-500/30 text-orange-400 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              <Zap size={15} />
              <span>{bannerMessages.message1}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
              Déstockage{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
                Multi-Catégories
              </span>
              <br />
              <span className="text-gray-300 text-3xl md:text-4xl lg:text-5xl font-bold">
                Arrivages & Bons Plans.
              </span>
            </h1>

            <p className="text-base md:text-lg text-gray-400 mb-8 max-w-xl leading-relaxed">
              Produits neufs, retours clients ou fin de série — testés, garantis et livrés en 48h.
              Prix imbattables sur le High-Tech, l'Électroménager, la Mode et plus encore.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <button
                onClick={() => onNavigate('shop')}
                className="bg-orange-600 hover:bg-orange-700 text-white px-7 py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-orange-900/40"
              >
                Découvrir la boutique
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => onNavigate('new-arrivals')}
                className="bg-white/8 hover:bg-white/15 text-white border border-white/15 px-7 py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all"
              >
                <Package size={18} className="text-orange-400" />
                Nouveaux arrivages
              </button>
            </div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { icon: ShieldCheck, label: "Produits Testés",  sub: "Garantie 12 mois" },
              { icon: Zap,         label: "Paiement Sécurisé", sub: "CB, Apple Pay" },
              { icon: Package,     label: "Livraison 48h",    sub: "Colissimo & Relay" },
              { icon: RotateCcw,   label: "Retours 14j",      sub: "Satisfait ou remboursé" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <item.icon className="text-orange-500" size={22} />
                <p className="text-white font-bold text-sm">{item.label}</p>
                <p className="text-gray-500 text-xs">{item.sub}</p>
              </div>
            ))}
          </motion.div>

          {/* Catégories - visible mobile uniquement */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-8 flex flex-wrap gap-2 lg:hidden"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => onNavigate('shop')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${cat.color} transition-all hover:scale-105`}
              >
                <cat.icon size={13} />
                {cat.label}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Hero image — Desktop uniquement */}
      <div className="hidden lg:block absolute top-0 right-0 w-[46%] h-full">
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="relative w-full h-full"
        >
          {/* Dégradé gauche pour fondu avec le fond */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-900 to-transparent z-10" />
          {/* Dégradé bas */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent z-10" />

          <img
            src="https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=1400&auto=format&fit=crop"
            className="w-full h-full object-cover object-center"
            alt="Produits high-tech SuperMalin"
          />

          {/* Badge flottant arrivage */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute top-16 left-8 z-20 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-[220px]"
          >
            <div className="bg-orange-100 text-orange-600 p-2.5 rounded-xl shrink-0">
              <Package size={20} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Nouveau lot !</p>
              <p className="text-sm font-black text-gray-900 leading-tight">{bannerMessages.message2}</p>
            </div>
          </motion.div>

          {/* Badge remise */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, duration: 0.4 }}
            className="absolute bottom-24 left-12 z-20 bg-orange-600 text-white px-4 py-2 rounded-xl shadow-xl font-black text-sm"
          >
            Jusqu'à −70%
          </motion.div>

          {/* Badges catégories */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="absolute bottom-36 left-8 z-20 flex flex-col gap-2"
          >
            {CATEGORIES.map((cat) => (
              <div
                key={cat.label}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${cat.color} backdrop-blur-sm`}
              >
                <cat.icon size={11} />
                {cat.label}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
