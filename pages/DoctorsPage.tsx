
import React, { useState } from 'react';
import { Star, MapPin, Clock, Check, Video, Calendar, X, Briefcase, Award, CheckCircle } from 'lucide-react';
import { Doctor } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface DoctorsPageProps {
  doctors: Doctor[];
  filterSpecialty: string | null;
  onBook: (doctor: Doctor, date: string, time: string, type: 'video' | 'in-person') => void;
}

const DoctorsPage: React.FC<DoctorsPageProps> = ({ doctors, filterSpecialty, onBook }) => {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState('Today');
  const [bookingDoctor, setBookingDoctor] = useState<string | null>(null);
  const [videoOnly, setVideoOnly] = useState(false);
  const [viewProfileDoctor, setViewProfileDoctor] = useState<Doctor | null>(null);

  const filteredDoctors = doctors.filter(d => {
    const matchesSpecialty = filterSpecialty 
      ? d.specialty.toLowerCase().includes(filterSpecialty.toLowerCase()) || d.specialty === 'General Physician'
      : true;
    const matchesVideo = videoOnly ? d.isVideoEnabled : true;
    return matchesSpecialty && matchesVideo;
  });

  const handleBooking = (doctor: Doctor) => {
    setBookingDoctor(doctor.id);
    setTimeout(() => {
      onBook(doctor, selectedDate, doctor.nextAvailable.split(', ')[1] || '10:00 AM', videoOnly ? 'video' : 'in-person');
      setBookingDoctor(null);
      setViewProfileDoctor(null);
    }, 1500);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header & Filter Info */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('find_doc.title')}</h2>
        <div className="flex justify-between items-center">
          {filterSpecialty ? (
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">
                <Check size={12} className="text-blue-600 dark:text-blue-400" />
                <span>{t('find_doc.recommended')}: <strong>{filterSpecialty}</strong></span>
            </div>
          ) : <div></div>}
          
          <button 
            onClick={() => setVideoOnly(!videoOnly)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition ${
              videoOnly 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}
          >
            <Video size={14} />
            {t('find_doc.video_consult')}
          </button>
        </div>
      </div>

      {/* Date Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
         {[t('common.today'), t('common.tomorrow'), 'Oct 24', 'Oct 25'].map(date => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                selectedDate === date 
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {date}
            </button>
         ))}
      </div>

      {/* Doctors List */}
      <div className="space-y-4">
        {filteredDoctors.length === 0 ? (
           <div className="text-center py-10 text-gray-400">
             <p>{t('find_doc.no_results')}</p>
             <button onClick={() => window.location.reload()} className="text-blue-600 dark:text-blue-400 underline text-sm mt-2">{t('find_doc.clear_filters')}</button>
           </div>
        ) : (
          filteredDoctors.map(doctor => (
            <div key={doctor.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors hover:shadow-md">
               <div className="p-4 flex gap-4 cursor-pointer" onClick={() => setViewProfileDoctor(doctor)}>
                  <img src={doctor.image} alt={doctor.name} className="w-20 h-20 rounded-xl object-cover bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1">
                     <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-800 dark:text-white text-lg flex items-center gap-1">
                             {doctor.name}
                             {doctor.verified && <CheckCircle size={14} className="text-blue-500" />}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{doctor.specialty}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2 py-1 rounded text-xs font-bold">
                           <Star size={12} fill="currentColor" />
                           {doctor.rating}
                        </div>
                     </div>
                     
                     <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        {doctor.experience && (
                           <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                              <Briefcase size={12} /> {doctor.experience}Y Exp
                           </div>
                        )}
                        <div className="flex items-center gap-1">
                          <MapPin size={12} /> Indiranagar
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                  <div className="text-xs">
                     <p className="text-gray-400 dark:text-gray-500">{t('find_doc.next_available')}</p>
                     <p className="font-semibold text-gray-700 dark:text-gray-200">{doctor.nextAvailable}</p>
                  </div>
                  <button 
                    onClick={() => handleBooking(doctor)}
                    disabled={bookingDoctor === doctor.id}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition disabled:opacity-70"
                  >
                    {bookingDoctor === doctor.id ? t('find_doc.booking') : `${t('find_doc.book')} ${doctor.price}`}
                  </button>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Doctor Profile Detail Modal */}
      {viewProfileDoctor && (
         <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={() => setViewProfileDoctor(null)}></div>
            <div className="bg-white dark:bg-gray-900 w-full max-w-md h-[85vh] rounded-t-3xl shadow-2xl relative animate-in slide-in-from-bottom-10 pointer-events-auto flex flex-col overflow-hidden">
               {/* Hero Image */}
               <div className="h-40 bg-gray-200 relative">
                  <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover opacity-50" />
                  <div className="absolute -bottom-12 left-6 border-4 border-white dark:border-gray-900 rounded-full">
                     <img src={viewProfileDoctor.image} className="w-24 h-24 rounded-full object-cover" />
                  </div>
                  <button 
                     onClick={() => setViewProfileDoctor(null)}
                     className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40"
                  >
                     <X size={20} />
                  </button>
               </div>
               
               {/* Content */}
               <div className="flex-1 overflow-y-auto pt-14 px-6 pb-24">
                  <div className="mb-6">
                     <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {viewProfileDoctor.name} 
                        {viewProfileDoctor.verified && <CheckCircle size={20} className="text-blue-500" />}
                     </h2>
                     <p className="text-blue-600 dark:text-blue-400 font-medium">{viewProfileDoctor.specialty}</p>
                     <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-300">
                        {viewProfileDoctor.experience && (
                           <div className="flex items-center gap-1.5">
                              <Briefcase size={16} className="text-gray-400" />
                              <span>{viewProfileDoctor.experience}+ Years Exp.</span>
                           </div>
                        )}
                        <div className="flex items-center gap-1.5">
                           <Star size={16} className="text-amber-500" fill="currentColor" />
                           <span className="font-bold">{viewProfileDoctor.rating}</span> <span className="text-gray-400">(1.2k Reviews)</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-2">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">{t('find_doc.about_doctor')}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                           {viewProfileDoctor.about || `${viewProfileDoctor.name} is a highly skilled ${viewProfileDoctor.specialty} with over ${viewProfileDoctor.experience || 10} years of experience in treating complex cases. Dedicated to providing patient-centered care with a holistic approach.`}
                        </p>
                     </div>

                     <div className="space-y-3">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">{t('doc_profile.qualifications')}</h3>
                        <div className="flex flex-wrap gap-2">
                           {viewProfileDoctor.qualifications?.map((q, i) => (
                              <span key={i} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5">
                                 <Award size={14} className="text-blue-500" /> {q}
                              </span>
                           )) || <span className="text-sm text-gray-500 italic">MBBS, MD (General Medicine)</span>}
                        </div>
                     </div>

                     <div className="space-y-3">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Availability</h3>
                        <div className="flex gap-2">
                           <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-xl p-3 flex-1 text-center">
                              <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase mb-1">{t('find_doc.next_available')}</p>
                              <p className="font-bold text-gray-900 dark:text-white">{viewProfileDoctor.nextAvailable}</p>
                           </div>
                           <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 flex-1 text-center">
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1">{t('doc_profile.fee')}</p>
                              <p className="font-bold text-gray-900 dark:text-white">{viewProfileDoctor.price}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Sticky Action Button */}
               <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                  <button 
                     onClick={() => handleBooking(viewProfileDoctor)}
                     disabled={bookingDoctor === viewProfileDoctor.id}
                     className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition disabled:opacity-70"
                  >
                     {bookingDoctor === viewProfileDoctor.id ? t('find_doc.booking') : t('find_doc.book_appointment')}
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default DoctorsPage;
