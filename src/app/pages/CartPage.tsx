import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { AppContext } from '../layouts/RootLayout';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useContext(AppContext);

  // Ensure cartTotal is always a valid number
  const cartTotal = cart?.reduce((sum, item) => sum + (Number(item.price) || 0), 0) || 0;

  const handleRemove = (index: number) => {
    removeFromCart(index);
    toast.info("Article retiré du panier");
  };

  const handleCheckout = () => {
    if (cart?.length === 0 || !cart) {
      toast.error("Votre panier est vide");
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-8">Votre Panier</h1>
      
      {!cart || cart.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingCart size={64} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500 mb-8">Votre panier est vide</p>
          <button 
            onClick={() => navigate('/boutique')} 
            className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all"
          >
            Découvrir la boutique
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
            {cart?.map((item, i) => (
              <div key={i} className="bg-white p-4 rounded-3xl border-2 border-gray-200 flex gap-6 items-center hover:border-orange-600 transition-all">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl" 
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.condition}</p>
                  <p className="text-orange-600 font-black text-xl">{item.price}€</p>
                </div>
                <button 
                  onClick={() => handleRemove(i)} 
                  className="text-gray-300 hover:text-red-500 transition-colors p-2"
                  title="Retirer du panier"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-900 text-white p-8 rounded-3xl h-fit sticky top-24">
            <h3 className="text-xl font-bold mb-6">Récapitulatif</h3>
            
            <div className="space-y-3 mb-6 pb-6 border-b border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Sous-total</span>
                <span className="font-medium">{cartTotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Livraison</span>
                <span className="font-medium">Calculé à l'étape suivante</span>
              </div>
            </div>
            
            <div className="flex justify-between text-2xl font-black text-orange-400 mb-8">
              <span>Total</span>
              <span>{cartTotal.toFixed(2)}€</span>
            </div>
            
            <button 
              onClick={handleCheckout} 
              className="w-full bg-orange-600 py-4 rounded-xl font-black text-lg hover:bg-orange-700 transition-all mb-4"
            >
              Passer commande
            </button>
            
            <button
              onClick={() => navigate('/boutique')}
              className="w-full border-2 border-gray-700 py-3 rounded-xl font-bold hover:border-orange-600 hover:text-orange-600 transition-all"
            >
              Continuer mes achats
            </button>
          </div>
        </div>
      )}
    </div>
  );
};