
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, X, MapPin } from 'lucide-react';

interface SOSOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  contactName: string;
}

const SOSOverlay: React.FC<SOSOverlayProps> = ({ isOpen, onClose, contactName }) => {
  const [countdown, setCountdown] = useState(5);
  // 'confirm' -> 'counting' -> 'active'
  const [status, setStatus] = useState<'confirm' | 'counting' | 'active'>('confirm');

  useEffect(() => {
    let timer: any;
    if (isOpen) {
      if (status === 'counting') {
        setCountdown(5);
        timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              setStatus('active');
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else {
      // Reset when closed
      setStatus('confirm');
      setCountdown(5);
    }
    return () => clearInterval(timer);
  }, [isOpen, status]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-red-600 flex flex-col items-center justify-center text-white p-6 animate-in fade-in zoom-in duration-300">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-red-700 rounded-full hover:bg-red-800"
      >
        <X size={32} />
      </button>

      <div className="text-center space-y-6 max-w-md w-full">
        
        {/* CONFIRMATION STATE */}
        {status === 'confirm' && (
           <div className="space-y-6 animate-in slide-in-from-bottom-5">
             <div className="bg-red-800/50 p-6 rounded-full inline-block mb-2">
                <AlertTriangle size={64} className="animate-pulse" />
             </div>
             <div>
                <h1 className="text-3xl font-black uppercase tracking-widest mb-2">Emergency?</h1>
                <p className="text-red-100 text-lg">Do you want to activate SOS?</p>
             </div>
             <div className="space-y-3 pt-4">
                <button 
                  onClick={() => setStatus('counting')}
                  className="w-full bg-white text-red-600 py-4 rounded-2xl font-black text-xl shadow-lg hover:bg-gray-100 hover:scale-105 transition-transform"
                >
                  YES, ACTIVATE SOS
                </button>
                <button 
                  onClick={onClose}
                  className="w-full bg-red-800 text-white py-4 rounded-2xl font-bold text-lg hover:bg-red-900 transition"
                >
                  Cancel
                </button>
             </div>
           </div>
        )}

        {/* COUNTDOWN STATE */}
        {status === 'counting' && (
          <div className="space-y-4">
             <AlertTriangle size={80} className="mx-auto mb-4 animate-bounce" />
             <h1 className="text-4xl font-bold uppercase tracking-widest">Emergency</h1>
             <p className="text-xl">Alerting services in</p>
             <div className="text-8xl font-black tabular-nums">{countdown}</div>
             <button 
                onClick={onClose}
                className="bg-white text-red-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg mt-4"
             >
                CANCEL
             </button>
          </div>
        )}

        {/* ACTIVE STATE */}
        {status === 'active' && (
          <div className="space-y-6 bg-red-700 p-6 rounded-2xl shadow-xl border border-red-500 animate-in zoom-in">
            <h1 className="text-2xl font-bold uppercase tracking-widest mb-4">Help is on the way</h1>
            
            <div className="flex items-center gap-4 bg-red-800 p-4 rounded-xl">
               <div className="bg-white/20 p-3 rounded-full">
                 <Phone size={24} />
               </div>
               <div className="text-left">
                 <div className="font-semibold text-sm opacity-80">Calling 108 (Ambulance)</div>
                 <div className="text-xl font-bold">Connected...</div>
               </div>
            </div>

            <div className="flex items-center gap-4 bg-red-800 p-4 rounded-xl">
               <div className="bg-white/20 p-3 rounded-full">
                 <MapPin size={24} />
               </div>
               <div className="text-left">
                 <div className="font-semibold text-sm opacity-80">GPS Coordinates Sent</div>
                 <div className="text-xl font-bold">Shared with {contactName}</div>
               </div>
            </div>

            <p className="text-sm opacity-75 mt-4">
              Booking emergency slot at City General Hospital...
            </p>
            
            <button 
              onClick={onClose} 
              className="mt-4 text-sm font-semibold underline hover:text-red-200"
            >
              Close Emergency Mode
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SOSOverlay;
