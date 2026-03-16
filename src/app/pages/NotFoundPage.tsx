import React from 'react';
import { useNavigate } from 'react-router';
import { Home, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="text-9xl font-black text-orange-600 mb-4">404</div>
        <h1 className="text-4xl font-black mb-4">Page introuvable</h1>
        <p className="text-gray-600 text-lg mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 transition-all flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Retour à l'accueil
          </button>
          <button
            onClick={() => navigate('/boutique')}
            className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
          >
            <Search size={20} />
            Explorer la boutique
          </button>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Vous pensez qu'il s'agit d'une erreur ?</p>
          <a href="/contact" className="text-orange-600 hover:underline font-bold">
            Contactez notre équipe
          </a>
        </div>
      </div>
    </div>
  );
};
