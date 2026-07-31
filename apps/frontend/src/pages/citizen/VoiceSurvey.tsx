import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "@/context/TranslationProvider";
import {
  Globe,
  WifiOff,
  Wifi,
  ShieldCheck,
  User
} from "lucide-react";
import VoiceSurveyEngine from "@/components/VoiceSurveyEngine";
import {
  generateHealthSurvey,
  generateAgricultureSurvey,
  generateConsumerExpenditureSurvey
} from "../admin/SurveyTemplates";

const languages = [
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { id: "ta", label: "தமிழ்", flag: "🇮🇳" },
  { id: "te", label: "తెలుగు", flag: "🇮🇳" },
  { id: "kn", label: "ಕನ್ನಡ", flag: "🇮🇳" },
];

type ViewState = "consent" | "prepopulation" | "survey";


export default function VoiceSurvey() {
  const navigate = useNavigate();
  const location = useLocation();
  const [view, setView] = useState<ViewState>("consent");
  const [consentChecked, setConsentChecked] = useState(false);
  const [lang, setLang] = useState("en");
  const [isOffline, setIsOffline] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [surveyTitle, setSurveyTitle] = useState("PLFS Q4 2025");
  const { currentLanguage, setLanguage } = useTranslation();

  // Sync internal lang state with global language context
  useEffect(() => {
    setLang(currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    const loadSurvey = async () => {
      const searchParams = new URLSearchParams(location.search);
      const surveyId = searchParams.get("id");

      if (surveyId) {
        try {
          const res = await fetch(`http://localhost:8080/api/surveys/${surveyId}`);
          if (res.ok) {
            const data = await res.json();
            setSurveyTitle(data.title);
            const schema = JSON.parse(data.schemaJson);
            const flatQuestions: any[] = [];
            let index = 1;
            
            const sections = Array.isArray(schema) ? schema : schema.sections;
            
            if (sections && Array.isArray(sections)) {
              sections.forEach((section: any) => {
                if (section.questions) {
                  section.questions.forEach((q: any) => {
                    flatQuestions.push({
                      id: index++,
                      text: q.label,
                      textHi: q.label,
                      type: q.type === "number" ? "number" : "voice"
                    });
                  });
                }
              });
            }
            if (flatQuestions.length > 0) {
              setQuestions(flatQuestions);
              return;
            }
          }
        } catch (e) {
          console.error("Failed to fetch survey from DB:", e);
        }
      }

      // Fallback: If no ID was provided (e.g. clicked "Take Voice Survey" in sidebar) or fetch failed, 
      // load the most recently published survey from the database.
      try {
        const fallbackRes = await fetch("http://localhost:8080/api/surveys");
        if (fallbackRes.ok) {
          const allSurveys = await fallbackRes.json();
          const publishedSurveys = allSurveys.filter((s: any) => s.status === "published");
          if (publishedSurveys.length > 0) {
            // Sort by createdAt descending to get the newest
            publishedSurveys.sort((a: any, b: any) => {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            const latest = publishedSurveys[0];
            setSurveyTitle(latest.title);
            
            const schema = JSON.parse(latest.schemaJson);
            const flatQuestions: any[] = [];
            let index = 1;
            
            const sections = Array.isArray(schema) ? schema : schema.sections;
            
            if (sections && Array.isArray(sections)) {
              sections.forEach((section: any) => {
                if (section.questions) {
                  section.questions.forEach((q: any) => {
                    flatQuestions.push({
                      id: index++,
                      text: q.label,
                      textHi: q.label,
                      type: q.type === "number" ? "number" : "voice"
                    });
                  });
                }
              });
            }
            if (flatQuestions.length > 0) {
              setQuestions(flatQuestions);
              return;
            }
          }
        }
      } catch (e) {
        console.error("Failed to fetch fallback surveys from DB:", e);
      }

    const defaultQuestions = [
      { id: 1, text: "What is the total number of members in your household?", textHi: "आपके परिवार में कुल कितने सदस्य हैं?", type: "number" },
      { id: 2, text: "What is the primary source of drinking water?", textHi: "पीने के पानी का मुख्य स्रोत क्या है?", type: "voice" },
      { id: 3, text: "What is the highest education level of the head of household?", textHi: "परिवार के मुखिया का उच्चतम शिक्षा स्तर क्या है?", type: "voice" },
      { id: 4, text: "What is the main occupation of the principal earner?", textHi: "मुख्य कमाने वाले का मुख्य व्यवसाय क्या है?", type: "voice" },
      { id: 5, text: "What is the approximate monthly household income?", textHi: "घर की अनुमानित मासिक आय कितनी है?", type: "number" },
      { id: 6, text: "Does your household own agricultural land?", textHi: "क्या आपके परिवार के पास कृषि भूमि है?", type: "voice" },
      { id: 7, text: "What type of dwelling does the household reside in?", textHi: "परिवार किस प्रकार के आवास में रहता है?", type: "voice" },
      { id: 8, text: "Is any member covered under a health insurance scheme?", textHi: "क्या कोई सदस्य स्वास्थ्य बीमा योजना के अंतर्गत आता है?", type: "voice" },
    ];
    setQuestions(defaultQuestions);
  };
  loadSurvey();
  }, [location.search]);

  return (
    <div className="mx-auto max-w-lg space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-primary">{surveyTitle}</p>
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
                    onClick={() => {
                      setLang(l.id);
                      setLanguage(l.id); // Also update global translator
                      setShowLangPicker(false);
                    }}
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

      {view === "survey" && questions.length > 0 && (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <VoiceSurveyEngine
            questions={questions}
            language={lang}
            isOffline={isOffline}
            onComplete={(answers) => {
              console.log("Survey completed with answers:", answers);
              
              // 1. Store locally in localStorage
              localStorage.setItem("mospi_voice_survey_answers", JSON.stringify(answers));
              
              // 2. Demonstration: Send/store responses to a backend REST API:
              /*
              fetch("http://localhost:8080/api/surveys/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  surveyCode: "PLFS_Q4_2025",
                  respondent: "Ramesh Kumar",
                  responses: answers,
                  submittedAt: new Date().toISOString()
                })
              })
              .then(res => res.json())
              .then(data => console.log("Backend response:", data))
              .catch(err => console.error("Backend error:", err));
              */
              
              navigate("/citizen/complete");
            }}
            onBackToConsent={() => setView("prepopulation")}
          />
        </div>
      )}
    </div>
  );
}
