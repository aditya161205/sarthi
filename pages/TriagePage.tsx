
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, AlertCircle, ChevronRight, Loader2, Image as ImageIcon, X, Volume2, VolumeX } from 'lucide-react';
import { Message, UserProfile, TriageResult } from '../types';
import { generateTriageResponse } from '../services/geminiService';
import VoiceInput from '../components/VoiceInput';
import { useLanguage } from '../contexts/LanguageContext';

interface TriagePageProps {
  user: UserProfile;
  onComplete: (specialty: string) => void;
}

const TriagePage: React.FC<TriagePageProps> = ({ user, onComplete }) => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      text: language === 'hi'
        ? `नमस्ते ${user.name.split(' ')[0]}। मैं वैद्य AI हूँ, आपकी निजी स्वास्थ्य सहायक। आज आप कैसा महसूस कर रहे हैं? आप लक्षण बता सकते हैं या फोटो डाल सकते हैं।`
        : `Namaste ${user.name.split(' ')[0]}. I'm Vaidya AI, your personal health assistant. How are you feeling today? You can describe symptoms or upload a photo of a skin condition or report.`,
      options: []
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [isConversationMode, setIsConversationMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, selectedImage]);

  // Reset chat if language changes to provide a fresh start in new language
  useEffect(() => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        text: language === 'hi'
          ? `नमस्ते ${user.name.split(' ')[0]}। मैं वैद्य AI हूँ। आज आप कैसा महसूस कर रहे हैं?`
          : `Namaste ${user.name.split(' ')[0]}. I'm Vaidya AI. How are you feeling today?`,
        options: []
      }
    ]);
  }, [language, user.name]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() && !selectedImage) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setSelectedImage(null);
    setIsTyping(true);

    // Call Gemini Service with current language
    const aiResponse = await generateTriageResponse([...messages, newUserMsg], user, language);

    setIsTyping(false);

    const newAiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: aiResponse.text,
      options: aiResponse.options || [],
      isFinal: aiResponse.isFinal,
      triageResult: aiResponse.triageResult
    };

    setMessages(prev => [...prev, newAiMsg]);

    if (aiResponse.isFinal && aiResponse.triageResult) {
      setResult(aiResponse.triageResult);
    }

    if (isConversationMode) {
      speak(aiResponse.text);
    }
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop previous

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

    // Select female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice =>
      voice.name.includes('Female') ||
      voice.name.includes('Zira') ||
      voice.name.includes('Samantha') ||
      voice.name.includes('Google UK English Female') ||
      (voice.lang.includes('en') && voice.name.toLowerCase().includes('female'))
    );

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    // Natural, calm settings
    utterance.rate = 0.85; // Slower for clarity
    utterance.pitch = 1.1; // Slightly higher for warmth
    utterance.volume = 0.9; // Softer

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950 relative transition-colors">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}>
              {msg.role === 'assistant' ? <Bot size={16} /> : <UserIcon size={16} />}
            </div>

            <div className={`max-w-[80%] space-y-2 ${msg.role === 'user' ? 'items-end flex flex-col' : ''}`}>

              {msg.image && (
                <div className="mb-2">
                  <img src={msg.image} alt="User upload" className="max-w-[200px] rounded-lg border border-gray-200 dark:border-gray-700" />
                </div>
              )}

              {msg.text && (
                <div className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'assistant'
                  ? 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-800'
                  : 'bg-blue-600 text-white rounded-tr-none'
                  }`}>
                  {msg.text}
                </div>
              )}

              {/* Suggestions / Options */}
              {msg.role === 'assistant' && msg.options && msg.options.length > 0 && !msg.isFinal && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {msg.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(opt)}
                      className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition active:scale-95"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
            </div>
            <span className="text-xs text-gray-400">{t('triage.analyzing')}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Triage Result Card (if final) */}
      {result && (
        <div className="absolute inset-x-4 bottom-24 z-10 animate-in slide-in-from-bottom-5 fade-in duration-500">
          <div className={`bg-white dark:bg-gray-900 rounded-2xl shadow-xl border-2 overflow-hidden ${result.level === 'Red' ? 'border-red-600' :
            result.level === 'Yellow' ? 'border-amber-400' : 'border-green-500'
            }`}>
            <div className={`p-3 font-bold flex items-center gap-2 ${result.level === 'Red' ? 'bg-red-50 text-red-700' :
              result.level === 'Yellow' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
              }`}>
              <AlertCircle size={20} />
              <span>Triage Level: {result.level}</span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800 dark:text-white mb-1">Recommended: {result.specialty}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{result.summary}</p>
              <button
                onClick={() => onComplete(result.specialty)}
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-100 transition"
              >
                {t('triage.find_specialist')} <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Overlay */}
      {selectedImage && (
        <div className="absolute bottom-20 left-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between z-20 animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3">
            <img src={selectedImage} alt="Preview" className="w-10 h-10 rounded object-cover" />
            <span className="text-xs text-gray-500 dark:text-gray-300">Image selected</span>
          </div>
          <button onClick={() => setSelectedImage(null)} className="p-1 bg-gray-100 dark:bg-gray-700 rounded-full"><X size={16} /></button>
        </div>
      )}

      {/* Floating Voice Conversation Mode Toggle */}
      <button
        onClick={() => setIsConversationMode(!isConversationMode)}
        className={`absolute top-4 right-4 z-30 p-3 rounded-full shadow-lg transition-all ${isConversationMode ? 'bg-blue-600 text-white animate-pulse' : 'bg-white dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
          }`}
        title={isConversationMode ? 'Voice Conversation Active' : 'Enable Voice Conversation'}
      >
        {isConversationMode ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3 pb-safe z-20">
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageSelect}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          >
            <ImageIcon size={24} />
          </button>

          <VoiceInput onTranscript={(text) => handleSendMessage(text)} isProcessing={isTyping || !!result} />

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            placeholder={result ? t('triage.complete') : t('triage.placeholder')}
            disabled={isTyping || !!result}
            className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-transparent rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50 transition-colors"
          />

          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={(!inputText.trim() && !selectedImage) || isTyping || !!result}
            className="bg-blue-600 text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
          >
            {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TriagePage;
