
import React, { useState } from 'react';
import { Calendar, Clock, MessageSquare, Video, X, Sparkles, Loader2, Zap, ChevronRight, FileText, Star, MapPin } from 'lucide-react';
import { UserProfile, Appointment, AppRoute, OngoingTreatment } from '../types';
import { generateHealthSummary, generateHealthTip } from '../services/geminiService';
import RateDoctorModal from '../components/RateDoctorModal';
import OngoingTreatmentCard from '../components/OngoingTreatmentCard';
import VideoCallModal from '../components/VideoCallModal';
import TreatmentDetailsModal from '../components/TreatmentDetailsModal';
import DoctorChatView from '../components/DoctorChatView';

import { useLanguage } from '../contexts/LanguageContext';

interface HomePageProps {
   user: UserProfile;
   appointments: Appointment[];
   onNavigate: (route: AppRoute) => void;
   onRateDoctor: (appointmentId: string, rating: number, review: string) => void;
}

const MOCK_ONGOING_TREATMENTS: OngoingTreatment[] = [
   {
      id: 't1',
      title: 'Diabetes Management',
      doctorName: 'Dr. Anjali Gupta',
      doctorImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop',
      progress: 65,
      totalDuration: 'Month 4 of 6',
      nextStep: 'HbA1c Test next week',
      doctorSpecialty: 'Endocrinologist'
   },
   {
      id: 't2',
      title: 'Physical Therapy',
      doctorName: 'Dr. Ravi Kumar',
      doctorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop',
      progress: 30,
      totalDuration: 'Week 5 of 12',
      nextStep: 'Range of Motion Assessment',
      doctorSpecialty: 'Physiotherapist'
   }
];

const HomePage: React.FC<HomePageProps> = ({ user, appointments, onNavigate, onRateDoctor }) => {
   const { t, language } = useLanguage();
   const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
   const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

   const [ratingModalAppointment, setRatingModalAppointment] = useState<Appointment | null>(null);

   // New Features State
   const [videoCallTreatment, setVideoCallTreatment] = useState<OngoingTreatment | null>(null);
   const [detailsTreatment, setDetailsTreatment] = useState<OngoingTreatment | null>(null);
   const [chatTreatment, setChatTreatment] = useState<OngoingTreatment | null>(null);

   // AI Insights State
   const [insightView, setInsightView] = useState<'tip' | 'summary'>('tip');
   const [healthSummary, setHealthSummary] = useState<string | null>(null);
   const [isLoadingSummary, setIsLoadingSummary] = useState(false);
   const [healthTip, setHealthTip] = useState<string | null>(null);
   const [isLoadingTip, setIsLoadingTip] = useState(false);

   const handleGenerateSummary = async () => {
      setIsLoadingSummary(true);
      const summary = await generateHealthSummary(user, language);
      setHealthSummary(summary);
      setIsLoadingSummary(false);
   };

   const handleGenerateTip = async () => {
      setIsLoadingTip(true);
      const tip = await generateHealthTip(user, language);
      setHealthTip(tip);
      setIsLoadingTip(false);
   };

   const openRatingModal = (e: React.MouseEvent, apt: Appointment) => {
      e.stopPropagation();
      setRatingModalAppointment(apt);
   };

   const upcomingAppointments = appointments.filter(a => a.status === 'upcoming');
   const historyAppointments = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

   return (
      <div className="p-4 space-y-6 pb-20 relative">
         {/* Welcome Header */}
         <div className="flex justify-between items-center">
            <div>
               <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide">{t('header.welcome')}</p>
               <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user.name}</h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
               {user.name.charAt(0)}
            </div>
         </div>

         {/* Quick Actions Grid (Moved Top) */}
         <div className="grid grid-cols-2 gap-4">
            <button
               onClick={() => onNavigate(AppRoute.TRIAGE)}
               className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-4 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none active:scale-95 transition text-left relative overflow-hidden group"
            >
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <MessageSquare size={64} />
               </div>
               <div className="relative z-10">
                  <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm mb-6">
                     <MessageSquare size={16} />
                  </div>
                  <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">{t('home.chat_desc')}</p>
                  <h3 className="font-bold text-lg leading-tight">{t('home.chat_title')}</h3>
               </div>
            </button>

            <button
               onClick={() => onNavigate(AppRoute.DOCTORS)}
               className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-2xl shadow-sm active:scale-95 transition text-left group hover:border-blue-200 dark:hover:border-blue-800"
            >
               <div className="bg-gray-50 dark:bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 mb-6 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 transition-colors">
                  <Calendar size={16} />
               </div>
               <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{t('home.find_doc_desc')}</p>
               <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg leading-tight group-hover:text-blue-600 transition-colors">{t('home.find_doc_title')}</h3>
            </button>
         </div>

         {/* Unified AI Insights Widget (Thinner & Below) */}
         <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800/50 rounded-xl shadow-sm border border-amber-100 dark:border-gray-800 p-3 flex items-start gap-3 relative overflow-hidden">
            <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-lg text-amber-600 dark:text-amber-500 shrink-0 mt-0.5">
               {insightView === 'tip' ? <Zap size={18} fill="currentColor" /> : <Sparkles size={18} />}
            </div>
            <div className="flex-1">
               <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm text-gray-800 dark:text-white uppercase tracking-wide">
                     {insightView === 'tip' ? t('home.health_tip') : t('home.health_snapshot')}
                  </h4>
                  <button
                     onClick={() => setInsightView(prev => prev === 'tip' ? 'summary' : 'tip')}
                     className="text-[10px] font-bold text-gray-400 hover:text-blue-600 uppercase"
                  >
                     {insightView === 'tip' ? t('home.switch_snapshot') : t('home.switch_tip')}
                  </button>
               </div>

               <div className="min-h-[40px] flex items-center">
                  {insightView === 'tip' ? (
                     <div>
                        {healthTip ? (
                           <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-snug">"{healthTip}"</p>
                        ) : (
                           <button onClick={handleGenerateTip} disabled={isLoadingTip} className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-1">
                              {isLoadingTip ? t('gen.loading') : t('home.reveal_tip')} {isLoadingTip && <Loader2 size={10} className="animate-spin" />}
                           </button>
                        )}
                     </div>
                  ) : (
                     <div>
                        {healthSummary ? (
                           <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">{healthSummary}</p>
                        ) : (
                           <button onClick={handleGenerateSummary} disabled={isLoadingSummary} className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
                              {isLoadingSummary ? t('gen.analyzing') : t('home.gen_summary')} {isLoadingSummary && <Loader2 size={10} className="animate-spin" />}
                           </button>
                        )}
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Ongoing Treatments Section */}
         <div>
            <div className="flex justify-between items-center mb-3 px-1">
               <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                  <Zap size={20} className="text-blue-600" /> {t('home.ongoing_treatments') || "Ongoing Treatments"}
               </h3>
               <button className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wide">
                  {t('home.view_all') || "View All"}
               </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x">
               {MOCK_ONGOING_TREATMENTS.map(treatment => (
                  <OngoingTreatmentCard
                     key={treatment.id}
                     treatment={treatment}
                     onVideoCall={setVideoCallTreatment}
                     onShowDetails={setDetailsTreatment}
                     onChat={() => setChatTreatment(treatment)}
                  />
               ))}
            </div>
         </div>

         {/* Appointments Section */}
         <div className="space-y-4 pt-2">
            <div className="flex items-center gap-6 border-b border-gray-100 dark:border-gray-800">
               <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`pb-2 text-sm font-bold border-b-2 transition ${activeTab === 'upcoming' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-400'}`}
               >
                  {t('home.tab.upcoming')}
               </button>
               <button
                  onClick={() => setActiveTab('history')}
                  className={`pb-2 text-sm font-bold border-b-2 transition ${activeTab === 'history' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-400'}`}
               >
                  {t('home.tab.history')}
               </button>
            </div>

            {activeTab === 'upcoming' ? (
               upcomingAppointments.length === 0 ? (
                  <div className="bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center text-gray-400 dark:text-gray-500">
                     <Calendar className="mx-auto mb-2 opacity-30" size={24} />
                     <p className="text-xs font-medium">{t('home.no_upcoming')}</p>
                     <button onClick={() => onNavigate(AppRoute.DOCTORS)} className="text-xs text-blue-600 font-bold mt-2">{t('home.book_now')}</button>
                  </div>
               ) : (
                  <div className="space-y-3">
                     {upcomingAppointments.map(apt => (
                        <div key={apt.id} className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 w-12 h-12 rounded-lg flex flex-col items-center justify-center text-xs font-bold shrink-0">
                                 <span>{apt.date.split(' ')[0].substring(0, 3)}</span>
                                 <span className="text-lg leading-none">{apt.date.split(' ')[1] || '24'}</span>
                              </div>
                              <div>
                                 <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm">{apt.doctorName}</h4>
                                 <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    {apt.time} • {apt.type === 'video' ? t('home.video') : t('home.clinic')}
                                 </p>
                              </div>
                           </div>
                           {apt.type === 'video' && (
                              <button className="bg-purple-600 text-white p-2 rounded-lg shadow-sm hover:bg-purple-700 transition">
                                 <Video size={16} />
                              </button>
                           )}
                        </div>
                     ))}
                  </div>
               )
            ) : (
               <div className="space-y-3">
                  {historyAppointments.length === 0 ? (
                     <div className="text-center py-6 text-gray-400 text-xs">{t('home.no_history')}</div>
                  ) : (
                     historyAppointments.map(apt => (
                        <button
                           key={apt.id}
                           onClick={() => setSelectedAppointment(apt)}
                           className="w-full bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 text-left hover:border-blue-200 dark:hover:border-blue-800 transition group"
                        >
                           <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm">{apt.doctorName}</h4>
                              {apt.userRating ? (
                                 <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded">
                                    <Star size={10} fill="currentColor" /> {apt.userRating}
                                 </div>
                              ) : (
                                 <span
                                    onClick={(e) => openRatingModal(e, apt)}
                                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
                                 >
                                    {t('home.rate_doctor')}
                                 </span>
                              )}
                           </div>
                           <div className="flex items-center justify-between">
                              <div>
                                 <p className="text-[10px] text-gray-400">{apt.date}</p>
                                 <p className="text-xs text-gray-500 dark:text-gray-400">{apt.diagnosis || 'Routine Checkup'}</p>
                              </div>
                              <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-500" />
                           </div>
                        </button>
                     ))
                  )}
               </div>
            )}
         </div>

         {/* Appointment Details Modal */}
         {selectedAppointment && (
            <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
               <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={() => setSelectedAppointment(null)}></div>
               <div className="bg-white dark:bg-gray-900 w-full max-w-md p-6 rounded-t-3xl sm:rounded-2xl shadow-2xl relative animate-in slide-in-from-bottom-10 pointer-events-auto border-t border-gray-200 dark:border-gray-800">
                  <button
                     onClick={() => setSelectedAppointment(null)}
                     className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400"
                  >
                     <X size={20} />
                  </button>

                  <div className="mb-6">
                     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{t('home.appt_details')}</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400">{selectedAppointment.date} • {selectedAppointment.time}</p>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                           <Clock size={20} />
                        </div>
                        <div className="flex-1">
                           <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">{t('booking.doctor')}</p>
                           <p className="font-semibold text-gray-800 dark:text-gray-100">{selectedAppointment.doctorName}</p>
                        </div>
                     </div>

                     {selectedAppointment.diagnosis && (
                        <div className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl">
                           <p className="text-xs text-gray-400 font-bold uppercase mb-1">{t('home.diagnosis')}</p>
                           <p className="font-medium text-gray-800 dark:text-gray-200">{selectedAppointment.diagnosis}</p>
                        </div>
                     )}

                     {selectedAppointment.prescription && selectedAppointment.prescription.length > 0 && (
                        <div className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl">
                           <p className="text-xs text-gray-400 font-bold uppercase mb-2">{t('home.prescribed_meds')}</p>
                           <div className="flex flex-wrap gap-2">
                              {selectedAppointment.prescription.map((med, i) => (
                                 <span key={i} className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">
                                    {med}
                                 </span>
                              ))}
                           </div>
                        </div>
                     )}

                     {selectedAppointment.userRating ? (
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30">
                           <p className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase mb-1">{t('home.your_rating')}</p>
                           <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                 <Star key={i} size={16} className={i < (selectedAppointment.userRating || 0) ? "text-amber-500 fill-amber-500" : "text-gray-300 dark:text-gray-700"} />
                              ))}
                           </div>
                           {selectedAppointment.userReview && <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 italic">"{selectedAppointment.userReview}"</p>}
                        </div>
                     ) : (
                        <button
                           onClick={(e) => {
                              setSelectedAppointment(null);
                              openRatingModal(e, selectedAppointment);
                           }}
                           className="w-full py-3 rounded-xl font-bold text-sm bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition flex items-center justify-center gap-2"
                        >
                           <Star size={16} /> {t('home.rate_doctor')}
                        </button>
                     )}

                     <div className="flex gap-2 mt-4">
                        <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition">
                           {t('home.book_again')}
                        </button>
                        {selectedAppointment.diagnosis && (
                           <button className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-2">
                              <FileText size={16} /> {t('home.view_report')}
                           </button>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Rating Modal */}
         {ratingModalAppointment && (
            <RateDoctorModal
               appointment={ratingModalAppointment}
               onClose={() => setRatingModalAppointment(null)}
               onSubmit={onRateDoctor}
            />
         )}
         {/* New Modals */}
         {videoCallTreatment && (
            <VideoCallModal
               treatment={videoCallTreatment}
               onClose={() => setVideoCallTreatment(null)}
            />
         )}

         {detailsTreatment && (
            <TreatmentDetailsModal
               treatment={detailsTreatment}
               onClose={() => setDetailsTreatment(null)}
               onChat={() => {
                  setDetailsTreatment(null);
                  setChatTreatment(detailsTreatment);
               }}
               onVideoCall={(t) => {
                  setDetailsTreatment(null);
                  setVideoCallTreatment(t);
               }}
            />
         )}

         {chatTreatment && (
            <div className="absolute inset-0 z-50 bg-white dark:bg-gray-900 animate-in slide-in-from-right">
               <DoctorChatView
                  treatment={chatTreatment}
                  onBack={() => setChatTreatment(null)}
               />
            </div>
         )}
      </div>
   );
};

export default HomePage;
