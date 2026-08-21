import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HsdTrainingHub() {
  const [currentModule, setCurrentModule] = useState(1);
  const [completedModules, setCompletedModules] = useState<number[]>([1]);
  const [simAnswer, setSimAnswer] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const modules = [
    {
      id: 1,
      title: "Module 1: Real-time API & Batch Data Ingestion",
      desc: "Learn to ingest household survey payloads, upload batch Parquet files, and parse schema headers."
    },
    {
      id: 2,
      title: "Module 2: Defining Integrity Validation Rules",
      desc: "Master existential, referential (NCO-2015/NIC-2008 taxonomy), and cross-field logic rules."
    },
    {
      id: 3,
      title: "Module 3: ML Anomaly & Benford's Law Triaging",
      desc: "Detect statistical outliers, multivariate income discrepancies, and data fabrication patterns."
    },
    {
      id: 4,
      title: "Module 4: Validation Workbench & Inline Fixes",
      desc: "Operate the HSD Validation Workbench to review flags, resolve errors, and write audit notes."
    }
  ];

  const handleEvaluateExercise = (option: string) => {
    setSimAnswer(option);
    if (option === "RULE_LOGICAL_AGE_EMP") {
      setFeedbackMessage("Correct! The record violates Rule 101 because a child under 15 cannot be marked as Employed.");
      if (!completedModules.includes(currentModule)) {
        setCompletedModules([...completedModules, currentModule]);
      }
    } else {
      setFeedbackMessage("Incorrect rule selection. Hint: Examine the age (12) and employment status ('Employed').");
    }
  };

  const overallProgress = Math.round((completedModules.length / modules.length) * 100);

  return (
    <div className="space-y-6">
      {/* ── Banner ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#003366] via-[#004e8c] to-[#002244] text-white p-6 rounded-xl shadow-lg border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-[#f39c12] text-white font-bold px-2.5 py-0.5 text-xs">
              HSD Certification Portal
            </Badge>
            <span className="text-xs text-blue-200 uppercase tracking-widest">
              MoSPI Training & Capacity Building
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
            Household Survey Division (HSD) Interactive Training Hub
          </h1>
          <p className="text-sm text-blue-100/90 mt-1">
            Hands-on training walkthrough for statistical officers and supervisors to master platform operations.
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded-lg border border-white/20 text-right min-w-[200px]">
          <div className="text-xs text-blue-200 font-bold uppercase">Training Progress</div>
          <div className="text-2xl font-black text-white mt-0.5">{overallProgress}% Completed</div>
          <div className="w-full bg-white/20 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-[#f39c12] h-full rounded-full" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>
      </div>

      {/* ── Curriculum Modules List ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {modules.map(mod => {
          const isDone = completedModules.includes(mod.id);
          const isActive = currentModule === mod.id;
          return (
            <Card
              key={mod.id}
              onClick={() => setCurrentModule(mod.id)}
              className={`cursor-pointer transition-all border ${
                isActive
                  ? "border-[#003366] ring-2 ring-[#003366]/20 bg-blue-50/50"
                  : isDone
                  ? "border-emerald-300 bg-emerald-50/30"
                  : "border-slate-200 bg-white"
              }`}
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Module {mod.id}</span>
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <BookOpen className="h-4 w-4 text-slate-400" />
                  )}
                </div>
                <h4 className="text-sm font-bold text-[#003366]">{mod.title}</h4>
                <p className="text-[11px] text-slate-600 leading-snug">{mod.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Interactive Hands-on Scenario Workbench ── */}
      <Card className="border border-slate-200 shadow-sm bg-white">
        <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-[#003366] flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#f39c12]" />
              Hands-On Simulation Exercise: Module {currentModule}
            </CardTitle>
            <Badge className="bg-[#003366] text-white font-bold text-xs">Guided Interactive Mode</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="p-4 bg-slate-100 border border-slate-200 rounded-lg space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-[#003366]" /> Practical Household Survey Case Scenario:
            </h4>
            <div className="bg-white p-4 rounded border border-slate-200 font-mono text-xs text-slate-800 space-y-1">
              <div><strong>Household ID:</strong> HH-2026-TRAIN-09</div>
              <div><strong>Respondent Name:</strong> Ramesh Patel</div>
              <div><strong>Age:</strong> 12 Years</div>
              <div><strong>Employment Status:</strong> "Employed"</div>
              <div><strong>Occupation Code:</strong> 6111</div>
              <div><strong>Monthly Income:</strong> ₹8,500</div>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              <strong>Task for Officer:</strong> Identify which integrity validation rule is violated by this submission.
            </p>
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase text-slate-700">Select Rule Violation:</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={() => handleEvaluateExercise("RULE_EXIST_001")}
                className={`justify-start text-xs font-bold py-6 ${
                  simAnswer === "RULE_EXIST_001" ? "border-red-500 bg-red-50" : ""
                }`}
              >
                1. RULE_EXIST_001: Missing Household ID
              </Button>

              <Button
                variant="outline"
                onClick={() => handleEvaluateExercise("RULE_LOGICAL_AGE_EMP")}
                className={`justify-start text-xs font-bold py-6 ${
                  simAnswer === "RULE_LOGICAL_AGE_EMP" ? "border-emerald-600 bg-emerald-50 text-emerald-900" : ""
                }`}
              >
                2. RULE_LOGICAL_AGE_EMP: Child Employment Logic Violation
              </Button>

              <Button
                variant="outline"
                onClick={() => handleEvaluateExercise("RULE_REF_NIC")}
                className={`justify-start text-xs font-bold py-6 ${
                  simAnswer === "RULE_REF_NIC" ? "border-red-500 bg-red-50" : ""
                }`}
              >
                3. RULE_REF_NIC: Invalid NIC Industry Code
              </Button>
            </div>
          </div>

          {/* Feedback Area */}
          {feedbackMessage && (
            <div
              className={`p-4 rounded-lg text-xs font-bold flex items-center justify-between ${
                simAnswer === "RULE_LOGICAL_AGE_EMP"
                  ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                  : "bg-red-100 text-red-900 border border-red-300"
              }`}
            >
              <div className="flex items-center gap-2">
                {simAnswer === "RULE_LOGICAL_AGE_EMP" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <ShieldCheck className="h-5 w-5 text-red-600" />
                )}
                <span>{feedbackMessage}</span>
              </div>

              {simAnswer === "RULE_LOGICAL_AGE_EMP" && currentModule < 4 && (
                <Button
                  size="sm"
                  onClick={() => setCurrentModule(currentModule + 1)}
                  className="bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs gap-1"
                >
                  Next Module <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
