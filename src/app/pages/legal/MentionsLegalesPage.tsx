import React from 'react';

export const MentionsLegalesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-black mb-2">Mentions Légales</h1>
      <p className="text-gray-400 text-sm mb-10">Dernière mise à jour : 30 avril 2026</p>

      <div className="space-y-10">

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-5 text-gray-900">Éditeur du site</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div><span className="font-bold text-gray-500 uppercase text-[11px] tracking-wide block mb-1">Raison sociale</span>MounAchatMalin SAS</div>
            <div><span className="font-bold text-gray-500 uppercase text-[11px] tracking-wide block mb-1">Nom commercial</span>SuperMalin</div>
            <div><span className="font-bold text-gray-500 uppercase text-[11px] tracking-wide block mb-1">Forme juridique</span>Société par Actions Simplifiée (SAS)</div>
            <div><span className="font-bold text-gray-500 uppercase text-[11px] tracking-wide block mb-1">Capital social</span>5 000 €</div>
            <div><span className="font-bold text-gray-500 uppercase text-[11px] tracking-wide block mb-1">SIRET</span>928 223 221 00013</div>
            <div><span className="font-bold text-gray-500 uppercase text-[11px] tracking-wide block mb-1">Siège social</span>13 rue René Latour, 60620 Acy-en-Multien, France</div>
            <div><span className="font-bold text-gray-500 uppercase text-[11px] tracking-wide block mb-1">Email</span><a href="mailto:contact@supermalin.fr" className="text-orange-600 hover:underline">contact@supermalin.fr</a></div>
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-5 text-gray-900">Directeur de la publication</h2>
          <p className="text-gray-700 text-sm">Mounou Pierre, en qualité de représentant légal de MounAchatMalin SAS.</p>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-5 text-gray-900">Hébergement</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <p className="font-bold mb-1">Interface web (frontend)</p>
              <p>Vercel Inc. — 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</p>
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">vercel.com</a>
            </div>
            <div>
              <p className="font-bold mb-1">Base de données et stockage</p>
              <p>Supabase Inc. — 970 Toa Payoh North, #07-04, Singapore 318992</p>
              <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">supabase.com</a>
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-5 text-gray-900">Propriété intellectuelle</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            L'ensemble des contenus présents sur le site supermalin.fr (textes, images, logo, design, structure, éléments graphiques) sont la propriété exclusive de MounAchatMalin SAS, sauf mentions contraires. Toute reproduction, représentation ou exploitation, totale ou partielle, sans autorisation préalable écrite est strictement interdite et constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
          </p>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-5 text-gray-900">Données personnelles</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            Conformément au RGPD et à la loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données.
          </p>
          <p className="text-gray-700 text-sm">
            Pour exercer ces droits : <a href="mailto:contact@supermalin.fr" className="text-orange-600 hover:underline">contact@supermalin.fr</a> — voir notre <a href="/politique-confidentialite" className="text-orange-600 hover:underline">Politique de confidentialité</a>.
          </p>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-5 text-gray-900">Cookies</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Le site utilise uniquement des cookies techniques essentiels au fonctionnement du service (authentification, panier, session). Aucun cookie publicitaire ou de tracking tiers n'est utilisé sans votre consentement explicite.
          </p>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-8">
          <h2 className="text-xl font-black mb-5 text-gray-900">Médiation de la consommation</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            En cas de litige non résolu à l'amiable, vous pouvez recourir gratuitement au service de médiation de la consommation dans un délai d'un an suivant votre réclamation écrite auprès de MounAchatMalin SAS. Conformément à l'article 14 du Règlement (UE) n° 524/2013, la Commission Européenne met à disposition une plateforme de règlement en ligne des litiges : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">ec.europa.eu/consumers/odr</a>.
          </p>
        </section>

        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-600">
            Pour toute question, contactez-nous à <a href="mailto:contact@supermalin.fr" className="text-orange-600 font-bold hover:underline">contact@supermalin.fr</a>
          </p>
        </div>

      </div>
    </div>
  );
};
