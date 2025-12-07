
import React, { useState } from 'react';
import { User, Save, Upload, Plus, X, Award, Briefcase, DollarSign, CheckCircle, LogOut } from 'lucide-react';
import { Doctor } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface DoctorProfilePageProps {
  doctor: Doctor;
  onUpdate: (updatedDoctor: Doctor) => void;
  onLogout: () => void;
}

const DoctorProfilePage: React.FC<DoctorProfilePageProps> = ({ doctor, onUpdate, onLogout }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Doctor>(doctor);
  const [newQual, setNewQual] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdate(formData);
      setIsSaving(false);
    }, 800);
  };

  const addQualification = () => {
    if (newQual.trim()) {
      setFormData({
        ...formData,
        qualifications: [...(formData.qualifications || []), newQual.trim()]
      });
      setNewQual('');
    }
  };

  const removeQualification = (index: number) => {
    const updated = [...(formData.qualifications || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, qualifications: updated });
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950 flex flex-col relative">
      <div className="flex-1 p-4 space-y-6 pb-20">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t('doc_profile.edit')}</h1>
          <button 
             onClick={onLogout}
             className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
          >
             <LogOut size={14} /> {t('doc_profile.logout')}
          </button>
        </div>

        {/* Basic Info Card */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
           <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                 <img src={formData.image} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-md" />
                 <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white dark:border-gray-900">
                    <Upload size={12} />
                 </button>
              </div>
              <div className="flex-1">
                 <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('doc_profile.full_name')}</label>
                 <input 
                   type="text" 
                   value={formData.name}
                   onChange={e => setFormData({...formData, name: e.target.value})}
                   className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-3 py-2 font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                 />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('doc_profile.specialty')}</label>
                 <input 
                   type="text" 
                   value={formData.specialty}
                   onChange={e => setFormData({...formData, specialty: e.target.value})}
                   className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                 />
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('doc_profile.experience')}</label>
                 <div className="relative">
                    <Briefcase size={14} className="absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="number" 
                      value={formData.experience || 0}
                      onChange={e => setFormData({...formData, experience: parseInt(e.target.value)})}
                      className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg pl-9 pr-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                 </div>
              </div>
              <div className="col-span-2">
                 <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('doc_profile.fee')}</label>
                 <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="text" 
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg pl-9 pr-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* About Section */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
           <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">{t('doc_profile.about')}</label>
           <textarea 
             className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 min-h-[100px]"
             value={formData.about || ''}
             onChange={e => setFormData({...formData, about: e.target.value})}
             placeholder="Write a brief bio..."
           />
        </div>

        {/* Qualifications */}
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
           <div className="flex justify-between items-center mb-3">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{t('doc_profile.qualifications')}</label>
           </div>
           
           <div className="space-y-2 mb-3">
              {formData.qualifications?.map((q, idx) => (
                 <div key={idx} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                       <Award size={16} className="text-blue-500" />
                       <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{q}</span>
                    </div>
                    <button onClick={() => removeQualification(idx)} className="text-gray-400 hover:text-red-500">
                       <X size={14} />
                    </button>
                 </div>
              ))}
              {(!formData.qualifications || formData.qualifications.length === 0) && (
                 <p className="text-sm text-gray-400 italic">{t('doc_profile.no_qual')}</p>
              )}
           </div>

           <div className="flex gap-2">
              <input 
                type="text" 
                value={newQual}
                onChange={e => setNewQual(e.target.value)}
                placeholder="e.g. MBBS, MD - Cardiology"
                className="flex-1 bg-gray-50 dark:bg-gray-800 border-none rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={addQualification}
                disabled={!newQual.trim()}
                className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                <Plus size={20} />
              </button>
           </div>
           
           <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button className="w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition flex items-center justify-center gap-2">
                 <Upload size={16} /> {t('doc_profile.upload_evidence')}
              </button>
              <p className="text-[10px] text-gray-400 mt-2 text-center">Upload certificates to get the "Verified" badge.</p>
           </div>
        </div>
      </div>

      {/* Sticky Save Button */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 z-10">
         <button 
           onClick={handleSave}
           disabled={isSaving}
           className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
         >
           {isSaving ? <span className="animate-spin">⏳</span> : <Save size={20} />}
           {t('doc_profile.save')}
         </button>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
