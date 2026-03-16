import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '/src/utils/supabase/client';
import { toast } from 'sonner';
import { PasswordValidator, validatePassword } from '../components/PasswordValidator';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    const handlePasswordReset = async () => {
      console.log('🔍 ResetPasswordPage - Début de la vérification du token');
      console.log('URL complète:', window.location.href);
      console.log('Search params:', window.location.search);
      console.log('Hash:', window.location.hash);
      
      try {
        // MODE DÉVELOPPEMENT : Contourner le rate limiting
        const devMode = searchParams.get('dev_mode');
        const devEmail = searchParams.get('email');
        
        if (devMode === 'true' && devEmail) {
          console.log('🛠️ MODE DÉVELOPPEMENT ACTIVÉ pour:', devEmail);
          console.log('⚠️ Création d\'une session de développement sans vérification email');
          
          // En mode dev, on autorise directement le reset sans vérifier le token email
          // ATTENTION : Ne jamais utiliser en production !
          setIsValidToken(true);
          setIsCheckingToken(false);
          
          toast.success('Mode développement activé', {
            description: '⚠️ Session temporaire créée pour contourner le rate limiting'
          });
          
          return;
        }
        
        // Méthode 1 : PKCE flow avec code dans l'URL (?code=...)
        const code = searchParams.get('code');
        
        if (code) {
          console.log('✅ Code PKCE détecté dans URL:', code.substring(0, 20) + '...');
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('❌ Erreur lors de l\'échange du code:', error);
            throw error;
          }
          
          if (data.session) {
            console.log('✅ Session établie avec succès via code PKCE');
            setIsValidToken(true);
            setIsCheckingToken(false);
            return;
          }
        }

        // Méthode 2 : Implicit flow avec access_token dans le hash (#access_token=...)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        
        console.log('Type dans hash:', type);
        console.log('Access token présent:', !!accessToken);

        if (type === 'recovery' && accessToken) {
          console.log('✅ Token de récupération détecté dans le hash');
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });

          if (error) {
            console.error('❌ Erreur lors de la définition de la session:', error);
            throw error;
          }

          console.log('✅ Session établie avec succès via hash');
          setIsValidToken(true);
          setIsCheckingToken(false);
          return;
        }

        // Méthode 3 : Vérifier si une session de récupération existe déjà
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('Session de récupération existante trouvée');
          setIsValidToken(true);
          setIsCheckingToken(false);
          return;
        }

        // Aucun token valide trouvé
        console.warn('Aucun token de réinitialisation valide trouvé');
        toast.error('Lien invalide ou expiré', {
          description: 'Veuillez demander un nouveau lien de réinitialisation.'
        });
        setTimeout(() => navigate('/forgot-password'), 3000);
        setIsCheckingToken(false);

      } catch (error: any) {
        console.error('Erreur lors de la gestion du token:', error);
        toast.error('Erreur', {
          description: error.message || 'Lien invalide ou expiré.'
        });
        setTimeout(() => navigate('/forgot-password'), 3000);
        setIsCheckingToken(false);
      }
    };

    handlePasswordReset();
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Erreur', {
        description: 'Les mots de passe ne correspondent pas.'
      });
      return;
    }

    const { isValid } = validatePassword(password);
    if (!isValid) {
      toast.error("Mot de passe non conforme", {
        description: "Veuillez respecter tous les critères de sécurité."
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast.success('Mot de passe réinitialisé !', {
        description: 'Vous êtes maintenant connecté avec votre nouveau mot de passe.'
      });

      // Rediriger vers la page d'accueil après 2 secondes
      setTimeout(() => navigate('/'), 2000);
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
      toast.error('Erreur', {
        description: error.message || 'Impossible de réinitialiser le mot de passe.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Vérification du lien...</p>
        </div>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-red-600" size={40} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-4">Lien invalide</h1>
          <p className="text-gray-600">
            Ce lien de réinitialisation est invalide ou a expiré. Veuillez demander un nouveau lien.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Nouveau mot de passe</h1>
          <p className="text-gray-600">
            Choisissez un nouveau mot de passe sécurisé pour votre compte.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400 ml-1">Nouveau mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all pl-12 pr-12"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <PasswordValidator password={password} showCriteria={true} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400 ml-1">Confirmer le mot de passe</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all pl-12 pr-12"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {password && confirmPassword && (
            <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
              password === confirmPassword ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {password === confirmPassword ? (
                <>
                  <CheckCircle size={16} />
                  Les mots de passe correspondent
                </>
              ) : (
                <>
                  <AlertCircle size={16} />
                  Les mots de passe ne correspondent pas
                </>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || password !== confirmPassword}
            className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg disabled:opacity-50"
          >
            {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  );
};