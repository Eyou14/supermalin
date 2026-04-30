import React from 'react';
import { Search, ShieldCheck, Truck, CreditCard, Zap, BadgeCheck, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

export const HowItWorks = () => {
  const steps = [
    {
      title: "Trouvez votre pépite",
      description: "Explorez notre catalogue d'articles High-Tech et multimédia. Chaque produit est décrit avec précision : état, photos réelles, prix transparent.",
      icon: Search,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Achetez en un clic",
      description: "Ajoutez au panier et validez votre commande en quelques secondes. Paiement 100% sécurisé via Stripe — carte bancaire ou portefeuille.",
      icon: CreditCard,
      color: "bg-orange-100 text-orange-600"
    },
    {
      title: "Expédition sous 24/48h",
      description: "Votre colis est préparé et expédié sous 24 à 48h. Choisissez entre Mondial Relay (économique) ou Chronopost (express). Chaque colis est soigneusement emballé.",
      icon: Truck,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Satisfait ou remboursé",
      description: "14 jours pour changer d'avis, sans justification. Garantie légale de conformité 2 ans. Notre service client répond sous 24h.",
      icon: RotateCcw,
      color: "bg-purple-100 text-purple-600"
    }
  ];

  const commitments = [
    { icon: BadgeCheck, title: "Articles vérifiés", desc: "Chaque produit est inspecté avant mise en vente. Photos réelles, état décrit avec précision." },
    { icon: ShieldCheck, title: "Paiement sécurisé", desc: "Technologie Stripe — vos données bancaires ne transitent jamais par nos serveurs." },
    { icon: Truck, title: "Expédition 24/48h", desc: "Mondial Relay ou Chronopost. Suivi en temps réel. Livraison offerte dès 50€." },
    { icon: RotateCcw, title: "Retours 14 jours", desc: "Satisfait ou remboursé. Garantie légale 2 ans. Aucune condition cachée." },
    { icon: Zap, title: "Prix déstockage", desc: "Des prix jusqu'à -70% par rapport au neuf. Arrivages réguliers de nouvelles pépites." },
    { icon: CreditCard, title: "Portefeuille client", desc: "Cumulez des crédits sur votre compte SuperMalin et payez vos prochaines commandes." },
  ];

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
          Comment fonctionne <span className="text-orange-600">SuperMalin</span> ?
        </h1>
        <p className="text-xl text-gray-500 font-medium">
          Du déstockage professionnel, des prix imbattables, une expérience d'achat simple et rassurante.
        </p>
      </div>

      {/* Buying Flow */}
      <section className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all relative"
            >
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-orange-600 text-white rounded-xl flex items-center justify-center text-sm font-black">
                {i + 1}
              </div>
              <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mb-6`}>
                <step.icon size={28} />
              </div>
              <h3 className="text-lg font-bold mb-3">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Commitments Grid */}
      <section>
        <div className="bg-gray-900 rounded-[3rem] p-12 md:p-16 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-center">
              Nos <span className="text-orange-500">engagements</span>
            </h2>
            <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
              SuperMalin, c'est une promesse simple : des bonnes affaires, sans mauvaise surprise.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {commitments.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                >
                  <div className="w-10 h-10 bg-orange-600/20 rounded-xl flex items-center justify-center mb-4">
                    <item.icon size={20} className="text-orange-400" />
                  </div>
                  <h4 className="font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-20 text-center">
        <button
          onClick={() => window.scrollTo(0, 0)}
          className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-orange-700 transition-all shadow-xl shadow-orange-600/20"
        >
          Voir les arrivages
        </button>
      </div>
    </div>
  );
};
