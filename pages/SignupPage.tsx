
import React, { useState } from 'react';
import { User, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { AuthService } from '../services/authService';
import { AppRoute } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SignupPageProps {
  onSignup: (response: any) => void;
  onNavigate: (route: AppRoute) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onNavigate }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await AuthService.signup(name, email, role);
      onSignup(response);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-6 animate-in slide-in-from-right duration-500">
      <div className="w-full max-w-sm space-y-6">
        
        <button 
          onClick={() => onNavigate(AppRoute.LOGIN)}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition mb-2"
        >
          <ArrowLeft size={16} /> {t('auth.back_login')}
        </button>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{t('auth.create_title')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('auth.join_subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
           <div className="relative">
              <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t('auth.full_name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition-colors"
                required
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="email"
                placeholder={t('auth.email_placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition-colors"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="password"
                placeholder={t('auth.password_placeholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition-colors"
                required
              />
            </div>

            <div className="pt-2">
               <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">{t('auth.iam')}</label>
               <div className="flex gap-3">
                  <label className="flex-1 cursor-pointer">
                     <input 
                       type="radio" 
                       name="role" 
                       className="hidden peer" 
                       checked={role === 'patient'} 
                       onChange={() => setRole('patient')}
                     />
                     <div className="py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-center text-sm font-bold text-gray-600 dark:text-gray-400 peer-checked:border-blue-500 peer-checked:text-blue-600 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 transition-all">
                        {t('auth.patient')}
                     </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                     <input 
                       type="radio" 
                       name="role" 
                       className="hidden peer"
                       checked={role === 'doctor'} 
                       onChange={() => setRole('doctor')}
                     />
                     <div className="py-3 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-center text-sm font-bold text-gray-600 dark:text-gray-400 peer-checked:border-blue-500 peer-checked:text-blue-600 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 transition-all">
                        {t('auth.doctor')}
                     </div>
                  </label>
               </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : t('auth.sign_up')}
            </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          {t('auth.terms')}
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
