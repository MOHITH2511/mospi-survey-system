import { useState } from "react";
import { Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

const surveyQuestions = [
  { id: 1, text: "What is the total number of members in your household?", type: "number" },
  { id: 2, text: "What is the primary source of drinking water for your household?", type: "choice", options: ["Tap water", "Hand pump", "Well", "River/Canal", "Other"] },
  { id: 3, text: "What is the highest educational qualification of the head of household?", type: "choice", options: ["No formal education", "Primary", "Secondary", "Graduate", "Post-graduate"] },
  { id: 4, text: "What is the main occupation of the principal earner?", type: "choice", options: ["Agriculture", "Salaried", "Self-employed", "Daily wage", "Not working"] },
  { id: 5, text: "What is the approximate monthly household income (in ₹)?", type: "number" },
];

const languages = ["English", "हिन्दी", "தமிழ்", "తెలుగు", "ಕನ್ನಡ"];

export default function SurveyPreview() {
  const [currentQ, setCurrentQ] = useState(0);
  const [lang, setLang] = useState(0);
  const q = surveyQuestions[currentQ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Survey Preview"
        description="Preview how your survey will appear to citizens"
      />

      <div className="flex justify-center py-4">
        {/* Phone frame */}
        <div className="w-full max-w-sm">
          {/* Language toggle */}
          <div className="mb-4 flex items-center justify-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <div className="flex rounded-lg border border-border bg-white p-0.5">
              {languages.map((l, i) => (
                <button
                  key={l}
                  onClick={() => setLang(i)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                    lang === i
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Phone mockup */}
          <div className="rounded-[2rem] border-[3px] border-slate-800 bg-white p-4 shadow-2xl">
            {/* Status bar */}
            <div className="mb-4 flex items-center justify-between px-2">
              <span className="text-[11px] font-medium text-foreground">9:41</span>
              <div className="h-6 w-20 rounded-full bg-slate-800" />
              <div className="flex gap-1">
                <div className="h-2.5 w-2.5 rounded-sm bg-slate-800" />
                <div className="h-2.5 w-2.5 rounded-sm bg-slate-800" />
              </div>
            </div>

            {/* Header */}
            <div className="mb-4 text-center">
              <p className="text-[11px] font-medium text-primary">National Survey Portal</p>
              <h3 className="text-sm font-bold text-foreground">Household Survey 2026</h3>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="h-1.5 w-full rounded-full bg-muted">
                <div
                  className="h-1.5 rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${((currentQ + 1) / surveyQuestions.length) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-center text-[10px] text-muted-foreground">
                Question {currentQ + 1} of {surveyQuestions.length}
              </p>
            </div>

            {/* Question card */}
            <div className="rounded-2xl bg-surface p-4">
              <p className="text-sm font-medium text-foreground leading-relaxed">
                {q.text}
              </p>

              {q.type === "number" ? (
                <input
                  className="mt-3 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  placeholder="Enter number..."
                  type="number"
                />
              ) : (
                <div className="mt-3 space-y-2">
                  {q.options?.map((opt) => (
                    <label
                      key={opt}
                      className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-primary-50/30"
                    >
                      <div className="h-4 w-4 rounded-full border-2 border-border" />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setCurrentQ((c) => Math.max(0, c - 1))}
                disabled={currentQ === 0}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-border bg-white py-2.5 text-sm font-medium text-muted-foreground disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
              <button
                onClick={() => setCurrentQ((c) => Math.min(surveyQuestions.length - 1, c + 1))}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
