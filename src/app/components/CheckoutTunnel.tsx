import React, { useState, useEffect } from 'react';
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
type ShippingMethod = 'mondial_relay' | 'colissimo' | 'chronopost' | 'retrait';

const FREE_SHIPPING_THRESHOLD = 50; // Livraison gratuite dès 50€

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
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('mondial_relay');
  const [selectedRelay, setSelectedRelay] = useState<string | null>(null);
  const [useWallet, setUseWallet] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [postalCode, setPostalCode] = useState(profile?.zipCode || '');
  const [city, setCity] = useState(profile?.city || '');
  const [address, setAddress] = useState(profile?.street || '');
  const [nearbyRelays, setNearbyRelays] = useState<any[]>([]);

  const steps = [
    { id: 'shipping', label: 'Livraison', icon: Truck },
    { id: 'payment', label: 'Paiement', icon: CreditCard },
    { id: 'confirmation', label: 'Confirmation', icon: CheckCircle2 },
  ];

  const isFreeShipping = Number(total) >= FREE_SHIPPING_THRESHOLD;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - Number(total));
  const freeShippingProgress = Math.min(100, (Number(total) / FREE_SHIPPING_THRESHOLD) * 100);

  const shippingOptions = [
    {
      id: 'mondial_relay' as ShippingMethod,
      name: 'Mondial Relay',
      description: 'Point relais — 3 à 5 jours',
      basePrice: 3.99,
      price: isFreeShipping ? 0 : 3.99,
      free: isFreeShipping,
      tag: 'Économique',
      tagColor: 'green',
      icon: '📦',
    },
    {
      id: 'colissimo' as ShippingMethod,
      name: 'Colissimo',
      description: 'À domicile — 2 à 3 jours',
      basePrice: 5.90,
      price: isFreeShipping ? 0 : 5.90,
      free: isFreeShipping,
      tag: 'Populaire',
      tagColor: 'blue',
      icon: '🏠',
    },
    {
      id: 'chronopost' as ShippingMethod,
      name: 'Chronopost',
      description: 'Express — livraison le lendemain',
      basePrice: 9.90,
      price: 9.90,
      free: false,
      tag: 'Express',
      tagColor: 'orange',
      icon: '⚡',
    },
    {
      id: 'retrait' as ShippingMethod,
      name: 'Retrait en main propre',
      description: 'Sur rendez-vous — Acy-en-Multien (60)',
      basePrice: 0,
      price: 0,
      free: true,
      tag: 'Gratuit',
      tagColor: 'gray',
      icon: '🤝',
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

  // Pré-remplir les points relais si le profil a un code postal sauvegardé
  useEffect(() => {
    if (profile?.zipCode && profile.zipCode.length === 5 && nearbyRelays.length === 0) {
      setNearbyRelays(generateRelayPoints(profile.zipCode));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const shippingCost = selectedShipping?.price ?? 0;
  
  // Ensure all values are valid numbers to prevent toFixed() errors
  const safeTotal = Number(total) || 0;
  const safeWalletBalance = Number(walletBalance) || 0;
  
  const currentTotal = useWallet ? Math.max(0, safeTotal - safeWalletBalance) : safeTotal;
  const finalTotal = currentTotal + shippingCost;

  const handleNext = async () => {
    if (step === 'shipping') {
      if (shippingMethod !== 'retrait' && (!postalCode || !city)) {
        toast.error("Veuillez renseigner votre code postal et votre ville.");
        return;
      }
      if (shippingMethod === 'colissimo' && !address) {
        toast.error("Veuillez renseigner votre adresse de livraison.");
        return;
      }
      if (shippingMethod === 'mondial_relay' && !selectedRelay && !address) {
        toast.error("Veuillez sélectionner un point relais.");
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
              <motion.div key="shipping" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">

                {/* ── Barre livraison gratuite ── */}
                <div className={`rounded-2xl p-5 border ${isFreeShipping ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-100'}`}>
                  {isFreeShipping ? (
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎉</span>
                      <div>
                        <p className="font-black text-green-800">Livraison offerte débloquée !</p>
                        <p className="text-xs text-green-600">Profitez de la livraison gratuite sur vos modes standard.</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-black text-gray-800">
                          Plus que <span className="text-orange-600">{amountToFreeShipping.toFixed(2)}€</span> pour la livraison offerte !
                        </p>
                        <span className="text-xs font-bold text-orange-600">Dès {FREE_SHIPPING_THRESHOLD}€</span>
                      </div>
                      <div className="w-full bg-orange-100 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${freeShippingProgress}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1.5">Livraison gratuite (Mondial Relay &amp; Colissimo) à partir de {FREE_SHIPPING_THRESHOLD}€ d'achats</p>
                    </div>
                  )}
                </div>

                {/* ── Options de livraison ── */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                    <MapPin className="text-orange-600" /> Mode de livraison
                  </h2>
                  <div className="space-y-3">
                    {shippingOptions.map((opt) => {
                      const isSelected = shippingMethod === opt.id;
                      const borderColor = isSelected
                        ? opt.tagColor === 'green' ? 'border-green-500 bg-green-50/40'
                        : opt.tagColor === 'blue' ? 'border-blue-500 bg-blue-50/40'
                        : opt.tagColor === 'orange' ? 'border-orange-500 bg-orange-50/40'
                        : 'border-gray-400 bg-gray-50/40'
                        : 'border-gray-100 hover:border-gray-200';
                      const tagStyle = opt.tagColor === 'green' ? 'bg-green-100 text-green-700'
                        : opt.tagColor === 'blue' ? 'bg-blue-100 text-blue-700'
                        : opt.tagColor === 'orange' ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-600';

                      return (
                        <button
                          key={opt.id}
                          onClick={() => setShippingMethod(opt.id)}
                          className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${borderColor}`}
                        >
                          <span className="text-2xl shrink-0">{opt.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-gray-900 text-sm">{opt.name}</span>
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${tagStyle}`}>
                                {opt.tag}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            {opt.free && opt.basePrice > 0 ? (
                              <div>
                                <p className="text-xs text-gray-400 line-through">{opt.basePrice.toFixed(2)}€</p>
                                <p className="text-sm font-black text-green-600">GRATUIT</p>
                              </div>
                            ) : opt.price === 0 ? (
                              <p className="text-sm font-black text-green-600">GRATUIT</p>
                            ) : (
                              <p className="text-sm font-black text-gray-900">+{opt.price.toFixed(2)}€</p>
                            )}
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                            isSelected ? 'border-orange-600 bg-orange-600' : 'border-gray-300'
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── Adresse ── */}
                {shippingMethod !== 'retrait' && (
                  <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                    <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                      <MapPin className="text-gray-400" size={20} />
                      {shippingMethod === 'mondial_relay' ? 'Adresse pour trouver les points relais' : 'Adresse de livraison'}
                    </h2>
                    <div className="space-y-3">
                      {shippingMethod !== 'mondial_relay' && (
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Numéro et nom de rue"
                          className="w-full p-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:outline-none text-sm"
                        />
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={postalCode}
                          onChange={handlePostalCodeChange}
                          placeholder="Code postal"
                          className="p-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:outline-none text-sm"
                          maxLength={5}
                        />
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Ville"
                          className="p-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:outline-none text-sm"
                        />
                      </div>
                      {shippingMethod === 'mondial_relay' && nearbyRelays.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-xs font-black uppercase text-gray-400 tracking-wider">Points relais proches</p>
                          {relayPoints.slice(0, 4).map((relay: any) => (
                            <button
                              key={relay.id}
                              onClick={() => { setSelectedRelay(relay.id); setAddress(relay.address); }}
                              className={`w-full p-3 rounded-xl border text-left transition-all text-sm flex justify-between items-center ${selectedRelay === relay.id ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}
                            >
                              <div>
                                <p className="font-bold text-gray-900">{relay.name}</p>
                                <p className="text-xs text-gray-500">{relay.address}</p>
                              </div>
                              <span className="text-xs text-gray-400 shrink-0 ml-2">{relay.distance}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {shippingMethod === 'retrait' && (
                  <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 flex items-start gap-4">
                    <span className="text-2xl">📍</span>
                    <div>
                      <p className="font-bold text-gray-900 mb-1">Retrait à Acy-en-Multien (60620)</p>
                      <p className="text-sm text-gray-600">13 rue René Latour — Un rendez-vous sera convenu par email après confirmation de commande.</p>
                    </div>
                  </div>
                )}
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
                <p className="text-sm text-gray-400 mb-6">Retrouvez votre commande dans votre espace "Mon Compte".</p>
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
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Livraison ({selectedShipping?.name || '—'})</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-400 font-bold">Gratuite ✓</span>
                  ) : (
                    <span>+{shippingCost.toFixed(2)}€</span>
                  )}
                </div>
                {useWallet && (
                  <div className="flex justify-between text-sm text-orange-400">
                    <span>Portefeuille</span>
                    <span>-{Math.min(safeTotal, safeWalletBalance).toFixed(2)}€</span>
                  </div>
                )}
                {!isFreeShipping && amountToFreeShipping > 0 && shippingCost > 0 && (
                  <div className="text-[10px] text-orange-300 pt-1 border-t border-white/5">
                    💡 Plus que {amountToFreeShipping.toFixed(2)}€ pour la livraison offerte
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