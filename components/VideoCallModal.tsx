
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, MoreHorizontal, Maximize2, ShieldCheck, User } from 'lucide-react';
import { OngoingTreatment } from '../types';

interface VideoCallModalProps {
    treatment: OngoingTreatment;
    onClose: () => void;
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({ treatment, onClose }) => {
    const [isMicOn, setIsMicOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setDuration(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="absolute inset-0 z-[60] bg-gray-900 flex flex-col items-center justify-center overflow-hidden h-full">
            {/* Background / Main Video Feed */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop"
                    alt="Doctor Video"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
            </div>

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10">
                <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-white text-xs font-mono font-medium">{formatTime(duration)}</span>
                </div>
                <button className="bg-black/40 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/60 transition">
                    <Maximize2 size={20} />
                </button>
            </div>

            {/* Main Content (Center) */}
            <div className="relative z-10 flex flex-col items-center mb-20">
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-blue-500 to-purple-600 mb-4 relative">
                    <img
                        src={treatment.doctorImage}
                        alt={treatment.doctorName}
                        className="w-full h-full rounded-full object-cover border-4 border-gray-900"
                    />
                    <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900"></div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1 shadow-black drop-shadow-md text-center">{treatment.doctorName}</h2>
                <div className="flex items-center gap-1.5 text-blue-200 text-xs font-bold uppercase tracking-wider bg-blue-900/50 px-3 py-1 rounded-full backdrop-blur-sm border border-blue-500/30">
                    <ShieldCheck size={12} /> Secure Consultation
                </div>
            </div>

            {/* Self View (Pip) */}
            <div className="absolute bottom-32 right-6 w-28 h-40 bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700 z-10">
                <div className="w-full h-full bg-slate-700 flex items-center justify-center relative">
                    <User size={40} className="text-slate-500" />
                    {!isVideoOn && (
                        <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center">
                            <VideoOff size={24} className="text-white" />
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-4 z-20 px-4">
                <button
                    onClick={() => setIsMicOn(!isMicOn)}
                    className={`p-4 rounded-full backdrop-blur-md transition ${isMicOn ? 'bg-gray-800/60 text-white hover:bg-gray-700/60' : 'bg-white text-gray-900'}`}
                >
                    {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
                </button>
                <button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={`p-4 rounded-full backdrop-blur-md transition ${isVideoOn ? 'bg-gray-800/60 text-white hover:bg-gray-700/60' : 'bg-white text-gray-900'}`}
                >
                    {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
                </button>
                <button
                    onClick={onClose}
                    className="p-5 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/50 transition transform hover:scale-105 active:scale-95"
                >
                    <PhoneOff size={32} fill="currentColor" />
                </button>
                <button className="p-4 rounded-full bg-gray-800/60 backdrop-blur-md text-white hover:bg-gray-700/60 transition">
                    <MessageSquare size={24} />
                </button>
                <button className="p-4 rounded-full bg-gray-800/60 backdrop-blur-md text-white hover:bg-gray-700/60 transition">
                    <MoreHorizontal size={24} />
                </button>
            </div>

            <div className="absolute bottom-2 left-0 right-0 text-center">
                <p className="text-[10px] text-gray-500 font-mono">ENCRYPTED CONSULTATION • ID: TR-1</p>
            </div>

        </div>
    );
};

export default VideoCallModal;
