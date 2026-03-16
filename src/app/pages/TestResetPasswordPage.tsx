import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { supabase } from '/src/utils/supabase/client';
import { CheckCircle } from 'lucide-react';

export const TestResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<string[]>([]);
  const [hasValidSession, setHasValidSession] = useState(false);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  useEffect(() => {
    const testFlow = async () => {
      addLog('=== TEST DU FLUX DE RESET PASSWORD ===');
      
      // Test 1: Vérifier l'URL complète
      addLog(`URL complète: ${window.location.href}`);
      addLog(`Origin: ${window.location.origin}`);
      addLog(`Pathname: ${window.location.pathname}`);
      addLog(`Search: ${window.location.search}`);
      addLog(`Hash: ${window.location.hash}`);
      
      // Test 2: Vérifier les paramètres de l'URL
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      addLog(`Code dans query params: ${code || 'AUCUN'}`);
      addLog(`Error dans query params: ${errorParam || 'AUCUN'}`);
      addLog(`Error description: ${errorDescription || 'AUCUN'}`);
      
      // Test 3: Vérifier le hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');
      const errorHash = hashParams.get('error');
      
      addLog(`Access token dans hash: ${accessToken ? 'PRÉSENT' : 'AUCUN'}`);
      addLog(`Refresh token dans hash: ${refreshToken ? 'PRÉSENT' : 'AUCUN'}`);
      addLog(`Type dans hash: ${type || 'AUCUN'}`);
      addLog(`Error dans hash: ${errorHash || 'AUCUN'}`);
      
      // Test 4: Tester l'échange de code si présent
      if (code) {
        try {
          addLog('Tentative d\'échange du code pour une session...');
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            addLog(`❌ ERREUR échange code: ${error.message}`);
          } else if (data.session) {
            addLog(`✅ Session créée avec succès!`);
            addLog(`User ID: ${data.session.user.id}`);
            addLog(`Email: ${data.session.user.email}`);
          } else {
            addLog(`⚠️ Pas d'erreur mais pas de session`);
          }
        } catch (err: any) {
          addLog(`❌ EXCEPTION lors de l'échange: ${err.message}`);
        }
      }
      
      // Test 5: Tester setSession si hash présent
      if (type === 'recovery' && accessToken) {
        try {
          addLog('Tentative de définition de la session avec le hash...');
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });
          
          if (error) {
            addLog(`❌ ERREUR setSession: ${error.message}`);
          } else {
            addLog(`✅ Session définie avec succès!`);
          }
        } catch (err: any) {
          addLog(`❌ EXCEPTION lors du setSession: ${err.message}`);
        }
      }
      
      // Test 6: Vérifier la session actuelle
      try {
        addLog('Vérification de la session actuelle...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          addLog(`❌ ERREUR getSession: ${error.message}`);
        } else if (session) {
          addLog(`✅ Session active trouvée!`);
          addLog(`User ID: ${session.user.id}`);
          addLog(`Email: ${session.user.email}`);
          setHasValidSession(true);
        } else {
          addLog(`⚠️ Aucune session active`);
        }
      } catch (err: any) {
        addLog(`❌ EXCEPTION lors du getSession: ${err.message}`);
      }
      
      addLog('=== FIN DU TEST ===');
    };

    testFlow();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 mb-6 shadow-2xl">
          <h1 className="text-3xl font-bold mb-2 text-white flex items-center gap-3">
            <CheckCircle size={32} />
            Test Reset Password - Mode Diagnostic
          </h1>
          <p className="text-purple-100">
            Cette page vous aide à diagnostiquer le flux de réinitialisation de mot de passe.
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 space-y-2">
          <h2 className="text-xl font-bold mb-4 text-green-400">Console de logs:</h2>
          {logs.length === 0 ? (
            <p className="text-gray-400">Chargement...</p>
          ) : (
            logs.map((log, i) => (
              <div 
                key={i} 
                className={`font-mono text-sm p-2 rounded ${
                  log.includes('❌') ? 'bg-red-900/30 text-red-300' :
                  log.includes('✅') ? 'bg-green-900/30 text-green-300' :
                  log.includes('⚠️') ? 'bg-yellow-900/30 text-yellow-300' :
                  log.includes('===') ? 'bg-blue-900/30 text-blue-300 font-bold' :
                  'text-gray-300'
                }`}
              >
                {log}
              </div>
            ))
          )}
        </div>
        
        <div className="mt-8 bg-blue-900/30 border border-blue-500 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-400">Instructions de test:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Allez sur <code className="bg-gray-800 px-2 py-1 rounded">/forgot-password</code></li>
            <li>Entrez votre email et cliquez sur "Envoyer le lien"</li>
            <li>Vérifiez votre email et cliquez sur le lien de réinitialisation</li>
            <li>Vous devriez arriver sur cette page de test avec les logs ci-dessus</li>
            <li>Vérifiez les logs pour identifier le problème</li>
          </ol>
        </div>
        
        <div className="mt-8 bg-orange-900/30 border border-orange-500 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-orange-400">Vérifications Supabase nécessaires:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Dans Authentication → URL Configuration</li>
            <li>Site URL doit être: <code className="bg-gray-800 px-2 py-1 rounded">https://supermalin.fr</code></li>
            <li>Redirect URLs doivent inclure (cochées ✓):
              <ul className="list-circle list-inside ml-6 mt-2">
                <li><code className="bg-gray-800 px-2 py-1 rounded">https://supermalin.fr/reset-password</code></li>
                <li><code className="bg-gray-800 px-2 py-1 rounded">https://www.supermalin.fr/reset-password</code></li>
                <li><code className="bg-gray-800 px-2 py-1 rounded">http://localhost:5173/reset-password</code> (pour dev)</li>
              </ul>
            </li>
            <li>Cliquez sur <strong className="text-orange-300">"Save changes"</strong> après modification</li>
          </ul>
        </div>
        
        {hasValidSession && (
          <div className="mt-8 bg-green-900/30 border border-green-500 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-green-400">Session valide:</h2>
            <p className="text-gray-300">Une session valide a été créée. Vous pouvez maintenant fermer cette page.</p>
            <button
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => navigate('/')}
            >
              <CheckCircle className="inline-block mr-2" />
              Retour à l'accueil
            </button>
          </div>
        )}
      </div>
    </div>
  );
};