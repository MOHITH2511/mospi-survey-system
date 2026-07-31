import { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  SkipForward,
  CheckCircle2,
  Loader2,
  Edit3,
  Check
} from "lucide-react";
import { useTranslation } from "@/context/TranslationProvider";

// Web Speech API Types
type VoiceState = "idle" | "listening" | "processing" | "confirmed";

interface Question {
  id: number;
  text: string;
  textHi: string;
  type: string;
}

interface VoiceSurveyEngineProps {
  questions: Question[];
  language: string; // "en" | "hi" | etc.
  isOffline: boolean;
  onComplete: (answers: Record<number, { transcript: string; structured: string }>) => void;
  onBackToConsent: () => void;
}

// Removed Mock Responses - We now use pure real recorded data from the user

// Helper function to map app language to BCP-47 code for Web Speech API
const getBcp47Lang = (code: string): string => {
  const map: Record<string, string> = {
    hi: "hi-IN",
    bn: "bn-IN",
    te: "te-IN",
    mr: "mr-IN",
    ta: "ta-IN",
    ur: "ur-IN",
    gu: "gu-IN",
    kn: "kn-IN",
    ml: "ml-IN",
    pa: "pa-IN",
    en: "en-IN"
  };
  return map[code] || "en-IN";
};

const parseNumberFromText = (text: string): string | null => {
  if (!text) return null;
  
  // 1. Check for standard digits (e.g. "8", "25")
  const matchedDigits = text.match(/\d+/);
  if (matchedDigits) {
    return matchedDigits[0];
  }

  // 2. Map of number words in English and Hindi to digits
  const numberWordsMap: Record<string, string> = {
    one: "1", two: "2", three: "3", four: "4", five: "5",
    six: "6", seven: "7", eight: "8", nine: "9", ten: "10",
    eleven: "11", twelve: "12", thirteen: "13", fourteen: "14", fifteen: "15",
    sixteen: "16", seventeen: "17", eighteen: "18", nineteen: "19", twenty: "20",
    single: "1", double: "2", triple: "3",
    ek: "1", do: "2", teen: "3", chaar: "4", paanch: "5",
    chah: "6", saat: "7", aath: "8", nau: "9", das: "10",
    gyarah: "11", barah: "12", terah: "13", chaudah: "14", pandrah: "15",
    "एक": "1", "दो": "2", "तीन": "3", "चार": "4", "पांच": "5",
    "छह": "6", "सात": "7", "आठ": "8", "नौ": "9", "दस": "10",
    "ஒன்று": "1", "இரண்டு": "2", "மூன்று": "3", "நான்கு": "4", "ஐந்து": "5",
    "ஆறு": "6", "ஏழு": "7", "எட்டு": "8", "ஒன்பது": "9", "பத்து": "10",
    "ఒకటి": "1", "రెండు": "2", "మూడు": "3", "నాలుగు": "4", "ఐదు": "5",
    "ఆరు": "6", "ఏడు": "7", "ఎనిమిది": "8", "తొమ్మిది": "9", "పది": "10"
  };

  // Clean and split text into words
  const cleanText = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  const words = cleanText.split(/\s+/);
  for (const word of words) {
    if (numberWordsMap[word]) {
      return numberWordsMap[word];
    }
  }

  return null;
};

export default function VoiceSurveyEngine({
  questions,
  language,
  isOffline,
  onComplete,
  onBackToConsent,
}: VoiceSurveyEngineProps) {
  const { t } = useTranslation();
  const [currentQ, setCurrentQ] = useState(0);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [structuredText, setStructuredText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [manualInput, setManualInput] = useState("");

  // Paradata Capture
  const [surveyStartTime] = useState(Date.now());
  const [locationData, setLocationData] = useState<any>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocationData({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => setLocationData({ error: err.message }),
        { timeout: 10000 }
      );
    }
  }, []);

  const [isTtsSpeaking, setIsTtsSpeaking] = useState(false);
  const [autoRead, setAutoRead] = useState(false);
  
  // Storage for all completed answers (initialized from localStorage)
  const [answers, setAnswers] = useState<Record<number, { transcript: string; structured: string }>>(() => {
    const surveyIdMatch = window.location.search.match(/id=(\d+)/);
    const surveyId = surveyIdMatch ? surveyIdMatch[1] : "default";
    const stored = localStorage.getItem(`mospi_voice_survey_answers_${surveyId}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (err) {
        return {};
      }
    }
    return {};
  });

  // Web Speech API references
  const recognitionRef = useRef<any>(null);
  const speechTimeoutRef = useRef<any>(null);

  const q = questions[currentQ];
  const questionText = language === "hi" ? q.textHi : q.text;
  const progress = (Object.keys(answers).length / questions.length) * 100;

  // Refs to prevent stale closure issues in SpeechRecognition events
  const transcriptRef = useRef(transcript);
  const qRef = useRef(q);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    qRef.current = q;
  }, [q]);

  // Sync answers to localStorage on change so progress is immediately saved
  useEffect(() => {
    const surveyIdMatch = window.location.search.match(/id=(\d+)/);
    const surveyId = surveyIdMatch ? surveyIdMatch[1] : "default";
    localStorage.setItem(`mospi_voice_survey_answers_${surveyId}`, JSON.stringify(answers));
  }, [answers]);

  // Waveform heights for animated equalizer
  const [waveformStyles] = useState(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      height: `${8 + Math.random() * 24}px`,
      animation: `waveform ${0.3 + Math.random() * 0.4}s ease-in-out infinite`,
      animationDelay: `${i * 40}ms`,
    }));
  });

  // Check Speech Recognition Support
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const isSpeechSupported = !!SpeechRecognition;

  // ── Initial Setup & Speech Synthesis Voices Load ──
  useEffect(() => {
    if (isSpeechSupported) {
      const rec = new SpeechRecognition();
      rec.continuous = false; // Stop when the user stops speaking
      rec.interimResults = true; // Show interim results
      
      rec.onstart = () => {
        setVoiceState("listening");
      };

      rec.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        transcriptRef.current = currentTranscript;
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          stopSpeechRecognition();
          handleSimulationFallback();
        }
      };

      rec.onend = () => {
        // Automatically transition to processing if we captured a transcript
        setVoiceState((state) => {
          if (state === "listening") {
            processTranscript();
            return "processing";
          }
          return state;
        });
      };

      recognitionRef.current = rec;
    }

    // Load speech synthesis voices
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }

    return () => {
      stopSpeechRecognition();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ── Auto-Read Question on transition ──
  useEffect(() => {
    // Stop any ongoing TTS speaking
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsTtsSpeaking(false);
    }

    if (autoRead) {
      // Delay slightly to allow translation API to finish resolving
      const timer = setTimeout(() => {
        handleReadAloud();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [currentQ, language]);

  // Load existing answer if returning to an already completed question
  useEffect(() => {
    const existing = answers[q.id];
    if (existing) {
      setTranscript(existing.transcript);
      setStructuredText(existing.structured);
      setVoiceState("confirmed");
    } else {
      setTranscript("");
      setStructuredText("");
      setVoiceState("idle");
    }
    setIsEditing(false);
  }, [currentQ]);

  // ── Speech Synthesis (TTS) ──
  const handleReadAloud = () => {
    if (!window.speechSynthesis) return;

    if (isTtsSpeaking) {
      window.speechSynthesis.cancel();
      setIsTtsSpeaking(false);
      return;
    }

    // Cancel other speech
    window.speechSynthesis.cancel();

    // Try to get the cached translation directly first, fallback to DOM if needed
    const translatedFromDict = t(questionText);
    const renderedElement = document.getElementById("tts-question-text");
    const textToSpeak = (translatedFromDict !== questionText) 
      ? translatedFromDict 
      : (renderedElement ? renderedElement.innerText : questionText);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    // Use the internal language state over global DOM language
    const currentAppLang = language || document.documentElement.lang;
    const bcp47 = getBcp47Lang(currentAppLang);
    utterance.lang = bcp47;

    // Attempt to locate a matching browser voice
    const voices = window.speechSynthesis.getVoices();
    let matchedVoice = voices.find((v) => v.lang.startsWith(bcp47) || v.lang.startsWith(bcp47.split('-')[0]));
    
    if (!matchedVoice && bcp47 === "en-IN") {
      matchedVoice = voices.find((v) => v.lang.includes("IN") && v.lang.startsWith("en")) || voices.find((v) => v.lang.startsWith("en"));
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => setIsTtsSpeaking(true);
    utterance.onend = () => setIsTtsSpeaking(false);
    utterance.onerror = () => setIsTtsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // ── Speech Recognition Controls ──
  const startSpeechRecognition = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsTtsSpeaking(false);
    }

    setTranscript("");
    setStructuredText("");
    setIsEditing(false);

    if (isSpeechSupported && !isOffline) {
      try {
        const recognition = recognitionRef.current;
        const currentAppLang = language || document.documentElement.lang;
        recognition.lang = getBcp47Lang(currentAppLang);
        recognition.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
        handleSimulationFallback();
      }
    } else {
      // Simulate speech input for environments without API or when offline
      handleSimulationFallback();
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current && voiceState === "listening") {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error("Error stopping recognition:", err);
      }
    }
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
  };

  // ── Simulation Fallback ──
  const handleSimulationFallback = () => {
    setVoiceState("listening");
    
    // Without speech API, wait for user to type manually
    speechTimeoutRef.current = setTimeout(() => {
      setVoiceState("idle");
      // Don't inject dummy data; user must type their answer manually.
    }, 3000);
  };

  // ── AI Structuring Simulation ──
  const processTranscript = () => {
    setVoiceState("processing");
    
    // Simulate AI parsing text into a structured response
    setTimeout(() => {
      const activeQ = qRef.current;
      const finalRaw = transcriptRef.current.trim() || "";
      
      if (!finalRaw) {
        setVoiceState("idle");
        return;
      }
      
      // Basic heuristic for structuring text
      let structVal = finalRaw;
      if (activeQ.type === "number") {
        const parsed = parseNumberFromText(finalRaw);
        structVal = parsed !== null ? parsed : finalRaw;
      }
      
      setTranscript(finalRaw);
      setStructuredText(structVal);
      setVoiceState("confirmed");

      setAnswers((prev) => ({
        ...prev,
        [activeQ.id]: { transcript: finalRaw, structured: structVal },
      }));
    }, 1200);
  };

  // ── Saving Edited Transcript ──
  const handleSaveEdit = () => {
    setIsEditing(false);
    
    // Re-simulate structuring based on new manual text
    setVoiceState("processing");
    setTimeout(() => {
      const activeQ = qRef.current;
      let structVal = transcript.trim();
      if (activeQ.type === "number") {
        const parsed = parseNumberFromText(transcript);
        structVal = parsed !== null ? parsed : structuredText;
      } else if (transcript.toLowerCase().includes("no")) {
        structVal = "No";
      } else if (transcript.toLowerCase().includes("yes")) {
        structVal = "Yes";
      }
      
      setStructuredText(structVal);
      setVoiceState("confirmed");
      setAnswers((prev) => ({
        ...prev,
        [activeQ.id]: { transcript: transcript, structured: structVal },
      }));
    }, 800);
  };

  // ── Navigation ──
  const goNext = () => {
    // Auto-save any pending text
    const finalRaw = transcriptRef.current.trim();
    if (finalRaw && voiceState !== "confirmed") {
      let structVal = finalRaw;
      if (qRef.current.type === "number") {
        const parsed = parseNumberFromText(finalRaw);
        structVal = parsed !== null ? parsed : finalRaw;
      }
      setAnswers((prev) => ({
        ...prev,
        [qRef.current.id]: { transcript: finalRaw, structured: structVal },
      }));
    }

    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
    } else {
      // Completed! Trigger callback with paradata
      const paradata = {
        timeTakenSeconds: Math.round((Date.now() - surveyStartTime) / 1000),
        location: locationData,
        userAgent: navigator.userAgent
      };
      
      const surveyIdMatch = window.location.search.match(/id=(\d+)/);
      const surveyId = surveyIdMatch ? surveyIdMatch[1] : "default";
      localStorage.removeItem(`mospi_voice_survey_answers_${surveyId}`);
      
      onComplete({ answers, paradata });
    }
  };

  const goPrev = () => {
    if (currentQ > 0) {
      setCurrentQ((c) => c - 1);
    } else {
      onBackToConsent();
    }
  };

  const skipQuestion = () => {
    // Save as skipped
    setAnswers((prev) => ({
      ...prev,
      [q.id]: { transcript: `[${t("Skipped")}]`, structured: t("Skipped") },
    }));
    goNext();
  };

  return (
    <div className="space-y-6">
      {/* ── Status & Info Header ── */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {isOffline ? (
              <span className="h-2 w-2 rounded-full bg-amber-500" />
            ) : isSpeechSupported ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </>
            ) : (
              <span className="h-2 w-2 rounded-full bg-amber-500" />
            )}
          </span>
          <span className="text-xs font-semibold text-slate-600">
            {isOffline
              ? "Offline Mode: Simulated AI"
              : isSpeechSupported
              ? "Real-time Voice Active"
              : "Speech Recognition Unavailable (Simulated)"}
          </span>
        </div>

        {/* Auto-read settings */}
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-500 select-none">
          <input
            type="checkbox"
            checked={autoRead}
            onChange={(e) => setAutoRead(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary h-3.5 w-3.5"
          />
          Auto-read questions
        </label>
      </div>

      {/* ── Progress bar ── */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
          <span>
            Question {currentQ + 1} of {questions.length}
          </span>
          <span className="text-primary font-bold">{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-slate-150 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-600 to-primary-800 transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Main Question Card ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md transition-all duration-300 relative overflow-hidden">
        {/* Question Header */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-450 bg-slate-100 px-2 py-0.5 rounded-md">
            Question {q.id}
          </span>
          <button
            onClick={handleReadAloud}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all duration-200 ${
              isTtsSpeaking
                ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 animate-pulse"
                : "bg-primary-50 text-primary border-primary-100 hover:bg-primary-100"
            }`}
          >
            {isTtsSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {isTtsSpeaking ? "Stop" : "Listen Aloud"}
          </button>
        </div>

        {/* Question Text */}
        <p id="tts-question-text" className="text-lg md:text-xl font-bold text-slate-800 leading-snug mb-6 text-balance">
          {questionText}
        </p>

        {/* ── Voice Capture Area ── */}
        <div className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-150 bg-slate-25 rounded-2xl mb-6">
          <div className="relative mb-4">
            {voiceState === "listening" && (
              <>
                <div className="absolute inset-0 rounded-full bg-red-400/20 animate-voice-pulse" />
                <div className="absolute inset-0 rounded-full bg-red-400/10 animate-voice-pulse animation-delay-300" />
              </>
            )}
            <button
              onClick={voiceState === "listening" ? stopSpeechRecognition : startSpeechRecognition}
              disabled={voiceState === "processing"}
              className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-full shadow-lg transition-all active:scale-95 duration-350 cursor-pointer ${
                voiceState === "listening"
                  ? "bg-red-500 text-white scale-110"
                  : voiceState === "processing"
                  ? "bg-primary-600 text-white cursor-wait"
                  : voiceState === "confirmed"
                  ? "bg-emerald-600 text-white border-2 border-emerald-100 hover:bg-emerald-500"
                  : "bg-primary hover:bg-primary-700 text-white hover:scale-105"
              }`}
            >
              {voiceState === "processing" ? (
                <Loader2 className="h-10 w-10 animate-spin" />
              ) : voiceState === "confirmed" ? (
                <CheckCircle2 className="h-10 w-10" />
              ) : voiceState === "listening" ? (
                <MicOff className="h-10 w-10" />
              ) : (
                <Mic className="h-10 w-10" />
              )}
            </button>
          </div>

          {/* Mic Status Indicator Text */}
          <span
            className={`text-xs font-bold uppercase tracking-widest ${
              voiceState === "listening"
                ? "text-red-500 animate-pulse"
                : voiceState === "processing"
                ? "text-primary"
                : voiceState === "confirmed"
                ? "text-emerald-600"
                : "text-slate-500"
            }`}
          >
            {voiceState === "idle" && "Tap Mic to Answer"}
            {voiceState === "listening" && "Recording Active..."}
            {voiceState === "processing" && "Processing Audio..."}
            {voiceState === "confirmed" && "Recorded & Saved"}
          </span>

          {/* Always Visible Text Input Field */}
          <div className="mt-6 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                YOUR ANSWER
              </span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>
            
            <div className="space-y-2">
              <textarea
                value={transcript}
                onChange={(e) => {
                  setTranscript(e.target.value);
                  transcriptRef.current = e.target.value;
                }}
                disabled={voiceState === "listening" || voiceState === "processing"}
                className="w-full text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none disabled:opacity-50 transition-shadow resize-none shadow-sm"
                rows={3}
                placeholder="Type your response here or tap the mic to speak..."
              />
              <div className="flex justify-end">
                <button
                  onClick={processTranscript}
                  disabled={!transcript.trim() || voiceState === "processing" || voiceState === "listening"}
                  className="px-5 py-2.5 text-sm font-bold bg-primary text-white rounded-xl hover:bg-primary-700 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Check className="h-4 w-4" /> Save Answer
                </button>
              </div>
            </div>
          </div>

          {/* Equalizer Visualizer */}
          {voiceState === "listening" && (
            <div className="flex items-center justify-center gap-1 h-9 mt-4 w-full px-8">
              {waveformStyles.map((style, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-red-400"
                  style={style}
                />
              ))}
            </div>
          )}

          {/* Real-time speech result text display */}
          {voiceState === "listening" && transcript && (
            <div className="mt-4 w-full bg-white/80 border border-slate-100 rounded-xl p-3 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                Live Transcription
              </span>
              <p className="text-sm font-semibold text-slate-700 italic">
                "{transcript}"
              </p>
            </div>
          )}
        </div>

        {/* ── AI Structured Data Output ── */}
        {(voiceState === "confirmed" || isEditing) && (
          <div className="space-y-4 animate-fade-in-up duration-300">

            {/* AI Structured Data Output */}
            {!isEditing && structuredText && (
              <div className="border border-emerald-200 bg-emerald-25 rounded-xl p-4 flex items-start gap-3">
                <div className="p-1 bg-emerald-100 text-emerald-800 rounded-lg mt-0.5">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">
                    AI Extracted Value
                  </span>
                  <p className="text-base font-bold text-emerald-900 leading-none">
                    {structuredText}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Navigation Bottom Bar ── */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={goPrev}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-650 hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <button
          onClick={skipQuestion}
          className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
          title="Skip question"
        >
          <SkipForward className="h-4 w-4" />
        </button>

        <button
          onClick={goNext}
          disabled={voiceState !== "confirmed"}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-bold text-white transition-all active:scale-[0.98] cursor-pointer ${
            voiceState === "confirmed"
              ? "bg-primary hover:bg-primary-750"
              : "bg-slate-300 cursor-not-allowed opacity-70"
          }`}
        >
          {currentQ === questions.length - 1 ? "Submit Survey" : "Next Question"}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
