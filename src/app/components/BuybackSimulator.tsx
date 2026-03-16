import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Smartphone, Laptop, Watch, CheckCircle2, ChevronRight, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const BuybackSimulator = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    deviceType: "",
    model: "",
    state: ""
  });

  const deviceTypes = [
    { id: 'phone', label: 'Smartphone', icon: Smartphone },
    { id: 'laptop', label: 'Ordinateur', icon: Laptop },
    { id: 'watch', label: 'Montre connectée', icon: Watch },
  ];

  const states = [
    { id: 'perfect', label: 'Comme neuf', priceMod: 1 },
    { id: 'good', label: 'Très bon état', priceMod: 0.85 },
    { id: 'used', label: 'État correct', priceMod: 0.65 },
    { id: 'broken', label: 'HS / Cassé', priceMod: 0.3 },
  ];

  const getEstimatedPrice = () => {
    // Basic logic for mock
    let base = 500;
    if (data.deviceType === 'laptop') base = 800;
    if (data.deviceType === 'watch') base = 250;
    
    const mod = states.find(s => s.id === data.state)?.priceMod || 1;
    return Math.round(base * mod);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden max-w-2xl mx-auto">
      <div className="bg-gray-900 p-6 text-white flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Simulateur de Rachat</h3>
          <p className="text-gray-400 text-sm">Estimation gratuite en 30 secondes</p>
        </div>
        <div className="bg-orange-600/20 text-orange-500 p-3 rounded-2xl">
          <RefreshCw size={24} className="animate-spin-slow" />
        </div>
      </div>

      <div className="p-8">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                s <= step ? 'bg-orange-600' : 'bg-gray-100'
              }`} 
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h4 className="text-lg font-bold text-gray-900">Quel type d'appareil souhaitez-vous revendre ?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {deviceTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setData({ ...data, deviceType: type.id });
                      setStep(2);
                    }}
                    className="flex flex-col items-center gap-4 p-6 rounded-2xl border-2 border-gray-100 hover:border-orange-500 hover:bg-orange-50 transition-all group"
                  >
                    <type.icon size={32} className="text-gray-400 group-hover:text-orange-600" />
                    <span className="font-bold text-gray-700">{type.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h4 className="text-lg font-bold text-gray-900">Dans quel état se trouve-t-il ?</h4>
              <div className="grid grid-cols-1 gap-3">
                {states.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setData({ ...data, state: s.id });
                      setStep(3);
                    }}
                    className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-orange-500 hover:bg-orange-50 transition-all text-left"
                  >
                    <span className="font-bold text-gray-700">{s.label}</span>
                    <ChevronRight size={20} className="text-gray-300" />
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setStep(1)}
                className="text-sm font-bold text-gray-400 hover:text-orange-600"
              >
                Retour
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-2xl font-black text-gray-900 mb-2">Estimation de rachat</h4>
              <div className="text-5xl font-black text-orange-600 mb-6">
                {getEstimatedPrice()}€*
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left space-y-4">
                <div className="flex gap-3">
                  <ShieldCheck size={20} className="text-blue-600 flex-shrink-0" />
                  <p className="text-sm text-gray-600">Offre ferme après vérification technique par nos experts dans les Hauts-de-France.</p>
                </div>
                <div className="flex gap-3">
                  <RefreshCw size={20} className="text-green-600 flex-shrink-0" />
                  <p className="text-sm text-gray-600">Option "Dépôt-vente" : vendez jusqu'à 20% plus cher en partageant les gains.</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => toast.success("Demande de rachat envoyée !")}
                  className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition-all flex items-center justify-center gap-2"
                >
                  Valider le rachat cash
                  <ArrowRight size={20} />
                </button>
                <button 
                  onClick={() => toast.success("Demande de dépôt-vente envoyée !")}
                  className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all"
                >
                  Opter pour le dépôt-vente collaboratif
                </button>
              </div>
              <button 
                onClick={() => setStep(1)}
                className="mt-6 text-sm font-bold text-gray-400 hover:text-orange-600"
              >
                Recommencer la simulation
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
