
import React, { useState } from 'react';
import { ChevronRight, Stethoscope, Shield, User, Activity } from 'lucide-react';
import { UserProfile, Medication } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface OnboardingPageProps {
  onComplete: (user: UserProfile) => void;
  initialName?: string;
  initialEmail?: string;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete, initialName, initialEmail }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: initialName || "",
    age: 0, // Force entry
    gender: "Male",
    medicalHistory: "",
    medicalEvents: [],
    reports: [],
    allergies: [],
    medications: [],
    emergencyContact: {
      name: "",
      phone: "",
      relation: ""
    }
  });

  const [allergyInput, setAllergyInput] = useState("");
  const [medInput, setMedInput] = useState("");

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleFinish = () => {
    const finalProfile: UserProfile = {
      name: formData.name || "User",
      age: formData.age || 25,
      gender: formData.gender || "Male",
      medicalHistory: formData.medicalHistory || "None",
      medicalEvents: [],
      reports: [],
      allergies: formData.allergies || [],
      medications: formData.medications || [],
      emergencyContact: {
        name: formData.emergencyContact?.name || "Emergency Contact",
        phone: formData.emergencyContact?.phone || "112",
        relation: formData.emergencyContact?.relation || "Family"
      }
    };
    onComplete(finalProfile);
  };

  const addMedication = () => {
    if (medInput.trim()) {
       const newMed: Medication = {
          id: Date.now().toString(),
          name: medInput.trim(),
          dosage: "As prescribed", // Default for onboarding to keep it simple
          frequency: "Daily",
          taken: false
       };
       setFormData({ ...formData, medications: [...(formData.medications || []), newMed] });
       setMedInput("");
    }
  };

  return (
    <div className="h-full bg-white dark:bg-gray-900 flex flex-col p-6 overflow-y-auto">
      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${step >= i ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-800'}`} />
        ))}
      </div>

      <div className="flex-1">
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="text-center space-y-2 mb-8">
               <div className="bg-blue-100 dark:bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 mb-4">
                  <User size={40} />
               </div>
               <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t('onboarding.step1_title')}</h1>
               <p className="text-gray-500 dark:text-gray-400">{t('onboarding.step1_desc')}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('onboarding.name')}</label>
                <input 
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('onboarding.age')}</label>
                  <input 
                    type="number"
                    placeholder="25"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                    value={formData.age || ''}
                    onChange={e => setFormData({...formData, age: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('onboarding.gender')}</label>
                  <select 
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                    value={formData.gender}
                    onChange={e => setFormData({...formData, gender: e.target.value})}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="text-center space-y-2 mb-8">
               <div className="bg-blue-100 dark:bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400 mb-4">
                  <Activity size={40} />
               </div>
               <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t('onboarding.step2_title')}</h1>
               <p className="text-gray-500 dark:text-gray-400">{t('onboarding.step2_desc')}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('onboarding.conditions')}</label>
                <textarea 
                  placeholder="e.g. Diabetes, Hypertension, Asthma..."
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white h-24 resize-none"
                  value={formData.medicalHistory}
                  onChange={e => setFormData({...formData, medicalHistory: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('onboarding.allergies')}</label>
                <div className="flex gap-2 mb-2">
                   <input 
                      type="text"
                      placeholder="Add allergy"
                      className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-gray-900 dark:text-white"
                      value={allergyInput}
                      onChange={e => setAllergyInput(e.target.value)}
                    />
                    <button 
                      onClick={() => {
                        if(allergyInput) {
                          setFormData({...formData, allergies: [...(formData.allergies || []), allergyInput]});
                          setAllergyInput("");
                        }
                      }}
                      className="bg-blue-600 text-white px-4 rounded-xl font-bold"
                    >
                      +
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.allergies?.map((a, i) => (
                    <span key={i} className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold">{a}</span>
                  ))}
                </div>
              </div>

               <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('onboarding.meds')}</label>
                <div className="flex gap-2 mb-2">
                   <input 
                      type="text"
                      placeholder="Add medication"
                      className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-gray-900 dark:text-white"
                      value={medInput}
                      onChange={e => setMedInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addMedication()}
                    />
                    <button 
                      onClick={addMedication}
                      className="bg-blue-600 text-white px-4 rounded-xl font-bold"
                    >
                      +
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.medications?.map((m, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">{m.name}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
             <div className="text-center space-y-2 mb-8">
               <div className="bg-red-100 dark:bg-red-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-red-600 dark:text-red-400 mb-4">
                  <Shield size={40} />
               </div>
               <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t('onboarding.step3_title')}</h1>
               <p className="text-gray-500 dark:text-gray-400">{t('onboarding.step3_desc')}</p>
            </div>

            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('onboarding.contact_name')}</label>
                  <input 
                    type="text"
                    placeholder="e.g. Father, Spouse"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                    value={formData.emergencyContact?.name}
                    onChange={e => setFormData({
                      ...formData, 
                      emergencyContact: { ...formData.emergencyContact!, name: e.target.value }
                    })}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('onboarding.relation')}</label>
                  <input 
                    type="text"
                    placeholder="e.g. Father"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                    value={formData.emergencyContact?.relation}
                    onChange={e => setFormData({
                      ...formData, 
                      emergencyContact: { ...formData.emergencyContact!, relation: e.target.value }
                    })}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('onboarding.phone')}</label>
                  <input 
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                    value={formData.emergencyContact?.phone}
                    onChange={e => setFormData({
                      ...formData, 
                      emergencyContact: { ...formData.emergencyContact!, phone: e.target.value }
                    })}
                  />
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        <button 
          onClick={step === 3 ? handleFinish : handleNext}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          {step === 3 ? t('onboarding.finish') : t('onboarding.next')}
          {step !== 3 && <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage;
