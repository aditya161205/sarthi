
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, User, Activity, FileText, Camera, Upload, Check, Loader2, Plus, X, Calendar, Clock, MapPin, Download, Stethoscope, Lock, Award } from 'lucide-react';
import { UserProfile, Appointment, PrescriptionData } from '../types';
import { parsePrescription } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

interface DoctorPatientViewProps {
  user: UserProfile; // The patient
  appointment: Appointment | null;
  onBack: () => void;
  onComplete: (data: PrescriptionData) => void;
}

const DoctorPatientView: React.FC<DoctorPatientViewProps> = ({ user, appointment, onBack, onComplete }) => {
  const { t } = useLanguage();
  // If appointment is pending, default to history view
  const isPending = appointment?.status === 'pending';
  const [activeTab, setActiveTab] = useState<'consult' | 'history' | 'reports'>(isPending ? 'history' : 'consult');
  
  // Consultation Form State
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState<string[]>([]);
  const [newMed, setNewMed] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingOCR(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const data = await parsePrescription(base64);
          setDiagnosis(data.diagnosis);
          setMedications(data.medications);
          setFollowUp(data.followUp || '');
        } catch (error) {
          alert("Failed to read prescription. Please try again or enter manually.");
        } finally {
          setIsProcessingOCR(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMed = () => {
    if (newMed.trim()) {
      setMedications([...medications, newMed.trim()]);
      setNewMed('');
    }
  };

  const handleRemoveMed = (index: number) => {
    const updated = [...medications];
    updated.splice(index, 1);
    setMedications(updated);
  };

  const handleComplete = () => {
    setIsSaving(true);
    // Simulate API delay
    setTimeout(() => {
      onComplete({
        diagnosis,
        medications,
        followUp
      });
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-950 flex flex-col relative transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-20">
         <div className="px-4 py-3 flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300">
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h2 className="font-bold text-gray-800 dark:text-white leading-tight text-lg">{user.name}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.age} Y • {user.gender} • +91 {user.emergencyContact.phone.slice(-10)}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500">
               <User size={20} />
            </div>
         </div>
         
         {/* Pending Banner */}
         {isPending && (
             <div className="bg-amber-100 dark:bg-amber-900/30 px-4 py-2 text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center justify-center gap-2">
                 <Lock size={12} /> {t('dpv.preview_mode')}
             </div>
         )}

         {/* Navigation Tabs */}
         <div className="flex px-4 gap-6 overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => setActiveTab('consult')}
              disabled={isPending}
              className={`pb-3 text-sm font-bold border-b-2 transition whitespace-nowrap ${activeTab === 'consult' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400'} ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
               {t('dpv.tab.consult')}
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`pb-3 text-sm font-bold border-b-2 transition whitespace-nowrap ${activeTab === 'history' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400'}`}
            >
               {t('dpv.tab.history')}
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`pb-3 text-sm font-bold border-b-2 transition whitespace-nowrap ${activeTab === 'reports' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400'}`}
            >
               {t('dpv.tab.reports')}
            </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-950">
         
         {/* --- CONSULTATION TAB --- */}
         {activeTab === 'consult' && !isPending && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               {/* Triage Summary */}
               <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <h3 className="text-blue-800 dark:text-blue-300 font-bold text-sm mb-2 flex items-center gap-2">
                    <Activity size={16} /> {t('dpv.triage_summary')}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                    Patient reports severe cough and mild fever for 3 days. History of mild asthma. 
                    Vitals from wearable: HR 88 bpm. AI Suggestion: Rule out Bronchitis.
                  </p>
                  <div className="flex flex-wrap gap-2">
                     <span className="text-xs font-bold bg-white dark:bg-gray-900 text-amber-600 dark:text-amber-400 px-2 py-1 rounded border border-amber-200 dark:border-amber-900">{t('dpv.allergies')}: {user.allergies.join(', ') || 'None'}</span>
                     <span className="text-xs font-bold bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded border border-blue-200 dark:border-blue-900">{t('dpv.current_meds')}: {user.medications.length}</span>
                  </div>
               </div>

               {/* Prescription Form */}
               <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                     <h3 className="font-bold text-gray-800 dark:text-white">{t('dpv.rx_notes')}</h3>
                     <div className="relative">
                        <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileUpload} />
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isProcessingOCR}
                          className="flex items-center gap-2 text-xs bg-gray-900 dark:bg-gray-700 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-600 disabled:opacity-70"
                        >
                          {isProcessingOCR ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                          {isProcessingOCR ? t('gen.analyzing') : t('dpv.scan_rx')}
                        </button>
                     </div>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('dpv.diagnosis')}</label>
                     <input 
                       type="text" 
                       className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                       placeholder="e.g. Acute Bronchitis"
                       value={diagnosis}
                       onChange={e => setDiagnosis(e.target.value)}
                     />
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('dpv.medications')}</label>
                     <div className="space-y-2 mb-2">
                        {medications.map((med, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg">
                             <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">{med}</span>
                             <button onClick={() => handleRemoveMed(idx)} className="text-gray-400 hover:text-red-500"><X size={16}/></button>
                          </div>
                        ))}
                     </div>
                     <div className="flex gap-2">
                        <input 
                          type="text" 
                          className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                          placeholder={t('dpv.add_med_placeholder')}
                          value={newMed}
                          onChange={e => setNewMed(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleAddMed()}
                        />
                        <button onClick={handleAddMed} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700">
                          <Plus size={20} />
                        </button>
                     </div>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">{t('dpv.follow_up')}</label>
                     <input 
                       type="text" 
                       className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                       placeholder="e.g. 5 Days"
                       value={followUp}
                       onChange={e => setFollowUp(e.target.value)}
                     />
                  </div>
               </div>
            </div>
         )}

         {/* --- HISTORY TAB --- */}
         {activeTab === 'history' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 dark:text-white">{t('dpv.patient_timeline')}</h3>
               </div>
               <div className="relative pl-4 space-y-8 before:content-[''] before:absolute before:left-[27px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200 dark:before:bg-gray-700">
                 {user.medicalEvents.length === 0 ? (
                    <div className="pl-8 text-gray-400 italic text-sm">{t('dpv.no_history')}</div>
                 ) : (
                    user.medicalEvents.map((event) => (
                       <div key={event.id} className="relative pl-10">
                          {/* Dot */}
                          <div className={`absolute left-[18px] top-1 w-5 h-5 rounded-full border-[3px] border-white dark:border-gray-950 shadow-sm z-10 ${
                             event.type === 'surgery' ? 'bg-red-500' :
                             event.type === 'diagnosis' ? 'bg-amber-500' :
                             event.type === 'lab' ? 'bg-sky-500' : 'bg-blue-500'
                          }`}></div>
                          
                          {/* Event Card */}
                          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm">
                             <div className="flex justify-between items-start mb-2">
                                <div>
                                   <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{event.date}</span>
                                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                         event.type === 'surgery' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                                         event.type === 'diagnosis' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                                         'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                      }`}>{event.type}</span>
                                   </div>
                                   <h4 className="font-bold text-gray-800 dark:text-white">{event.title}</h4>
                                </div>
                             </div>
                             
                             {event.doctorName && (
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                                   <Stethoscope size={12} /> {event.doctorName} {event.location && `• ${event.location}`}
                                </div>
                             )}

                             <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700/50">
                                {event.description}
                             </p>
                          </div>
                       </div>
                    ))
                 )}
               </div>
            </div>
         )}

         {/* --- REPORTS TAB --- */}
         {activeTab === 'reports' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
               <h3 className="font-bold text-gray-800 dark:text-white">{t('dpv.medical_docs')}</h3>
               {user.reports.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                     <FileText className="mx-auto mb-2 opacity-50" size={32} />
                     <p className="text-sm">{t('dpv.no_reports')}</p>
                  </div>
               ) : (
                  user.reports.map(report => (
                     <div key={report.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                             report.type === 'Certificate' 
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-600' 
                                : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 dark:text-indigo-400'
                           }`}>
                              {report.type === 'Certificate' ? <Award size={20} /> : <FileText size={20} />}
                           </div>
                           <div>
                              <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100">{report.title}</h4>
                                  {report.type === 'Certificate' && <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500">CERT</span>}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{report.date} • {report.doctorName}</p>
                           </div>
                        </div>
                        <button className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition">
                           View
                        </button>
                     </div>
                  ))
               )}
            </div>
         )}

      </div>

      {/* Complete Button (Only visible on Consult tab AND if not pending) */}
      {activeTab === 'consult' && !isPending && (
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 sticky bottom-0 z-20">
           <button 
             onClick={handleComplete}
             disabled={!diagnosis || isSaving}
             className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition shadow-lg shadow-blue-200 dark:shadow-none"
           >
             {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
             {t('dpv.complete_consult')}
           </button>
        </div>
      )}
    </div>
  );
};

export default DoctorPatientView;
