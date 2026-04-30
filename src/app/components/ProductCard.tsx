import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Gavel, Clock, ShieldCheck, Zap, Heart } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

export interface Product {
  id: string;
  title?: string;
  name?: string;
  category: string;
  image_url?: string | null;
  image?: string | null;
  images?: string[];
  price: number;
  condition: string;
  stock?: number;
  description?: string;
  is_featured?: boolean;
  is_new_arrival?: boolean;
  is_active?: boolean;
  type?: "direct" | "auction";
  tested?: boolean;

  // Compatibilité ancien schéma
  auctionEnd?: string;
  currentBid?: number;
  bidCount?: number;
  originalPrice?: number;
  tags?: string[];
}

export const ProductCard = ({
  product,
  onClick,
  onAction,
  onWishlist,
  isWishlisted,
}: {
  product: Product;
  onClick: () => void;
  onAction: (e: React.MouseEvent) => void;
  onWishlist: (e: React.MouseEvent) => void;
  isWishlisted: boolean;
}) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  const productTitle = product.title || product.name || "Produit";
  const productImage =
    product.image_url ||
    product.image ||
    (product.images && product.images.length > 0 ? product.images[0] : "") ||
    "";

  useEffect(() => {
    if (product.type !== "auction" || !product.auctionEnd) return;

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

  const conditionColor: Record<string, string> = {
    "Neuf scellé": "bg-green-100 text-green-700 border-green-200",
    "Neuf ouvert": "bg-blue-100 text-blue-700 border-blue-200",
    "Très bon état": "bg-indigo-100 text-indigo-700 border-indigo-200",
    "Comme neuf": "bg-indigo-100 text-indigo-700 border-indigo-200",
    "Bon état": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Correct": "bg-orange-100 text-orange-700 border-orange-200",
    "Pour pièces": "bg-red-100 text-red-700 border-red-200",
  };

  const isOutOfStock = product.stock === 0;

  return (
    <motion.div
      whileHover={isOutOfStock ? {} : { y: -4 }}
      className={`bg-white rounded-2xl border shadow-sm transition-all overflow-hidden flex flex-col h-full group ${
        isOutOfStock
          ? "border-gray-200 opacity-75 cursor-not-allowed"
          : "border-gray-100 hover:shadow-md cursor-pointer"
      }`}
      onClick={isOutOfStock ? undefined : onClick}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <ImageWithFallback
          src={productImage}
          alt={productTitle}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isOutOfStock ? "grayscale" : "group-hover:scale-105"
          }`}
        />

        {/* Overlay rupture de stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
            <span className="bg-gray-900/90 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full">
              Rupture de stock
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
              conditionColor[product.condition] || "bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            {product.condition}
          </span>

          {product.tested && (
            <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border border-gray-200 flex items-center gap-1">
              <ShieldCheck size={12} className="text-green-600" />
              Testé
            </span>
          )}

          {product.tags &&
            product.tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="bg-orange-50/90 backdrop-blur-sm text-orange-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border border-orange-100"
              >
                {tag}
              </span>
            ))}

          {product.is_new_arrival && (
            <span className="bg-blue-50/90 backdrop-blur-sm text-blue-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border border-blue-100">
              Nouvel arrivage
            </span>
          )}
        </div>

        {product.type === "auction" && (
          <div className="absolute bottom-0 left-0 right-0 bg-orange-600/90 backdrop-blur-sm text-white py-1.5 px-3 text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{timeLeft}</span>
            </div>
            <div className="flex items-center gap-1">
              <Gavel size={14} />
              <span>{product.bidCount || 0} enchères</span>
            </div>
          </div>
        )}

        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {product.originalPrice && product.type === "direct" && (
            <div className="bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </div>
          )}

          <button
            onClick={onWishlist}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isWishlisted
                ? "bg-orange-600 text-white shadow-lg"
                : "bg-white/80 text-gray-400 hover:text-orange-600 hover:bg-white"
            }`}
          >
            <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {product.category}
          </p>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">
            {productTitle}
          </h3>
        </div>

        <div className="mt-auto pt-3 flex items-end justify-between">
          <div>
            <p className="text-[10px] text-gray-500 font-medium mb-0.5">
              {product.type === "auction" ? "Enchère actuelle" : "Prix direct"}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                {(product.type === "auction" ? product.currentBid || product.price : product.price)?.toLocaleString("fr-FR")}€
              </span>
              {product.originalPrice && product.type === "direct" && (
                <span className="text-xs text-gray-400 line-through">
                  {product.originalPrice.toLocaleString("fr-FR")}€
                </span>
              )}
            </div>
          </div>

          <button
            onClick={isOutOfStock ? undefined : onAction}
            disabled={isOutOfStock}
            className={`p-2 rounded-xl transition-all ${
              isOutOfStock
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : product.type === "auction"
                ? "bg-orange-600 text-white hover:bg-orange-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {product.type === "auction" ? <Gavel size={18} /> : <Zap size={18} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};