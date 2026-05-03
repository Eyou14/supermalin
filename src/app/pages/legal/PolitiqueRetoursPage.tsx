import React from 'react';

export const PolitiqueRetoursPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-black mb-2">Politique de Retours & Remboursements</h1>
      <p className="text-gray-400 text-sm mb-10">Dernière mise à jour : 30 avril 2026</p>

      <div className="space-y-8">

        <div className="bg-green-50 border border-green-100 rounded-2xl p-6 flex items-start gap-4">
          <div className="text-3xl">↩️</div>
          <div>
            <p className="font-black text-gray-900 mb-1">Satisfait ou remboursé — 14 jours</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Vous avez <strong>14 jours</strong> après réception pour retourner un article, sans avoir à vous justifier. C'est votre droit légal et nous l'appliquons sans conditions supplémentaires.
            </p>
          </div>
        </div>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">1. Droit de rétractation légal (14 jours)</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            Conformément à l'article L.221-18 du Code de la consommation, vous disposez d'un délai de <strong>14 jours calendaires</strong> à compter du lendemain de la réception de votre commande pour exercer votre droit de rétractation.
          </p>
          <div className="bg-orange-50 border-l-4 border-orange-500 rounded-r-xl p-4 text-sm text-gray-700">
            <strong>Important :</strong> Le délai court à partir de la date de réception du colis, non de la date de commande.
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">2. Procédure de retour</h2>
          <div className="space-y-4">
            {[
              { num: "1", titre: "Contactez-nous", detail: "Envoyez un email à contact@supermalin.fr en indiquant votre numéro de commande et la raison du retour (facultative mais appréciée)." },
              { num: "2", titre: "Préparez le colis", detail: "Remballez soigneusement l'article dans son emballage d'origine si possible. Joignez une copie de la confirmation de commande." },
              { num: "3", titre: "Expédiez le retour", detail: "Envoyez le colis à l'adresse indiquée dans notre réponse. Conservez le justificatif d'expédition." },
              { num: "4", titre: "Remboursement", detail: "Après réception et vérification de l'article, le remboursement est effectué sous 5 à 10 jours ouvrés sur le moyen de paiement utilisé lors de l'achat." },
            ].map((step) => (
              <div key={step.num} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-black shrink-0">{step.num}</div>
                <div className="text-sm text-gray-700">
                  <p className="font-bold text-gray-900 mb-1">{step.titre}</p>
                  <p className="leading-relaxed">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">3. Frais de retour</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex gap-3 p-4 bg-green-50 rounded-xl">
              <span className="text-green-600 font-black text-lg">✓</span>
              <div>
                <p className="font-bold text-green-800 mb-1">Retour GRATUIT</p>
                <p>Si le produit est défectueux, non conforme à la description, ou endommagé lors du transport.</p>
              </div>
            </div>
            <div className="flex gap-3 p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-500 font-black text-lg">→</span>
              <div>
                <p className="font-bold text-gray-800 mb-1">Frais à votre charge</p>
                <p>Dans les autres cas (rétractation, changement d'avis), les frais de retour sont à votre charge.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">4. État du produit retourné</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            Le produit doit être retourné dans l'état dans lequel vous l'avez reçu. Tout retour présentant des dégradations supplémentaires imputables au client pourra faire l'objet d'une déduction sur le remboursement.
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">
            Pour les produits "Neuf scellé", l'emballage doit être intact si vous souhaitez bénéficier d'un remboursement total.
          </p>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">5. Produits non éligibles au retour</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex gap-2"><span className="text-red-400 font-bold">✕</span><span>Produits descellés par le client (hygiène : cosmétiques, lingerie)</span></div>
            <div className="flex gap-2"><span className="text-red-400 font-bold">✕</span><span>Produits personnalisés ou sur mesure</span></div>
            <div className="flex gap-2"><span className="text-red-400 font-bold">✕</span><span>Produits endommagés par le client après livraison</span></div>
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">6. Garantie légale de conformité</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            Au-delà du droit de rétractation, vous bénéficiez de la <strong>garantie légale de conformité</strong> pendant <strong>2 ans</strong> à compter de la livraison (article L.217-4 du Code de la consommation).
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">
            En cas de défaut de conformité constaté dans les <strong>12 premiers mois</strong>, la présomption de défaut préexistant à la livraison s'applique — la preuve contraire nous incombe.
          </p>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-4 text-gray-900">7. Remboursement</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            Le remboursement est effectué sur le même moyen de paiement utilisé lors de l'achat, dans un délai de <strong>5 à 10 jours ouvrés</strong> après réception et validation du retour.
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">
            Le remboursement inclut le prix du produit et les frais de livraison initiaux (hors frais de retour sauf cas de produit défectueux).
          </p>
        </section>

        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center">
          <p className="font-bold text-gray-900 mb-2">Une question sur un retour ?</p>
          <p className="text-sm text-gray-600 mb-3">Notre équipe répond sous 24h ouvrées</p>
          <a
            href="mailto:contact@supermalin.fr"
            className="inline-block bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-700 transition-colors"
          >
            contact@supermalin.fr
          </a>
        </div>

      </div>
    </div>
  );
};
