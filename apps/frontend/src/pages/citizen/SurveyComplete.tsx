import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, Mic, ArrowLeft, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

export default function SurveyComplete() {
  const navigate = useNavigate();
  const [showCheck, setShowCheck] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [savedAnswers, setSavedAnswers] = useState<Record<number, { transcript: string; structured: string }>>({});

  const questions = [
    { id: 1, text: "What is the total number of members in your household?" },
    { id: 2, text: "What is the primary source of drinking water?" },
    { id: 3, text: "What is the highest education level of the head of household?" },
    { id: 4, text: "What is the main occupation of the principal earner?" },
    { id: 5, text: "What is the approximate monthly household income?" },
    { id: 6, text: "Does your household own agricultural land?" },
    { id: 7, text: "What type of dwelling does the household reside in?" },
    { id: 8, text: "Is any member covered under a health insurance scheme?" },
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setShowCheck(true), 300);
    const t2 = setTimeout(() => setShowConfetti(true), 600);
    
    // Read responses from localStorage
    const stored = localStorage.getItem("mospi_voice_survey_answers");
    if (stored) {
      try {
        setSavedAnswers(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse stored answers:", err);
      }
    }
    
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const [confettiStyles] = useState(() => {
    const confettiColors = ["#2563eb", "#7c3aed", "#10b981", "#f59e0b", "#ec4899", "#06b6d4"];
    return Array.from({ length: 24 }).map((_, i) => ({
      left: `${20 + Math.random() * 60}%`,
      top: `${Math.random() * 30}%`,
      width: `${4 + Math.random() * 6}px`,
      height: `${4 + Math.random() * 6}px`,
      borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      backgroundColor: confettiColors[i % confettiColors.length],
      animation: `confetti-fall ${1.5 + Math.random() * 1.5}s ease-out forwards`,
      animationDelay: `${Math.random() * 0.5}s`,
    }));
  });

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-8 py-12 text-center">
      {/* Success animation */}
      <div className="relative">
        {/* Confetti particles */}
        {showConfetti && (
          <div className="absolute -inset-16 pointer-events-none">
            {confettiStyles.map((style, i) => (
              <div
                key={i}
                className="absolute"
                style={style}
              />
            ))}
          </div>
        )}

        {/* Checkmark circle */}
        <div
          className={`flex h-24 w-24 items-center justify-center rounded-full transition-all duration-500 ${
            showCheck
              ? "bg-emerald-500 scale-100 opacity-100"
              : "bg-emerald-500/20 scale-50 opacity-0"
          }`}
        >
          <CheckCircle2
            className={`h-12 w-12 text-white transition-all duration-500 delay-200 ${
              showCheck ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          />
        </div>
      </div>

      {/* Thank you message */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Survey Completed!</h1>
        <p className="text-base text-muted-foreground">
          Thank you for your participation. Your responses have been securely recorded.
        </p>
        <p className="text-sm text-emerald-600 font-medium">
          धन्यवाद! आपकी प्रतिक्रियाएँ सुरक्षित रूप से दर्ज कर ली गई हैं।
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid w-full grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white border border-border p-4">
          <BarChart3 className="mx-auto mb-2 h-5 w-5 text-primary" />
          <p className="text-lg font-bold text-foreground">
            {Object.keys(savedAnswers).length || 8}
          </p>
          <p className="text-xs text-muted-foreground">Questions Answered</p>
        </div>
        <div className="rounded-2xl bg-white border border-border p-4">
          <Clock className="mx-auto mb-2 h-5 w-5 text-primary" />
          <p className="text-lg font-bold text-foreground">2:15</p>
          <p className="text-xs text-muted-foreground">Time Taken</p>
        </div>
        <div className="rounded-2xl bg-white border border-border p-4">
          <Mic className="mx-auto mb-2 h-5 w-5 text-primary" />
          <p className="text-lg font-bold text-foreground">
            {Object.keys(savedAnswers).length > 0 ? "100%" : "87%"}
          </p>
          <p className="text-xs text-muted-foreground">Voice Usage</p>
        </div>
      </div>

      {/* Dynamic Summary Review Table */}
      {Object.keys(savedAnswers).length > 0 && (
        <div className="w-full text-left bg-white border border-border rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-150 pb-2">
            Stored Response Breakdown (Local Storage)
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {questions.map((item) => {
              const ans = savedAnswers[item.id];
              if (!ans) return null;
              return (
                <div key={item.id} className="text-xs border-b border-gray-100 pb-2.5 last:border-b-0 last:pb-0">
                  <p className="font-bold text-gray-800 mb-1">
                    Q{item.id}: {item.text}
                  </p>
                  <div className="pl-3 border-l-2 border-primary-100 space-y-1">
                    <p className="text-gray-500 italic">
                      Spoken: "{ans.transcript}"
                    </p>
                    <p className="text-emerald-700 font-bold">
                      Extracted: {ans.structured}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("mospi_voice_survey_answers");
              setSavedAnswers({});
            }}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Clear Stored Data
          </button>
        </div>
      )}

      {/* Response ID */}
      <div className="w-full rounded-xl bg-muted/60 p-4">
        <p className="text-xs text-muted-foreground mb-1">Response ID</p>
        <p className="text-sm font-mono font-semibold text-foreground">
          SOS-PLFS-2026-0611-A7K9
        </p>
      </div>

      {/* Actions */}
      <div className="flex w-full gap-3">
        <button
          onClick={() => navigate("/citizen")}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-white py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
