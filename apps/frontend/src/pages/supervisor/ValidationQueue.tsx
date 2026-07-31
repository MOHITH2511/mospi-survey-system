import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, Mic, Clock } from "lucide-react";

const queue = [
  { id: "VAL-001", survey: "PLFS Q4 2025", respondent: "R-44821", district: "Varanasi, UP", submittedOn: "Jun 10, 2026", voiceUsed: true, duration: "4:12", questions: 24, flagged: 1, answer: "I have 6 family members living in our house. My father, mother, myself, my wife, and two children." },
  { id: "VAL-002", survey: "Census Pre-listing 2026", respondent: "R-31209", district: "Madurai, TN", submittedOn: "Jun 10, 2026", voiceUsed: true, duration: "3:45", questions: 15, flagged: 0, answer: "எங்கள் குடும்பத்தில் நான்கு பேர் உள்ளனர். நான், என் மனைவி மற்றும் இரண்டு குழந்தைகள்." },
  { id: "VAL-003", survey: "Health Survey NHS-6", respondent: "R-55102", district: "Pune, MH", submittedOn: "Jun 9, 2026", voiceUsed: false, duration: "5:30", questions: 28, flagged: 2, answer: "We are 5 members. Both my parents are senior citizens. My mother has diabetes and needs regular check-ups." },
  { id: "VAL-004", survey: "Agricultural Census", respondent: "R-67221", district: "Belgaum, KA", submittedOn: "Jun 9, 2026", voiceUsed: true, duration: "3:18", questions: 12, flagged: 0, answer: "ನಮ್ಮ ಕುಟುಂಬದಲ್ಲಿ 7 ಜನರಿದ್ದಾರೆ. ನಾವು 3 ಎಕರೆ ಭೂಮಿಯಲ್ಲಿ ಭತ್ತ ಮತ್ತು ಕಬ್ಬು ಬೆಳೆಯುತ್ತೇವೆ." },
  { id: "VAL-005", survey: "Consumer Expenditure R80", respondent: "R-12384", district: "Jaipur, RJ", submittedOn: "Jun 8, 2026", voiceUsed: true, duration: "6:05", questions: 32, flagged: 3, answer: "हम 8 लोग हैं। मेरे ससुर जी किसान हैं और हम सभी मिलकर खेती करते हैं।" },
];

export default function ValidationQueue() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [validated, setValidated] = useState<Set<string>>(new Set());

  const handleApprove = (id: string) => {
    setValidated((prev) => new Set(prev).add(id));
    setExpanded(null);
  };

  const pending = queue.filter((q) => !validated.has(q.id));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Validation Queue"
        description={`${pending.length} responses pending validation`}
      />

      <div className="space-y-3">
        {pending.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-emerald-300 rounded-2xl bg-emerald-50/10 min-h-[350px]">
            <div className="h-14 w-14 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100">
              <CheckCircle2 className="h-7 w-7 text-emerald-600 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Validation Queue Cleared</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              All field enumerator submissions have been reviewed. There are no outstanding anomalies, speeding alerts, or GPS mismatch flags left in the verification pipe.
            </p>
          </div>
        ) : (
          queue.map((item) => {
            const isExpanded = expanded === item.id;
            const isValidated = validated.has(item.id);

            return (
              <div
                key={item.id}
                className={`rounded-2xl border bg-white transition-all ${
                  isValidated
                    ? "border-emerald-200 bg-emerald-50/30 opacity-60"
                    : "border-border"
                }`}
              >
                {/* Header */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : item.id)}
                  className="flex w-full items-center gap-4 p-4 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-muted-foreground">{item.id}</span>
                      {item.flagged > 0 && (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                          {item.flagged} flag{item.flagged > 1 ? "s" : ""}
                        </span>
                      )}
                      {isValidated && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          Approved
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">{item.survey}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.respondent} · {item.district} · {item.submittedOn}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {item.voiceUsed && (
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <Mic className="h-3.5 w-3.5" />
                        Voice
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {item.duration}
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && !isValidated && (
                  <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
                    <div className="rounded-xl bg-muted/50 p-4">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Sample Voice Response (Q1):</p>
                      <p className="text-sm text-foreground italic">"{item.answer}"</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{item.questions} questions answered</span>
                      <span>·</span>
                      <span>Duration: {item.duration}</span>
                      <span>·</span>
                      <span>{item.voiceUsed ? "Voice input used" : "Text input only"}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Approve
                      </button>
                      <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors">
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
