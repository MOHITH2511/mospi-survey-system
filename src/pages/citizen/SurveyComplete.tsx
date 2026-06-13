import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, Mic, ArrowLeft, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

export default function SurveyComplete() {
  const navigate = useNavigate();
  const [showCheck, setShowCheck] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowCheck(true), 300);
    const t2 = setTimeout(() => setShowConfetti(true), 600);
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
  }, []);

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
          <p className="text-lg font-bold text-foreground">8</p>
          <p className="text-xs text-muted-foreground">Questions Answered</p>
        </div>
        <div className="rounded-2xl bg-white border border-border p-4">
          <Clock className="mx-auto mb-2 h-5 w-5 text-primary" />
          <p className="text-lg font-bold text-foreground">3:42</p>
          <p className="text-xs text-muted-foreground">Time Taken</p>
        </div>
        <div className="rounded-2xl bg-white border border-border p-4">
          <Mic className="mx-auto mb-2 h-5 w-5 text-primary" />
          <p className="text-lg font-bold text-foreground">87%</p>
          <p className="text-xs text-muted-foreground">Voice Usage</p>
        </div>
      </div>

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
