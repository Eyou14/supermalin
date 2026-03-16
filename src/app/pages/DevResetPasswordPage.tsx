import React, { useState } from 'react';
import { Link } from 'react-router';
import { Shield, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '/src/utils/supabase/client';
import { toast } from 'sonner';

export const DevResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateDevResetLink = async () => {
    setIsLoading(true);
    try {
      console.log('🔍 Génération d\'un lien de réinitialisation pour:', email);
      
      // SOLUTION SIMPLE : Créer un lien direct qui force React Router à aller sur reset-password
      // puis utiliser l'API Admin pour créer une session temporaire
      
      const baseUrl = window.location.origin;
      
      // Créer un lien qui redirige vers reset-password avec l'email en paramètre
      // La page reset-password détectera cet email et créera automatiquement une session
      const devLink = `${baseUrl}/reset-password?dev_mode=true&email=${encodeURIComponent(email)}`;
      
      setResetLink(devLink);
      
      toast.success('Lien généré !', {
        description: '⚠️ Mode développement : Ce lien contourne le rate limiting de Supabase'
      });

    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error('Erreur', {
        description: error.message || 'Impossible de générer le lien'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    // Méthode alternative pour copier sans utiliser l'API Clipboard (qui peut être bloquée)
    const textArea = document.createElement('textarea');
    textArea.value = resetLink;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        toast.success('Copié !', {
          description: 'Le lien a été copié dans le presse-papiers'
        });
      } else {
        toast.error('Erreur de copie', {
          description: 'Veuillez copier le lien manuellement'
        });
      }
    } catch (err) {
      console.error('Erreur de copie:', err);
      toast.error('Erreur de copie', {
        description: 'Veuillez sélectionner et copier le lien manuellement'
      });
    } finally {
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full">
        {/* Warning Banner */}
        <div className="bg-red-100 border-2 border-red-300 rounded-2xl p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-red-900 mb-1">⚠️ MODE DÉVELOPPEMENT UNIQUEMENT</h3>
            <p className="text-sm text-red-700">
              Cette page permet de contourner le rate limiting de Supabase en mode dev. 
              <strong> NE PAS utiliser en production !</strong>
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Shield className="text-orange-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Générateur de lien de reset</h1>
              <p className="text-sm text-gray-500">Pour contourner le rate limiting</p>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
            <h3 className="font-bold text-yellow-900 text-sm mb-2">📊 Problème du Rate Limiting</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Supabase limite à <strong>4 emails/heure</strong> en mode gratuit</li>
              <li>• Erreur : <code className="bg-yellow-100 px-2 py-0.5 rounded">over_email_send_rate_limit</code></li>
              <li>• Status : <code className="bg-yellow-100 px-2 py-0.5 rounded">429 Too Many Requests</code></li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400 ml-1">
              Email de l'utilisateur
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="utilisateur@exemple.fr"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
            <h3 className="font-bold mb-2">💡 Comment utiliser :</h3>
            <ol className="space-y-1 list-decimal list-inside">
              <li>Entrez l'email d'un utilisateur existant</li>
              <li>Cliquez sur "Générer le lien"</li>
              <li>Attendez que le lien apparaisse ci-dessous</li>
              <li>Copiez le lien et collez-le dans votre navigateur</li>
            </ol>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateDevResetLink}
            disabled={isLoading || !email}
            className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Génération...
              </span>
            ) : (
              'Générer le lien de reset'
            )}
          </button>

          {/* Reset Link Display */}
          {resetLink && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={20} />
                <span className="font-bold">Lien généré avec succès !</span>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <p className="text-xs font-black uppercase text-gray-400 mb-2">Lien de réinitialisation</p>
                    <p className="text-sm text-gray-700 break-all font-mono bg-white p-3 rounded-lg border border-gray-200">
                      {resetLink}
                    </p>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="flex-shrink-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 text-sm font-bold"
                  >
                    <Copy size={16} />
                    Copier
                  </button>
                </div>

                <div className="bg-orange-100 border border-orange-200 rounded-lg p-3">
                  <p className="text-xs text-orange-800">
                    ⚠️ <strong>Note :</strong> Ce lien est une simulation pour le développement. 
                    En production, utilisez la vraie fonctionnalité d'envoi d'email ou configurez l'API Admin de Supabase.
                  </p>
                </div>
              </div>

              <a
                href={resetLink}
                className="block w-full bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg text-center"
              >
                🚀 Ouvrir le lien de reset
              </a>
            </div>
          )}

          {/* Solutions */}
          <div className="border-t pt-6">
            <h3 className="font-bold text-gray-900 mb-3">🔧 Autres solutions au rate limiting :</h3>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <strong className="text-gray-900">Solution 1 :</strong>
                <span className="text-gray-600"> Attendez 1 heure pour que le compteur se réinitialise</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <strong className="text-gray-900">Solution 2 :</strong>
                <span className="text-gray-600"> Utilisez un email différent pour tester</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <strong className="text-gray-900">Solution 3 :</strong>
                <span className="text-gray-600"> Passez à un plan Supabase payant (rate limit plus élevé)</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <strong className="text-gray-900">Solution 4 :</strong>
                <span className="text-gray-600"> Configurez un serveur SMTP personnalisé dans Supabase</span>
              </div>
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center pt-4">
            <Link 
              to="/forgot-password" 
              className="text-orange-600 font-bold hover:underline"
            >
              ← Retour à la page de reset normale
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};