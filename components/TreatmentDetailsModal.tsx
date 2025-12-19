
import React from 'react';
import { X, Calendar, MessageSquare, Video, Info, CheckCircle2 } from 'lucide-react';
import { OngoingTreatment } from '../types';

interface TreatmentDetailsModalProps {
    treatment: OngoingTreatment;
    onClose: () => void;
    onChat: (treatment: OngoingTreatment) => void;
    onVideoCall: (treatment: OngoingTreatment) => void;
}

const TreatmentDetailsModal: React.FC<TreatmentDetailsModalProps> = ({
    treatment,
    onClose,
    onChat,
    onVideoCall
}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={onClose}></div>
            <div className="bg-gray-50 dark:bg-gray-900 w-full max-w-md h-[90vh] sm:h-[85vh] rounded-t-3xl sm:rounded-2xl shadow-2xl relative animate-in slide-in-from-bottom-10 pointer-events-auto border-t border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-blue-600 p-6 pb-12 relative shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition"
                    >
                        <X size={20} />
                    </button>
                    <h2 className="text-2xl font-bold text-white mb-1">{treatment.title}</h2>
                    <div className="flex items-center gap-2 text-blue-100 text-sm">
                        <span className="bg-blue-500/50 p-1 rounded-md"><Info size={14} /></span>
                        <span>Managed by Dr. {treatment.doctorName.split(' ').slice(1).join(' ')}</span>
                    </div>
                </div>

                {/* Floating Doctor Card */}
                <div className="px-6 -mt-8 relative z-10 shrink-0">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src={treatment.doctorImage} alt={treatment.doctorName} className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm" />
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ASSIGNED DOCTOR</p>
                                <h3 className="font-bold text-gray-800 dark:text-white text-sm">{treatment.doctorName}</h3>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => onChat(treatment)} className="p-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition">
                                <MessageSquare size={18} />
                            </button>
                            <button onClick={() => onVideoCall(treatment)} className="p-2.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 transition">
                                <Video size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Progress */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">CURRENT PROGRESS</p>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{treatment.progress}% Complete</h3>
                            </div>
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/30">
                                {treatment.totalDuration}
                            </span>
                        </div>
                        <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${treatment.progress}%` }}></div>
                        </div>
                    </div>

                    {/* History Timeline */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-gray-800 dark:text-white">
                            <Calendar className="text-blue-600" size={20} />
                            <h3 className="font-bold text-lg">Treatment History</h3>
                        </div>

                        <div className="space-y-6 relative pl-4 border-l-2 border-gray-100 dark:border-gray-800 ml-2">
                            {/* Item 1 */}
                            <div className="relative pl-6">
                                <div className="absolute -left-[21px] top-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white dark:border-gray-900 ring-4 ring-blue-50 dark:ring-blue-900/20"></div>
                                <p className="text-xs text-gray-400 font-mono mb-1">2023-09-01 <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">DIAGNOSIS</span></p>
                                <h4 className="font-bold text-gray-800 dark:text-white text-sm mb-1">Initial Consultation</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Diagnosed with Type 2 Diabetes. Started Metformin.</p>
                            </div>

                            {/* Item 2 */}
                            <div className="relative pl-6">
                                <div className="absolute -left-[21px] top-1 w-3 h-3 bg-blue-400 rounded-full border-2 border-white dark:border-gray-900"></div>
                                <p className="text-xs text-gray-400 font-mono mb-1">2023-10-01 <span className="ml-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">GENERAL</span></p>
                                <h4 className="font-bold text-gray-800 dark:text-white text-sm mb-1">Follow-up Checkup</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Glucose levels stabilizing. Dosage adjusted.</p>
                            </div>

                            {/* Item 3 */}
                            <div className="relative pl-6">
                                <div className="absolute -left-[21px] top-1 w-3 h-3 bg-blue-400 rounded-full border-2 border-white dark:border-gray-900"></div>
                                <p className="text-xs text-gray-400 font-mono mb-1">2023-11-05 <span className="ml-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">LAB</span></p>
                                <h4 className="font-bold text-gray-800 dark:text-white text-sm mb-1">HbA1c Test</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">Results pending.</p>
                            </div>
                        </div>
                    </div>

                    {/* Note Card */}
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2 text-amber-800 dark:text-amber-500">
                            <Info size={18} />
                            <h4 className="font-bold text-sm">Patient Note</h4>
                        </div>
                        <p className="text-xs text-amber-900/80 dark:text-amber-400/80 leading-relaxed">
                            Ensure you complete your <span className="font-bold">HbA1c Test next week</span> on time. Consistent adherence is crucial for a successful diabetes management.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TreatmentDetailsModal;
