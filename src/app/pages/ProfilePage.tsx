import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { AppContext } from '../layouts/RootLayout';
import { UserProfile } from '../components/UserProfile';
import { supabase } from '/src/utils/supabase/client';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile, updateUserProfile } = useContext(AppContext);

  const handleLogout = async () => {
    try {
      // Deconnexion locale uniquement, timeout 3s si Supabase est lent
      await Promise.race([
        supabase.auth.signOut({ scope: 'local' }),
        new Promise<void>((resolve) => setTimeout(resolve, 3000)),
      ]);
    } catch {
      // Ignorer les erreurs reseau
    } finally {
      // Vider toutes les cles Supabase du localStorage
      Object.keys(localStorage)
        .filter((k) => k.startsWith('sb-'))
        .forEach((k) => localStorage.removeItem(k));
    }
    navigate('/');
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-black mb-4">Connexion requise</h1>
        <p className="text-gray-600 mb-8">Veuillez vous connecter pour acceder a votre profil</p>
        <button
          onClick={() => navigate('/')}
          className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all"
        >
          Retour a l'accueil
        </button>
      </div>
    );
  }

  return (
    <UserProfile
      user={user}
      profile={userProfile}
      onLogout={handleLogout}
      onUpdateProfile={updateUserProfile}
      onNavigate={(page) => navigate(page === 'home' ? '/' : `/${page}`)}
    />
  );
};
