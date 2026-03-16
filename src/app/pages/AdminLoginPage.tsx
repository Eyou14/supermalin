import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ShieldCheck, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { AppContext } from '../layouts/RootLayout';
import { supabase } from '/src/utils/supabase/client';

const API_URL = `https://${projectId}.supabase.co/functions/v1/server`;

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, user } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Si déjà admin, rediriger vers admin
  useEffect(() => {
    if (isAdmin && user) {
      navigate('/admin');
    }
  }, [isAdmin, user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Se connecter avec Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        toast.error('Échec de connexion', {
          description: 'Email ou mot de passe incorrect'
        });
        setIsLoading(false);
        return;
      }

      if (!authData.session) {
        toast.error('Session invalide');
        setIsLoading(false);
        return;
      }

      // 2. Vérifier le rôle admin dans le profil
      const response = await fetch(`${API_URL}/profile/${authData.user.id}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      const profile = await response.json();

      if (profile.role !== 'admin') {
        // Pas admin → déconnecter et rediriger
        await supabase.auth.signOut();
        toast.error('Accès refusé', {
          description: 'Vous n\'avez pas les permissions administrateur'
        });
        setTimeout(() => {
          navigate('/');
        }, 2000);
        setIsLoading(false);
        return;
      }

      // 3. Admin confirmé → rediriger vers admin
      toast.success('Connexion réussie', {
        description: 'Bienvenue dans l\'espace administrateur'
      });
      
      setTimeout(() => {
        window.location.href = '/admin'; // Force reload pour mettre à jour le contexte
      }, 500);

    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Erreur', {
        description: 'Une erreur est survenue lors de la connexion'
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-3xl shadow-2xl p-12 max-w-md w-full border border-gray-700">
        {/* Warning Banner */}
        <div className="bg-red-900/20 border-2 border-red-500/50 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-red-300 mb-1">🔒 ZONE SÉCURISÉE</h3>
            <p className="text-sm text-red-200">
              Accès réservé aux administrateurs autorisés uniquement.
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            Administration
          </h1>
          <p className="text-gray-400 text-sm">SuperMalin Back-Office</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400 ml-1">
              Email Administrateur
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@supermalin.fr"
              required
              autoComplete="username"
              className="w-full bg-gray-900 border border-gray-600 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400 ml-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full bg-gray-900 border border-gray-600 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Connexion en cours...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Lock size={20} />
                Se connecter
              </span>
            )}
          </button>
        </form>

        {/* Info */}
        <div className="mt-8 bg-gray-900 rounded-xl p-4 border border-gray-700">
          <h3 className="font-bold text-gray-300 text-sm mb-2">🔐 Sécurité :</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Seuls les comptes avec role = "admin" peuvent accéder</li>
            <li>• La session est vérifiée à chaque requête</li>
            <li>• Les tentatives de connexion sont surveillées</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            ← Retour à l'accueil
          </button>
        </div>

        <p className="text-xs text-gray-600 text-center mt-6">
          SIRET: 92822322100013 - SuperMalin SAS
        </p>
      </div>
    </div>
  );
};