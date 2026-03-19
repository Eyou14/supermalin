import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gavel,
  Clock,
  ShieldCheck,
  Zap,
  Heart,
  Share2,
  ChevronLeft,
  Info,
  Eye,
  TrendingUp,
  Package,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Trophy,
  History
} from 'lucide-react';
import { Product } from './ProductCard';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onPlaceBid: (product: Product, amount: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onBack,
  onAddToCart,
  onPlaceBid,
  isWishlisted,
  onToggleWishlist
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [bidAmount, setBidAmount] = useState<number>((product.currentBid || product.price) + 5);
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const productTitle = product.title || product.name || 'Produit';

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image_url || product.image || ''].filter(Boolean);

  useEffect(() => {
    if (product.type !== 'auction' || !product.auctionEnd) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(product.auctionEnd!).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft('Terminée');
        clearInterval(interval);
      } else {
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${h}h ${m}m ${s}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [product]);

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bidAmount <= (product.currentBid || product.price)) {
      toast.error("L'enchère doit être supérieure au prix actuel.");
      return;
    }

    setIsPlacingBid(true);
    setTimeout(() => {
      onPlaceBid(product, bidAmount);
      setIsPlacingBid(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#ffffff']
      });
      toast.success("Enchère placée avec succès !", {
        description: `Vous êtes maintenant le meilleur enchérisseur à ${bidAmount}€.`
      });
    }, 1000);
  };

  const buyNowPrice =
    product.type === 'auction'
      ? Math.round((product.currentBid || product.price) * 1.35)
      : product.price;

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors group"
        >
          <div className="p-2 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
            <ChevronLeft size={20} />
          </div>
          Retour aux articles
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Lien copié dans le presse-papier !');
            }}
            className="p-3 bg-white border border-gray-100 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
          >
            <Share2 size={20} />
          </button>
          <button
            onClick={() => onToggleWishlist(product.id)}
            className={`p-3 rounded-full transition-all shadow-sm border ${
              isWishlisted
                ? 'bg-orange-50 border-orange-200 text-orange-600'
                : 'bg-white border-gray-100 text-gray-400 hover:text-orange-600'
            }`}
          >
            <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-gray-50 rounded-[2.5rem] overflow-hidden aspect-[4/3] relative group">
            <ImageWithFallback
              src={images[activeImageIdx] || ''}
              alt={productTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {product.type === 'auction' && (
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <div className="bg-orange-600 text-white px-4 py-2 rounded-2xl flex items-center gap-2 font-black shadow-lg shadow-orange-600/20">
                  <Clock size={18} className="animate-pulse" />
                  {timeLeft}
                </div>
              </div>
            )}
            <div className="absolute bottom-6 right-6 flex gap-3">
              <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 border border-white/20 shadow-lg">
                <Eye size={14} className="text-blue-600" />
                {Math.floor(Math.random() * 200) + 50} Vues aujourd'hui
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                  activeImageIdx === idx
                    ? 'border-orange-500 ring-4 ring-orange-500/10'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <ImageWithFallback
                  src={img}
                  alt={`${productTitle} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 space-y-8">
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-4">Description de l'expert</h2>
              <p className="text-gray-600 leading-relaxed">
                Ce {productTitle} a été soigneusement inspecté par nos techniciens.{' '}
                {product.tested
                  ? 'Toutes les fonctionnalités ont été testées et sont 100% opérationnelles.'
                  : "Produit vendu en l'état."}
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <ShieldCheck className="text-green-600" size={24} />
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400">État certifié</p>
                    <p className="text-sm font-bold text-gray-900">{product.condition}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <Package className="text-blue-600" size={24} />
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400">Origine</p>
                    <p className="text-sm font-bold text-gray-900">Rachat Particulier (HDF)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-6">Nos Engagements SuperMalin</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Truck className="text-orange-600" size={24} />
                  <p className="font-bold text-sm">Expédition 24/48h</p>
                  <p className="text-xs text-gray-500">Mondial Relay ou Chronopost</p>
                </div>
                <div className="space-y-2">
                  <RotateCcw className="text-orange-600" size={24} />
                  <p className="font-bold text-sm">14 jours pour changer d'avis</p>
                  <p className="text-xs text-gray-500">Retour simple et rapide</p>
                </div>
                <div className="space-y-2">
                  <MessageCircle className="text-orange-600" size={24} />
                  <p className="font-bold text-sm">Support Réactif</p>
                  <p className="text-xs text-gray-500">Équipe basée en France</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                  {product.category}
                </span>
                <span className="text-gray-200">•</span>
                <span className="text-[10px] font-black uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                  Réf: SM-{product.id}
                </span>
              </div>
              <h1 className="text-3xl font-black text-gray-900 leading-tight mb-4">{productTitle}</h1>

              {product.type === 'auction' ? (
                <div className="space-y-8">
                  <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[11px] font-black uppercase text-orange-400 mb-1">
                          Enchère actuelle
                        </p>
                        <div className="text-4xl font-black text-gray-900">
                          {product.currentBid?.toLocaleString('fr-FR')}€
                        </div>
                        <button
                          onClick={() => setShowHistory(!showHistory)}
                          className="mt-2 text-xs font-bold text-orange-600 flex items-center gap-1 hover:underline"
                        >
                          <History size={14} /> {product.bidCount || 0} enchères • Voir l'historique
                        </button>
                      </div>
                      <div className="bg-white px-3 py-1.5 rounded-xl border border-orange-100 flex items-center gap-1.5 shadow-sm">
                        <TrendingUp size={16} className="text-green-600" />
                        <span className="text-xs font-black text-green-700">Tendance Forte</span>
                      </div>
                    </div>

                    <form onSubmit={handleBidSubmit} className="space-y-4">
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(Number(e.target.value))}
                            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-xl font-black outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500"
                          />
                          <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-gray-400">
                            €
                          </span>
                        </div>
                        <button
                          type="submit"
                          disabled={isPlacingBid}
                          className="px-8 bg-gray-900 text-white rounded-2xl font-black hover:bg-orange-600 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                        >
                          {isPlacingBid ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          ) : (
                            'Enchérir'
                          )}
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 text-center font-bold uppercase">
                        Mise minimale : {(product.currentBid || product.price) + 1}€
                      </p>
                    </form>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase font-black">
                      <span className="bg-white px-4 text-gray-300">OU</span>
                    </div>
                  </div>

                  <div className="bg-blue-600 rounded-3xl p-6 text-white relative overflow-hidden group shadow-xl shadow-blue-600/20">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                      <Zap size={80} />
                    </div>
                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                      <div>
                        <p className="text-[11px] font-black uppercase text-blue-200 mb-1 flex items-center justify-center sm:justify-start gap-1">
                          <Zap size={14} fill="currentColor" /> Option Coupe-file
                        </p>
                        <h3 className="text-xl font-black">Achat Immédiat</h3>
                        <p className="text-3xl font-black mt-1 text-orange-400">
                          {buyNowPrice.toLocaleString('fr-FR')}€
                        </p>
                      </div>
                      <button
                        onClick={() => onAddToCart(product)}
                        className="w-full sm:w-auto px-8 py-3 bg-white text-blue-700 rounded-2xl font-black hover:bg-orange-500 hover:text-white transition-all shadow-xl hover:scale-105 active:scale-95"
                      >
                        Acheter maintenant
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-black text-gray-900">
                      {product.price.toLocaleString('fr-FR')}€
                    </span>
                    {product.originalPrice && (
                      <span className="text-xl text-gray-400 line-through font-bold">
                        {product.originalPrice.toLocaleString('fr-FR')}€
                      </span>
                    )}
                    {product.originalPrice && (
                      <span className="bg-red-50 text-red-600 px-2 py-1 rounded-lg text-xs font-black">
                        -
                        {Math.round(
                          ((product.originalPrice - product.price) / product.originalPrice) * 100
                        )}
                        %
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => onAddToCart(product)}
                      className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl shadow-gray-200"
                    >
                      <Zap size={20} /> Acheter Maintenant
                    </button>
                    <button
                      onClick={() => onAddToCart(product)}
                      className="flex-1 py-4 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-black flex items-center justify-center gap-3 hover:border-gray-900 transition-all"
                    >
                      Ajouter au panier
                    </button>
                  </div>

                  <div className="bg-green-50 p-4 rounded-2xl flex items-center gap-3 border border-green-100">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                      <Truck size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-green-800">En stock : Expédition aujourd'hui</p>
                      <p className="text-[10px] text-green-700">Livraison estimée : 18 - 20 Février</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden bg-gray-50 border-t border-gray-100"
                >
                  <div className="p-8 space-y-4">
                    <h4 className="text-xs font-black uppercase text-gray-400 flex items-center gap-2">
                      <History size={14} /> Historique des offres
                    </h4>
                    <div className="space-y-3">
                      {[
                        { user: 'Tho***92', amount: product.currentBid, time: 'Il y a 2h', status: 'leader' },
                        { user: 'Mar***45', amount: (product.currentBid || 0) - 10, time: 'Il y a 5h', status: 'outbid' },
                        { user: 'Jul***01', amount: (product.currentBid || 0) - 25, time: 'Hier à 18:30', status: 'outbid' }
                      ].map((bid, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                bid.status === 'leader' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
                              }`}
                            />
                            <span className="text-xs font-bold text-gray-900">{bid.user}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-black text-gray-900">{bid.amount}€</p>
                            <p className="text-[10px] text-gray-500">{bid.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
              <Trophy size={100} />
            </div>
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-orange-500">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h3 className="text-lg font-black">SuperMalin Protekt</h3>
                <p className="text-sm text-gray-400">
                  Paiement 100% sécurisé et garantie contre la casse pendant le transport.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
              <CheckCircle2 size={14} className="text-green-500" />
              Sellers Pro Certifié
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
              <CheckCircle2 size={14} className="text-green-500" />
              Service Client 24/7
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};