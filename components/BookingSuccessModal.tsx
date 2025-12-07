
import React from 'react';
import { CheckCircle, Calendar, Clock, MapPin, Video, X } from 'lucide-react';
import { Appointment } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface BookingSuccessModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({ appointment, onClose }) => {
  const { t } = useLanguage();
  if (!appointment) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-300 border border-gray-100 dark:border-gray-800">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('booking.confirmed')}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            {t('booking.msg')}
          </p>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 w-full space-y-4 mb-6 text-left">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
               <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                  {appointment.doctorName.charAt(0)}
               </div>
               <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">{t('booking.doctor')}</p>
                  <p className="font-bold text-gray-900 dark:text-white">{appointment.doctorName}</p>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1">
                     <Calendar size={14} />
                     <span className="text-xs font-bold uppercase">{t('booking.date')}</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{appointment.date}</p>
               </div>
               <div>
                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1">
                     <Clock size={14} />
                     <span className="text-xs font-bold uppercase">{t('booking.time')}</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{appointment.time}</p>
               </div>
            </div>

            <div>
               <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1">
                  {appointment.type === 'video' ? <Video size={14} /> : <MapPin size={14} />}
                  <span className="text-xs font-bold uppercase">{t('booking.type')}</span>
               </div>
               <p className="font-semibold text-gray-900 dark:text-white text-sm">
                 {appointment.type === 'video' ? 'Video Consultation' : 'In-Person Visit'}
               </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition"
          >
            {t('booking.done')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessModal;
