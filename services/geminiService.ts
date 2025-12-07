
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Message, UserProfile, PrescriptionData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const TRIAGE_MODEL_NAME = 'gemini-2.5-flash';

const triageSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    text: {
      type: Type.STRING,
      description: "The response text or question to ask the user.",
    },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 2-4 short suggested response buttons for the user (e.g., 'Yes', 'No', 'High Fever').",
    },
    isFinal: {
      type: Type.BOOLEAN,
      description: "Set to true only if you have gathered enough information to provide a preliminary triage recommendation.",
    },
    triageResult: {
      type: Type.OBJECT,
      nullable: true,
      description: "Required if isFinal is true.",
      properties: {
        level: {
          type: Type.STRING,
          enum: ["Green", "Yellow", "Red"],
          description: "Green: Non-urgent. Yellow: Urgent appointment needed. Red: Emergency room.",
        },
        specialty: {
          type: Type.STRING,
          description: "The recommended medical specialty (e.g., General Physician, Cardiologist, Dermatologist).",
        },
        summary: {
          type: Type.STRING,
          description: "A concise summary of the preliminary analysis for the doctor.",
        },
      },
      required: ["level", "specialty", "summary"],
    },
  },
  required: ["text", "isFinal"],
};

const prescriptionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    diagnosis: {
      type: Type.STRING,
      description: "The diagnosis extracted from the prescription or notes.",
    },
    medications: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of medications prescribed with dosage.",
    },
    followUp: {
      type: Type.STRING,
      description: "Recommended follow-up time (e.g., '1 week', '3 days').",
    },
  },
  required: ["diagnosis", "medications"],
};

export const generateTriageResponse = async (
  history: Message[],
  userProfile: UserProfile,
  language: 'en' | 'hi' = 'en'
): Promise<any> => {
  try {
    const timelineEvents = userProfile.medicalEvents
      .map(e => `- ${e.date}: ${e.title} (${e.description})`)
      .join('\n');

    const medNames = userProfile.medications.map(m => m.name).join(', ');
    const langInstruction = language === 'hi' 
      ? "IMPORTANT: You MUST respond in Hindi (Devanagari script). Use simple, empathetic Hindi suitable for an Indian patient." 
      : "Respond in English.";

    const systemPrompt = `
      You are "Vaidya AI", an intelligent and empathetic medical assistant tailored for the Indian healthcare context.
      Your goal is to assess the user's symptoms efficiently and recommend a triage level and specialist.
      ${langInstruction}
      
      User Profile:
      - Age: ${userProfile.age}
      - Allergies: ${userProfile.allergies.join(', ')}
      - Medications: ${medNames}
      
      Medical History Timeline:
      ${timelineEvents}
      
      Summary: ${userProfile.medicalHistory}

      Protocol:
      1. Ask 1-3 targeted follow-up questions to clarify symptoms. If the user uploads an image (e.g., rash, wound), analyze it.
      2. Provide "options" for quick replies (in ${language === 'hi' ? 'Hindi' : 'English'}).
      3. Once you have enough info, set "isFinal" to true.
      4. For critical issues (chest pain, heavy bleeding), set Triage Level "Red" immediately and advise calling 112 or 108.
      5. Use Indian terminology where appropriate.
      6. Be warm, professional, and concise.
    `;

    // Convert chat history to Gemini format
    const contents = history.map((msg) => {
      const parts: any[] = [{ text: msg.text }];
      
      if (msg.image) {
        // Strip the data URL prefix (e.g. "data:image/jpeg;base64,")
        const base64Data = msg.image.split(',')[1];
        if (base64Data) {
            parts.push({
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Data
                }
            });
        }
      }
      
      return {
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: parts,
      };
    });

    const response = await ai.models.generateContent({
      model: TRIAGE_MODEL_NAME,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: triageSchema,
      },
      contents: contents,
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Gemini Triage Error:", error);
    return {
      text: language === 'hi' 
        ? "मुझे नेटवर्क से कनेक्ट करने में समस्या हो रही है। कृपया अपना कनेक्शन जांचें।" 
        : "I'm having trouble connecting to the network. Please check your connection or try again.",
      options: [],
      isFinal: false
    };
  }
};

export const parsePrescription = async (imageBase64: string): Promise<PrescriptionData> => {
  try {
    const base64Data = imageBase64.split(',')[1];
    
    const response = await ai.models.generateContent({
      model: TRIAGE_MODEL_NAME,
      config: {
        systemInstruction: "You are an expert AI medical assistant. Your task is to transcribe handwritten or printed medical prescriptions into structured data. Extract the Diagnosis, Medications (with dosage), and any Follow-up advice.",
        responseMimeType: "application/json",
        responseSchema: prescriptionSchema,
      },
      contents: [
        {
          parts: [
            { text: "Analyze this prescription image and extract the details." },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data
              }
            }
          ]
        }
      ]
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    
    return JSON.parse(jsonText) as PrescriptionData;
  } catch (error) {
    console.error("Prescription OCR Error:", error);
    throw error;
  }
};

export const generateHealthSummary = async (userProfile: UserProfile, language: 'en' | 'hi' = 'en'): Promise<string> => {
  try {
     const timelineEvents = userProfile.medicalEvents.slice(0, 5)
      .map(e => `- ${e.date}: ${e.title} (${e.type})`)
      .join('\n');
      const medNames = userProfile.medications.map(m => m.name).join(', ');

    const prompt = `
      Analyze this patient profile and provide a brief, empathetic 3-4 sentence health summary in ${language === 'hi' ? 'Hindi' : 'English'}.
      
      Name: ${userProfile.name}, Age: ${userProfile.age}
      Conditions: ${userProfile.medicalHistory}
      Meds: ${medNames}
      Recent Events:
      ${timelineEvents}
      
      Output format: Plain text paragraph. Do not use markdown formatting.
    `;

    const response = await ai.models.generateContent({
      model: TRIAGE_MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    return response.text || "Health summary unavailable.";
  } catch (error) {
    console.error("Summary Gen Error", error);
    return "Could not generate summary at this time.";
  }
};

export const generateHealthTip = async (userProfile: UserProfile, language: 'en' | 'hi' = 'en'): Promise<string> => {
  try {
    const medNames = userProfile.medications.map(m => m.name).join(', ');
    const prompt = `
      Based on the following user profile, generate a single, short, personalized, and actionable health tip or habit for today in ${language === 'hi' ? 'Hindi' : 'English'}.
      Keep it under 30 words.
      
      Profile:
      - Age: ${userProfile.age}
      - Conditions: ${userProfile.medicalHistory}
      - Medications: ${medNames}
      - Allergies: ${userProfile.allergies.join(', ')}
    `;

    const response = await ai.models.generateContent({
      model: TRIAGE_MODEL_NAME,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    return response.text || "Drink plenty of water today!";
  } catch (error) {
    console.error("Health Tip Error", error);
    return "Take a 10-minute walk today to boost your energy.";
  }
};
