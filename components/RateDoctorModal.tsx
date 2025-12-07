
import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Appointment } from '../types';

interface RateDoctorModalProps {
  appointment: Appointment;
  onClose: () => void;
  onSubmit: (appointmentId: string, rating: number, review: string) => void;
}

const RateDoctorModal: React.FC<RateDoctorModalProps> = ({ appointment, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(appointment.id, rating, review);
      onClose();
    }
  };

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

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Rate Your Experience</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">How was your appointment with <br/> <span className="font-semibold text-gray-800 dark:text-gray-200">{appointment.doctorName}</span>?</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="p-1 transition-transform hover:scale-110 focus:outline-none"
            >
              <Star 
                size={32} 
                className={`${(hoverRating || rating) >= star ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-700'}`} 
              />
            </button>
          ))}
        </div>

        <div className="mb-6">
           <textarea
             placeholder="Write a review (optional)..."
             className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24 text-gray-900 dark:text-white"
             value={review}
             onChange={(e) => setReview(e.target.value)}
           />
        </div>

        <button 
          onClick={handleSubmit}
          disabled={rating === 0}
          className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default RateDoctorModal;
