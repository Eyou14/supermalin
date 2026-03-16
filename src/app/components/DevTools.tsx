import React, { useState } from 'react';
import { Link } from 'react-router';
import { Bug, X } from 'lucide-react';

export const DevTools: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Ne pas afficher en production
  if (window.location.hostname === 'supermalin.fr' || window.location.hostname === 'www.supermalin.fr') {
    return null;
  }

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-all z-50"
        title="Outils développeur"
      >
        {isOpen ? <X size={24} /> : <Bug size={24} />}
      </button>

      {/* Panel de debug */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 bg-gray-900 text-white rounded-2xl shadow-2xl p-6 w-80 z-50">
          <h3 className="text-lg font-bold mb-4 text-purple-400">🛠️ Dev Tools</h3>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-bold text-gray-400 mb-2">Reset Password Test</h4>
              <div className="space-y-2">
                <Link
                  to="/forgot-password"
                  className="block bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-700 transition-all text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Forgot Password
                </Link>
                <Link
                  to="/test-reset-password"
                  className="block bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-700 transition-all text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Test Reset (Diagnostic)
                </Link>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <h4 className="text-sm font-bold text-gray-400 mb-2">Info</h4>
              <div className="text-xs text-gray-400 space-y-1">
                <p>Env: {window.location.hostname}</p>
                <p>Port: {window.location.port || '80'}</p>
              </div>
            </div>

            <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-3">
              <p className="text-xs text-yellow-400">
                ⚠️ Ces outils ne sont visibles qu'en développement local
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
