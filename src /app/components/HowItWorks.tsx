import React from 'react';
import { Search, Gavel, ShieldCheck, Truck, CreditCard, RefreshCcw, Handshake, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export const HowItWorks = () => {
  const steps = [
    {
      title: "Trouvez votre pépite",
      description: "Explorez notre catalogue d'objets High-Tech testés et certifiés. Choisissez entre l'achat immédiat ou tentez votre chance aux enchères.",
      icon: Search,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Misez ou Achetez",
      description: "Placez votre enchère en un clic ou achetez directement. Nos prix sont transparents et reflètent l'état réel de chaque appareil.",
      icon: Gavel,
      color: "bg-orange-100 text-orange-600"
    },
    {
      title: "Paiement Sécurisé",
      description: "Payez en toute sécurité par carte bancaire. Les fonds sont protégés jusqu'à ce que la transaction soit validée.",
      icon: CreditCard,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Livraison Rapide",
      description: "Votre colis est expédié sous 24h avec suivi. Nous emballons chaque produit avec le plus grand soin pour garantir son arrivée.",
      icon: Truck,
      color: "bg-purple-100 text-purple-600"
    }
  ];

  const tradeInSteps = [
    {
      title: "Estimez",
      description: "Répondez à quelques questions sur l'état de votre appareil et obtenez une estimation immédiate.",
      icon: Zap
    },
    {
      title: "Envoyez",
      description: "Imprimez votre bon de transport gratuit et déposez votre colis en point relais.",
      icon: Truck
    },
    {
      title: "Encaissez",
      description: "Après vérification, recevez votre virement sous 48h ou laissez-nous le vendre pour vous (Collab) pour gagner plus.",
      icon: CreditCard
    }
  ];

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
          Comment fonctionne <span className="text-orange-600">SuperMalin</span> ?
        </h1>
        <p className="text-xl text-gray-500 font-medium">
          Une plateforme transparente pour donner une seconde vie au High-Tech, tout en faisant des économies.
        </p>
      </div>

      {/* Buying Flow */}
      <section className="mb-32">
        <h2 className="text-2xl font-black mb-12 flex items-center gap-3">
          <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm">1</span>
          Acheter sur la plateforme
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all"
            >
              <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mb-6`}>
                <step.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Selling Flow */}
      <section>
        <div className="bg-gray-900 rounded-[3rem] p-12 md:p-20 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-black mb-8 leading-tight">
                Vendre ou faire <span className="text-orange-500">Racheter</span> son appareil
              </h2>
              <p className="text-gray-400 text-lg mb-12">
                Ne laissez pas vos tiroirs s'encombrer. Nous reprenons vos anciens smartphones, ordinateurs et consoles au meilleur prix.
              </p>
              
              <div className="space-y-8">
                {tradeInSteps.map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                      <step.icon className="text-orange-500" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{step.title}</h4>
                      <p className="text-gray-500 text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center font-black">?</div>
                <div>
                  <h4 className="font-bold">Pourquoi nous choisir ?</h4>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-black">SuperMalin Advantage</p>
                </div>
              </div>
              
              <ul className="space-y-6">
                {[
                  { title: "Estimation en 2 minutes", icon: Zap },
                  { title: "Transport gratuit et assuré", icon: Truck },
                  { title: "Paiement ultra-rapide", icon: CreditCard },
                  { title: "Garantie de revente (Collab)", icon: Handshake }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-gray-300">
                    <CheckCircle2 size={20} className="text-green-500" />
                    <span className="font-medium">{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-20 text-center">
        <button 
          onClick={() => window.scrollTo(0, 0)}
          className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20"
        >
          Démarrer maintenant
        </button>
      </div>
    </div>
  );
};

const CheckCircle2 = ({ size, className }: { size: number, className: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
