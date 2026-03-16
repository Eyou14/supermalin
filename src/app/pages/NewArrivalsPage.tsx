import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { ProductCard, Product } from '../components/ProductCard';
import { MOCK_PRODUCTS } from '../mockData';
import { AppContext } from '../layouts/RootLayout';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Package, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e62e42f7`;

export const NewArrivalsPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useContext(AppContext);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  const fetchNewArrivals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/products?sortBy=newest&limit=50`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error(`Server error ${response.status}`);
      
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        // Filter products by creation date (last 30 days) or "nouveau" tag
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const newProducts = data.filter((p: any) => {
          const createdAt = p.created_at ? new Date(p.created_at) : null;
          const isRecent = createdAt && createdAt >= thirtyDaysAgo;
          const hasNewTag = p.tags?.includes('nouveau') || p.tags?.includes('arrivage');
          return isRecent || hasNewTag;
        });
        
        setProducts(newProducts);
      } else {
        // Fallback to mock products sorted by newest
        setProducts(MOCK_PRODUCTS.slice(0, 12));
      }
    } catch (error) {
      console.error("Fetch new arrivals failed:", error);
      setProducts(MOCK_PRODUCTS.slice(0, 12));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (product.stock === 0) {
      toast.error("Produit en rupture de stock");
      return;
    }
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

  // Pagination logic
  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-bold mb-4">
          <TrendingUp size={16} />
          <span>Mis à jour quotidiennement</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Nouveaux Arrivages
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Découvrez les derniers produits ajoutés sur SuperMalin. 
          Produits récents, stocks limités et opportunités exceptionnelles !
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border-2 border-orange-200">
          <div className="flex items-center gap-4">
            <div className="bg-orange-600 text-white p-3 rounded-xl">
              <Package size={24} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{products.length}</p>
              <p className="text-sm text-gray-600">Nouveaux produits</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border-2 border-blue-200">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 text-white p-3 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">30j</p>
              <p className="text-sm text-gray-600">Arrivés récemment</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border-2 border-green-200">
          <div className="flex items-center gap-4">
            <div className="bg-green-600 text-white p-3 rounded-xl">
              <Package size={24} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">Stock limité</p>
              <p className="text-sm text-gray-600">Profitez-en vite !</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {currentProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentProducts.map(product => (
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border-2 border-gray-200 font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Précédent
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      currentPage === page
                        ? 'bg-orange-600 text-white'
                        : 'border-2 border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border-2 border-gray-200 font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Suivant
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun nouveau produit</h3>
          <p className="text-gray-600 mb-6">Revenez bientôt pour découvrir nos prochains arrivages !</p>
          <button
            onClick={() => navigate('/boutique')}
            className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all"
          >
            Voir toute la boutique
          </button>
        </div>
      )}
    </div>
  );
};
