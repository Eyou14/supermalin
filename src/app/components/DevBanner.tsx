import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';

export const DevBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Ne pas afficher en production
  if (window.location.hostname === 'supermalin.fr' || window.location.hostname === 'www.supermalin.fr') {
    return null;
  }

  // Ne pas afficher si déjà fermé dans cette session
  const bannerDismissed = sessionStorage.getItem('devBannerDismissed');
  if (bannerDismissed || !isVisible) {
    return null;
  }

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('devBannerDismissed', 'true');
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <AlertCircle size={24} className="flex-shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-sm">
              🔧 Mode TEST activé pour Reset Password
            </p>
            <p className="text-xs text-purple-100">
              Configurez Supabase puis testez le flux avec{' '}
              <Link 
                to="/forgot-password" 
                className="underline hover:text-white font-bold"
              >
                /forgot-password
              </Link>
              {' '}→ Voir{' '}
              <a 
                href="/QUICK_START_RESET_PASSWORD.md" 
                target="_blank" 
                className="underline hover:text-white font-bold"
              >
                QUICK_START_RESET_PASSWORD.md
              </a>
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-white hover:bg-white/20 p-2 rounded-lg transition-all flex-shrink-0"
          title="Fermer"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};
