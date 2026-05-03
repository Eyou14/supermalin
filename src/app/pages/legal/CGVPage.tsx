import React from 'react';

export const CGVPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-black mb-8">Conditions Générales de Vente</h1>
      
      <div className="prose prose-lg max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Article 1 – Objet</h2>
          <p className="text-gray-700 leading-relaxed">
            Les présentes Conditions Générales de Vente régissent les ventes réalisées sur le site supermalin.fr.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Article 2 – Produits</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Les produits proposés sont issus de déstockage et peuvent être :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Neufs</li>
            <li>Reconditionnés</li>
            <li>En très bon état</li>
            <li>En état correct</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            Les descriptions sont établies avec la plus grande précision possible.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Article 3 – Prix</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Les prix sont indiqués en euros TTC.
          </p>
          <p className="text-gray-700 leading-relaxed">
            SUPER MALIN se réserve le droit de modifier ses prix à tout moment. Le prix appliqué est celui affiché au moment de la commande.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Article 4 – Commande</h2>
          <p className="text-gray-700 leading-relaxed">
            Toute commande passée sur le site implique l'acceptation pleine et entière des présentes CGV.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Article 5 – Paiement</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Les paiements sont sécurisés via la plateforme Stripe.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Cartes acceptées : Visa, Mastercard.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Article 6 – Livraison</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Les livraisons sont effectuées via :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Mondial Relay</li>
            <li>Colissimo</li>
            <li>Chronopost</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            Les délais de livraison sont donnés à titre indicatif.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Article 7 – Droit de rétractation</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Conformément à la législation en vigueur, le client dispose d'un délai de <strong>14 jours</strong> à compter de la réception du produit pour exercer son droit de rétractation.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            Le produit doit être retourné :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Non utilisé</li>
            <li>Dans son emballage d'origine</li>
            <li>Complet (accessoires inclus)</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            Les frais de retour sont à la charge du client sauf en cas de produit défectueux.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Article 8 – Remboursement</h2>
          <p className="text-gray-700 leading-relaxed">
            Le remboursement intervient dans un délai maximum de 14 jours après réception et validation du produit retourné.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Article 9 – Responsabilité</h2>
          <p className="text-gray-700 leading-relaxed">
            SUPER MALIN ne saurait être tenu responsable en cas de mauvaise utilisation du produit par le client.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Article 10 – Litiges</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Les présentes CGV sont soumises au droit français.
          </p>
          <p className="text-gray-700 leading-relaxed">
            En cas de litige, compétence est attribuée aux tribunaux du ressort du siège social.
          </p>
        </section>

        <div className="bg-gray-50 p-6 rounded-xl mt-8">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Informations légales :</strong>
          </p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li><strong>Raison sociale :</strong> SUPER MALIN</li>
            <li><strong>Forme juridique :</strong> SAS (Société par Actions Simplifiée)</li>
            <li><strong>SIRET :</strong> 92822322100013</li>
            <li><strong>Siège social :</strong> Hauts-de-France</li>
            <li><strong>Email :</strong> contact@supermalin.fr</li>
            <li><strong>Téléphone :</strong> 0977454776</li>
          </ul>
        </div>

        <div className="bg-orange-50 border-l-4 border-orange-600 p-6 rounded-r-xl mt-8">
          <p className="text-sm text-gray-700">
            <strong>Date de dernière mise à jour :</strong> 26 février 2026
          </p>
        </div>
      </div>
    </div>
  );
};