import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { Hero } from '../components/Hero';
import { ProductCard, Product } from '../components/ProductCard';
import { MOCK_PRODUCTS } from '../mockData';
import { AppContext } from '../layouts/RootLayout';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { ChevronRight, ShieldCheck, TruckIcon, RefreshCcw, Zap } from 'lucide-react';
import { toast } from 'sonner';
const hdfLogo = "/logo-hdf.svg";

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e62e42f7`;

const categories = [
  { name: 'Téléphonie', icon: '📱', slug: 'telephonie' },
  { name: 'Informatique', icon: '💻', slug: 'informatique' },
  { name: 'Audio / Vidéo', icon: '🎧', slug: 'audio-video' },
  { name: 'Gaming', icon: '🎮', slug: 'gaming' },
  { name: 'Maison', icon: '🏠', slug: 'maison' },
  { name: 'Cuisine', icon: '🍳', slug: 'cuisine' },
  { name: 'Vêtements', icon: '👕', slug: 'vetements' },
  { name: 'Cosmétiques', icon: '💄', slug: 'cosmetiques' },
  { name: 'Accessoires', icon: '⌚', slug: 'accessoires' },
  { name: 'Divers Arrivages', icon: '📦', slug: 'divers' },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist, isAdmin } = useContext(AppContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`Server error ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(MOCK_PRODUCTS);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
      setProducts(MOCK_PRODUCTS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} ajouté au panier !`, {
      action: {
        label: 'Voir Panier',
        onClick: () => navigate('/panier')
      }
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    toggleWishlist(productId);
    if (wishlist?.includes(productId)) {
      toast.info("Retiré des favoris");
    } else {
      toast.success("Ajouté aux favoris !");
    }
  };

  const handleNavigate = (page: string) => {
    const routes: Record<string, string> = {
      'home': '/',
      'shop': '/boutique',
      'new-arrivals': '/nouveaux-arrivages',
      'contact': '/contact',
    };
    navigate(routes[page] || '/');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-20">
      <Hero onNavigate={handleNavigate} />
      
      {/* Categories Section */}
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Nos Catégories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => navigate(`/boutique?categorie=${cat.slug}`)}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-orange-600 hover:shadow-lg transition-all text-center group"
            >
              <div className="text-4xl mb-2">{cat.icon}</div>
              <h3 className="font-bold text-sm text-gray-900 group-hover:text-orange-600 transition-colors">
                {cat.name}
              </h3>
            </button>
          ))}
        </div>
      </div>

      {/* Latest Products */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-gray-900">Dernières Pépites</h2>
          <button 
            onClick={() => navigate('/boutique')} 
            className="text-orange-600 font-bold flex items-center gap-2 hover:gap-3 transition-all"
          >
            Tout voir <ChevronRight size={20} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 8).map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onClick={() => navigate(`/boutique/${product.id}`)}
              onAction={(e) => handleAddToCart(e, product)}
              onWishlist={(e) => handleToggleWishlist(e, product.id)}
              isWishlisted={wishlist?.includes(product.id) || false}
            />
          ))}
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-gradient-to-br from-blue-50 to-orange-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-black text-center mb-12">Pourquoi SuperMalin ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="font-bold text-xl mb-2">Paiement Sécurisé</h3>
              <p className="text-gray-600">Protection Stripe & paiement 100% sécurisé</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon size={32} />
              </div>
              <h3 className="font-bold text-xl mb-2">Livraison Rapide</h3>
              <p className="text-gray-600">Mondial Relay, Colissimo & Chronopost</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCcw size={32} />
              </div>
              <h3 className="font-bold text-xl mb-2">Retours 14 jours</h3>
              <p className="text-gray-600">Satisfait ou remboursé sans condition</p>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Section */}
      <div className="container mx-auto px-4 text-center">
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 max-w-2xl mx-auto">
          <img src={hdfLogo} alt="Région Hauts-de-France" className="h-16 mx-auto mb-4" />
          <p className="text-gray-600 leading-relaxed">
            SuperMalin est soutenu par la <strong>Région Hauts-de-France</strong> dans le cadre de son développement. 
            Entreprise française engagée pour des prix justes et transparents.
          </p>
        </div>
      </div>

    </div>
  );
};