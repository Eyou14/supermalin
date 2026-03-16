import React from 'react';

export const PolitiqueConfidentialitePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-black mb-8">Politique de Confidentialité</h1>
      
      <div className="prose prose-lg max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            SuperMalin accorde une grande importance à la protection de vos données personnelles. Cette politique de confidentialité vous informe sur la manière dont nous collectons, utilisons, partageons et protégeons vos informations conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Responsable du traitement</h2>
          <p className="text-gray-700 leading-relaxed">
            Le responsable du traitement de vos données personnelles est <strong>SUPER MALIN SAS</strong>, contactable à l'adresse <strong>contact@supermalin.fr</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Données collectées</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            SUPER MALIN peut collecter les données suivantes :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Nom</li>
            <li>Prénom</li>
            <li>Adresse</li>
            <li>Email</li>
            <li>Téléphone</li>
            <li>Historique des commandes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. Finalité</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Ces données sont utilisées pour :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Gestion des commandes</li>
            <li>Livraison</li>
            <li>Facturation</li>
            <li>Service client</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Durée de conservation</h2>
          <p className="text-gray-700 leading-relaxed">
            Les données sont conservées pendant une durée maximale de 5 ans, sauf obligation légale contraire.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Destinataires des données</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Vos données peuvent être partagées avec les catégories de destinataires suivantes :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Personnel autorisé de SUPER MALIN</strong></li>
            <li><strong>Prestataires techniques :</strong> Hébergement (o2switch), base de données (Supabase), envoi d'emails (Resend)</li>
            <li><strong>Prestataire de paiement :</strong> Stripe (conforme PCI-DSS)</li>
            <li><strong>Transporteurs :</strong> Mondial Relay, Colissimo, Chronopost (uniquement pour l'expédition)</li>
            <li><strong>Autorités compétentes :</strong> En cas d'obligation légale ou de fraude avérée</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            Nous ne vendons ni ne louons vos données personnelles à des tiers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. Vos droits</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Conformément au RGPD, les utilisateurs disposent :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>D'un droit d'accès</li>
            <li>D'un droit de rectification</li>
            <li>D'un droit de suppression</li>
            <li>D'un droit d'opposition</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            Toute demande peut être adressée à : <strong>contact@supermalin.fr</strong>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">8. Sécurité des données</h2>
          <p className="text-gray-700 leading-relaxed">
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte, destruction ou divulgation :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-3">
            <li>Chiffrement SSL/TLS pour toutes les communications</li>
            <li>Hébergement sécurisé et sauvegardé</li>
            <li>Accès restreint aux données par mot de passe</li>
            <li>Paiement sécurisé via Stripe (certifié PCI-DSS)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">9. Transferts internationaux</h2>
          <p className="text-gray-700 leading-relaxed">
            Certains de nos prestataires (Supabase, Stripe) peuvent stocker vos données en dehors de l'Union Européenne. Ces transferts sont encadrés par des garanties appropriées (clauses contractuelles types, certifications Privacy Shield).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">10. Cookies</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Nous utilisons les cookies suivants :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Cookies strictement nécessaires :</strong> Authentification, panier, sécurité (pas de consentement requis)</li>
            <li><strong>Cookies fonctionnels :</strong> Préférences utilisateur (avec consentement)</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-3">
            Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela peut affecter le fonctionnement du site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">11. Réclamation</h2>
          <p className="text-gray-700 leading-relaxed">
            Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la Commission Nationale de l'Informatique et des Libertés (CNIL) :
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            <strong>CNIL</strong><br />
            3 Place de Fontenoy - TSA 80715<br />
            75334 PARIS CEDEX 07<br />
            Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">www.cnil.fr</a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">12. Modifications</h2>
          <p className="text-gray-700 leading-relaxed">
            SuperMalin se réserve le droit de modifier cette politique de confidentialité à tout moment. Toute modification sera publiée sur cette page avec la date de mise à jour.
          </p>
        </section>

        <div className="bg-orange-50 border-l-4 border-orange-600 p-6 rounded-r-xl mt-8">
          <p className="text-sm text-gray-700">
            <strong>Date de dernière mise à jour :</strong> 26 février 2026
          </p>
        </div>
      </div>
    </div>
  );
};