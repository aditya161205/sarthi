
import React, { useEffect, useState } from 'react';
import { Stethoscope, Activity, HeartPulse } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Start fade out animation after 2.2 seconds
    const timer1 = setTimeout(() => {
      setFading(true);
    }, 2200);

    // Call onFinish to unmount component after animation completes (2.2s + 0.5s)
    const timer2 = setTimeout(() => {
      onFinish();
    }, 2700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  return (
    <div 
      className={`absolute inset-0 z-[100] bg-gradient-to-br from-blue-600 to-indigo-800 flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center">
        <div className="bg-white p-5 rounded-3xl shadow-2xl mb-6 animate-in zoom-in duration-700 ease-out">
          <Stethoscope size={64} className="text-blue-600" />
        </div>
        
        <h1 className="text-4xl font-black text-white tracking-tight mb-2 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-150 fill-mode-forwards">
          Sarthi <span className="font-light">AI</span>
        </h1>
        
        <div className="flex items-center gap-2 text-blue-100 text-sm font-medium tracking-widest uppercase animate-in slide-in-from-bottom-4 fade-in duration-700 delay-300 fill-mode-forwards">
          <Activity size={16} className="text-blue-200 animate-pulse" />
          <span>Your Health Companion</span>
        </div>
      </div>

      <div className="absolute bottom-12 flex flex-col items-center gap-2 animate-in fade-in duration-1000 delay-500">
        <HeartPulse size={24} className="text-white/80 animate-bounce" />
        <p className="text-white/40 text-[10px] uppercase tracking-widest">Powered by Google Gemini</p>
      </div>
    </div>
  );
};

export default SplashScreen;
