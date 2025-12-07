
import React, { useState } from 'react';
import { Stethoscope, User, ArrowRight, Loader2, Lock, Mail } from 'lucide-react';
import { AuthService } from '../services/authService';
import { AppRoute } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginPageProps {
  onLogin: (response: any) => void;
  onNavigate: (route: AppRoute) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigate }) => {
  const { t } = useLanguage();
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [email, setEmail] = useState('rahul@demo.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await AuthService.login(email, role);
      onLogin(response);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-sm space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none mb-4">
            <Stethoscope className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{t('auth.welcome')}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t('auth.signin_subtitle')}</p>
        </div>

        {/* Role Toggle */}
        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex">
          <button
            onClick={() => setRole('patient')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              role === 'patient' 
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <User size={16} /> {t('auth.patient')}
          </button>
          <button
            onClick={() => setRole('doctor')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              role === 'doctor' 
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Stethoscope size={16} /> {t('auth.doctor')}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
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
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button type="button" className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
              {t('auth.forgot_password')}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : t('auth.sign_in')}
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">{t('auth.new_user')}</span>
          </div>
        </div>

        <button 
          onClick={() => onNavigate(AppRoute.SIGNUP)}
          className="w-full py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          {t('auth.create_account')}
        </button>

        {/* Credentials Hint (For Demo) */}
        <div className="text-center text-[10px] text-gray-400 mt-6 bg-gray-50 dark:bg-gray-800 p-2 rounded border border-dashed border-gray-200 dark:border-gray-700">
           <p className="font-bold mb-1">{t('auth.demo_creds')}:</p>
           <p>Patient: rahul@demo.com / password</p>
           <p>Doctor: vikram@demo.com / password</p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
