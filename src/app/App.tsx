import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';

const App: React.FC = () => {
  // 🚨 INTERCEPTION DU HASH SUPABASE AVANT QUE REACT ROUTER NE REDIRIGE
  React.useEffect(() => {
    // Vérifier si l'URL contient un hash avec des paramètres Supabase Auth
    const hash = window.location.hash;
    
    if (hash) {
      const hashParams = new URLSearchParams(hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');

      // Si c'est un token de récupération de mot de passe
      if (type === 'recovery' && accessToken) {
        const currentPath = window.location.pathname;
        if (currentPath !== '/reset-password') {
          window.history.replaceState(null, '', `/reset-password${hash}`);
          window.location.reload();
        }
      }
    }
  }, []);

  return <RouterProvider router={router} />;
};

export default App;