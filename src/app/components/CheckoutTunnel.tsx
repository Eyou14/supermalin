import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  CreditCard, 
  Truck, 
  MapPin, 
  ChevronRight, 
  ShieldCheck, 
  Wallet, 
  Lock, 
  Smartphone,
  Info,
  ArrowLeft,
  Search,
  Zap,
  Star,
  Plus
} from 'lucide-react';
import { Product } from './ProductCard';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e62e42f7`;

interface CheckoutTunnelProps {
  cart: Product[];
  total: number;
  walletBalance: number;
  profile: any;
  onComplete: (useWallet: boolean, shippingMethod: string, shippingCost: number) => void;
  onBack: () => void;
}

type Step = 'shipping' | 'payment' | 'confirmation';
type ShippingMethod = 'mondial-relay' | 'colissimo' | 'chronopost';

export const CheckoutTunnel: React.FC<CheckoutTunnelProps> = ({ 
  cart, 
  total, 
  walletBalance, 
  profile,
  onComplete,
  onBack 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [step, setStep] = useState<Step>('shipping');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('mondial-relay');
  const [selectedRelay, setSelectedRelay] = useState<string | null>(null);
  const [useWallet, setUseWallet] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [nearbyRelays, setNearbyRelays] = useState<any[]>([]);

  const steps = [
    { id: 'shipping', label: 'Livraison', icon: Truck },
    { id: 'payment', label: 'Paiement', icon: CreditCard },
    { id: 'confirmation', label: 'Confirmation', icon: CheckCircle2 },
  ];

  const shippingOptions = [
    { 
      id: 'mondial-relay' as ShippingMethod, 
      name: 'Mondial Relay', 
      description: 'Point relais - 3 à 4 jours', 
      price: 0, 
      color: 'green' 
    },
    { 
      id: 'colissimo' as ShippingMethod, 
      name: 'Colissimo', 
      description: 'Domicile - 2 à 3 jours', 
      price: 5.90, 
      color: 'blue' 
    },
    { 
      id: 'chronopost' as ShippingMethod, 
      name: 'Chronopost', 
      description: 'Express - 24h à 48h', 
      price: 12.90, 
      color: 'orange' 
    },
  ];

  // Simulated relay points - in production, this would call Mondial Relay API
  const generateRelayPoints = (postalCode: string) => {
    if (!postalCode || postalCode.length < 5) return [];
    
    const departement = postalCode.substring(0, 2);
    const cities: Record<string, string> = {
      '59': 'Lille',
      '75': 'Paris',
      '69': 'Lyon',
      '13': 'Marseille',
      '33': 'Bordeaux',
      '44': 'Nantes',
      '31': 'Toulouse',
      '67': 'Strasbourg'
    };
    
    const cityName = cities[departement] || 'Votre ville';
    
    return [
      { id: `${postalCode}-1`, name: `Tabac de la Gare`, address: `12 Rue de la Gare, ${cityName}`, distance: '350m', postalCode },
      { id: `${postalCode}-2`, name: `Supermarché Express`, address: `45 Rue Principale, ${cityName}`, distance: '800m', postalCode },
      { id: `${postalCode}-3`, name: `Boulangerie du Centre`, address: `88 Avenue Centrale, ${cityName}`, distance: '1.2km', postalCode },
      { id: `${postalCode}-4`, name: `Pharmacie Centrale`, address: `23 Place de la République, ${cityName}`, distance: '1.5km', postalCode },
      { id: `${postalCode}-5`, name: `Bureau de Poste`, address: `5 Boulevard Victor Hugo, ${cityName}`, distance: '2km', postalCode },
    ];
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setPostalCode(code);
    
    if (code.length === 5) {
      const relays = generateRelayPoints(code);
      setNearbyRelays(relays);
      if (relays.length > 0) {
        toast.success(`${relays.length} points relais trouvés près de chez vous !`);
      }
    }
  };

  const relayPoints = nearbyRelays.length > 0 ? nearbyRelays : generateRelayPoints('59000');

  const selectedShipping = shippingOptions.find(opt => opt.id === shippingMethod);
  const shippingCost = selectedShipping?.price || 0;
  
  // Ensure all values are valid numbers to prevent toFixed() errors
  const safeTotal = Number(total) || 0;
  const safeWalletBalance = Number(walletBalance) || 0;
  
  const currentTotal = useWallet ? Math.max(0, safeTotal - safeWalletBalance) : safeTotal;
  const finalTotal = currentTotal + shippingCost;

  const handleNext = async () => {
    if (step === 'shipping') {
      if (shippingMethod === 'mondial-relay' && !selectedRelay) {
        toast.error("Veuillez choisir un point relais.");
        return;
      }
      if (shippingMethod !== 'mondial-relay' && (!address || !postalCode || !city)) {
        toast.error("Veuillez renseigner votre adresse de livraison.");
        return;
      }
      console.log('✅ Étape livraison validée, passage au paiement');
      setStep('payment');
    } else if (step === 'payment') {
      console.log('💳 Validation du paiement...', { finalTotal, useWallet });
      
      if (finalTotal === 0) {
        console.log('✅ Total = 0€, paiement couvert par le wallet');
        handleSuccess();
        return;
      }

      if (!stripe || !elements) {
        toast.error("Chargement du service de paiement...");
        console.error('❌ Stripe ou Elements non initialisé');
        return;
      }

      setIsProcessing(true);
      
      try {
        console.log('📡 Création du PaymentIntent Stripe...');
        const response = await fetch(`${API_URL}/checkout/create-payment-intent`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}` 
          },
          body: JSON.stringify({
            cart: cart?.map(p => ({ id: p.id, name: p.name })) || [],
            userId: profile?.userId,
            amount: finalTotal,
            shippingMethod,
            useWallet
          })
        });

        const data = await response.json();
        console.log('📩 Réponse du serveur:', data);
        
        if (data.error) {
          console.error('❌ Erreur serveur:', data.error);
          throw new Error(data.error);
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          console.error('❌ CardElement non trouvé');
          throw new Error("Erreur de chargement du module de carte");
        }

        console.log('🔐 Confirmation du paiement avec Stripe...');
        const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: profile?.name || 'Client SuperMalin',
              email: profile?.email
            }
          }
        });

        if (error) {
          console.error('❌ Erreur Stripe:', error);
          throw new Error(error.message);
        }
        
        if (paymentIntent?.status === 'succeeded') {
          console.log('✅ Paiement réussi !');
          handleSuccess();
        } else {
          console.warn('⚠️ Statut du paiement:', paymentIntent?.status);
          throw new Error('Le paiement n\'a pas abouti');
        }
      } catch (err: any) {
        console.error('❌ Erreur lors du paiement:', err);
        toast.error(err.message || "Paiement refusé.");
        setIsProcessing(false);
      }
    }
  };

  const handleSuccess = () => {
    setIsProcessing(false);
    setStep('confirmation');
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f97316', '#3b82f6', '#ffffff']
    });
    onComplete(useWallet, shippingMethod, shippingCost);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {step !== 'confirmation' && (
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold">
            <ArrowLeft size={20} /> Retour
          </button>
          <div className="flex items-center gap-4">
            {steps.map((s, i) => (
              <div key={s.id} className="contents">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${
                    step === s.id ? 'bg-orange-600 border-orange-600 text-white shadow-lg' : 
                    (i < steps.findIndex(x => x.id === step) ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-300')
                  }`}>
                    {i < steps.findIndex(x => x.id === step) ? <CheckCircle2 size={16} /> : i + 1}
                  </div>
                </div>
                {i < steps.length - 1 && <div className="w-8 h-px bg-gray-200" />}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {step === 'shipping' && (
              <motion.div key="shipping" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                    <MapPin className="text-orange-600" /> Livraison
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                      onClick={() => setShippingMethod('mondial-relay')} 
                      className={`p-6 rounded-3xl border-2 transition-all text-left ${shippingMethod === 'mondial-relay' ? 'border-green-600 bg-green-50/30' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                       <h3 className="font-bold text-gray-900">Mondial Relay</h3>
                       <p className="text-xs text-gray-500">Point relais - 3 à 4 jours</p>
                       <p className="mt-4 text-xs font-black text-green-600 uppercase">Gratuit</p>
                    </button>
                    <button 
                      onClick={() => setShippingMethod('colissimo')} 
                      className={`p-6 rounded-3xl border-2 transition-all text-left ${shippingMethod === 'colissimo' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                       <h3 className="font-bold text-gray-900">Colissimo</h3>
                       <p className="text-xs text-gray-500">Domicile - 2 à 3 jours</p>
                       <p className="mt-4 text-xs font-black text-gray-900 uppercase">+5.90€</p>
                    </button>
                    <button 
                      onClick={() => setShippingMethod('chronopost')} 
                      className={`p-6 rounded-3xl border-2 transition-all text-left ${shippingMethod === 'chronopost' ? 'border-orange-600 bg-orange-50/30' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                       <h3 className="font-bold text-gray-900">Chronopost</h3>
                       <p className="text-xs text-gray-500">Express - 24h à 48h</p>
                       <p className="mt-4 text-xs font-black text-gray-900 uppercase">+12.90€</p>
                    </button>
                  </div>
                  {shippingMethod === 'mondial-relay' && (
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center gap-4">
                        <input 
                          type="text" 
                          value={postalCode} 
                          onChange={handlePostalCodeChange} 
                          placeholder="Code postal" 
                          className="w-32 p-2 rounded-lg border border-gray-300 focus:border-orange-600 focus:outline-none" 
                        />
                        <button 
                          onClick={() => setNearbyRelays(generateRelayPoints(postalCode))}
                          className="bg-orange-600 text-white px-4 py-2 rounded-lg"
                        >
                          Rechercher
                        </button>
                      </div>
                      {relayPoints.map(r => (
                        <button key={r.id} onClick={() => setSelectedRelay(r.id)} className={`w-full p-4 rounded-xl border text-left flex justify-between items-center ${selectedRelay === r.id ? 'border-orange-600 bg-orange-50' : 'border-gray-100'}`}>
                          <div>
                            <p className="text-sm font-bold">{r.name}</p>
                            <p className="text-xs text-gray-400">{r.address}</p>
                          </div>
                          <span className="text-xs font-bold text-orange-600">{r.distance}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {shippingMethod !== 'mondial-relay' && (
                    <div className="mt-6 space-y-3">
                      <p className="text-sm font-bold text-gray-700 mb-3">📍 Adresse de livraison</p>
                      <input 
                        type="text" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        placeholder="Numéro et nom de rue" 
                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-orange-600 focus:outline-none" 
                        required
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input 
                          type="text" 
                          value={postalCode} 
                          onChange={(e) => setPostalCode(e.target.value)} 
                          placeholder="Code postal" 
                          className="p-3 rounded-lg border border-gray-300 focus:border-orange-600 focus:outline-none" 
                          maxLength={5}
                          required
                        />
                        <input 
                          type="text" 
                          value={city} 
                          onChange={(e) => setCity(e.target.value)} 
                          placeholder="Ville" 
                          className="p-3 rounded-lg border border-gray-300 focus:border-orange-600 focus:outline-none" 
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                    <CreditCard className="text-blue-600" /> Paiement
                  </h2>
                  <div className={`p-6 rounded-2xl border mb-6 ${useWallet ? 'bg-orange-50 border-orange-200' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-center">
                       <div className="flex items-center gap-3">
                          <Wallet className="text-orange-600" />
                          <div>
                            <p className="font-bold text-sm">Utiliser le portefeuille</p>
                            <p className="text-xs text-gray-500">Solde : {safeWalletBalance.toFixed(2)}€</p>
                          </div>
                       </div>
                       <button onClick={() => setUseWallet(!useWallet)} className={`w-12 h-6 rounded-full transition-colors relative ${useWallet ? 'bg-orange-600' : 'bg-gray-300'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${useWallet ? 'right-1' : 'left-1'}`} />
                       </button>
                    </div>
                  </div>
                  {finalTotal > 0 ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-white border border-gray-200 rounded-xl">
                        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Lock size={12} /> Paiement 100% sécurisé via Stripe
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-green-50 text-green-700 rounded-2xl text-center font-bold">
                       Couvert par votre solde !
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 'confirmation' && (
              <motion.div key="confirmation" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-12 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl">
                <CheckCircle2 size={64} className="mx-auto text-green-500 mb-6" />
                <h2 className="text-3xl font-black mb-4">Commande Confirmée !</h2>
                <p className="text-gray-500 mb-8">Votre commande SuperMalin a été enregistrée avec succès.</p>
                <p className="text-sm text-gray-400 mb-6">Un email de confirmation vous a été envoyé.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {step !== 'confirmation' && (
          <div className="lg:col-span-4">
            <div className="bg-gray-900 rounded-[2rem] p-8 text-white sticky top-24">
              <h3 className="font-bold mb-6">Résumé</h3>
              <div className="space-y-4 mb-8">
                {cart?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-400 truncate w-32">{item.name}</span>
                    <span className="font-bold">{item.price}€</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4 space-y-2 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Sous-total</span>
                  <span>{safeTotal.toFixed(2)}€</span>
                </div>
                {shippingMethod !== 'mondial-relay' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Livraison</span>
                    <span>{shippingCost.toFixed(2)}€</span>
                  </div>
                )}
                {useWallet && (
                  <div className="flex justify-between text-sm text-orange-400">
                    <span>Remise Portefeuille</span>
                    <span>-{Math.min(safeTotal, safeWalletBalance).toFixed(2)}€</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between text-xl font-black mb-8">
                <span>Total</span>
                <span className="text-orange-500">{finalTotal.toFixed(2)}€</span>
              </div>
              <button 
                onClick={handleNext} 
                disabled={isProcessing}
                className="w-full bg-orange-600 hover:bg-orange-700 py-4 rounded-xl font-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <><div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> Traitement...</>
                ) : step === 'shipping' ? (
                  <>Continuer <ChevronRight size={20} /></>
                ) : (
                  <>Payer {finalTotal > 0 ? `${finalTotal.toFixed(2)}€` : 'maintenant'} <ChevronRight size={20} /></>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};