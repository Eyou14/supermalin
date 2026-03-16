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
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    })
      .then(res => res.json())
      .then(config => {
        if (config.stripePublicKey && config.stripePublicKey !== 'pk_test_placeholder') {
          return loadStripe(config.stripePublicKey);
        }
        return null;
      })
      .catch(() => null);
  });

  const [cart, setCart] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setIsLoggedIn(true);
        await fetchUserProfile(session.user.id);
        
        // Check admin role immediately after getting user
        if (session.user.email === 'admin@supermalin.fr') {
          setIsAdmin(true);
        }
      }
    } catch (error) {
      console.error("Session check error:", error);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/profile/${userId}`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
        setWalletBalance(data.balance || 0);
        
        // Update admin status based on profile role - SEULE SOURCE DE VÉRITÉ
        console.log('🔐 Profile loaded:', data);
        if (data.role === 'admin') {
          console.log('✅ Admin role detected for user:', userId);
          setIsAdmin(true);
        } else {
          console.log('❌ No admin role for user:', userId);
          setIsAdmin(false);
        }
      } else {
        // If profile doesn't exist, create a default one
        console.log('⚠️ Profile not found, creating default profile for user:', userId);
        const defaultProfile = { 
          userId, 
          balance: 0, 
          role: 'user',
          createdAt: new Date().toISOString()
        };
        
        // Try to create the profile
        const createResponse = await fetch(`${API_URL}/profile/${userId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}` 
          },
          body: JSON.stringify(defaultProfile)
        });
        
        if (createResponse.ok) {
          const createdProfile = await createResponse.json();
          setUserProfile(createdProfile);
          setWalletBalance(0);
          setIsAdmin(false);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Even if fetch fails, check if user is admin by email as fallback
      const session = await supabase.auth.getSession();
      if (session?.data?.session?.user?.email === 'admin@supermalin.fr') {
        console.log('⚠️ Profile fetch failed but user is admin by email, setting isAdmin = true');
        setIsAdmin(true);
        setUserProfile({ userId, role: 'admin', balance: 0 });
      } else {
        setIsAdmin(false);
      }
    }
  };

  const updateUserProfile = async (updates: any) => {
    if (!user) return;
    try {
      const response = await fetch(`${API_URL}/profile/${user.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}` 
        },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
        setWalletBalance(data.balance || 0);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    checkSession();
    
    // Écouter les changements d'auth
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        setIsLoggedIn(true);
        await fetchUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUserProfile(null);
        setWalletBalance(0);
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Re-fetch le profil quand le token est rafraîchi
        await fetchUserProfile(session.user.id);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => [...prev, product]);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleNavigate = (page: string) => {
    const routes: Record<string, string> = {
      'home': '/',
      'shop': '/boutique',
      'cart': '/panier',
      'checkout': '/checkout',
      'profile': '/profil',
      'admin': '/admin',
      'cgv': '/cgv',
      'mentions': '/mentions-legales',
      'privacy': '/politique-confidentialite',
      'returns': '/politique-retours',
      'contact': '/contact',
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
            onSuccess={(user) => {
              setUser(user);
              setIsLoggedIn(true);
              fetchUserProfile(user.id);
              setIsAuthOpen(false);
            }}
          />
          <DevTools />
        </div>
      </AppContext.Provider>
    </Elements>
  );
};