import React, { useState, useEffect } from 'react';
import {
  Home,
  MessageSquare,
  Stethoscope,
  User,
  ShieldAlert,
  Moon,
  Sun,
  Bell,
  Briefcase,
  Pill,
  LogOut
} from 'lucide-react';
import { UserProfile, AppRoute, Doctor, Appointment, Notification, MedicalReport, PrescriptionData, MedicalEvent, AuthResponse } from './types';
import { AuthService, MOCK_PATIENT_DATA } from './services/authService';
import { useLanguage } from './contexts/LanguageContext';
import SOSOverlay from './components/SOSOverlay';
import NotificationPanel from './components/NotificationPanel';
import MedicationPanel from './components/MedicationPanel';
import SplashScreen from './components/SplashScreen';
import BookingSuccessModal from './components/BookingSuccessModal';
import AppTour from './components/AppTour';
import TriagePage from './pages/TriagePage';
import DoctorsPage from './pages/DoctorsPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorPatientView from './pages/DoctorPatientView';
import DoctorProfilePage from './pages/DoctorProfilePage';

// --- MOCK DATA ---
const MOCK_REPORTS: MedicalReport[] = [
  { id: '101', title: 'Complete Blood Count (CBC)', date: '2023-11-15', type: 'Lab Report', doctorName: 'City PathLabs', url: '#' },
  { id: '102', title: 'Eye Vision Prescription', date: '2023-08-10', type: 'Prescription', doctorName: 'Dr. Aditi Gupta', url: '#' },
  { id: '103', title: 'Discharge Summary - Surgery', date: '2022-12-08', type: 'Certificate', doctorName: 'Apollo Hospital', url: '#' },
  { id: '104', title: 'Allergy Test Panel', date: '2022-03-15', type: 'Lab Report', doctorName: 'Dr. Meera Reddy', url: '#' },
  { id: '105', title: 'COVID-19 Vaccination Cert', date: '2021-06-20', type: 'Certificate', doctorName: 'CoWin', url: '#' },
  { id: '106', title: 'Chest X-Ray PA View', date: '2020-09-12', type: 'Imaging', doctorName: 'City Imaging Center', url: '#' },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Appointment Reminder', message: 'Video consult with Dr. Anita Desai starts in 15 mins.', time: '10 min ago', type: 'reminder', read: false },
  { id: '2', title: 'Lab Results Ready', message: 'Your recent blood work report is available for download.', time: '2 hours ago', type: 'info', read: false },
  { id: '3', title: 'Daily Check-in', message: 'Time for your daily wellness check.', time: 'Yesterday', type: 'alert', read: true },
];

const DEFAULT_DOCTORS: Doctor[] = [
  {
    id: '1', name: 'Dr. Anita Desai', specialty: 'Cardiologist', rating: 4.9, image: 'https://picsum.photos/100/100?random=1', nextAvailable: 'Today, 2:30 PM', price: '₹1200', isVideoEnabled: true,
    about: 'Dr. Anita Desai is a senior Cardiologist with over 15 years of experience. She specializes in preventive cardiology and heart failure management.',
    experience: 15, qualifications: ['MBBS', 'MD (Medicine)', 'DM (Cardiology)'], verified: true
  },
  {
    id: '2', name: 'Dr. Rajesh Kumar', specialty: 'General Physician', rating: 4.7, image: 'https://picsum.photos/100/100?random=2', nextAvailable: 'Tomorrow, 9:00 AM', price: '₹600', isVideoEnabled: false,
    about: 'Friendly neighborhood physician focusing on holistic health and chronic disease management.',
    experience: 8, qualifications: ['MBBS', 'DNB (Family Medicine)']
  },
  {
    id: '3', name: 'Dr. Meera Reddy', specialty: 'Dermatologist', rating: 4.8, image: 'https://picsum.photos/100/100?random=3', nextAvailable: 'Today, 4:15 PM', price: '₹900', isVideoEnabled: true,
    experience: 10, qualifications: ['MBBS', 'MD (Dermatology)']
  },
  {
    id: '4', name: 'Dr. Vikram Singh', specialty: 'Neurologist', rating: 4.9, image: 'https://picsum.photos/100/100?random=4', nextAvailable: 'Wed, 11:00 AM', price: '₹1500', isVideoEnabled: true,
    about: 'Expert in treating migraines, epilepsy, and stroke rehabilitation. Passionate about leveraging technology for patient care.',
    experience: 12, qualifications: ['MBBS', 'MD', 'DM (Neurology)'], verified: true
  },
  {
    id: '5', name: 'Dr. Arjun Gupta', specialty: 'Orthopedist', rating: 4.6, image: 'https://picsum.photos/100/100?random=5', nextAvailable: 'Thu, 10:30 AM', price: '₹1000', isVideoEnabled: true,
    experience: 14, qualifications: ['MBBS', 'MS (Orthopedics)']
  },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  // Upcoming
  { id: '201', doctorId: '1', doctorName: 'Dr. Anita Desai', date: 'Today', time: '2:30 PM', type: 'video', status: 'upcoming', notes: 'Routine check' },
  { id: '204', doctorId: '4', doctorName: 'Dr. Vikram Singh', date: 'Tomorrow', time: '11:00 AM', type: 'video', status: 'upcoming', notes: 'Follow up on migraine' },

  // Pending Requests (For Doctor Dashboard Demo)
  { id: '207', doctorId: '4', doctorName: 'Dr. Vikram Singh', date: 'Today', time: '04:00 PM', type: 'video', status: 'pending', notes: 'New Patient: Frequent headaches' },
  { id: '208', doctorId: '4', doctorName: 'Dr. Vikram Singh', date: 'Tomorrow', time: '12:30 PM', type: 'in-person', status: 'pending', notes: 'Review MRI Scan' },

  // History - Enriched for Demo
  { id: '202', doctorId: '2', doctorName: 'Dr. Rajesh Kumar', date: '2023-11-15', time: '10:00 AM', type: 'in-person', status: 'completed', notes: 'Annual Physical', diagnosis: 'Healthy', prescription: ['Multivitamins'], userRating: 5 },
  { id: '205', doctorId: '6', doctorName: 'Dr. Aditi Gupta', date: '2023-08-10', time: '11:30 AM', type: 'in-person', status: 'completed', notes: 'Eye Exam', diagnosis: 'Mild Myopia', prescription: ['Eye Drops', 'Corrective Lenses'] },
  { id: '203', doctorId: '3', doctorName: 'Dr. Meera Reddy', date: '2023-03-15', time: '4:00 PM', type: 'video', status: 'completed', notes: 'Skin rash', diagnosis: 'Contact Dermatitis', prescription: ['Hydrocortisone Cream', 'Levocetirizine'], userRating: 4, userReview: "Good doctor, but video lagged a bit." },
  { id: '206', doctorId: '2', doctorName: 'Dr. Rajesh Kumar', date: '2023-05-22', time: '09:30 AM', type: 'in-person', status: 'completed', notes: 'High Fever', diagnosis: 'Viral Fever', prescription: ['Paracetamol 650mg', 'Rest'] },
  { id: '209', doctorId: '5', doctorName: 'Dr. Arjun Gupta', date: '2022-11-20', time: '05:00 PM', type: 'in-person', status: 'completed', notes: 'Ankle Sprain', diagnosis: 'Grade 1 Ligament Tear', prescription: ['Volini Spray', 'Aceclofenac'], userRating: 5 },
];

const INITIAL_USER: UserProfile = {
  name: "",
  age: 0,
  gender: "",
  medicalHistory: "",
  medicalEvents: [],
  reports: [],
  allergies: [],
  medications: [],
  emergencyContact: { name: "", phone: "", relation: "" }
};

function App() {
  const { language, setLanguage, t } = useLanguage();
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.LOGIN);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [doctors, setDoctors] = useState<Doctor[]>(DEFAULT_DOCTORS);

  // Overlays State
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMedicationPanelOpen, setIsMedicationPanelOpen] = useState(false);

  const [triageFilter, setTriageFilter] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isDoctorMode, setIsDoctorMode] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null); // For doctor view
  const [showSplash, setShowSplash] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [lastBookedAppointment, setLastBookedAppointment] = useState<Appointment | null>(null);

  // Current logged in doctor mock (Dr. Vikram Singh - ID 4)
  const [currentDoctorProfile, setCurrentDoctorProfile] = useState<Doctor>(DEFAULT_DOCTORS[3]);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check Session on Mount
  useEffect(() => {
    const session = AuthService.getSession();
    if (session) {
      handleAuthSuccess(session, true);
    } else {
      setCurrentRoute(AppRoute.LOGIN);
    }
  }, []);

  const handleAuthSuccess = (session: AuthResponse, isRestored: boolean = false) => {
    setIsAuthenticated(true);

    if (session.role === 'patient') {
      setUser(session.user as UserProfile);
      setIsDoctorMode(false);

      if (session.isNewUser) {
        setCurrentRoute(AppRoute.ONBOARDING);
      } else {
        setCurrentRoute(AppRoute.HOME);
        if (!isRestored) setShowTour(true);
      }

    } else {
      setCurrentDoctorProfile(session.user as Doctor);
      setIsDoctorMode(true);
      setCurrentRoute(AppRoute.DOCTOR_HOME);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    setIsDoctorMode(false);
    setCurrentRoute(AppRoute.LOGIN);
  };

  const handleBookAppointment = (doctor: Doctor, date: string, time: string, type: 'video' | 'in-person') => {
    const newAppt: Appointment = {
      id: Date.now().toString(),
      doctorId: doctor.id,
      doctorName: doctor.name,
      date,
      time,
      notes: "Booked via Sarthi AI",
      type,
      status: 'pending'
    };
    setAppointments([...appointments, newAppt]);
    setNotifications([
      { id: Date.now().toString(), title: 'Request Sent', message: `Appointment request sent to ${doctor.name}`, time: 'Just now', type: 'info', read: false },
      ...notifications
    ]);
    setLastBookedAppointment(newAppt);
  };

  const handleBookingConfirmationClose = () => {
    setLastBookedAppointment(null);
    setCurrentRoute(AppRoute.HOME);
  };

  const handleTriageComplete = (specialty: string) => {
    setTriageFilter(specialty);
    setCurrentRoute(AppRoute.DOCTORS);
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setUser(updated);
  };

  const handleUpdateDoctor = (updated: Doctor) => {
    setCurrentDoctorProfile(updated);
    setDoctors(prev => prev.map(d => d.id === updated.id ? updated : d));
  };

  const handleMarkMedicationTaken = (medId: string) => {
    const updatedMeds = user.medications.map(med =>
      med.id === medId ? { ...med, taken: true } : med
    );
    setUser({ ...user, medications: updatedMeds });
  };

  const handleOnboardingComplete = (newUser: UserProfile) => {
    const completeProfile = { ...user, ...newUser };
    if (!completeProfile.reports || completeProfile.reports.length === 0) {
      completeProfile.reports = MOCK_REPORTS;
    }
    setUser(completeProfile);
    setCurrentRoute(AppRoute.HOME);
    setShowTour(true);
  };

  const handleDoctorSelectPatient = (apptId: string) => {
    setSelectedPatientId(apptId);
    setCurrentRoute(AppRoute.DOCTOR_CONSULT);
  };

  const handleAcceptAppointment = (id: string) => {
    setAppointments(prev => prev.map(appt =>
      appt.id === id ? { ...appt, status: 'upcoming' } : appt
    ));
  };

  const handleDeclineAppointment = (id: string) => {
    setAppointments(prev => prev.map(appt =>
      appt.id === id ? { ...appt, status: 'cancelled' } : appt
    ));
  };

  const handleConsultationComplete = (data: PrescriptionData) => {
    const newEvent: MedicalEvent = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      title: 'Doctor Visit',
      description: `Diagnosis: ${data.diagnosis}. Follow up: ${data.followUp || 'N/A'}`,
      type: 'diagnosis',
      doctorName: currentDoctorProfile.name,
      location: 'Apollo Clinic'
    };

    const updatedUser = {
      ...user,
      medicalEvents: [newEvent, ...user.medicalEvents],
      medications: [...new Set([...user.medications, ...data.medications])]
    };
    setUser(updatedUser);

    if (selectedPatientId) {
      setAppointments(prev => prev.map(appt =>
        appt.id === selectedPatientId ? { ...appt, status: 'completed', diagnosis: data.diagnosis, prescription: data.medications } : appt
      ));
    }
    setCurrentRoute(AppRoute.DOCTOR_HOME);
  };

  const handleRateAppointment = (appointmentId: string, rating: number, review: string) => {
    setAppointments(prev => prev.map(appt =>
      appt.id === appointmentId ? { ...appt, userRating: rating, userReview: review } : appt
    ));
  };

  const renderPage = () => {
    switch (currentRoute) {
      case AppRoute.LOGIN: return <LoginPage onLogin={handleAuthSuccess} onNavigate={setCurrentRoute} />;
      case AppRoute.SIGNUP: return <SignupPage onSignup={handleAuthSuccess} onNavigate={setCurrentRoute} />;
      case AppRoute.ONBOARDING: return <OnboardingPage initialName={user.name} initialEmail={user.email} onComplete={handleOnboardingComplete} />;
      case AppRoute.HOME: return <HomePage user={user} appointments={appointments} onNavigate={setCurrentRoute} onRateDoctor={handleRateAppointment} />;
      case AppRoute.TRIAGE: return <TriagePage user={user} onComplete={handleTriageComplete} />;
      case AppRoute.DOCTORS: return <DoctorsPage doctors={doctors} filterSpecialty={triageFilter} onBook={handleBookAppointment} />;
      case AppRoute.PROFILE: return <ProfilePage user={user} onUpdate={handleUpdateProfile} onLogout={handleLogout} />;
      case AppRoute.DOCTOR_HOME: return <DoctorDashboard appointments={appointments} onSelectPatient={handleDoctorSelectPatient} onAccept={handleAcceptAppointment} onDecline={handleDeclineAppointment} />;
      case AppRoute.DOCTOR_CONSULT:
        const apt = appointments.find(a => a.id === selectedPatientId) || null;
        return <DoctorPatientView user={isDoctorMode ? MOCK_PATIENT_DATA : user} appointment={apt} onBack={() => setCurrentRoute(AppRoute.DOCTOR_HOME)} onComplete={handleConsultationComplete} />;
      case AppRoute.DOCTOR_PROFILE: return <DoctorProfilePage doctor={currentDoctorProfile} onUpdate={handleUpdateDoctor} onLogout={handleLogout} />;
      default: return <HomePage user={user} appointments={appointments} onNavigate={setCurrentRoute} onRateDoctor={handleRateAppointment} />;
    }
  };

  const showPatientNav = isAuthenticated && !isDoctorMode && ![AppRoute.ONBOARDING, AppRoute.LOGIN, AppRoute.SIGNUP].includes(currentRoute);
  const showDoctorNav = isAuthenticated && isDoctorMode && currentRoute !== AppRoute.DOCTOR_CONSULT;
  const showHeader = isAuthenticated && ![AppRoute.ONBOARDING, AppRoute.LOGIN, AppRoute.SIGNUP].includes(currentRoute);
  const hasPendingMeds = !isDoctorMode && user.medications && user.medications.some(m => !m.taken);

  return (
    // Use dynamic viewport height (h-[100dvh]) to prevent mobile browser address bars from cutting off content
    <div className={`${darkMode ? 'dark' : ''} h-[100dvh] flex justify-center bg-gray-100 dark:bg-black overflow-hidden`}>
      <div className="w-full h-full max-w-md bg-gray-50 dark:bg-gray-950 flex flex-col shadow-2xl relative border-x border-gray-200 dark:border-gray-800 transition-colors duration-300">

        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

        {showHeader && (
          <header className="bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-20 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Stethoscope className="text-white w-5 h-5" />
              </div>
              <h1 className="font-bold text-gray-800 dark:text-white text-lg tracking-tight">
                {isDoctorMode ? 'Sarthi Pro' : t('app.name')}
              </h1>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors flex items-center justify-center font-bold text-xs border border-gray-200 dark:border-gray-700 w-9 h-9"
              >
                {language === 'en' ? 'Hi' : 'En'}
              </button>
              <div className="hidden xs:block text-[10px] text-gray-400 font-mono border border-gray-200 dark:border-gray-700 px-1 rounded">
                v1.1
              </div>

              {!isDoctorMode && (
                <button
                  onClick={() => setIsMedicationPanelOpen(true)}
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors relative"
                >
                  <Pill size={20} />
                  {hasPendingMeds && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900 animate-pulse"></span>}
                </button>
              )}

              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors relative"
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-50 rounded-full border border-white dark:border-gray-900"></span>
              </button>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {!isDoctorMode && (
                <button
                  onClick={() => setIsSOSOpen(true)}
                  className="ml-2 bg-red-600 text-white px-3 py-2 rounded-lg shadow-md hover:bg-red-700 transition animate-pulse flex items-center justify-center gap-1 font-bold"
                >
                  <ShieldAlert size={18} />
                  <span>SOS</span>
                </button>
              )}
            </div>
          </header>
        )}

        <main className="flex-1 overflow-y-auto scrollbar-hide relative">
          {renderPage()}
        </main>

        {showPatientNav && (
          <nav className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-3 flex justify-between items-center z-20 sticky bottom-0 pb-safe transition-colors duration-300">
            <button
              onClick={() => setCurrentRoute(AppRoute.HOME)}
              className={`flex flex-col items-center gap-1 transition-colors duration-200 ${currentRoute === AppRoute.HOME ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <Home size={24} strokeWidth={currentRoute === AppRoute.HOME ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{t('nav.home')}</span>
            </button>
            <button
              onClick={() => setCurrentRoute(AppRoute.TRIAGE)}
              className={`flex flex-col items-center gap-1 transition-colors duration-200 ${currentRoute === AppRoute.TRIAGE ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <MessageSquare size={24} strokeWidth={currentRoute === AppRoute.TRIAGE ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{t('nav.triage')}</span>
            </button>
            <button
              onClick={() => setCurrentRoute(AppRoute.DOCTORS)}
              className={`flex flex-col items-center gap-1 transition-colors duration-200 ${currentRoute === AppRoute.DOCTORS ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <Stethoscope size={24} strokeWidth={currentRoute === AppRoute.DOCTORS ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{t('nav.doctors')}</span>
            </button>
            <button
              onClick={() => setCurrentRoute(AppRoute.PROFILE)}
              className={`flex flex-col items-center gap-1 transition-colors duration-200 ${currentRoute === AppRoute.PROFILE ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <User size={24} strokeWidth={currentRoute === AppRoute.PROFILE ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{t('nav.profile')}</span>
            </button>
          </nav>
        )}

        {showDoctorNav && (
          <nav className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-12 py-3 flex justify-around items-center z-20 sticky bottom-0 pb-safe transition-colors duration-300">
            <button
              onClick={() => setCurrentRoute(AppRoute.DOCTOR_HOME)}
              className={`flex flex-col items-center gap-1 transition-colors duration-200 ${currentRoute === AppRoute.DOCTOR_HOME ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <Home size={24} strokeWidth={currentRoute === AppRoute.DOCTOR_HOME ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{t('nav.dashboard')}</span>
            </button>
            <button
              onClick={() => setCurrentRoute(AppRoute.DOCTOR_PROFILE)}
              className={`flex flex-col items-center gap-1 transition-colors duration-200 ${currentRoute === AppRoute.DOCTOR_PROFILE ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <Briefcase size={24} strokeWidth={currentRoute === AppRoute.DOCTOR_PROFILE ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{t('nav.profile')}</span>
            </button>
          </nav>
        )}

        <SOSOverlay
          isOpen={isSOSOpen}
          onClose={() => setIsSOSOpen(false)}
          contactName={user.emergencyContact?.name || "Emergency Contact"}
        />

        <NotificationPanel
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          notifications={notifications}
        />

        <MedicationPanel
          isOpen={isMedicationPanelOpen}
          onClose={() => setIsMedicationPanelOpen(false)}
          user={user}
          onMarkTaken={handleMarkMedicationTaken}
          onNavigateProfile={() => { setIsMedicationPanelOpen(false); setCurrentRoute(AppRoute.PROFILE); }}
        />

        <BookingSuccessModal
          appointment={lastBookedAppointment}
          onClose={handleBookingConfirmationClose}
        />

        <AppTour
          isOpen={showTour}
          onComplete={() => setShowTour(false)}
        />
      </div>
    </div>
  );
}

export default App;