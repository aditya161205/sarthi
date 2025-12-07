
import React, { useState } from 'react';
import { Calendar, Clock, ChevronRight, Video, MapPin, Star, TrendingUp, Users, Activity, Check, X, AlertTriangle, Edit2, User } from 'lucide-react';
import { Appointment } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface DoctorDashboardProps {
  appointments: Appointment[];
  onSelectPatient: (appointmentId: string) => void;
  onAccept: (appointmentId: string) => void;
  onDecline: (appointmentId: string) => void;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ appointments, onSelectPatient, onAccept, onDecline }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'schedule' | 'requests'>('schedule');
  const [workingHours, setWorkingHours] = useState("09:00 AM - 05:00 PM");
  const [isEditingHours, setIsEditingHours] = useState(false);
  const [acceptingPatients, setAcceptingPatients] = useState(true);
  
  // Decline Logic
  const [declineId, setDeclineId] = useState<string | null>(null);

  const activeAppointments = appointments.filter(a => a.status === 'upcoming');
  const pendingRequests = appointments.filter(a => a.status === 'pending');

  const confirmDecline = () => {
    if (declineId) {
      onDecline(declineId);
      setDeclineId(null);
    }
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-950 flex flex-col p-4 overflow-y-auto transition-colors relative">
      
      {/* Decline Warning Modal */}
      {declineId && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-sm animate-in zoom-in-95">
              <div className="flex flex-col items-center text-center space-y-3 mb-6">
                 <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 p-4 rounded-full">
                    <AlertTriangle size={32} />
                 </div>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">Are you sure?</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400">
                    Declining a new patient request may negatively impact your search ranking and rating score.
                 </p>
              </div>
              <div className="flex gap-3">
                 <button 
                   onClick={() => setDeclineId(null)}
                   className="flex-1 py-3 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                 >
                   {t('common.cancel')}
                 </button>
                 <button 
                   onClick={confirmDecline}
                   className="flex-1 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition"
                 >
                   {t('doctor.decline')}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Elaborate Doctor Profile Header */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-800 mb-6 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-4">
             <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold border-4 border-blue-50 dark:border-blue-900/30">
                VS
             </div>
             <div>
               <h1 className="text-xl font-bold text-gray-800 dark:text-white">Dr. Vikram Singh</h1>
               <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                 <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs font-bold">Neurologist</span>
                 <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${acceptingPatients ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <button onClick={() => setAcceptingPatients(!acceptingPatients)} className="hover:underline">
                      {acceptingPatients ? t('doctor.accepting') : t('doctor.not_available')}
                    </button>
                 </div>
               </div>
             </div>
          </div>
          <div className="text-right">
             <div className="flex items-center gap-1 justify-end text-amber-500 font-bold">
               <span className="text-lg">4.9</span>
               <Star size={16} fill="currentColor" />
             </div>
             <p className="text-xs text-gray-400">1,204 {t('doctor.reviews')}</p>
          </div>
        </div>

        {/* Working Hours Editor */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex justify-between items-center border border-gray-100 dark:border-gray-700 mb-4">
           <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              {isEditingHours ? (
                <input 
                  autoFocus
                  className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded px-2 py-0.5 text-xs text-gray-800 dark:text-gray-200 outline-none"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  onBlur={() => setIsEditingHours(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingHours(false)}
                />
              ) : (
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{workingHours}</span>
              )}
           </div>
           <button onClick={() => setIsEditingHours(true)} className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 p-1.5 rounded-lg transition">
              <Edit2 size={12} />
           </button>
        </div>

        {/* Practice Stats */}
        <div className="grid grid-cols-3 gap-3">
           <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase">
                 <Users size={14} /> {t('doctor.patients')}
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">24</p>
              <p className="text-[10px] text-green-600 flex items-center gap-1">
                 <TrendingUp size={10} /> +12% today
              </p>
           </div>
           <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase">
                 <Video size={14} /> {t('doctor.consults')}
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">8</p>
              <p className="text-[10px] text-gray-400">{t('doctor.scheduled')}</p>
           </div>
           <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-1 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase">
                 <Activity size={14} /> {t('doctor.score')}
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">98%</p>
              <p className="text-[10px] text-green-600">{t('doctor.response_rate')}</p>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800 mb-4">
         <button 
           onClick={() => setActiveTab('schedule')}
           className={`pb-2 text-sm font-bold border-b-2 transition ${activeTab === 'schedule' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-400'}`}
         >
           {t('doctor.schedule')} ({activeAppointments.length})
         </button>
         <button 
           onClick={() => setActiveTab('requests')}
           className={`pb-2 text-sm font-bold border-b-2 transition ${activeTab === 'requests' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-400'}`}
         >
           {t('doctor.requests')} <span className="ml-1 bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-[10px]">{pendingRequests.length}</span>
         </button>
      </div>

      {/* --- SCHEDULE TAB --- */}
      {activeTab === 'schedule' && (
        <div className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-300">
          {activeAppointments.length === 0 ? (
             <div className="text-center py-12 text-gray-400 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
               <Calendar className="mx-auto mb-2 opacity-50" size={32} />
               <p>{t('doctor.no_schedule')}</p>
             </div>
          ) : (
            activeAppointments.map(apt => (
              <button 
                key={apt.id}
                onClick={() => onSelectPatient(apt.id)}
                className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between hover:border-blue-400 dark:hover:border-blue-600 transition group"
              >
                 <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 w-14 h-14 rounded-xl text-blue-700 dark:text-blue-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                       <span className="text-xs font-bold uppercase">{apt.time.split(' ')[1]}</span>
                       <span className="text-lg font-bold">{apt.time.split(' ')[0]}</span>
                    </div>
                    <div className="text-left">
                       <h3 className="font-bold text-gray-800 dark:text-white text-lg">{apt.doctorName === 'Dr. Vikram Singh' ? 'Rahul Sharma' : apt.doctorName}</h3>
                       <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {apt.type === 'video' ? (
                            <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded"><Video size={12}/> {t('doctor.video')}</span>
                          ) : (
                            <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded"><MapPin size={12}/> {t('doctor.clinic')}</span>
                          )}
                          <span className="font-medium">{apt.notes || 'Routine Checkup'}</span>
                       </div>
                    </div>
                 </div>
                 <div className="text-gray-300 group-hover:text-blue-600 transition-colors">
                    <ChevronRight size={24} />
                 </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* --- REQUESTS TAB --- */}
      {activeTab === 'requests' && (
        <div className="space-y-3 animate-in fade-in slide-in-from-right-2 duration-300">
           {pendingRequests.length === 0 ? (
             <div className="text-center py-12 text-gray-400 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
               <Check className="mx-auto mb-2 opacity-50" size={32} />
               <p>{t('doctor.no_requests')}</p>
             </div>
           ) : (
             pendingRequests.map(apt => (
               <div key={apt.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
                   <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-500">
                            <Users size={20} />
                         </div>
                         <div>
                            <h3 className="font-bold text-gray-800 dark:text-white">Rahul Sharma</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('doctor.new_patient')} • {apt.notes}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{apt.date}</p>
                         <p className="text-xs text-gray-500">{apt.time}</p>
                      </div>
                   </div>
                   
                   <div className="flex flex-col gap-2">
                       <button 
                          onClick={() => onSelectPatient(apt.id)}
                          className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center justify-center gap-1"
                       >
                         <User size={14} /> {t('doctor.view_profile')}
                       </button>

                       <div className="flex gap-3">
                          <button 
                            onClick={() => setDeclineId(apt.id)}
                            className="flex-1 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                          >
                             <X size={16} /> {t('doctor.decline')}
                          </button>
                          <button 
                            onClick={() => onAccept(apt.id)}
                            className="flex-1 bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-100 dark:hover:bg-green-900/30 transition shadow-sm"
                          >
                             <Check size={16} /> {t('doctor.accept')}
                          </button>
                       </div>
                   </div>
               </div>
             ))
           )}
        </div>
      )}

    </div>
  );
};

export default DoctorDashboard;
