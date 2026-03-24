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
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    let resolved = false;

    const resolve = (valid: boolean) => {
      if (resolved) return;
      resolved = true;
      setIsValidToken(valid);
      setIsCheckingToken(false);
      if (valid) setSessionReady(true);
    };

    // Méthode 1 (officielle) : écouter l'événement PASSWORD_RECOVERY de Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Auth event:', event, '| Session:', !!session);

      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        if (session) {
          console.log('✅ Session de récupération reçue via onAuthStateChange');
          resolve(true);
        }
      }
    });

    // Méthode 2 : PKCE flow (?code=...)
    const code = searchParams.get('code');
    if (code) {
      console.log('🔑 Code PKCE détecté');
      supabase.auth.exchangeCodeForSession(code)
        .then(({ data, error }) => {
          if (error) {
            console.error('❌ Erreur PKCE:', error);
          } else if (data.session) {
            console.log('✅ Session PKCE établie');
            resolve(true);
          }
        });
    }

    // Méthode 3 : Mode développement
    const devMode = searchParams.get('dev_mode');
    const devEmail = searchParams.get('email');
    if (devMode === 'true' && devEmail) {
      console.log('🛠️ Mode développement activé');
      toast.success('Mode développement activé', {
        description: '⚠️ Session temporaire pour tests'
      });
      resolve(true);
      subscription.unsubscribe();
      return;
    }

    // Fallback : timeout après 5s — si toujours pas de session, lien invalide
    const timeout = setTimeout(() => {
      if (!resolved) {
        console.warn('⏱️ Timeout : aucun token valide détecté');
        toast.error('Lien invalide ou expiré', {
          description: 'Veuillez demander un nouveau lien de réinitialisation.'
        });
        resolve(false);
        setTimeout(() => navigate('/forgot-password'), 3000);
      }
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
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
      toast.error('Mot de passe non conforme', {
        description: 'Veuillez respecter tous les critères de sécurité.'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Vérifier que la session est toujours active
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Session expirée', {
          description: 'Veuillez demander un nouveau lien de réinitialisation.'
        });
        setTimeout(() => navigate('/forgot-password'), 2000);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      toast.success('Mot de passe réinitialisé !', {
        description: 'Vous êtes maintenant connecté avec votre nouveau mot de passe.'
      });

      setTimeout(() => navigate('/'), 2000);
    } catch (error: any) {
      console.error('❌ Erreur updateUser:', error);
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
          <p className="text-gray-600 mb-6">
            Ce lien de réinitialisation est invalide ou a expiré.
          </p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all"
          >
            Demander un nouveau lien
          </button>
        </div>
      </div>
    );
  }

  const passwordValid = validatePassword(password).isValid;
  const canSubmit = !isLoading && password === confirmPassword && password.length > 0 && passwordValid;

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
                <><CheckCircle size={16} /> Les mots de passe correspondent</>
              ) : (
                <><AlertCircle size={16} /> Les mots de passe ne correspondent pas</>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Réinitialisation...
              </span>
            ) : 'Réinitialiser le mot de passe'}
          </button>

          {!canSubmit && password.length > 0 && password === confirmPassword && !passwordValid && (
            <p className="text-xs text-center text-orange-600">
              Le mot de passe doit respecter tous les critères ci-dessus
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
