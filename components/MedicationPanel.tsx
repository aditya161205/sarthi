
import React from 'react';
import { X, Pill, CheckCircle, ChevronRight } from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface MedicationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onMarkTaken: (medId: string) => void;
  onNavigateProfile: () => void;
}

const MedicationPanel: React.FC<MedicationPanelProps> = ({ isOpen, onClose, user, onMarkTaken, onNavigateProfile }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const sortedMeds = [...user.medications].sort((a, b) => {
    // Sort: Untaken first, then taken
    return (a.taken === b.taken) ? 0 : a.taken ? 1 : -1;
  });

  return (
    <div className="absolute inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
      <div className="w-80 h-full bg-white dark:bg-gray-900 shadow-2xl relative animate-in slide-in-from-right duration-300 flex flex-col border-l border-gray-100 dark:border-gray-800">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 z-10">
          <h2 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-lg text-blue-600 dark:text-blue-400">
                <Pill size={18} /> 
            </div>
            {t('meds.my_meds')}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-950 p-4 space-y-3">
          {user.medications.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
               <Pill size={32} className="mx-auto mb-2 opacity-50" />
               <p>{t('meds.no_active')}</p>
               <button onClick={() => { onClose(); onNavigateProfile(); }} className="text-blue-600 font-bold mt-2">{t('profile.add_med')}</button>
            </div>
          ) : (
            sortedMeds.map(med => (
                <div 
                  key={med.id} 
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    med.taken 
                        ? 'bg-gray-100 dark:bg-gray-800/40 border-transparent opacity-60' 
                        : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-sm'
                  }`}
                >
                   <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                          med.taken 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30' 
                            : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      }`}>
                         {med.dosage}
                      </div>
                      <div>
                         <p className={`font-bold text-sm ${med.taken ? 'text-gray-500 line-through' : 'text-gray-800 dark:text-white'}`}>{med.name}</p>
                         <p className="text-[10px] text-gray-400">{med.frequency}</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => onMarkTaken(med.id)}
                     disabled={med.taken}
                     className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        med.taken 
                            ? 'text-green-600 dark:text-green-500' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-green-500 hover:text-white'
                     }`}
                   >
                      {med.taken ? <CheckCircle size={20} /> : <CheckCircle size={20} />}
                   </button>
                </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <button 
                onClick={() => { onClose(); onNavigateProfile(); }}
                className="w-full py-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition flex items-center justify-center gap-1"
            >
                {t('meds.manage')} <ChevronRight size={14} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default MedicationPanel;
