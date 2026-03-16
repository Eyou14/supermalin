import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AuthModal } from '../components/AuthModal';
import { ChatWidget } from '../components/ChatWidget';
import { DevTools } from '../components/DevTools';
import { DevBanner } from '../components/DevBanner';
import { Toaster } from 'sonner';
import { supabase } from '/src/utils/supabase/client';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Product } from '../components/ProductCard';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e62e42f7`;

export interface AppContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  user: any;
  isLoggedIn: boolean;
  isAdmin: boolean;
  userProfile: any;
  walletBalance: number;
  fetchUserProfile: (userId: string) => Promise<void>;
  updateUserProfile: (updates: any) => Promise<void>;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  openAuth: () => void;
}

export const AppContext = React.createContext<AppContextType>({} as AppContextType);

export const RootLayout: React.FC = () => {
  const navigate = useNavigate();

  const [stripePromise] = useState(() => {
    return fetch(`${API_URL}/config`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    })
      .then((res) => res.json())
      .then((config) => {
        if (config.stripePublicKey && config.stripePublicKey !== 'pk_test_placeholder') {
          return loadStripe(config.stripePublicKey);
        }
        return null;
      })
      .catch(() => null);
  });

  const [cart, setCart] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('supermalin_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        (item) =>
          item &&
          typeof item.id === 'string' &&
          typeof item.name === 'string' &&
          Number.isFinite(Number(item.price))
      );
    } catch {
      return [];
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('supermalin_cart', JSON.stringify(cart));
  }, [cart]);

  const resetUserState = () => {
    setUserProfile(null);
    setWalletBalance(0);
    setIsAdmin(false);
  };

  const checkSession = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user?.id) {
        setUser(session.user);
        setIsLoggedIn(true);
        resetUserState();
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        resetUserState();
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/profile/${userId}`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
        setWalletBalance(Number(data.balance) || 0);
        setIsAdmin(data.role === 'admin');
      } else {
        const defaultProfile = {
          userId,
          balance: 0,
          role: 'user',
          createdAt: new Date().toISOString(),
        };

        const createResponse = await fetch(`${API_URL}/profile/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(defaultProfile),
        });

        if (createResponse.ok) {
          const createdProfile = await createResponse.json();
          setUserProfile(createdProfile);
          setWalletBalance(0);
          setIsAdmin(false);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setIsAdmin(false);
    }
  };

  const updateUserProfile = async (updates: any) => {
    if (!user) return;

    try {
      const safeUpdates = {
        firstName: updates.firstName ?? userProfile?.firstName ?? '',
        lastName: updates.lastName ?? userProfile?.lastName ?? '',
        name:
          updates.name ??
          [updates.firstName ?? userProfile?.firstName ?? '', updates.lastName ?? userProfile?.lastName ?? '']
            .filter(Boolean)
            .join(' ')
            .trim(),
        email: userProfile?.email || user?.email || '',
        phone: updates.phone ?? userProfile?.phone ?? '',
        street: updates.street ?? userProfile?.street ?? '',
        zipCode: updates.zipCode ?? userProfile?.zipCode ?? '',
        city: updates.city ?? userProfile?.city ?? '',
        country: updates.country ?? userProfile?.country ?? 'France',
        avatar: updates.avatar ?? userProfile?.avatar,
        addresses: updates.addresses ?? userProfile?.addresses,
      };

      const response = await fetch(`${API_URL}/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(safeUpdates),
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
        setWalletBalance(Number(data.balance) || 0);
        setIsAdmin(data.role === 'admin');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  useEffect(() => {
    checkSession();

    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);

      if (event === 'SIGNED_IN' && session?.user?.id) {
        setUser(session.user);
        setIsLoggedIn(true);
        resetUserState();
        await fetchUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoggedIn(false);
        resetUserState();
      } else if (event === 'TOKEN_REFRESHED' && session?.user?.id) {
        await fetchUserProfile(session.user.id);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const addToCart = (product: Product) => {
    if (!product?.id || !product?.name || !Number.isFinite(Number(product.price))) return;
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const handleNavigate = (page: string) => {
    const routes: Record<string, string> = {
      home: '/',
      shop: '/boutique',
      cart: '/panier',
      checkout: '/checkout',
      profile: '/profil',
      admin: '/admin',
      cgv: '/cgv',
      mentions: '/mentions-legales',
      privacy: '/politique-confidentialite',
      returns: '/politique-retours',
      contact: '/contact',
    };

    navigate(routes[page] || '/');
  };

  const contextValue: AppContextType = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    user,
    isLoggedIn,
    isAdmin,
    userProfile,
    walletBalance,
    fetchUserProfile,
    updateUserProfile,
    wishlist,
    toggleWishlist,
    openAuth: () => setIsAuthOpen(true),
  };

  return (
    <Elements stripe={stripePromise}>
      <AppContext.Provider value={contextValue}>
        <div className="min-h-screen bg-white flex flex-col font-sans">
          <Toaster position="top-center" richColors />

          <Header
            cartCount={cart.length}
            onNavigate={handleNavigate}
            onAuthOpen={() => setIsAuthOpen(true)}
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
            user={user}
            profile={userProfile}
          />

          <DevBanner />

          <main className="flex-1">
            <Outlet />
          </main>

          <Footer onNavigate={handleNavigate} />
          <ChatWidget />

          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            onSuccess={(session) => {
              const authUser = session?.user;
              if (!authUser?.id) {
                console.error('AuthModal onSuccess: session.user manquant', session);
                return;
              }

              setUser(authUser);
              setIsLoggedIn(true);
              resetUserState();
              fetchUserProfile(authUser.id);
              setIsAuthOpen(false);
            }}
          />

          <DevTools />
        </div>
      </AppContext.Provider>
    </Elements>
  );
};