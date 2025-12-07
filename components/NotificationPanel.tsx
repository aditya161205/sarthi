import React from 'react';
import { X, Bell, Calendar, Activity } from 'lucide-react';
import { Notification } from '../types';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose, notifications }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
      <div className="w-80 h-full bg-white dark:bg-gray-900 shadow-2xl relative animate-in slide-in-from-right duration-300 flex flex-col">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900">
          <h2 className="font-bold text-lg dark:text-white flex items-center gap-2">
            <Bell size={20} className="text-blue-600" /> Notifications
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-950">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No new notifications</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {notifications.map(notif => (
                <div key={notif.id} className={`p-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition ${notif.read ? 'opacity-60' : ''}`}>
                  <div className="flex gap-3">
                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${notif.type === 'alert' ? 'bg-red-500' : notif.type === 'reminder' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100">{notif.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{notif.message}</p>
                      <span className="text-[10px] text-gray-400 mt-2 block font-medium">{notif.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <button className="w-full py-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition">
                Mark all as read
            </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;