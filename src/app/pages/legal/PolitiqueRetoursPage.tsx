import React from 'react';

export const PolitiqueRetoursPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-black mb-8">Politique de Retours et Remboursements</h1>
      
      <div className="prose prose-lg max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">1. Droit de rétractation</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Conformément à la législation en vigueur, vous disposez d'un délai de <strong>14 jours</strong> à compter de la réception de votre commande pour exercer votre droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.
          </p>
          <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded-r-xl">
            <p className="text-sm text-gray-700">
              <strong>Important :</strong> Le délai court à partir de la date de réception du colis, et non de la date de commande.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Comment exercer votre droit de rétractation ?</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Pour exercer votre droit de rétractation, suivez ces étapes :
          </p>
          <ol className="list-decimal pl-6 space-y-3 text-gray-700">
            <li>
              <strong>Contactez-nous :</strong> Envoyez un email à <strong>contact@supermalin.fr</strong> en précisant :
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Votre numéro de commande</li>
                <li>Le(s) produit(s) concerné(s)</li>
                <li>Le motif du retour (facultatif)</li>
              </ul>
            </li>
            <li>
              <strong>Recevez l'autorisation :</strong> Nous vous confirmerons la prise en compte de votre demande et vous fournirons une étiquette de retour si nécessaire.
            </li>
            <li>
              <strong>Retournez le produit :</strong> Renvoyez le produit dans son emballage d'origine, complet avec tous ses accessoires, notices et éléments.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Conditions de retour</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Pour que votre retour soit accepté, le produit doit respecter les conditions suivantes :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Le produit doit être dans son <strong>état d'origine</strong>, non utilisé, non endommagé et complet</li>
            <li>L'emballage d'origine doit être intact (scellés, étiquettes, etc.)</li>
            <li>Tous les accessoires, notices et éléments fournis doivent être présents</li>
            <li>Le produit ne doit pas présenter de traces d'usure, de rayures ou de dommages</li>
          </ul>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl mt-4">
            <p className="text-sm text-gray-700">
              <strong>Astuce :</strong> Conservez l'emballage d'origine jusqu'à la fin du délai de rétractation pour faciliter un éventuel retour.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Délai de retour</h2>
          <p className="text-gray-700 leading-relaxed">
            Le client dispose de <strong>14 jours</strong> après réception pour retourner un produit.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Conditions</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Le produit doit être :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Non utilisé</li>
            <li>Dans son emballage d'origine</li>
            <li>Complet avec accessoires</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Remboursement</h2>
          <p className="text-gray-700 leading-relaxed">
            Le remboursement est effectué dans un délai de 14 jours après validation du retour.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. Frais de retour</h2>
          <div className="space-y-3">
            <div className="bg-green-50 border-2 border-green-600 p-4 rounded-xl">
              <p className="text-gray-700 font-semibold">✅ Retour gratuit dans les cas suivants :</p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-gray-700">
                <li>Produit défectueux ou non conforme</li>
                <li>Erreur de livraison (mauvais produit envoyé)</li>
                <li>Colis endommagé lors du transport</li>
              </ul>
            </div>
            <div className="bg-orange-50 border-2 border-orange-600 p-4 rounded-xl">
              <p className="text-gray-700 font-semibold">⚠️ Frais de retour à votre charge dans les cas suivants :</p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-gray-700">
                <li>Changement d'avis</li>
                <li>Produit ne convenant pas à vos besoins</li>
              </ul>
              <p className="text-xs text-gray-600 mt-2">Nous vous recommandons d'utiliser un transporteur avec suivi (Colissimo, Mondial Relay).</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">8. Inspection et remboursement</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Une fois votre retour reçu, nous procéderons selon les étapes suivantes :
          </p>
          <ol className="list-decimal pl-6 space-y-3 text-gray-700">
            <li>
              <strong>Inspection (sous 3 jours ouvrés) :</strong> Nous vérifions l'état du produit et sa conformité aux conditions de retour.
            </li>
            <li>
              <strong>Validation :</strong> Si le produit est conforme, nous validons votre demande de remboursement.
            </li>
            <li>
              <strong>Remboursement (sous 14 jours) :</strong> Le remboursement est effectué par le même moyen de paiement que celui utilisé lors de l'achat.
            </li>
          </ol>
          <p className="text-gray-700 leading-relaxed mt-4">
            Vous recevrez une confirmation par email à chaque étape du processus.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">9. Produits exclus du droit de rétractation</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Conformément à la législation, certains produits ne peuvent pas faire l'objet d'un retour :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Produits descellés pour des raisons d'hygiène ou de santé (écouteurs intra-auriculaires, cosmétiques ouverts)</li>
            <li>Produits personnalisés ou sur-mesure</li>
            <li>Produits périssables ou à date d'expiration courte</li>
            <li>Contenus numériques téléchargés (logiciels, licences)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">10. Produit défectueux ou non conforme</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Si vous recevez un produit défectueux ou non conforme à votre commande, contactez-nous immédiatement à <strong>contact@supermalin.fr</strong> avec :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Votre numéro de commande</li>
            <li>Une description détaillée du problème</li>
            <li>Des photos du produit et de l'emballage</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            Nous vous proposerons les solutions suivantes :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-2">
            <li><strong>Échange :</strong> Remplacement par un produit identique (sous réserve de disponibilité)</li>
            <li><strong>Remboursement intégral :</strong> Incluant les frais de livraison initiaux</li>
            <li><strong>Réparation :</strong> Si applicable et souhaité</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">11. Garantie légale</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Indépendamment du droit de rétractation, tous les produits bénéficient des garanties légales :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Garantie légale de conformité :</strong> 2 ans pour les produits neufs</li>
            <li><strong>Garantie des vices cachés :</strong> Protection contre les défauts non apparents</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            Pour plus d'informations sur les garanties, consultez nos <a href="/cgv" className="text-orange-600 hover:underline">Conditions Générales de Vente</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">12. Échange de produit</h2>
          <p className="text-gray-700 leading-relaxed">
            Si vous souhaitez échanger un produit pour une raison autre qu'un défaut :
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700 mt-3">
            <li>Effectuez d'abord un retour selon la procédure standard</li>
            <li>Une fois le remboursement effectué, passez une nouvelle commande pour le produit souhaité</li>
          </ol>
          <p className="text-gray-700 leading-relaxed mt-3">
            Cette procédure garantit une traçabilité optimale et évite les erreurs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">13. Responsabilité lors du retour</h2>
          <p className="text-gray-700 leading-relaxed">
            Vous êtes responsable du produit jusqu'à sa réception dans nos entrepôts. Nous vous recommandons vivement d'utiliser un service de livraison avec suivi et assurance pour tout retour.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            SuperMalin ne pourra être tenu responsable en cas de perte ou de dommage durant le transport retour si vous n'avez pas souscrit d'assurance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">14. Adresse de retour</h2>
          <div className="bg-gray-50 p-6 rounded-xl">
            <p className="text-gray-700 font-semibold mb-2">Retourner votre colis à :</p>
            <p className="text-gray-900 font-mono">
              SUPER MALIN<br />
              Service Retours<br />
              13 Av. Roland Moreno<br />
              77124 Chauconin-Neufmontiers<br />
              France
            </p>
            <p className="text-sm text-gray-600 mt-3">
              ⚠️ N'oubliez pas d'indiquer votre numéro de commande à l'intérieur du colis.
            </p>
          </div>
        </section>

        <div className="bg-orange-50 border-l-4 border-orange-600 p-6 rounded-r-xl mt-8">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Besoin d'aide ?</strong>
          </p>
          <p className="text-sm text-gray-700">
            Notre équipe est à votre disposition pour toute question relative aux retours et remboursements. 
            Contactez-nous à <strong>contact@supermalin.fr</strong> ou au <strong>0977454776</strong>.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl mt-8">
          <p className="text-sm text-gray-700">
            <strong>Date de dernière mise à jour :</strong> 26 février 2026
          </p>
        </div>
      </div>
    </div>
  );
};