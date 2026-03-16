import { Zap, RefreshCcw, Handshake, ChevronRight, Laptop, Smartphone, Tablet, Watch, Package } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from 'utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e62e42f7`;

export const TradeInModule = ({ onNavigate }: { onNavigate?: (page: string) => void }) => {
  const [step, setStep] = useState(1);
  const [device, setDevice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deviceTypes = [
    { id: 'phone', label: 'Smartphone', icon: Smartphone },
    { id: 'laptop', label: 'Ordinateur', icon: Laptop },
    { id: 'tablet', label: 'Tablette', icon: Tablet },
    { id: 'watch', label: 'Montre', icon: Watch },
  ];

  const submitRequest = async (type: 'buyback' | 'consignment') => {
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const modelInput = document.getElementById('model') as HTMLInputElement;
    
    if (!emailInput?.value) {
      toast.error("Veuillez renseigner votre email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          type,
          device,
          email: emailInput.value,
          model: modelInput?.value,
          status: 'pending',
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        toast.success("Votre demande a été enregistrée ! Nous vous contacterons sous 24h.");
        setStep(1);
      } else {
        throw new Error();
      }
    } catch (e) {
      toast.error("Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">Gagnez de l'argent avec vos anciens appareils</h1>
          <p className="text-gray-500 text-lg">Choisissez votre mode de revalorisation : Rachat cash ou Vente collaborative.</p>
          {onNavigate && (
            <button 
              onClick={() => onNavigate('profile')}
              className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-bold hover:bg-orange-50 hover:text-orange-600 transition-all border border-transparent hover:border-orange-200"
            >
              <Package size={16} /> Voir mes ventes en cours
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Option 1: Buyback */}
          <div className="bg-white border-2 border-gray-100 p-8 rounded-3xl hover:border-orange-500 transition-all group">
            <div className="bg-orange-100 text-orange-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <RefreshCcw size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Rachat Cash Immédiat</h3>
            <p className="text-gray-500 mb-6">Nous rachetons votre appareil au meilleur prix après test. Paiement sous 48h. Idéal pour un gain rapide.</p>
            <ul className="space-y-2 mb-8 text-sm font-medium text-gray-600">
              <li className="flex items-center gap-2">✓ Estimation instantanée</li>
              <li className="flex items-center gap-2">✓ Envoi gratuit</li>
              <li className="flex items-center gap-2">✓ Paiement virement/Paypal</li>
            </ul>
            <button 
              onClick={() => setStep(2)}
              className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-all"
            >
              Estimer mon appareil
            </button>
          </div>

          {/* Option 2: Consignment */}
          <div className="bg-white border-2 border-gray-100 p-8 rounded-3xl hover:border-blue-500 transition-all group">
            <div className="bg-blue-100 text-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Handshake size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">Vente Collaborative (Dépôt-Vente)</h3>
            <p className="text-gray-500 mb-6">Nous vendons votre appareil pour vous via nos enchères. Maximisez vos gains, nous partageons le profit final.</p>
            <ul className="space-y-2 mb-8 text-sm font-medium text-gray-600">
              <li className="flex items-center gap-2">✓ Prix de vente jusqu'à +40%</li>
              <li className="flex items-center gap-2">✓ On s'occupe de tout (photos, tests)</li>
              <li className="flex items-center gap-2">✓ Commission transparente</li>
            </ul>
            <button 
              onClick={() => { setStep(2); }}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
            >
              Proposer un dépôt-vente
            </button>
          </div>
        </div>

        {/* Estimation Workflow Simulation */}
        <motion.div 
          layout
          className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-200"
        >
          {step === 1 ? (
            <div className="text-center">
              <h4 className="text-lg font-bold mb-8">Commencez par choisir votre type d'appareil</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {deviceTypes.map((t) => (
                  <button 
                    key={t.id}
                    onClick={() => { setDevice(t.id); setStep(2); }}
                    className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-orange-500 hover:shadow-lg transition-all flex flex-col items-center gap-3"
                  >
                    <t.icon size={32} className="text-gray-400" />
                    <span className="font-bold text-sm text-gray-700">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <h4 className="text-xl font-bold mb-6 text-center">Estimation pour votre {device}</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Votre Email</label>
                  <input id="email" type="email" required placeholder="contact@exemple.fr" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Modèle précis</label>
                  <input id="model" type="text" placeholder="ex: iPhone 14 Pro 128GB" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">État de l'appareil</label>
                  <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none">
                    <option>Comme neuf</option>
                    <option>Très bon état</option>
                    <option>Écran rayé / Usé</option>
                    <option>Ne s'allume plus</option>
                  </select>
                </div>
                <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-orange-200 text-center mb-6">
                  <p className="text-sm text-gray-500 mb-1">Estimation provisoire</p>
                  <p className="text-3xl font-black text-orange-600">350€ - 420€</p>
                </div>
                <button 
                  disabled={isSubmitting}
                  onClick={() => submitRequest('buyback')}
                  className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Envoi..." : "Recevoir mon bon d'expédition"}
                </button>
                <button 
                  onClick={() => setStep(1)}
                  className="w-full text-sm text-gray-500 font-bold hover:text-gray-900 transition-all"
                >
                  Retour au choix
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
