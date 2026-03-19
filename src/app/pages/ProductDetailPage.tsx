import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ProductDetail } from '../components/ProductDetail';
import { Product } from '../components/ProductCard';
import { MOCK_PRODUCTS } from '../mockData';
import { AppContext } from '../layouts/RootLayout';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { toast } from 'sonner';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e62e42f7`;

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useContext(AppContext);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        const foundProduct = data.find((p: Product) => p.id === productId);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          // Fallback to mock data
          const mockProduct = MOCK_PRODUCTS.find(p => p.id === productId);
          setProduct(mockProduct || null);
        }
      } else {
        const mockProduct = MOCK_PRODUCTS.find(p => p.id === productId);
        setProduct(mockProduct || null);
      }
    } catch (error) {
      console.error("Fetch product failed:", error);
      const mockProduct = MOCK_PRODUCTS.find(p => p.id === productId);
      setProduct(mockProduct || null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
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

  const handleToggleWishlist = (productId: string) => {
    toggleWishlist(productId);
    if (wishlist?.includes(productId)) {
      toast.info("Retiré des favoris");
    } else {
      toast.success("Ajouté aux favoris !");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-black mb-4">Produit introuvable</h1>
        <button
          onClick={() => navigate('/boutique')}
          className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all"
        >
          Retour à la boutique
        </button>
      </div>
    );
  }

  return (
    <ProductDetail 
      product={product}
      onBack={() => navigate(-1)}
      onAddToCart={handleAddToCart}
      onPlaceBid={() => toast.info("Enchères bientôt disponibles")}
      isWishlisted={wishlist?.includes(product.id) || false}
      onToggleWishlist={handleToggleWishlist}
    />
  );
};