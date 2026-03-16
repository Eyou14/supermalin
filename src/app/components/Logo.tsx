import React, { useState, useCallback } from 'react';
import { Zap } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export const Logo = ({ className = "w-10 h-10", iconOnly = false, light = false }: { className?: string, iconOnly?: boolean, light?: boolean }) => {
  const logoUrl = "https://images.unsplash.com/photo-1736166054966-d7af5d257d31?q=80&w=200&h=200&auto=format&fit=crop";
  const navigate = useNavigate();
  
  // Easter egg: 5 clics pour accès admin
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleLogoClick = useCallback(() => {
    const now = Date.now();
    
    // Reset si plus de 2 secondes entre les clics
    if (now - lastClickTime > 2000) {
      setClickCount(1);
      setLastClickTime(now);
      return;
    }

    const newCount = clickCount + 1;
    setClickCount(newCount);
    setLastClickTime(now);

    // Afficher progression
    if (newCount === 3) {
      toast('🔐 Continue...', { duration: 1000 });
    } else if (newCount === 4) {
      toast('🔓 Presque...', { duration: 1000 });
    } else if (newCount === 5) {
      // Easter egg activé !
      toast.success('🎯 Accès Admin déverrouillé !', {
        description: 'Redirection vers la page de connexion admin...'
      });
      setTimeout(() => {
        navigate('/admin-login');
      }, 1000);
      setClickCount(0);
    }
  }, [clickCount, lastClickTime, navigate]);

  return (
    <div 
      className={`flex items-center gap-3 ${iconOnly ? '' : 'group cursor-pointer'}`}
      onClick={handleLogoClick}
      title="SuperMalin"
    >
      <div className={`relative ${className} shrink-0`}>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-orange-500 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
        
        {/* Main Logo Container - Circular for modern look */}
        <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-full flex items-center justify-center overflow-hidden border-2 border-orange-600 shadow-xl group-hover:border-orange-400 transition-all">
          <img 
            src={logoUrl} 
            alt="SuperMalin Mascot" 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
          {/* Overlay gradient to blend tech/malin */}
          <div className="absolute inset-0 bg-gradient-to-t from-orange-600/40 to-transparent pointer-events-none" />
        </div>
        
        {/* The "Super" Badge (Action/Speed) */}
        <div className="absolute -top-1 -right-1 bg-orange-600 text-white p-1 rounded-lg shadow-lg border border-white transform rotate-12 group-hover:rotate-0 transition-transform">
          <Zap size={10} fill="currentColor" />
        </div>
      </div>

      {!iconOnly && (
        <div className="flex flex-col -space-y-1">
          <span className={`text-xl font-black group-hover:text-orange-600 transition-colors tracking-tight ${light ? 'text-white' : 'text-gray-900'}`}>
            Super<span className="text-orange-600">Malin</span>
          </span>
          <span className={`text-[8px] font-bold uppercase tracking-[0.2em] group-hover:text-orange-500 transition-colors ${light ? 'text-gray-400' : 'text-gray-500'}`}>
            Déstockage Multi-Catégories
          </span>
        </div>
      )}
    </div>
  );
};