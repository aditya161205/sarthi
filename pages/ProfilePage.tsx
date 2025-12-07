
import React, { useState } from 'react';
import { User, Plus, X, Phone, Activity, Save, Edit2, Trash2, FileText, Download, Upload, MapPin, Calendar, Stethoscope, Pill, LogOut } from 'lucide-react';
import { UserProfile, MedicalEvent, MedicalReport, Medication } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ProfilePageProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
  onLogout: () => void;
}

type Tab = 'overview' | 'timeline' | 'documents';

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdate, onLogout }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<MedicalEvent | null>(null);
  
  // Local state for basic info editing
  const [basicInfo, setBasicInfo] = useState({
    name: user.name,
    age: user.age,
    gender: user.gender,
    phone: user.emergencyContact.phone,
    contactName: user.emergencyContact.name,
    relation: user.emergencyContact.relation,
  });

  // Local state for inputs
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('');
  
  const [newAllergy, setNewAllergy] = useState('');
  
  // New Event Form State
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<MedicalEvent>>({
    date: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
    type: 'general',
    doctorName: '',
    location: ''
  });

  const handleSaveProfile = () => {
    onUpdate({
      ...user,
      name: basicInfo.name,
      age: basicInfo.age,
      gender: basicInfo.gender,
      emergencyContact: {
        name: basicInfo.contactName,
        phone: basicInfo.phone,
        relation: basicInfo.relation
      }
    });
    setIsEditingProfile(false);
  };

  const addMedication = () => {
    if (newMedName.trim() && newMedDosage.trim()) {
      const newMedication: Medication = {
        id: Date.now().toString(),
        name: newMedName.trim(),
        dosage: newMedDosage.trim(),
        frequency: newMedFreq.trim() || 'Daily',
        taken: false
      };
      onUpdate({ ...user, medications: [...user.medications, newMedication] });
      setNewMedName('');
      setNewMedDosage('');
      setNewMedFreq('');
    }
  };

  const removeMedication = (index: number) => {
    const newMeds = [...user.medications];
    newMeds.splice(index, 1);
    onUpdate({ ...user, medications: newMeds });
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      onUpdate({ ...user, allergies: [...user.allergies, newAllergy.trim()] });
      setNewAllergy('');
    }
  };

  const removeAllergy = (index: number) => {
    const newAllergies = [...user.allergies];
    newAllergies.splice(index, 1);
    onUpdate({ ...user, allergies: newAllergies });
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date) {
      const event: MedicalEvent = {
        id: Date.now().toString(),
        date: newEvent.date || '',
        title: newEvent.title || '',
        description: newEvent.description || '',
        type: (newEvent.type as any) || 'general',
        doctorName: newEvent.doctorName,
        location: newEvent.location
      };
      
      // Sort events by date descending
      const updatedEvents = [...user.medicalEvents, event].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      onUpdate({ ...user, medicalEvents: updatedEvents });
      setShowEventForm(false);
      setNewEvent({ date: new Date().toISOString().split('T')[0], title: '', description: '', type: 'general', doctorName: '', location: '' });
    }
  };

  const removeEvent = (id: string, e: React.MouseEvent) => {
     e.stopPropagation(); // Prevent opening modal
     onUpdate({ ...user, medicalEvents: user.medicalEvents.filter(e => e.id !== id) });
  };

  // Mock upload report
  const handleUploadReport = () => {
    const mockReport: MedicalReport = {
        id: Date.now().toString(),
        title: "New Lab Result",
        date: new Date().toISOString().split('T')[0],
        type: "Lab Report",
        doctorName: "Dr. Mockup",
        url: "#"
    };
    onUpdate({...user, reports: [mockReport, ...user.reports]});
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-full pb-6 transition-colors relative">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-gray-900 p-6 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400">
              <User size={32} />
            </div>
            <div>
              {isEditingProfile ? (
                <div className="space-y-2">
                  <input 
                    className="block w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-2 py-1 text-sm font-bold"
                    value={basicInfo.name}
                    onChange={(e) => setBasicInfo({...basicInfo, name: e.target.value})}
                  />
                  <div className="flex gap-2">
                     <input 
                        type="number"
                        className="w-16 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-2 py-1 text-xs"
                        value={basicInfo.age}
                        onChange={(e) => setBasicInfo({...basicInfo, age: parseInt(e.target.value)})}
                      />
                      <input 
                        className="w-24 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-2 py-1 text-xs"
                        value={basicInfo.gender}
                        onChange={(e) => setBasicInfo({...basicInfo, gender: e.target.value})}
                      />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">{user.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.age} Years • {user.gender}</p>
                </>
              )}
            </div>
          </div>
          <button 
            onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}
            className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-full transition"
          >
            {isEditingProfile ? <Save size={20} /> : <Edit2 size={20} />}
          </button>
        </div>

        {/* Emergency Contact Mini-Card */}
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-3 flex justify-between items-center transition-colors mb-4">
           <div className="flex items-center gap-3">
              <div className="bg-red-100 dark:bg-red-900/40 p-2 rounded-full text-red-600 dark:text-red-400">
                <Phone size={16} />
              </div>
              <div>
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold uppercase tracking-wider">{t('profile.emergency_contact')}</p>
                {isEditingProfile ? (
                   <div className="flex flex-col gap-1 mt-1">
                      <input 
                        className="border border-red-200 dark:border-red-800 rounded px-2 py-1 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Name"
                        value={basicInfo.contactName}
                        onChange={(e) => setBasicInfo({...basicInfo, contactName: e.target.value})}
                      />
                      <input 
                        className="border border-red-200 dark:border-red-800 rounded px-2 py-1 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Relation"
                        value={basicInfo.relation}
                        onChange={(e) => setBasicInfo({...basicInfo, relation: e.target.value})}
                      />
                      <input 
                        className="border border-red-200 dark:border-red-800 rounded px-2 py-1 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        placeholder="Phone"
                        value={basicInfo.phone}
                        onChange={(e) => setBasicInfo({...basicInfo, phone: e.target.value})}
                      />
                   </div>
                ) : (
                   <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{user.emergencyContact.name} ({user.emergencyContact.relation})</p>
                )}
              </div>
           </div>
           {!isEditingProfile && (
             <a href={`tel:${user.emergencyContact.phone}`} className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
               {t('profile.call')}
             </a>
           )}
        </div>
        
        {/* Logout Button in Header */}
        <button 
           onClick={onLogout}
           className="w-full py-2 flex items-center justify-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg text-sm font-bold transition-colors"
        >
           <LogOut size={16} /> {t('doc_profile.logout')}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10 transition-colors">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition ${
            activeTab === 'overview' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          {t('profile.overview')}
        </button>
        <button 
          onClick={() => setActiveTab('timeline')}
          className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition ${
            activeTab === 'timeline' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          {t('profile.history')}
        </button>
        <button 
          onClick={() => setActiveTab('documents')}
          className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition ${
            activeTab === 'documents' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          {t('profile.documents')}
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 space-y-6">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Medications */}
            <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
               <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                 <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm flex items-center gap-2">
                   <Pill size={16} className="text-blue-600" /> {t('profile.medications')}
                 </h3>
               </div>
               <div className="p-4">
                 <div className="space-y-2 mb-4">
                   {user.medications.map((med, idx) => (
                     <div key={idx} className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg shadow-sm">
                       <div className="flex flex-col">
                          <span className="font-bold text-gray-800 dark:text-white text-sm">{med.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{med.dosage} • {med.frequency}</span>
                       </div>
                       <button onClick={() => removeMedication(idx)} className="text-gray-400 hover:text-red-500 p-1">
                         <X size={16} />
                       </button>
                     </div>
                   ))}
                   {user.medications.length === 0 && <p className="text-sm text-gray-400 italic">{t('profile.no_meds')}</p>}
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2 mb-2">
                   <input 
                     type="text" 
                     value={newMedName}
                     onChange={(e) => setNewMedName(e.target.value)}
                     placeholder="Name"
                     className="col-span-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                   />
                   <input 
                     type="text" 
                     value={newMedDosage}
                     onChange={(e) => setNewMedDosage(e.target.value)}
                     placeholder="Dosage"
                     className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                   />
                   <input 
                     type="text" 
                     value={newMedFreq}
                     onChange={(e) => setNewMedFreq(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && addMedication()}
                     placeholder="Freq"
                     className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                   />
                 </div>
                 <button 
                   onClick={addMedication}
                   disabled={!newMedName.trim() || !newMedDosage.trim()}
                   className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center justify-center gap-1"
                 >
                   <Plus size={16} /> {t('profile.add_med')}
                 </button>
               </div>
            </section>

            {/* Allergies */}
            <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
               <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                 <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm flex items-center gap-2">
                   <Activity size={16} className="text-amber-600" /> {t('profile.allergies')}
                 </h3>
               </div>
               <div className="p-4">
                 <div className="flex flex-wrap gap-2 mb-4">
                   {user.allergies.map((alg, idx) => (
                     <span key={idx} className="inline-flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
                       {alg}
                       <button onClick={() => removeAllergy(idx)} className="text-gray-400 hover:text-red-500 ml-1">
                         <X size={14} />
                       </button>
                     </span>
                   ))}
                   {user.allergies.length === 0 && <p className="text-sm text-gray-400 italic">{t('profile.no_allergies')}</p>}
                 </div>
                 <div className="flex gap-2">
                   <input 
                     type="text" 
                     value={newAllergy}
                     onChange={(e) => setNewAllergy(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && addAllergy()}
                     placeholder="Add allergy..."
                     className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                   />
                   <button 
                     onClick={addAllergy}
                     disabled={!newAllergy.trim()}
                     className="bg-amber-600 text-white p-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     <Plus size={20} />
                   </button>
                 </div>
               </div>
            </section>
          </div>
        )}

        {/* TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 dark:text-white">{t('profile.clinical_timeline')}</h3>
              <button 
                onClick={() => setShowEventForm(true)}
                className="text-xs bg-gray-900 dark:bg-gray-700 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-600 flex items-center gap-1 transition-colors"
              >
                <Plus size={14} /> {t('profile.add_event')}
              </button>
            </div>

            {/* Add Event Form Modal */}
            {showEventForm && (
               <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6 shadow-sm animate-in fade-in zoom-in-95 transition-colors">
                  <div className="flex justify-between items-center mb-3">
                     <h4 className="font-bold text-sm text-gray-900 dark:text-white">{t('profile.new_event')}</h4>
                     <button onClick={() => setShowEventForm(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={16} /></button>
                  </div>
                  <div className="space-y-3">
                     <input 
                       type="date"
                       className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm"
                       value={newEvent.date}
                       onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                     />
                     <input 
                       type="text"
                       placeholder="Event Title (e.g., Surgery, Diagnosis)"
                       className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm"
                       value={newEvent.title}
                       onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                     />
                      <input 
                       type="text"
                       placeholder="Doctor / Hospital (Optional)"
                       className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm"
                       value={newEvent.doctorName}
                       onChange={e => setNewEvent({...newEvent, doctorName: e.target.value})}
                     />
                     <select 
                        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm"
                        value={newEvent.type}
                        onChange={e => setNewEvent({...newEvent, type: e.target.value as any})}
                     >
                        <option value="general">General Checkup</option>
                        <option value="diagnosis">Diagnosis</option>
                        <option value="surgery">Surgery</option>
                        <option value="lab">Lab Result</option>
                     </select>
                     <textarea 
                       placeholder="Description..."
                       className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm h-20 resize-none"
                       value={newEvent.description}
                       onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                     />
                     <button 
                       onClick={handleAddEvent}
                       disabled={!newEvent.title || !newEvent.date}
                       className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-blue-700 disabled:opacity-50"
                     >
                       {t('profile.save_event')}
                     </button>
                  </div>
               </div>
            )}

            {/* Timeline */}
            <div className="relative pl-4 space-y-8 before:content-[''] before:absolute before:left-[27px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-200 dark:before:bg-gray-700">
               {user.medicalEvents.length === 0 ? (
                 <div className="pl-8 text-gray-400 italic text-sm">{t('dpv.no_history')}</div>
               ) : (
                 user.medicalEvents
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Ensure descenting sort
                  .map((event) => (
                   <div 
                      key={event.id} 
                      className="relative pl-10 group cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                   >
                      {/* Dot */}
                      <div className={`absolute left-[18px] top-1 w-5 h-5 rounded-full border-[3px] border-white dark:border-gray-950 shadow-sm z-10 ${
                        event.type === 'surgery' ? 'bg-red-500' :
                        event.type === 'diagnosis' ? 'bg-amber-500' :
                        event.type === 'lab' ? 'bg-sky-500' : 'bg-blue-500'
                      }`}></div>
                      
                      {/* Content Card */}
                      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm relative hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition">
                         <div className="flex justify-between items-start mb-1">
                            <div>
                               <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-0.5">{event.date}</span>
                               <h4 className="font-bold text-gray-800 dark:text-white text-base">{event.title}</h4>
                            </div>
                            <button 
                              onClick={(e) => removeEvent(event.id, e)}
                              className="text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition z-20 relative"
                            >
                              <Trash2 size={14} />
                            </button>
                         </div>
                         <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">{event.description}</p>
                         <div className="mt-3 flex gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              event.type === 'surgery' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900' :
                              event.type === 'diagnosis' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900' :
                              event.type === 'lab' ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-900' : 
                              'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900'
                            }`}>
                               {event.type.toUpperCase()}
                            </span>
                         </div>
                      </div>
                   </div>
                 ))
               )}
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-gray-800 dark:text-white">{t('profile.medical_reports')}</h3>
               <button 
                 onClick={handleUploadReport}
                 className="text-xs bg-gray-900 dark:bg-gray-700 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-600 flex items-center gap-1 transition-colors"
               >
                 <Upload size={14} /> {t('profile.upload')}
               </button>
             </div>
             
             <div className="space-y-3">
               {user.reports.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                     <FileText size={32} className="mx-auto mb-2 opacity-50" />
                     <p>{t('profile.no_docs')}</p>
                  </div>
               ) : (
                  user.reports.map(report => (
                     <div key={report.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-lg flex items-center justify-center">
                              <FileText size={20} />
                           </div>
                           <div>
                              <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100">{report.title}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{report.date} • {report.doctorName}</p>
                           </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
                           <Download size={18} />
                        </button>
                     </div>
                  ))
               )}
             </div>
          </div>
        )}
      </div>

      {/* EVENT DETAILS MODAL */}
      {selectedEvent && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={() => setSelectedEvent(null)}></div>
           <div className="bg-white dark:bg-gray-900 w-full max-w-md p-6 rounded-t-3xl sm:rounded-2xl shadow-2xl relative animate-in slide-in-from-bottom-10 pointer-events-auto border-t border-gray-200 dark:border-gray-800 flex flex-col max-h-[85vh]">
              <button 
                onClick={() => setSelectedEvent(null)} 
                className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <X size={20} />
              </button>
              
              <div className="mb-6 pr-8">
                 <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-2 ${
                     selectedEvent.type === 'surgery' ? 'bg-red-100 text-red-700' :
                     selectedEvent.type === 'diagnosis' ? 'bg-amber-100 text-amber-700' :
                     selectedEvent.type === 'lab' ? 'bg-sky-100 text-sky-700' : 'bg-blue-100 text-blue-700'
                 }`}>
                     {selectedEvent.type}
                 </span>
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{selectedEvent.title}</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <Calendar size={12} /> {selectedEvent.date}
                 </p>
              </div>

              <div className="space-y-4 overflow-y-auto">
                 {/* Doctor / Location Info */}
                 {(selectedEvent.doctorName || selectedEvent.location) && (
                   <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div className="bg-white dark:bg-gray-700 p-2 rounded-lg text-gray-600 dark:text-gray-300 shadow-sm">
                         <Stethoscope size={20} />
                      </div>
                      <div>
                         {selectedEvent.doctorName && (
                            <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{selectedEvent.doctorName}</p>
                         )}
                         {selectedEvent.location && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                               <MapPin size={10} /> {selectedEvent.location}
                            </p>
                         )}
                      </div>
                   </div>
                 )}

                 {/* Full Description */}
                 <div className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-2">Clinical Notes</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                       {selectedEvent.description}
                    </p>
                 </div>
                 
                 {/* Actions */}
                 <div className="pt-2">
                    {selectedEvent.type === 'lab' || selectedEvent.type === 'diagnosis' ? (
                        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition flex items-center justify-center gap-2">
                           <FileText size={16} /> View Related Report
                        </button>
                    ) : (
                        <button className="w-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                           Add Follow-up Note
                        </button>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
