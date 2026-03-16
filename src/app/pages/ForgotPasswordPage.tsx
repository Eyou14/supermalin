import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '/src/utils/supabase/client';
import { toast } from 'sonner';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const [rateLimitError, setRateLimitError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Support both www and non-www domains
      const baseUrl = window.location.origin.includes('www.supermalin.fr') 
        ? 'https://www.supermalin.fr' 
        : window.location.origin;
      
      // MODE PRODUCTION: Rediriger vers la page de réinitialisation
      const redirectUrl = `${baseUrl}/reset-password`;
      
      console.log('=== DIAGNOSTIC EMAIL RESET ===');
      console.log('📧 Email:', email);
      console.log('🌐 Origin:', window.location.origin);
      console.log('🔗 RedirectURL:', redirectUrl);
      console.log('⏰ Timestamp:', new Date().toISOString());
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      console.log('📦 Response data:', data);
      console.log('❌ Response error:', error);

      if (error) {
        console.error('🚨 ERREUR DÉTECTÉE:', error);
        console.error('Code erreur:', error.code);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        
        if (error.message.includes('rate limit')) {
          setRateLimitError(true); // ACTIVER L'AFFICHAGE DU MODE DEV
          toast.error('Trop de tentatives', {
            description: '⏱️ Vous avez dépassé la limite. Attendez 1 heure ou utilisez un autre email.'
          });
        } else if (error.message.includes('not found')) {
          toast.error('Email non trouvé', {
            description: 'Aucun compte associé à cet email.'
          });
        } else {
          throw error;
        }
      } else {
        console.log('✅ Email envoyé avec succès !');
        setEmailSent(true);
        toast.success('Email envoyé !', {
          description: 'Vérifiez votre boîte de réception.'
        });
      }
    } catch (error: any) {
      console.error('🚨 ERREUR CATCH:', error);
      toast.error('Erreur', {
        description: error.message || 'Une erreur est survenue.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-4">Email envoyé !</h1>
          <p className="text-gray-600 mb-8">
            Un lien de réinitialisation a été envoyé à <strong>{email}</strong>. 
            Vérifiez votre boîte de réception et cliquez sur le lien pour créer un nouveau mot de passe.
          </p>
          
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-orange-600 font-bold hover:underline"
          >
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 mb-6">
            <ArrowLeft size={16} />
            Retour
          </Link>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Mot de passe oublié ?</h1>
          <p className="text-gray-600">
            Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400 ml-1">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jean@exemple.fr"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all pl-12"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Envoi en cours...
              </span>
            ) : (
              'Envoyer le lien'
            )}
          </button>
          
          <p className="text-xs text-gray-400 text-center mt-4">
            Vous recevrez un email avec un lien de réinitialisation valide pendant 1 heure.
          </p>
        </form>

        {/* Rate Limit Error - Solution de contournement */}
        {rateLimitError && (
          <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-2xl p-6 space-y-4">
            <div className="text-center">
              <h3 className="font-bold text-red-900 mb-2">⏱️ Limite d'envoi dépassée</h3>
              <p className="text-sm text-red-700 mb-4">
                Supabase limite à 4 emails par heure. Vous avez dépassé cette limite.
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-red-200">
              <h4 className="font-bold text-gray-900 text-sm mb-2">🔧 Solutions :</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">1.</span>
                  <span>Attendez <strong>1 heure</strong> et réessayez</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">2.</span>
                  <span>Utilisez un <strong>autre email</strong> pour tester</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">3.</span>
                  <span>Utilisez le <strong>mode développement</strong> ci-dessous ⬇️</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => navigate('/dev-reset-password')}
              className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg"
            >
              🛠️ Accéder au mode développement
            </button>

            <p className="text-xs text-red-600 text-center">
              ⚠️ Le mode développement permet de contourner le rate limiting pour les tests
            </p>
          </div>
        )}
      </div>
    </div>
  );
};