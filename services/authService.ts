
import { UserProfile, Doctor, AuthResponse } from '../types';

export const MOCK_PATIENT_DATA: UserProfile = {
  id: 'p1',
  email: 'rahul@demo.com',
  name: "Rahul Sharma",
  age: 28,
  gender: "Male",
  medicalHistory: "Asthma (Mild), Seasonal Allergies",
  medicalEvents: [
    { 
      id: '1', 
      date: '2023-11-15', 
      title: 'Annual Physical Checkup', 
      description: 'Blood pressure 120/80. Weight 72kg. All vitals normal. Patient advised to maintain regular exercise regime.', 
      type: 'general',
      doctorName: 'Dr. Rajesh Kumar',
      location: 'City General Hospital'
    },
    { 
      id: '2', 
      date: '2023-08-10', 
      title: 'Eye Examination', 
      description: 'Routine vision test. Mild myopia diagnosed in left eye (-0.5D). Anti-glare glasses prescribed.', 
      type: 'general',
      doctorName: 'Dr. Aditi Gupta',
      location: 'Vision Care Center'
    },
    { 
      id: '3', 
      date: '2023-05-22', 
      title: 'Viral Fever Treatment', 
      description: 'Patient presented with high fever (102F) and body ache. Tested negative for Dengue/Malaria. Prescribed Paracetamol and rest.', 
      type: 'diagnosis',
      doctorName: 'Dr. Rajesh Kumar',
      location: 'City General Hospital'
    },
    { 
      id: '4', 
      date: '2022-12-05', 
      title: 'Appendectomy', 
      description: 'Emergency laparoscopic appendectomy performed. Surgery successful. No post-operative complications.', 
      type: 'surgery',
      doctorName: 'Dr. Suresh Menon',
      location: 'Apollo Hospital'
    },
    { 
      id: '5', 
      date: '2022-03-15', 
      title: 'Dermatology Consult', 
      description: 'Allergic reaction to dust mites causing skin rash on forearm. Prescribed antihistamines and topical corticosteroid cream.', 
      type: 'diagnosis',
      doctorName: 'Dr. Meera Reddy',
      location: 'Skin & Glow Clinic'
    }
  ],
  reports: [
    { id: 'r1', title: 'Complete Blood Count (CBC)', date: '2023-11-15', type: 'Lab Report', doctorName: 'City PathLabs', url: '#' },
    { id: 'r5', title: 'Medical Fitness Certificate', date: '2023-11-16', type: 'Certificate', doctorName: 'Dr. Rajesh Kumar', url: '#' },
    { id: 'r2', title: 'Eye Vision Prescription', date: '2023-08-10', type: 'Prescription', doctorName: 'Dr. Aditi Gupta', url: '#' },
    { id: 'r3', title: 'Discharge Summary - Surgery', date: '2022-12-08', type: 'Certificate', doctorName: 'Apollo Hospital', url: '#' },
    { id: 'r7', title: 'Sick Leave Certificate (3 Days)', date: '2023-05-22', type: 'Certificate', doctorName: 'Dr. Rajesh Kumar', url: '#' },
    { id: 'r4', title: 'Allergy Test Panel', date: '2022-03-15', type: 'Lab Report', doctorName: 'Dr. Meera Reddy', url: '#' },
    { id: 'r6', title: 'Chest X-Ray PA View', date: '2020-09-12', type: 'Imaging', doctorName: 'City Imaging Center', url: '#' },
  ],
  allergies: ["Penicillin", "Dust Mites"],
  medications: [
    { id: 'm1', name: "Albuterol Inhaler", dosage: "2 puffs", frequency: "As needed", taken: false },
    { id: 'm2', name: "Multivitamins", dosage: "1 Tablet", frequency: "Morning", taken: true },
    { id: 'm3', name: "Cetirizine", dosage: "10mg", frequency: "Night", taken: false }
  ],
  emergencyContact: {
    name: "Priya Sharma",
    phone: "+91 98765 43210",
    relation: "Spouse"
  }
};

const MOCK_DOCTOR: Doctor = {
  id: 'd1',
  name: 'Dr. Vikram Singh', 
  specialty: 'Neurologist', 
  rating: 4.9, 
  image: 'https://picsum.photos/100/100?random=4', 
  nextAvailable: 'Wed, 11:00 AM', 
  price: '₹1500', 
  isVideoEnabled: true,
  about: 'Expert in treating migraines, epilepsy, and stroke rehabilitation.',
  experience: 12, 
  qualifications: ['MBBS', 'MD', 'DM (Neurology)'], 
  verified: true
};

const STORAGE_KEY = 'mediguard_auth_session';

export const AuthService = {
  login: async (email: string, role: 'patient' | 'doctor'): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (role === 'patient') {
      if (email === 'rahul@demo.com') {
        const session = { user: MOCK_PATIENT_DATA, role, token: 'mock-jwt-patient', isNewUser: false };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        return session as AuthResponse;
      }
    } else {
      if (email === 'vikram@demo.com') {
        const session = { user: MOCK_DOCTOR, role, token: 'mock-jwt-doctor', isNewUser: false };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        return session as AuthResponse;
      }
    }
    
    throw new Error("Invalid credentials. Try rahul@demo.com (Patient) or vikram@demo.com (Doctor).");
  },

  signup: async (name: string, email: string, role: 'patient' | 'doctor'): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1200));

    if (role === 'patient') {
      const newUser: UserProfile = {
        ...MOCK_PATIENT_DATA,
        id: Date.now().toString(),
        name: name,
        email: email,
        medicalEvents: [], // Empty for new user
        reports: [],
        medicalHistory: "",
        allergies: [],
        medications: []
      };
      const session = { user: newUser, role, token: 'mock-jwt-new', isNewUser: true };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return session as AuthResponse;
    } else {
       // Simplified doctor signup
       const newDoctor: Doctor = {
         ...MOCK_DOCTOR,
         id: Date.now().toString(),
         name: `Dr. ${name}`
       };
       const session = { user: newDoctor, role, token: 'mock-jwt-doc-new', isNewUser: true };
       localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
       return session as AuthResponse;
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getSession: (): AuthResponse | null => {
    const sessionStr = localStorage.getItem(STORAGE_KEY);
    return sessionStr ? JSON.parse(sessionStr) : null;
  }
};
