import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../layouts/RootLayout';
import { Zap, User, ShieldCheck, AlertCircle, CheckCircle, XCircle, Database, Key } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { toast } from 'sonner';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-e62e42f7`;

export const DebugAdminPage: React.FC = () => {
  const { user, isLoggedIn, isAdmin, userProfile } = useContext(AppContext);
  const [testResults, setTestResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);

  const runTests = async () => {
    setIsLoading(true);
    const results: any = {};

    // Test 1: Check if user is logged in
    results.isLoggedIn = isLoggedIn;
    results.userEmail = user?.email || 'Non connecté';
    results.userId = user?.id || 'N/A';
    
    // Test 2: Check admin status
    results.isAdmin = isAdmin;
    results.shouldBeAdmin = user?.email === 'admin@supermalin.fr';
    
    // Test 3: Check user profile
    results.userProfile = userProfile;
    
    // Test 4: Test API connection
    try {
      const response = await fetch(`${API_URL}/health`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      results.apiConnection = response.ok;
      results.apiStatus = response.status;
    } catch (error) {
      results.apiConnection = false;
      results.apiError = String(error);
    }

    // Test 5: Test database connection
    try {
      const response = await fetch(`${API_URL}/products`, {
        headers: { 'Authorization': `Bearer ${publicAnonKey}` }
      });
      results.dbConnection = response.ok;
      const data = await response.json();
      results.productsCount = data?.length || 0;
    } catch (error) {
      results.dbConnection = false;
      results.dbError = String(error);
    }

    setTestResults(results);
    setIsLoading(false);
  };

  useEffect(() => {
    runTests();
  }, [user, isLoggedIn, isAdmin]);

  const StatusIcon = ({ status }: { status: boolean }) => {
    return status ? (
      <CheckCircle className="text-green-600" size={24} />
    ) : (
      <XCircle className="text-red-600" size={24} />
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Zap size={48} />
            <div>
              <h1 className="text-4xl font-black">Debug Admin</h1>
              <p className="text-purple-200 mt-2">Diagnostics et informations système</p>
            </div>
          </div>
        </div>

        {/* Session Info */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
            <User className="text-orange-600" size={28} />
            Informations de Session
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="font-bold">Connecté :</span>
              <div className="flex items-center gap-2">
                <StatusIcon status={testResults.isLoggedIn} />
                <span>{testResults.isLoggedIn ? 'Oui' : 'Non'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="font-bold">Email :</span>
              <span className="font-mono text-sm">{testResults.userEmail}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="font-bold">User ID :</span>
              <span className="font-mono text-xs">{testResults.userId}</span>
            </div>
          </div>
        </div>

        {/* Admin Status */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
            <ShieldCheck className="text-orange-600" size={28} />
            Statut Administrateur
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="font-bold">Est Admin (détecté) :</span>
              <div className="flex items-center gap-2">
                <StatusIcon status={testResults.isAdmin} />
                <span className="font-black text-lg">{testResults.isAdmin ? 'OUI ✅' : 'NON ❌'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="font-bold">Devrait être admin :</span>
              <div className="flex items-center gap-2">
                <StatusIcon status={testResults.shouldBeAdmin} />
                <span>{testResults.shouldBeAdmin ? 'Oui (email = admin@supermalin.fr)' : 'Non'}</span>
              </div>
            </div>
            
            {!testResults.isAdmin && testResults.isLoggedIn && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mt-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-yellow-900 mb-2">Problème détecté</h3>
                    <p className="text-sm text-yellow-800 mb-3">
                      Vous êtes connecté mais le statut admin n'est pas activé. 
                      {testResults.shouldBeAdmin && (
                        <span className="font-bold"> Votre email est admin@supermalin.fr mais isAdmin = false.</span>
                      )}
                    </p>
                    <p className="text-xs text-yellow-700">
                      Solution : Déconnectez-vous et reconnectez-vous pour rafraîchir la session.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {!testResults.isLoggedIn && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mt-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-blue-900 mb-2">Non connecté</h3>
                    <p className="text-sm text-blue-800 mb-2">
                      Connectez-vous avec le compte admin pour accéder aux fonctionnalités d'administration.
                    </p>
                    <div className="bg-white p-3 rounded-lg mt-3 border border-blue-200">
                      <p className="text-xs font-bold text-blue-900 mb-1">Identifiants Admin :</p>
                      <p className="text-sm font-mono">Email: admin@supermalin.fr</p>
                      <p className="text-sm font-mono">Mot de passe: Admin123!</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* System Tests */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
            <Database className="text-orange-600" size={28} />
            Tests Système
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="font-bold">API Connection :</span>
              <div className="flex items-center gap-2">
                <StatusIcon status={testResults.apiConnection} />
                <span className="text-sm">Status: {testResults.apiStatus || 'N/A'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="font-bold">Database Connection :</span>
              <div className="flex items-center gap-2">
                <StatusIcon status={testResults.dbConnection} />
                <span className="text-sm">Produits: {testResults.productsCount || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile */}
        {userProfile && (
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-6">
            <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
              <Key className="text-orange-600" size={28} />
              Profil Utilisateur
            </h2>
            <div className="bg-gray-50 rounded-xl p-4">
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(userProfile, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <button
          onClick={runTests}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl font-black text-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg disabled:opacity-50"
        >
          {isLoading ? 'Test en cours...' : '🔄 Actualiser les tests'}
        </button>

        {/* Summary */}
        <div className="mt-8 p-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl">
          <h3 className="font-black text-lg mb-3">📋 Résumé</h3>
          <div className="space-y-2 text-sm">
            <p>✅ <strong>Bouton DEBUG visible :</strong> Uniquement si isAdmin = true</p>
            <p>✅ <strong>Bouton Admin visible :</strong> Uniquement si isAdmin = true</p>
            <p>✅ <strong>Page /admin accessible :</strong> Uniquement si connecté ET isAdmin = true</p>
            <p>✅ <strong>Compte admin :</strong> admin@supermalin.fr</p>
            <p className="pt-3 font-bold">
              {testResults.isAdmin 
                ? '🎉 Vous avez accès à toutes les fonctions admin !' 
                : '⚠️ Connectez-vous avec admin@supermalin.fr pour voir les options admin'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};