import React, { useState, useEffect } from "react";
import { ArrowRight, ShieldCheck, Zap, Gavel, Package, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e62e42f7`;

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
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-600 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-blue-600 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative pt-16 pb-20 md:pt-24 md:pb-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-orange-600/10 border border-orange-600/20 text-orange-500 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              <Zap size={16} />
              <span>{bannerMessages.message1}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Déstockage Multi-Catégories : <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                Arrivages & Bons Plans.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl">
              Produits neufs, retours clients ou fin de série. Testés, garantis et livrés en 48h. Profitez de prix imbattables sur toutes nos catégories : High-Tech, Électroménager, Mode et plus encore.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onNavigate('shop')}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                Découvrir la boutique
                <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => onNavigate('new-arrivals')}
                className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all"
              >
                <Package size={20} className="text-orange-500" />
                Nouveaux arrivages
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { icon: ShieldCheck, label: "Produits Testés", sub: "Garantie 12 mois" },
              { icon: Zap, label: "Paiement Sécurisé", sub: "CB, Apple Pay" },
              { icon: Package, label: "Livraison 48h", sub: "Colissimo & Relay" },
              { icon: RotateCcw, label: "Retours 14j", sub: "Satisfait ou remboursé" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <item.icon className="text-orange-500" size={24} />
                <p className="text-white font-bold text-sm">{item.label}</p>
                <p className="text-gray-500 text-xs">{item.sub}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Hero Image Mockup (Desktop) */}
      <div className="hidden lg:block absolute top-1/2 -right-20 -translate-y-1/2 w-1/2 h-[600px]">
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full h-full"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-l from-transparent to-gray-900 z-10" />
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1583737077382-3f51318d6074?q=80&w=1200"
            className="w-full h-full object-cover rounded-l-3xl shadow-2xl"
            alt="Destocking warehouse"
          />
          {/* Floating badge */}
          <div className="absolute top-20 left-10 z-20 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce-slow">
            <div className="bg-green-100 text-green-600 p-3 rounded-xl">
              <Package size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Nouveau lot arrivé !</p>
              <p className="text-sm font-bold text-gray-900">{bannerMessages.message2}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
