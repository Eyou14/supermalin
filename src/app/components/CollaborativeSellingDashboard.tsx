import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Search, 
  Camera, 
  Sparkles, 
  Gavel, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ArrowUpRight, 
  Info,
  DollarSign,
  History,
  AlertCircle,
  Eye,
  MessageSquare,
  Share2
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

type SaleStatus = 'RECEIVED' | 'PROCESSING' | 'PHOTO' | 'LISTED' | 'SOLD';

interface CollaborativeItem {
  id: string;
  name: string;
  image: string;
  category: string;
  status: SaleStatus;
  estimatedValue: number;
  finalPrice?: number;
  userGain?: number;
  commission: number; // percentage
  createdAt: string;
  views?: number;
  bids?: number;
  lastUpdate: string;
}

const MOCK_SALES: CollaborativeItem[] = [
  {
    id: '1',
    name: 'iPhone 13 Pro - 256Go',
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=400',
    category: 'Téléphonie',
    status: 'LISTED',
    estimatedValue: 650,
    commission: 15,
    createdAt: '2026-02-01',
    views: 142,
    bids: 8,
    lastUpdate: 'Il y a 2 heures',
  },
  {
    id: '2',
    name: 'MacBook Air M2 2022',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=400',
    category: 'Informatique',
    status: 'PHOTO',
    estimatedValue: 950,
    commission: 12,
    createdAt: '2026-02-10',
    lastUpdate: 'Hier à 14:30',
  },
  {
    id: '3',
    name: 'Nintendo Switch OLED',
    image: 'https://images.unsplash.com/photo-1623577742211-18e001815152?q=80&w=400',
    category: 'Gaming',
    status: 'SOLD',
    estimatedValue: 280,
    finalPrice: 310,
    userGain: 272.8,
    commission: 12,
    createdAt: '2026-01-20',
    lastUpdate: 'Le 10/02/2026',
  },
  {
    id: '4',
    name: 'AirPods Pro (2nd Gen)',
    image: 'https://images.unsplash.com/photo-1588423770574-9102111d41e8?q=80&w=400',
    category: 'Audio',
    status: 'PROCESSING',
    estimatedValue: 180,
    commission: 15,
    createdAt: '2026-02-12',
    lastUpdate: 'Ce matin',
  }
];

const STATUS_CONFIG = {
  RECEIVED: { label: 'Reçu', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', step: 1 },
  PROCESSING: { label: 'Expertise & Nettoyage', icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50', step: 2 },
  PHOTO: { label: 'Shooting Photo', icon: Camera, color: 'text-pink-600', bg: 'bg-pink-50', step: 3 },
  LISTED: { label: 'En vente', icon: Gavel, color: 'text-orange-600', bg: 'bg-orange-50', step: 4 },
  SOLD: { label: 'Vendu', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', step: 5 },
};

export const CollaborativeSellingDashboard: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<CollaborativeItem | null>(null);

  const totalGains = MOCK_SALES
    .filter(s => s.status === 'SOLD')
    .reduce((sum, s) => sum + (s.userGain || 0), 0);

  const potentialValue = MOCK_SALES
    .filter(s => s.status !== 'SOLD')
    .reduce((sum, s) => sum + (s.estimatedValue * (1 - s.commission / 100)), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Promo Banner */}
      <div className="bg-orange-50 border border-orange-100 rounded-3xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 animate-pulse">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-sm font-black text-orange-900">Nouveau : Boostez vos ventes !</p>
            <p className="text-xs text-orange-700">Partagez vos annonces sur les réseaux pour attirer plus d'enchérisseurs.</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-white text-orange-600 rounded-xl text-xs font-black border border-orange-200 hover:bg-orange-100 transition-colors">
          En savoir plus
        </button>
      </div>

      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
            <DollarSign size={80} />
          </div>
          <p className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Gains Totaux</p>
          <h3 className="text-3xl font-black text-gray-900">{totalGains.toFixed(2)}€</h3>
          <p className="text-[10px] text-green-600 font-bold mt-2 flex items-center gap-1">
            <TrendingUp size={12} /> +12% ce mois-ci
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-orange-600 p-6 rounded-[2.5rem] text-white relative overflow-hidden group shadow-xl shadow-orange-600/20"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp size={80} />
          </div>
          <p className="text-xs font-black uppercase text-orange-200 tracking-widest mb-2">Valeur Potentielle</p>
          <h3 className="text-3xl font-black">{potentialValue.toFixed(2)}€</h3>
          <p className="text-[10px] text-orange-100 font-medium mt-2">Estimation pour 3 objets en cours</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gray-900 p-6 rounded-[2.5rem] text-white relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <Package size={80} />
          </div>
          <p className="text-xs font-black uppercase text-gray-400 tracking-widest mb-2">Objets Confiés</p>
          <h3 className="text-3xl font-black">{MOCK_SALES.length}</h3>
          <p className="text-[10px] text-gray-400 font-medium mt-2">1 objet vendu cette semaine</p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900">Suivi de vos ventes</h2>
            <p className="text-sm text-gray-500">Transparence totale sur chaque étape du processus.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-black text-orange-600 bg-orange-50 px-4 py-2 rounded-full border border-orange-100">
            <Sparkles size={14} /> Vente Collaborative Activée
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {MOCK_SALES.map((item) => (
            <div 
              key={item.id} 
              className="p-6 hover:bg-gray-50/50 transition-colors cursor-pointer group"
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                {/* Item Thumbnail */}
                <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                  <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase text-gray-400">{item.category}</span>
                    <span className="text-[10px] font-black text-gray-300">•</span>
                    <span className="text-[10px] font-black text-gray-400">Réf: SM-{item.id}2026</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock size={12} /> Mis à jour {item.lastUpdate}
                  </p>
                </div>

                {/* Progress Stepper */}
                <div className="flex-1 w-full max-w-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-black px-3 py-1 rounded-full ${STATUS_CONFIG[item.status].bg} ${STATUS_CONFIG[item.status].color}`}>
                      {STATUS_CONFIG[item.status].label}
                    </span>
                    <span className="text-xs font-black text-gray-400">Étape {STATUS_CONFIG[item.status].step}/5</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(STATUS_CONFIG[item.status].step / 5) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${item.status === 'SOLD' ? 'bg-green-500' : 'bg-orange-500'}`}
                    />
                  </div>
                </div>

                {/* Values */}
                <div className="text-right shrink-0 lg:w-32">
                  <p className="text-[10px] font-black uppercase text-gray-400">Gain estimé</p>
                  <p className="text-xl font-black text-gray-900">
                    {item.status === 'SOLD' ? item.userGain?.toFixed(2) : (item.estimatedValue * (1 - item.commission / 100)).toFixed(2)}€
                  </p>
                  <button className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-end gap-1 ml-auto">
                    Détails <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Item Details Modal / Panel */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
              >
                <Plus className="rotate-45" size={24} />
              </button>

              <div className="flex flex-col md:flex-row h-full">
                {/* Visuals */}
                <div className="md:w-1/2 bg-gray-50 p-8 flex flex-col items-center justify-center border-r border-gray-100">
                  <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-lg mb-6">
                    <ImageWithFallback src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center">
                      <Eye size={20} className="text-blue-500 mb-2" />
                      <span className="text-lg font-black">{selectedItem.views || 0}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Vues</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center">
                      <Gavel size={20} className="text-orange-500 mb-2" />
                      <span className="text-lg font-black">{selectedItem.bids || 0}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Enchères</span>
                    </div>
                  </div>
                </div>

                {/* Info & Steps */}
                <div className="md:w-1/2 p-8 flex flex-col">
                  <div className="mb-6">
                    <span className="text-[10px] font-black uppercase text-orange-600 bg-orange-50 px-2 py-1 rounded-md">{selectedItem.category}</span>
                    <h3 className="text-2xl font-black text-gray-900 mt-2">{selectedItem.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Confié le {new Date(selectedItem.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>

                  <div className="space-y-6 flex-1">
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest">Étapes de revente</h4>
                      {[
                        { step: 'RECEIVED', label: 'Arrivée chez SuperMalin', desc: 'Produit réceptionné et identifié.' },
                        { step: 'PROCESSING', label: 'Nettoyage & Test', desc: 'Audit technique complet et mise à neuf.' },
                        { step: 'PHOTO', label: 'Mise en valeur', desc: 'Shooting photo haute définition.' },
                        { step: 'LISTED', label: 'Vente active', desc: 'Produit en ligne sur la plateforme.' },
                        { step: 'SOLD', label: 'Transaction finalisée', desc: 'Vente confirmée, fonds débloqués.' },
                      ].map((s, i) => {
                        const stepIndex = i + 1;
                        const currentStepIndex = STATUS_CONFIG[selectedItem.status].step;
                        const isCompleted = stepIndex < currentStepIndex;
                        const isCurrent = stepIndex === currentStepIndex;

                        return (
                          <div key={s.step} className="flex gap-4 group">
                            <div className="flex flex-col items-center">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-colors ${
                                isCompleted ? 'bg-green-500 border-green-500 text-white' : 
                                isCurrent ? 'bg-orange-500 border-orange-500 text-white animate-pulse' : 
                                'bg-white border-gray-200 text-gray-300'
                              }`}>
                                {isCompleted ? <CheckCircle2 size={12} /> : stepIndex}
                              </div>
                              {i < 4 && (
                                <div className={`w-0.5 h-10 transition-colors ${isCompleted ? 'bg-green-500' : 'bg-gray-100'}`} />
                              )}
                            </div>
                            <div className="pt-0.5">
                              <p className={`text-sm font-black transition-colors ${isCurrent ? 'text-gray-900' : isCompleted ? 'text-gray-700' : 'text-gray-300'}`}>
                                {s.label}
                              </p>
                              <p className="text-[11px] text-gray-400 leading-tight mt-0.5">
                                {s.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-50 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 group cursor-help">
                        <span className="text-xs font-bold text-gray-500">Commission SuperMalin</span>
                        <Info size={12} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <span className="text-sm font-black text-gray-900">{selectedItem.commission}%</span>
                    </div>
                    
                    {selectedItem.status === 'SOLD' ? (
                      <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-green-700">Votre gain final</span>
                          <span className="text-lg font-black text-green-700">{selectedItem.userGain?.toFixed(2)}€</span>
                        </div>
                        <p className="text-[10px] text-green-600 font-medium">Fonds disponibles dans votre portefeuille.</p>
                      </div>
                    ) : (
                      <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-orange-700">Gain estimé</span>
                          <span className="text-lg font-black text-orange-700">
                            {(selectedItem.estimatedValue * (1 - selectedItem.commission / 100)).toFixed(2)}€
                          </span>
                        </div>
                        <p className="text-[10px] text-orange-600 font-medium">Basé sur une valeur de vente de {selectedItem.estimatedValue}€.</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button 
                        className="flex-1 py-3 bg-gray-900 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                        onClick={() => toast.info("Ouverture du chat avec un expert...")}
                      >
                        <MessageSquare size={14} /> Contacter un expert
                      </button>
                      <button 
                        className="p-3 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                        onClick={() => toast.success("Lien de suivi copié !")}
                      >
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Empty State / Call to action */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
          <HandshakeIcon size={150} />
        </div>
        <div className="relative z-10 max-w-xl">
          <h3 className="text-2xl font-black mb-4">Vous avez d'autres pépites qui dorment ?</h3>
          <p className="text-blue-100 text-sm mb-8">
            Profitez de notre expertise logistique et de notre base d'acheteurs passionnés pour vendre au meilleur prix sans aucun effort. On s'occupe de tout !
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-3 bg-white text-blue-700 rounded-2xl font-black hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2"
          >
            Lancer une nouvelle estimation <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const HandshakeIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m11 17 2 2 6-6" />
    <path d="m18 10 1-1a2 2 0 0 0-3-3l-7 7a2 2 0 0 0-1 1v2a2 2 0 0 0 3 3l1-1" />
    <path d="m12 18-3.5 3.5a2 2 0 0 1-3-3l1.5-1.5" />
    <path d="M18 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h1" />
  </svg>
);
