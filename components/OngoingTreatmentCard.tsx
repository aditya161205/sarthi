
import React from 'react';
import { Info, Video, MessageSquare, Zap } from 'lucide-react';
import { OngoingTreatment } from '../types';

interface OngoingTreatmentCardProps {
    treatment: OngoingTreatment;
    onVideoCall: (treatment: OngoingTreatment) => void;
    onShowDetails: (treatment: OngoingTreatment) => void;
    onChat: (treatment: OngoingTreatment) => void;
}

const OngoingTreatmentCard: React.FC<OngoingTreatmentCardProps> = ({
    treatment,
    onVideoCall,
    onShowDetails,
    onChat
}) => {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 min-w-[300px] w-full max-w-sm flex-shrink-0 snap-center">
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                    <img
                        src={treatment.doctorImage}
                        alt={treatment.doctorName}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{treatment.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wide mt-1">{treatment.doctorName}</p>
                    </div>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onShowDetails(treatment); }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                >
                    <Info size={18} />
                </button>
            </div>

            <div className="mb-4">
                <div className="flex justify-between text-xs font-bold text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wide">
                    <span>{treatment.totalDuration}</span>
                    <span>{treatment.progress}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${treatment.progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
                <Zap size={14} className="text-amber-500 fill-amber-500" />
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Next: <span className="text-gray-900 dark:text-white font-semibold">{treatment.nextStep}</span>
                </p>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={() => onChat(treatment)}
                    className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
                >
                    <MessageSquare size={16} /> Chat
                </button>
                <button
                    onClick={() => onVideoCall(treatment)}
                    className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-200 dark:shadow-none hover:bg-purple-700 transition"
                >
                    <Video size={16} /> Video
                </button>
            </div>
        </div>
    );
};

export default OngoingTreatmentCard;
