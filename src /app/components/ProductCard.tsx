import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Gavel, Clock, ArrowRight, ShieldCheck, Zap, Heart } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  images?: string[];
  tags?: string[];
  price: number;
  originalPrice?: number;
  condition: 'Neuf scellé' | 'Neuf ouvert' | 'Très bon état' | 'Bon état' | 'Correct' | 'Pour pièces';
  type: 'direct' | 'auction';
  stock?: number;
  auctionEnd?: string;
  currentBid?: number;
  bidCount?: number;
  views?: number;
  tested?: boolean;
}

export const ProductCard = ({ product, onClick, onAction, onWishlist, isWishlisted }: { 
  product: Product; 
  onClick: () => void;
  onAction: (e: React.MouseEvent) => void;
  onWishlist: (e: React.MouseEvent) => void;
  isWishlisted: boolean;
}) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (product.type !== 'auction' || !product.auctionEnd) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(product.auctionEnd!).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft("Terminée");
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

  const conditionColor = {
    'Neuf scellé': 'bg-green-100 text-green-700 border-green-200',
    'Neuf ouvert': 'bg-blue-100 text-blue-700 border-blue-200',
    'Très bon état': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Bon état': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Correct': 'bg-orange-100 text-orange-700 border-orange-200',
    'Pour pièces': 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer flex flex-col h-full group"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <ImageWithFallback 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${conditionColor[product.condition]}`}>
            {product.condition}
          </span>
          {product.tested && (
            <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border border-gray-200 flex items-center gap-1">
              <ShieldCheck size={12} className="text-green-600" />
              Testé
            </span>
          )}
          {product.tags && product.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="bg-orange-50/90 backdrop-blur-sm text-orange-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border border-orange-100">
              {tag}
            </span>
          ))}
        </div>

        {product.type === 'auction' && (
          <div className="absolute bottom-0 left-0 right-0 bg-orange-600/90 backdrop-blur-sm text-white py-1.5 px-3 text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{timeLeft}</span>
            </div>
            <div className="flex items-center gap-1">
              <Gavel size={14} />
              <span>{product.bidCount} enchères</span>
            </div>
          </div>
        )}

        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {product.originalPrice && product.type === 'direct' && (
            <div className="bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </div>
          )}
          <button 
            onClick={onWishlist}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isWishlisted ? 'bg-orange-600 text-white shadow-lg' : 'bg-white/80 text-gray-400 hover:text-orange-600 hover:bg-white'
            }`}
          >
            <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.category}</p>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="mt-auto pt-3 flex items-end justify-between">
          <div>
            <p className="text-[10px] text-gray-500 font-medium mb-0.5">
              {product.type === 'auction' ? 'Enchère actuelle' : 'Prix direct'}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                {(product.type === 'auction' ? product.currentBid : product.price)?.toLocaleString('fr-FR')}€
              </span>
              {product.originalPrice && product.type === 'direct' && (
                <span className="text-xs text-gray-400 line-through">
                  {product.originalPrice.toLocaleString('fr-FR')}€
                </span>
              )}
            </div>
          </div>

          <button 
            onClick={onAction}
            className={`p-2 rounded-xl transition-all ${
              product.type === 'auction' 
                ? 'bg-orange-600 text-white hover:bg-orange-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {product.type === 'auction' ? <Gavel size={18} /> : <Zap size={18} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
