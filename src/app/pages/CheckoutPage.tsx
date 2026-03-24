import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AppContext } from '../layouts/RootLayout';
import { CheckoutTunnel } from '../components/CheckoutTunnel';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

import { API_URL } from '/src/utils/api';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart, user, userProfile, walletBalance, fetchUserProfile, openAuth } = useContext(AppContext);

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!user) {
      toast.error("Veuillez vous connecter pour passer commande");
      openAuth();
      navigate('/boutique');
    }
  }, [user, navigate, openAuth]);

  // Ensure cartTotal is always a valid number
  const cartTotal = cart?.reduce((sum, item) => sum + (Number(item.price) || 0), 0) || 0;

  const finalizeCheckout = async (usedWallet: boolean, shippingMethod: string, shippingCost: number) => {
    try {
      console.log('💳 Finalisation de la commande...', { usedWallet, shippingMethod, shippingCost });
      
      // Calculer le montant du wallet utilisé
      const walletUsed = usedWallet ? Math.min(walletBalance, cartTotal) : 0;
      const remainingTotal = cartTotal - walletUsed;
      const finalTotal = remainingTotal + shippingCost;

      const orderData = {
        userId: user?.id || 'anonymous',
        items: cart,
        total: finalTotal,
        walletUsed,
        shippingCost,
        shippingMethod,
        paymentMethod: usedWallet ? 'wallet' : 'stripe',
        status: 'paid',
        shippingInfo: {
          email: user?.email || 'guest@example.com',
          name: user?.user_metadata?.name || userProfile?.name || 'Client'
        },
        createdAt: new Date().toISOString()
      };

      console.log('📦 Données de commande:', orderData);

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}` 
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const order = await response.json();
        console.log('✅ Commande créée:', order);
        
        // Si le wallet a été utilisé, déduire le montant
        if (walletUsed > 0 && user?.id) {
          const newBalance = walletBalance - walletUsed;
          console.log(`💰 Mise à jour du solde: ${walletBalance}€ → ${newBalance}€`);
          
          await fetch(`${API_URL}/profile/${user.id}`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}` 
            },
            body: JSON.stringify({ balance: newBalance })
          });
        }
        
        clearCart();
        
        // Refresh user profile to update wallet balance
        if (user?.id) {
          await fetchUserProfile(user.id);
        }
        
        toast.success("Commande validée et enregistrée !");
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f97316', '#fb923c', '#ffffff', '#0055A4']
        });
        
        // Redirect to orders history
        setTimeout(() => {
          navigate('/profil', { replace: true });
        }, 3000);
      } else {
        const error = await response.json();
        console.error('❌ Erreur création commande:', error);
        toast.error(`Erreur: ${error.error || 'Impossible de créer la commande'}`);
      }
    } catch (e) {
      console.error("Checkout error:", e);
      toast.error("Erreur lors de l'enregistrement de la commande");
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-black mb-4">Votre panier est vide</h1>
        <button
          onClick={() => navigate('/boutique')}
          className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all"
        >
          Découvrir la boutique
        </button>
      </div>
    );
  }

  return (
    <CheckoutTunnel 
      cart={cart}
      total={cartTotal}
      walletBalance={walletBalance}
      profile={{
        userId: user?.id,
        name: user?.user_metadata?.name || userProfile?.name || 'Client',
        email: user?.email || userProfile?.email || '',
        street: userProfile?.street || '',
        zipCode: userProfile?.zipCode || '',
        city: userProfile?.city || '',
      }}
      onBack={() => navigate('/panier')}
      onComplete={finalizeCheckout}
    />
  );
};
