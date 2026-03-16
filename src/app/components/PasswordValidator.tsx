import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordValidatorProps {
  password: string;
  showCriteria?: boolean;
}

export const validatePassword = (password: string) => {
  const criteria = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };

  const isValid = Object.values(criteria).every(Boolean);

  return { criteria, isValid };
};

export const PasswordValidator: React.FC<PasswordValidatorProps> = ({ 
  password, 
  showCriteria = true 
}) => {
  const { criteria, isValid } = validatePassword(password);

  if (!showCriteria || !password) return null;

  return (
    <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
      <p className="text-xs font-bold text-gray-700 mb-2">Votre mot de passe doit contenir :</p>
      
      <div className="space-y-1.5">
        <div className={`flex items-center gap-2 text-xs ${criteria.minLength ? 'text-green-600' : 'text-gray-500'}`}>
          {criteria.minLength ? <Check size={14} /> : <X size={14} />}
          <span>Au moins 8 caractères</span>
        </div>

        <div className={`flex items-center gap-2 text-xs ${criteria.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
          {criteria.hasUppercase ? <Check size={14} /> : <X size={14} />}
          <span>Une lettre majuscule (A-Z)</span>
        </div>

        <div className={`flex items-center gap-2 text-xs ${criteria.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
          {criteria.hasLowercase ? <Check size={14} /> : <X size={14} />}
          <span>Une lettre minuscule (a-z)</span>
        </div>

        <div className={`flex items-center gap-2 text-xs ${criteria.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
          {criteria.hasNumber ? <Check size={14} /> : <X size={14} />}
          <span>Un chiffre (0-9)</span>
        </div>

        <div className={`flex items-center gap-2 text-xs ${criteria.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
          {criteria.hasSpecialChar ? <Check size={14} /> : <X size={14} />}
          <span>Un caractère spécial (!@#$%^&*...)</span>
        </div>
      </div>

      {isValid && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs font-bold text-green-600">
            <Check size={14} />
            <span>Mot de passe sécurisé ✓</span>
          </div>
        </div>
      )}
    </div>
  );
};
