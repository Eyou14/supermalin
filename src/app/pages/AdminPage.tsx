/*import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { AppContext } from '../layouts/RootLayout';
import { AdminDashboardNew } from '../components/AdminDashboardNew';
import { ShieldAlert, Lock } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useContext(AppContext);

  // Protection 1 : Pas d'utilisateur connecté → redirection immédiate
  if (!user) {
    setTimeout(() => navigate('/'), 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-3xl shadow-2xl p-12 max-w-md w-full border border-gray-700 text-center">
          <Lock className="text-red-400 mx-auto mb-4" size={48} />
          <h1 className="text-3xl font-black text-white mb-4">Accès Refusé</h1>
          <p className="text-gray-400 mb-8">Vous devez être connecté pour accéder à cette page.</p>
          <p className="text-sm text-gray-500">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  // Protection 2 : Utilisateur connecté mais pas admin → redirection
  if (!isAdmin) {
    setTimeout(() => navigate('/'), 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-3xl shadow-2xl p-12 max-w-md w-full border border-gray-700 text-center">
          <ShieldAlert className="text-red-400 mx-auto mb-4" size={48} />
          <h1 className="text-3xl font-black text-white mb-4">Accès Refusé</h1>
          <p className="text-gray-400 mb-8">
            Vous n'avez pas les permissions administrateur pour accéder à cette page.
          </p>
          <p className="text-sm text-gray-500">Utilisateur: {user.email}</p>
          <p className="text-sm text-gray-500 mt-2">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  // Protection 3 : Tout est OK, afficher l'admin
  const { user, isAdmin, userProfile } = useContext(AppContext);

// Protection 1
if (!user) {
  setTimeout(() => navigate('/'), 100);
  return <div>Pas connecté</div>;
}

// 🔥 TEMPORAIRE : DEBUG ADMIN
return (
  <pre style={{ padding: 20, fontSize: 14 }}>
    {JSON.stringify(
      {
        email: user?.email,
        userId: user?.id,
        isAdmin,
        userProfile,
      },
      null,
      2
    )}
  </pre>
);*/

import React, { useContext } from 'react';
import { AppContext } from '../layouts/RootLayout';

export const AdminPage: React.FC = () => {
  const { user, isAdmin, userProfile } = useContext(AppContext);

  return (
    <pre style={{ padding: 20, fontSize: 14, whiteSpace: 'pre-wrap' }}>
      {JSON.stringify(
        {
          email: user?.email,
          userId: user?.id,
          isAdmin,
          userProfile,
        },
        null,
        2
      )}
    </pre>
  );
};