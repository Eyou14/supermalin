import React from 'react';

export const PolitiqueConfidentialitePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-black mb-2">Politique de Confidentialité</h1>
      <p className="text-gray-400 text-sm mb-10">Dernière mise à jour : 30 avril 2026</p>

      <div className="space-y-8">

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <p className="text-sm text-gray-700 leading-relaxed">
            MounAchatMalin SAS (exploitant SuperMalin) s'engage à protéger vos données personnelles conformément au <strong>Règlement Général sur la Protection des Données (RGPD)</strong> et à la loi n° 78-17 du 6 janvier 1978. Cette politique vous explique quelles données nous collectons, pourquoi et comment vous pouvez les contrôler.
          </p>
        </div>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">1. Responsable du traitement</h2>
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>MounAchatMalin SAS</strong></p>
            <p>13 rue René Latour, 60620 Acy-en-Multien</p>
            <p>SIRET : 928 223 221 00013</p>
            <p>Email : <a href="mailto:contact@supermalin.fr" className="text-orange-600 hover:underline">contact@supermalin.fr</a></p>
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">2. Données collectées</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">Nous collectons uniquement les données nécessaires au fonctionnement du service :</p>
          <div className="space-y-3">
            {[
              { titre: "Données de compte", detail: "Prénom, nom, adresse email, mot de passe (chiffré) — lors de l'inscription." },
              { titre: "Données de commande", detail: "Adresse de livraison, numéro de téléphone, historique d'achats — pour traiter vos commandes." },
              { titre: "Données de paiement", detail: "Aucune donnée bancaire n'est stockée par SuperMalin. Le paiement est intégralement géré par Stripe." },
              { titre: "Données de navigation", detail: "Adresse IP, type de navigateur, pages visitées — collectées automatiquement pour la sécurité et l'amélioration du service." },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="text-orange-500 font-bold mt-0.5">›</span>
                <div><strong className="text-gray-900">{item.titre} :</strong> <span className="text-gray-700">{item.detail}</span></div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">3. Finalités du traitement</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span>Gestion des comptes clients et authentification</span></div>
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span>Traitement et livraison des commandes</span></div>
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span>Communication transactionnelle (confirmation de commande, suivi, retours)</span></div>
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span>Amélioration du service et analyse d'audience (données anonymisées)</span></div>
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span>Respect des obligations légales et fiscales</span></div>
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">4. Base légale des traitements</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Nos traitements reposent sur : l'<strong>exécution du contrat</strong> (commandes), le <strong>respect d'obligations légales</strong> (facturation, fiscalité), notre <strong>intérêt légitime</strong> (sécurité, amélioration du service) et votre <strong>consentement</strong> (communications marketing optionnelles).
          </p>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">5. Sous-traitants et partage de données</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">Vos données sont partagées uniquement avec les prestataires nécessaires à la fourniture du service, dans le cadre d'un contrat de sous-traitance conforme au RGPD :</p>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span><strong>Stripe</strong> — paiement sécurisé</span></div>
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span><strong>Supabase</strong> — base de données et stockage (serveurs UE)</span></div>
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span><strong>Vercel</strong> — hébergement de l'interface web</span></div>
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span><strong>Transporteurs</strong> (Colissimo, Mondial Relay, Chronopost) — livraison (adresse de livraison uniquement)</span></div>
          </div>
          <p className="text-gray-700 text-sm mt-4">Vos données ne sont <strong>jamais vendues</strong> à des tiers à des fins commerciales.</p>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">6. Durée de conservation</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span><strong>Données de compte :</strong> durée de l'inscription + 3 ans après la dernière commande</span></div>
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span><strong>Données de commande :</strong> 10 ans (obligations comptables et fiscales)</span></div>
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span><strong>Données de navigation :</strong> 13 mois maximum</span></div>
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">7. Vos droits</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">Conformément au RGPD, vous disposez des droits suivants :</p>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span><strong>Droit d'accès</strong> — obtenir une copie de vos données</span></div>
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span><strong>Droit de rectification</strong> — corriger des données inexactes</span></div>
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span><strong>Droit à l'effacement</strong> — supprimer vos données (sous conditions légales)</span></div>
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span><strong>Droit à la portabilité</strong> — recevoir vos données dans un format structuré</span></div>
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span><strong>Droit d'opposition</strong> — s'opposer à certains traitements</span></div>
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span><strong>Droit à la limitation</strong> — restreindre temporairement un traitement</span></div>
          </div>
          <p className="text-gray-700 text-sm mt-4">
            Pour exercer ces droits : <a href="mailto:contact@supermalin.fr" className="text-orange-600 hover:underline">contact@supermalin.fr</a>. Réponse sous 30 jours. En cas de litige, vous pouvez saisir la <strong>CNIL</strong> sur <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">cnil.fr</a>.
          </p>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">8. Cookies</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            SuperMalin utilise uniquement des cookies <strong>techniques essentiels</strong> au fonctionnement du service (session, panier, authentification). Ces cookies ne nécessitent pas de consentement.
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">
            Aucun cookie publicitaire ou de tracking tiers n'est déposé sans votre consentement explicite. Vous pouvez configurer votre navigateur pour refuser tous les cookies, ce qui peut altérer certaines fonctionnalités du site.
          </p>
        </section>

        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-600">
            Pour toute question relative à vos données : <a href="mailto:contact@supermalin.fr" className="text-orange-600 font-bold hover:underline">contact@supermalin.fr</a>
          </p>
        </div>

      </div>
    </div>
  );
};
