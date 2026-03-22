import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { AppContext } from '../layouts/RootLayout';
import { AdminDashboard } from '../components/AdminDashboard';
import { ShieldCheck, Lock } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoggedIn } = useContext(AppContext);

  // Non connecté
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-12 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="text-orange-600" size={32} />
          </div>
          <h1 className="text-2xl font-black mb-3">Connexion requise</h1>
          <p className="text-gray-600 mb-8">
            Vous devez être connecté pour accéder à l'espace administrateur.
          </p>
          <button
            onClick={() => navigate('/admin-login')}
            className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition-all"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  // Connecté mais pas admin
  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="bg-white border-2 border-red-200 rounded-3xl p-12 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="text-red-600" size={32} />
          </div>
          <h1 className="text-2xl font-black mb-3">Accès refusé</h1>
          <p className="text-gray-600 mb-8">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-700 transition-all"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Admin confirmé → afficher le dashboard
  return <AdminDashboard />;
};
