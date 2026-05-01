import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { AppContext } from '../layouts/RootLayout';
import { UserProfile } from '../components/UserProfile';
import { supabase } from '/src/utils/supabase/client';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile, updateUserProfile } = useContext(AppContext);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-black mb-4">Connexion requise</h1>
        <p className="text-gray-600 mb-8">Veuillez vous connecter pour accéder à votre profil</p>
        <button
          onClick={() => navigate('/')}
          className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all"
        >
          Retour à l'accueil
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