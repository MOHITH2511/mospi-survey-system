import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mic,
  MicOff,
  Volume2,
  Globe,
  WifiOff,
  Wifi,
  ChevronRight,
  ChevronLeft,
  SkipForward,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  User,
  MapPin,
  Clock,
  Smartphone
} from "lucide-react";

/* ── Survey questions ── */
const questions = [
  { id: 1, text: "What is the total number of members in your household?", textHi: "आपके परिवार में कुल कितने सदस्य हैं?", type: "number" },
  { id: 2, text: "What is the primary source of drinking water?", textHi: "पीने के पानी का मुख्य स्रोत क्या है?", type: "voice" },
  { id: 3, text: "What is the highest education level of the head of household?", textHi: "परिवार के मुखिया का उच्चतम शिक्षा स्तर क्या है?", type: "voice" },
  { id: 4, text: "What is the main occupation of the principal earner?", textHi: "मुख्य कमाने वाले का मुख्य व्यवसाय क्या है?", type: "voice" },
  { id: 5, text: "What is the approximate monthly household income?", textHi: "घर की अनुमानित मासिक आय कितनी है?", type: "number" },
  { id: 6, text: "Does your household own agricultural land?", textHi: "क्या आपके परिवार के पास कृषि भूमि है?", type: "voice" },
  { id: 7, text: "What type of dwelling does the household reside in?", textHi: "परिवार किस प्रकार के आवास में रहता है?", type: "voice" },
  { id: 8, text: "Is any member covered under a health insurance scheme?", textHi: "क्या कोई सदस्य स्वास्थ्य बीमा योजना के अंतर्गत आता है?", type: "voice" },
];

const languages = [
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { id: "ta", label: "தமிழ்", flag: "🇮🇳" },
  { id: "te", label: "తెలుగు", flag: "🇮🇳" },
  { id: "kn", label: "ಕನ್ನಡ", flag: "🇮🇳" },
];

type ViewState = "consent" | "prepopulation" | "survey";
type VoiceState = "idle" | "listening" | "processing" | "confirmed";

const mockTranscriptions: Record<number, string> = {
  1: "Five members",
  2: "We have a hand pump in our courtyard, that is our main source of drinking water",
  3: "My father studied till 10th standard, he is the head of our family",
  4: "He works as a daily wage labourer in the construction site nearby",
  5: "Around fifteen thousand rupees per month",
  6: "Yes, we have two acres of land where we grow rice",
  7: "We live in a pucca house made of bricks and cement",
  8: "Yes, my father has Ayushman Bharat card",
};

const mockStructured: Record<number, string> = {
  1: "5",
  2: "Hand pump",
  3: "Secondary (10th)",
  4: "Daily wage — Construction",
  5: "₹15,000",
  6: "Yes — 2 acres, Rice cultivation",
  7: "Pucca (Brick & Cement)",
  8: "Yes — Ayushman Bharat (PMJAY)",
};

export default function VoiceSurvey() {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewState>("consent");
  const [consentChecked, setConsentChecked] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [lang, setLang] = useState("en");
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [isOffline, setIsOffline] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [answered, setAnswered] = useState<Set<number>>(new Set());

  const q = questions[currentQ];
  const progress = ((answered.size) / questions.length) * 100;
  const questionText = lang === "hi" ? q.textHi : q.text;

  const [waveformStyles] = useState(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      height: `${8 + Math.random() * 20}px`,
      animation: `waveform ${0.4 + Math.random() * 0.4}s ease-in-out infinite`,
      animationDelay: `${i * 50}ms`,
    }));
  }, []);

  /* ── Simulate voice recording ── */
  const startListening = () => {
    setVoiceState("listening");
    setTimeout(() => {
      setVoiceState("processing");
      setTimeout(() => {
        setVoiceState("confirmed");
        setAnswered((prev) => new Set(prev).add(q.id));
      }, 1500);
    }, 2500);
  };

  const stopListening = () => {
    if (voiceState === "listening") {
      setVoiceState("processing");
      setTimeout(() => {
        setVoiceState("confirmed");
        setAnswered((prev) => new Set(prev).add(q.id));
      }, 1200);
    }
  };

  const goNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setVoiceState("idle");
    } else {
      navigate("/citizen/complete");
    }
  };

  const goPrev = () => {
    if (currentQ > 0) {
      setCurrentQ((c) => c - 1);
      setVoiceState(answered.has(questions[currentQ - 1].id) ? "confirmed" : "idle");
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-primary">PLFS Q4 2025</p>
          <p className="text-lg font-bold text-foreground">Voice Survey</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Offline toggle */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              isOffline
                ? "bg-amber-50 text-amber-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {isOffline ? <WifiOff className="h-3.5 w-3.5" /> : <Wifi className="h-3.5 w-3.5" />}
            {isOffline ? "Offline" : "Online"}
          </button>

          {/* Language */}
          <div className="relative">
            <button
              onClick={() => setShowLangPicker(!showLangPicker)}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
              {languages.find((l) => l.id === lang)?.label}
            </button>
            {showLangPicker && (
              <div className="absolute right-0 top-full mt-1 z-50 w-36 rounded-xl border border-border bg-white p-1 shadow-lg">
                {languages.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => { setLang(l.id); setShowLangPicker(false); }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      lang === l.id ? "bg-primary-50 text-primary font-medium" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{l.flag}</span>
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {view === "consent" && (
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-6 mt-4">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-[#1e3a8a]" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Data Privacy & Consent</h2>
            <p className="text-sm text-muted-foreground">
              Ministry of Statistics and Programme Implementation (MoSPI)
            </p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl text-xs text-gray-600 leading-relaxed space-y-2 border border-gray-100 h-48 overflow-y-auto">
            <p><strong>1. Purpose of Data Collection:</strong> The information collected will be used exclusively for official statistical purposes under the Collection of Statistics Act, 2008.</p>
            <p><strong>2. Confidentiality:</strong> Your identity and individual responses will be kept strictly confidential and will not be shared with any third-party private entity.</p>
            <p><strong>3. Paradata Tracking:</strong> To ensure survey quality, this app captures anonymous paradata including timestamp, device type, and GPS location during the interview.</p>
            <p><strong>4. Voluntary Participation:</strong> Your participation is completely voluntary. You may choose to skip any question or terminate the survey at any time.</p>
          </div>

          <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <input 
              type="checkbox" 
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]" 
            />
            <span className="text-sm font-medium text-gray-700">
              I have read the terms and explicitly consent to provide my data and allow background quality tracking.
            </span>
          </label>

          <button
            onClick={() => setView("prepopulation")}
            disabled={!consentChecked}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1e3a8a] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#1e3a8a]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Agree & Continue
          </button>
        </div>
      )}

      {view === "prepopulation" && (
        <div className="rounded-2xl border border-border bg-white p-6 shadow-sm space-y-6 mt-4">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
              <User className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Verified Pre-populated Data</h2>
            <p className="text-sm text-muted-foreground text-balance">
              We securely fetched your existing records via Aadhaar Linkage to save your time.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between p-3 border border-gray-100 bg-slate-50 rounded-lg">
              <span className="text-xs font-semibold text-gray-500 uppercase">Full Name</span>
              <span className="text-sm font-bold text-gray-900">Ramesh Kumar</span>
            </div>
            <div className="flex justify-between p-3 border border-gray-100 bg-slate-50 rounded-lg">
              <span className="text-xs font-semibold text-gray-500 uppercase">Age</span>
              <span className="text-sm font-bold text-gray-900">42 Years</span>
            </div>
            <div className="flex justify-between p-3 border border-gray-100 bg-slate-50 rounded-lg">
              <span className="text-xs font-semibold text-gray-500 uppercase">Location</span>
              <span className="text-sm font-bold text-gray-900">Bengaluru Urban, KA</span>
            </div>
            <div className="flex justify-between p-3 border border-gray-100 bg-slate-50 rounded-lg">
              <span className="text-xs font-semibold text-gray-500 uppercase">House Type</span>
              <span className="text-sm font-bold text-gray-900">Pucca</span>
            </div>
          </div>

          <p className="text-xs text-center text-emerald-700 bg-emerald-50 p-2 rounded-lg font-medium border border-emerald-100">
            ✓ This eliminates 4 demographic questions from your survey.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setView("survey")}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50"
            >
              Edit Data
            </button>
            <button
              onClick={() => setView("survey")}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#10b981] py-3 text-sm font-bold text-white transition-all hover:bg-[#059669]"
            >
              Confirm Details
            </button>
          </div>
        </div>
      )}

      {view === "survey" && (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          {/* Paradata Badges */}
          <div className="flex items-center justify-center gap-4 bg-slate-50 rounded-lg py-2 px-3 border border-slate-200">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider" title="Paradata Capture Active">
              <MapPin className="h-3.5 w-3.5 text-emerald-500" /> GPS Tagged
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <Clock className="h-3.5 w-3.5 text-blue-500" /> Timing tracked
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <Smartphone className="h-3.5 w-3.5 text-purple-500" /> Mobile Web
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Question {currentQ + 1} of {questions.length}
              </span>
              <span className="text-xs font-semibold text-primary">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

      {/* ══ Question Card ══ */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        {/* Listen button */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Q{currentQ + 1}
          </span>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary-100 transition-colors">
            <Volume2 className="h-3.5 w-3.5" />
            Listen
          </button>
        </div>

        {/* Question text */}
        <p className="text-lg font-semibold text-foreground leading-relaxed mb-6">
          {questionText}
        </p>

        {/* ── Voice Interaction Area ── */}
        <div className="flex flex-col items-center gap-4">
          {/* Microphone button with pulse rings */}
          <div className="relative">
            {voiceState === "listening" && (
              <>
                <div className="absolute inset-0 rounded-full bg-red-400/20 animate-voice-pulse" />
                <div className="absolute inset-0 rounded-full bg-red-400/10 animate-voice-pulse animation-delay-300" />
              </>
            )}
            <button
              onClick={voiceState === "listening" ? stopListening : startListening}
              disabled={voiceState === "processing"}
              className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-all active:scale-95 ${
                voiceState === "listening"
                  ? "bg-red-500 text-white scale-110"
                  : voiceState === "processing"
                    ? "bg-primary/80 text-white cursor-wait"
                    : voiceState === "confirmed"
                      ? "bg-emerald-500 text-white"
                      : "bg-primary text-white hover:bg-primary-700 hover:scale-105"
              }`}
            >
              {voiceState === "processing" ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : voiceState === "confirmed" ? (
                <CheckCircle2 className="h-8 w-8" />
              ) : voiceState === "listening" ? (
                <MicOff className="h-8 w-8" />
              ) : (
                <Mic className="h-8 w-8" />
              )}
            </button>
          </div>

          {/* State label */}
          <p className={`text-sm font-medium ${
            voiceState === "listening"
              ? "text-red-500"
              : voiceState === "processing"
                ? "text-primary"
                : voiceState === "confirmed"
                  ? "text-emerald-600"
                  : "text-muted-foreground"
          }`}>
            {voiceState === "idle" && "Tap to speak your answer"}
            {voiceState === "listening" && "Listening... Tap to stop"}
            {voiceState === "processing" && "AI is processing your response..."}
            {voiceState === "confirmed" && "Answer recorded ✓"}
          </p>

          {/* Waveform (when listening) */}
          {voiceState === "listening" && (
            <div className="flex items-center gap-1 h-8">
              {waveformStyles.map((style, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-red-400"
                  style={style}
                />
              ))}
            </div>
          )}

          {/* Transcription display */}
          {(voiceState === "processing" || voiceState === "confirmed") && (
            <div className="w-full space-y-2">
              <div className="rounded-xl bg-muted/60 p-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">🎤 Your voice response:</p>
                <p className="text-sm text-foreground italic">
                  "{mockTranscriptions[q.id] || "Processing..."}"
                </p>
              </div>
              {voiceState === "confirmed" && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
                  <p className="text-xs font-medium text-emerald-700 mb-1">✨ AI Structured Data:</p>
                  <p className="text-sm font-semibold text-emerald-800">
                    {mockStructured[q.id]}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Navigation ── */}
      <div className="flex items-center gap-2">
        <button
          onClick={goPrev}
          disabled={currentQ === 0}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-white py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <button
          onClick={() => { goNext(); }}
          className="flex items-center justify-center rounded-xl border border-border bg-white px-3 py-3 text-sm text-muted-foreground hover:bg-muted transition-colors"
          title="Skip"
        >
          <SkipForward className="h-4 w-4" />
        </button>

        <button
          onClick={goNext}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-all hover:bg-primary-700 active:scale-[0.98]"
        >
          {currentQ === questions.length - 1 ? "Submit" : "Next"}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      </div>
      )}
    </div>
  );
}
