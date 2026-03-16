import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e62e42f7`;

export const PromoteAdminPage: React.FC = () => {
  const [email, setEmail] = useState('admin@supermalin.fr');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);

    try {
      const response = await fetch(`${API_URL}/admin/promote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast.success('Promotion réussie !', {
          description: `${email} est maintenant administrateur. Rafraîchissez la page.`
        });
      } else {
        toast.error('Erreur', {
          description: data.error || 'Impossible de promouvoir cet utilisateur'
        });
      }
    } catch (error: any) {
      toast.error('Erreur', {
        description: error.message || 'Une erreur est survenue'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full">
        {/* Warning Banner */}
        <div className="bg-orange-100 border-2 border-orange-300 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-orange-900 mb-1">⚠️ OUTIL D'ADMINISTRATION</h3>
            <p className="text-sm text-orange-700">
              Cet outil permet de promouvoir un utilisateur en administrateur.
              <strong> Utilisez-le une seule fois !</strong>
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-orange-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Promouvoir Admin</h1>
              <p className="text-sm text-gray-500">SuperMalin Administration</p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
            <h3 className="font-bold text-blue-900 text-sm mb-2">📋 Comment ça marche :</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>L'utilisateur doit d'abord <strong>créer un compte</strong> sur le site</li>
              <li>Entrez son email ci-dessous</li>
              <li>Cliquez sur "Promouvoir en Admin"</li>
              <li><strong>Rafraîchissez la page</strong> pour voir le menu Admin apparaître</li>
            </ol>
          </div>
        </div>

        {success ? (
          <div className="space-y-6">
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
              <CheckCircle className="text-green-600 mx-auto mb-4" size={48} />
              <h2 className="text-xl font-black text-green-900 mb-2">
                🎉 Promotion réussie !
              </h2>
              <p className="text-sm text-green-700 mb-4">
                <strong>{email}</strong> est maintenant administrateur.
              </p>
              <div className="bg-white rounded-xl p-4 border border-green-200">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>📍 Prochaines étapes :</strong>
                </p>
                <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside text-left">
                  <li>Cliquez sur "Retour à l'accueil" ci-dessous</li>
                  <li><strong>Rafraîchissez la page</strong> (Cmd/Ctrl + R)</li>
                  <li>Le menu "Admin" apparaîtra dans le header</li>
                  <li>Cliquez dessus pour accéder au back-office</li>
                </ol>
              </div>
            </div>

            <a
              href="/"
              className="block w-full bg-orange-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg text-center"
            >
              🏠 Retour à l'accueil
            </a>
          </div>
        ) : (
          <form onSubmit={handlePromote} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">
                Email de l'utilisateur
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@supermalin.fr"
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Promotion en cours...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ShieldCheck size={20} />
                  Promouvoir en Admin
                </span>
              )}
            </button>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-2">💡 Informations :</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• L'email doit correspondre à un compte existant</li>
                <li>• L'utilisateur aura accès au back-office complet</li>
                <li>• Vous pouvez supprimer cette page après utilisation</li>
              </ul>
            </div>

            <p className="text-xs text-gray-400 text-center">
              SIRET: 92822322100013 - SuperMalin SAS
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
