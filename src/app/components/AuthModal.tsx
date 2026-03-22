import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { supabase } from '/src/utils/supabase/client';
import { toast } from 'sonner';
import { PasswordValidator, validatePassword } from './PasswordValidator';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (session: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password for signup
    if (mode === 'signup') {
      const { isValid } = validatePassword(formData.password);
      if (!isValid) {
        toast.error("Mot de passe non conforme", {
          description: "Veuillez respecter tous les critères de sécurité."
        });
        return;
      }
    }
    
    setIsLoading(true);

    try {
      import { API_URL } from '/src/utils/api';

      if (mode === 'signup') {
        const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    body: JSON.stringify(formData),
  });
}


        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Une erreur est survenue lors de l'inscription");
        }

        // After signup success, automatically log in
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (loginError) throw loginError;
        
        toast.success("Bienvenue chez SuperMalin !", {
          description: "Votre compte a été créé avec succès."
        });
        onSuccess(loginData.session);
        onClose();
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast.success("Content de vous revoir !");
        onSuccess(data.session);
        onClose();
      }
    } catch (error: any) {
      toast.error("Erreur d'authentification", {
        description: error.message || "Identifiants incorrects"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-[480px] rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-8 text-white relative">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-orange-900/20 text-orange-600">
                <Zap size={32} fill="currentColor" />
              </div>
              <h2 className="text-3xl font-black mb-2">
                {mode === 'login' ? 'Bon retour !' : 'Rejoindre SuperMalin'}
              </h2>
              <p className="text-orange-100 font-medium">
                {mode === 'login' 
                  ? 'Connectez-vous pour accéder à vos enchères.' 
                  : 'Créez un compte pour commencer à économiser.'}
              </p>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'signup' && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Prénom</label>
                        <div className="relative">
                          <input 
                            name="firstName"
                            type="text" 
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Jean"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all pl-12"
                          />
                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Nom</label>
                        <div className="relative">
                          <input 
                            name="lastName"
                            type="text" 
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Dupont"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all pl-12"
                          />
                          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">Email</label>
                  <div className="relative">
                    <input 
                      name="email"
                      type="email" 
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jean@exemple.fr"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all pl-12"
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Mot de passe</label>
                    {mode === 'login' && (
                      <a href="/forgot-password" className="text-[10px] font-black uppercase text-orange-600 hover:underline">Oublié ?</a>
                    )}
                  </div>
                  <div className="relative">
                    <input 
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all pl-12 pr-12"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  
                  {mode === 'signup' && (
                    <PasswordValidator password={formData.password} showCriteria={true} />
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-orange-600 transition-all shadow-xl shadow-gray-200 disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <div className="contents">
                      {mode === 'login' ? 'Se connecter' : "S'inscrire"}
                      <ArrowRight size={20} />
                    </div>
                  )}
                </button>
              </form>

              <div className="mt-8 flex flex-col items-center gap-6">
                <p className="text-gray-500 font-medium">
                  {mode === 'login' ? "Nouveau ici ?" : "Déjà membre ?"}
                  <button 
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    className="ml-2 text-orange-600 font-black hover:underline"
                  >
                    {mode === 'login' ? "Créer un compte" : "Se connecter"}
                  </button>
                </p>

                <div className="w-full h-px bg-gray-100 relative">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    Protection SuperMalin
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                  <ShieldCheck className="text-green-500" size={16} />
                  Vos données sont sécurisées et jamais partagées.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
