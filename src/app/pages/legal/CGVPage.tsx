import React from 'react';

export const CGVPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-black mb-2">Conditions Générales de Vente</h1>
      <p className="text-gray-400 text-sm mb-10">Dernière mise à jour : 30 avril 2026</p>

      <div className="space-y-8">

        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
          <p className="text-sm text-gray-700 leading-relaxed">
            Les présentes CGV s'appliquent à toutes les ventes conclues sur <strong>supermalin.fr</strong>, exploité par <strong>MounAchatMalin SAS</strong> (SIRET : 928 223 221 00013), 13 rue René Latour, 60620 Acy-en-Multien. Toute commande implique l'acceptation pleine et entière des présentes CGV.
          </p>
        </div>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">Article 1 – Nature des produits</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            SuperMalin commercialise des produits issus de déstockage, retours clients ou fins de série. Chaque produit indique son état exact :
          </p>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span><strong>Neuf scellé</strong> — jamais ouvert, emballage d'origine intact</span></div>
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span><strong>Neuf ouvert</strong> — déballé mais jamais utilisé</span></div>
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span><strong>Très bon état</strong> — légères traces d'utilisation, fonctionnel à 100%</span></div>
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span><strong>Bon état</strong> — traces visibles décrites dans la fiche, fonctionnel</span></div>
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span><strong>Correct</strong> — défauts esthétiques notables décrits précisément</span></div>
            <div className="flex gap-2"><span className="text-orange-500 font-bold">›</span><span><strong>Pour pièces</strong> — vendu tel quel, sans garantie de fonctionnement</span></div>
          </div>
          <p className="text-gray-700 text-sm mt-4">Les photos présentées sont celles du produit réel vendu.</p>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">Article 2 – Prix</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Les prix sont indiqués en euros TTC. Le prix facturé est celui en vigueur au moment de la validation de la commande. Les frais de livraison sont affichés avant la validation finale.
          </p>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">Article 3 – Commande et disponibilité</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            La commande est confirmée par email après validation du paiement. Les stocks étant limités (déstockage), les produits sont vendus dans la limite des stocks disponibles. En cas de rupture après commande, le client est remboursé intégralement dans un délai de 5 jours ouvrés.
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">
            MounAchatMalin SAS se réserve le droit d'annuler toute commande en cas d'erreur manifeste de prix ou de suspicion de fraude.
          </p>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">Article 4 – Paiement</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Le paiement est sécurisé via <strong>Stripe</strong> (certifié PCI-DSS). Moyens acceptés : carte bancaire (Visa, Mastercard), Apple Pay, Google Pay. MounAchatMalin SAS ne conserve aucune donnée bancaire.
          </p>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">Article 5 – Livraison</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Expédition sous 2 à 5 jours ouvrés. Livraison en France métropolitaine, DOM-TOM et Union Européenne via Colissimo, Mondial Relay ou Chronopost selon l'option choisie. En cas de retard imputable au transporteur, MounAchatMalin SAS ne peut être tenu responsable mais intervient auprès du transporteur.
          </p>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">Article 6 – Droit de rétractation</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            Conformément à l'article L.221-18 du Code de la consommation, vous disposez de <strong>14 jours</strong> à compter de la réception du colis pour vous rétracter, sans justification.
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">
            Exercez ce droit en contactant <a href="mailto:contact@supermalin.fr" className="text-orange-600 hover:underline">contact@supermalin.fr</a>. Les frais de retour sont à votre charge, sauf produit défectueux ou non conforme à la description.
          </p>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">Article 7 – Garanties légales</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Tous les produits bénéficient de la <strong>garantie légale de conformité</strong> (L.217-4 et suivants du Code de la consommation) et de la <strong>garantie des vices cachés</strong> (articles 1641 et suivants du Code civil). Les produits "Pour pièces" sont exclus de toute garantie de fonctionnement.
          </p>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">Article 8 – Données personnelles</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Les données collectées lors de la commande sont utilisées exclusivement pour son traitement et sa livraison. Elles ne sont jamais revendues. Voir notre <a href="/politique-confidentialite" className="text-orange-600 hover:underline">Politique de confidentialité</a>.
          </p>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">Article 9 – Droit applicable</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Les présentes CGV sont soumises au droit français. En cas de litige non résolu à l'amiable, les tribunaux du ressort du siège social de MounAchatMalin SAS seront compétents. Pour les litiges transfrontaliers UE : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">ec.europa.eu/consumers/odr</a>.
          </p>
        </section>

        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-600">
            Questions sur une commande ? <a href="mailto:contact@supermalin.fr" className="text-orange-600 font-bold hover:underline">contact@supermalin.fr</a>
          </p>
        </div>

      </div>
    </div>
  );
};
