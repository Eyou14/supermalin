import React from 'react';

export const MentionsLegalesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-black mb-8">Mentions Légales</h1>
      
      <div className="prose prose-lg max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Éditeur du site</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Le site <strong>www.supermalin.fr</strong> est édité par :
          </p>
          <ul className="list-none space-y-2 text-gray-700">
            <li><strong>Nom commercial :</strong> SUPER MALIN</li>
            <li><strong>Forme juridique :</strong> SAS (Société par Actions Simplifiée)</li>
            <li><strong>SIRET :</strong> 92822322100013</li>
            <li><strong>Siège social :</strong> Hauts-de-France</li>
            <li><strong>Email :</strong> contact@supermalin.fr</li>
            <li><strong>Téléphone :</strong> 0977454776</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Directeur de la publication</h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>Mounou Pierre</strong>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Hébergement</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Le site www.supermalin.fr est hébergé par :
          </p>
          <ul className="list-none space-y-2 text-gray-700">
            <li><strong>Hébergeur :</strong> O2SWITCH</li>
            <li><strong>Adresse :</strong> 222-224 Boulevard Gustave Flaubert, 63000 Clermont-Ferrand, France</li>
            <li><strong>Site web :</strong> <a href="https://www.o2switch.fr" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">www.o2switch.fr</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Services techniques</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Le site utilise les services suivants :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Base de données et backend :</strong> Supabase</li>
            <li><strong>Paiement sécurisé :</strong> Stripe</li>
            <li><strong>Envoi d'emails transactionnels :</strong> Resend</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Propriété intellectuelle</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            L'ensemble des contenus présents sur le site (textes, images, logo, design, structure, éléments graphiques) sont la propriété exclusive de SUPER MALIN, sauf mentions contraires.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Toute reproduction, représentation ou exploitation, totale ou partielle, sans autorisation préalable écrite est strictement interdite.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Protection des données personnelles</h2>
          <p className="text-gray-700 leading-relaxed">
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            Pour exercer ces droits ou pour toute question sur le traitement de vos données, contactez-nous à <strong>contact@supermalin.fr</strong>.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            Pour en savoir plus, consultez notre <a href="/politique-confidentialite" className="text-orange-600 hover:underline">Politique de Confidentialité</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Cookies</h2>
          <p className="text-gray-700 leading-relaxed">
            Le site utilise des cookies essentiels au fonctionnement du service (authentification, panier). Aucun cookie publicitaire ou de tracking tiers n'est utilisé sans votre consentement explicite.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Responsabilité</h2>
          <p className="text-gray-700 leading-relaxed">
            SUPER MALIN ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation du site internet ou de l'impossibilité d'y accéder.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Médiation</h2>
          <p className="text-gray-700 leading-relaxed">
            En cas de litige, vous pouvez recourir gratuitement à un médiateur de la consommation dans un délai d'un an à compter de votre réclamation écrite auprès de SUPER MALIN.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Partenariat</h2>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl">
            <p className="text-gray-700 leading-relaxed">
              SuperMalin est soutenu par la <strong>Région Hauts-de-France</strong> dans le cadre de son développement économique et entrepreneurial.
            </p>
          </div>
        </section>

        <div className="bg-gray-50 p-6 rounded-xl mt-8">
          <p className="text-sm text-gray-700">
            <strong>Date de dernière mise à jour :</strong> 26 février 2026
          </p>
        </div>
      </div>
    </div>
  );
};