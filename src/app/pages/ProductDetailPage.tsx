import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ProductDetail, BidHistoryItem } from '../components/ProductDetail';
import { Product } from '../components/ProductCard';
import { MOCK_PRODUCTS } from '../mockData';
import { AppContext } from '../layouts/RootLayout';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { supabase } from '/src/utils/supabase/client';
import { toast } from 'sonner';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e62e42f7`;

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist, user, isLoggedIn, openAuth } = useContext(AppContext);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bidHistory, setBidHistory] = useState<BidHistoryItem[]>([]);

  const fetchBidHistory = useCallback(async (auctionId: string) => {
    try {
      const res = await fetch(`${API_URL}/auctions/${auctionId}/bids`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      if (res.ok) setBidHistory(await res.json());
    } catch (error) {
      console.error('Fetch bid history failed:', error);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  // Enchères en temps réel : dès qu'une nouvelle offre est enregistrée sur cette
  // enchère, on rafraîchit le prix courant et l'historique sans recharger la page.
  useEffect(() => {
    if (!product?.auctionId) return;

    fetchBidHistory(product.auctionId);

    const channel = supabase
      .channel(`auction-${product.auctionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'auction_bids', filter: `auction_id=eq.${product.auctionId}` },
        () => {
          fetchBidHistory(product.auctionId!);
          if (id) fetchProduct(id, { silent: true });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.auctionId]);

  const fetchProduct = async (productId: string, options?: { silent?: boolean }) => {
    try {
      if (!options?.silent) setIsLoading(true);
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
      if (!options?.silent) setIsLoading(false);
    }
  };

  const handlePlaceBid = async (targetProduct: Product, amount: number): Promise<{ success: boolean; error?: string }> => {
    if (!isLoggedIn || !user) {
      openAuth();
      return { success: false, error: 'Connectez-vous pour enchérir.' };
    }
    if (!targetProduct.auctionId) {
      return { success: false, error: "Cette enchère n'est plus disponible." };
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        openAuth();
        return { success: false, error: 'Session expirée, reconnectez-vous.' };
      }

      const response = await fetch(`${API_URL}/auctions/${targetProduct.auctionId}/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || "Impossible de placer cette enchère." };
      }

      // Mise à jour immédiate de l'affichage (le canal temps réel rafraîchira aussi l'historique)
      setProduct((prev) =>
        prev
          ? { ...prev, currentBid: data.currentPrice, bidCount: data.bidCount, auctionEnd: data.endsAt }
          : prev
      );
      if (id) fetchBidHistory(targetProduct.auctionId);

      return { success: true };
    } catch (error) {
      console.error('Place bid failed:', error);
      return { success: false, error: 'Erreur réseau, réessayez.' };
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
      onPlaceBid={handlePlaceBid}
      isWishlisted={wishlist?.includes(product.id) || false}
      onToggleWishlist={handleToggleWishlist}
      bidHistory={bidHistory}
    />
  );
};