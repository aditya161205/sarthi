

export interface MedicalEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'diagnosis' | 'surgery' | 'lab' | 'general';
  doctorName?: string;
  location?: string;
  reportUrl?: string;
}

export interface MedicalReport {
  id: string;
  title: string;
  date: string;
  type: 'Lab Report' | 'Prescription' | 'Certificate' | 'Imaging';
  doctorName: string;
  url?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'info' | 'reminder';
  read: boolean;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string; // e.g. "Morning", "Night", "2x Daily"
  taken: boolean; // Reset daily
}

export interface UserProfile {
  id?: string;
  email?: string;
  name: string;
  age: number;
  gender: string;
  medicalHistory: string; // Summary
  medicalEvents: MedicalEvent[]; // Detailed Timeline
  reports: MedicalReport[];
  allergies: string[];
  medications: Medication[];
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  image?: string; // Base64 string for image
  options?: string[]; // Quick reply options
  isFinal?: boolean; // If true, the triage is complete
  triageResult?: TriageResult;
}

export interface TriageResult {
  level: 'Green' | 'Yellow' | 'Red';
  specialty: string;
  summary: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  image: string;
  nextAvailable: string;
  price: string;
  isVideoEnabled: boolean;
  // Extended Profile Fields
  about?: string;
  experience?: number; // Years
  qualifications?: string[];
  verified?: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  notes: string;
  type: 'video' | 'in-person';
  status: 'upcoming' | 'completed' | 'cancelled' | 'pending';
  diagnosis?: string;
  prescription?: string[];
  userRating?: number; // 1-5
  userReview?: string;
}

export interface OngoingTreatment {
  id: string;
  title: string;
  doctorName: string;
  doctorImage: string;
  progress: number; // 0-100
  totalDuration: string; // e.g., "Month 4 of 6"
  nextStep: string; // e.g., "Hba1c Test next week"
  doctorSpecialty?: string;
  history?: MedicalEvent[]; // For details view
}

export interface PrescriptionData {
  diagnosis: string;
  medications: string[];
  followUp: string;
}

export interface AuthResponse {
  user: UserProfile | Doctor;
  role: 'patient' | 'doctor';
  token: string;
  isNewUser?: boolean;
}

export enum AppRoute {
  LOGIN = 'login',
  SIGNUP = 'signup',
  ONBOARDING = 'onboarding',
  HOME = 'home',
  TRIAGE = 'triage',
  DOCTORS = 'doctors',
  PROFILE = 'profile',
  SOS = 'sos',
  DOCTOR_HOME = 'doctor_home',
  DOCTOR_CONSULT = 'doctor_consult',
  DOCTOR_PROFILE = 'doctor_profile'
}