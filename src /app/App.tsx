import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';

const App: React.FC = () => {
  // 🚨 INTERCEPTION DU HASH SUPABASE AVANT QUE REACT ROUTER NE REDIRIGE
  React.useEffect(() => {
    // Vérifier si l'URL contient un hash avec des paramètres Supabase Auth
    const hash = window.location.hash;
    
    if (hash) {
      console.log('🔍 Hash détecté dans App.tsx:', hash);
      
      const hashParams = new URLSearchParams(hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');
      
      console.log('Type:', type);
      console.log('Access token présent:', !!accessToken);
      
      // Si c'est un token de récupération de mot de passe
      if (type === 'recovery' && accessToken) {
        console.log('✅ Token de récupération détecté ! Forcer la navigation vers /reset-password');
        
        // Vérifier si on n'est pas déjà sur /reset-password
        const currentPath = window.location.pathname;
        console.log('Chemin actuel:', currentPath);
        
        if (currentPath !== '/reset-password') {
          console.log('🔄 Redirection vers /reset-password avec le hash préservé');
          // Remplacer l'URL sans recharger la page
          window.history.replaceState(null, '', `/reset-password${hash}`);
          // Forcer le rechargement pour que React Router prenne en compte la nouvelle route
          window.location.reload();
        }
      }
    }
  }, []);

  return <RouterProvider router={router} />;
};

export default App;