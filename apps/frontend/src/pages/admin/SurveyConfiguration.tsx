import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Save, 
  Sliders, 
  MapPin, 
  Smartphone, 
  CheckCircle2, 
  AlertTriangle,
  ClipboardList,
  UserCheck,
  Clock
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

interface QualityThreshold {
  surveyType: string;
  minQuestions: number;
  minCompletionPercentage: number;
  requireGPS: boolean;
  requireMobileVerification: boolean;
  allowAnonymous: boolean;
  recommendedCompletionTime: number;
}

const defaultThresholds: QualityThreshold[] = [
  { surveyType: "Household Survey", minQuestions: 20, minCompletionPercentage: 95, requireGPS: true, requireMobileVerification: true, allowAnonymous: false, recommendedCompletionTime: 25 },
  { surveyType: "Agriculture Survey", minQuestions: 30, minCompletionPercentage: 90, requireGPS: true, requireMobileVerification: false, allowAnonymous: false, recommendedCompletionTime: 30 },
  { surveyType: "Employment Survey", minQuestions: 15, minCompletionPercentage: 95, requireGPS: false, requireMobileVerification: true, allowAnonymous: false, recommendedCompletionTime: 15 },
  { surveyType: "Health Survey", minQuestions: 25, minCompletionPercentage: 95, requireGPS: true, requireMobileVerification: true, allowAnonymous: false, recommendedCompletionTime: 20 },
  { surveyType: "Education Survey", minQuestions: 15, minCompletionPercentage: 90, requireGPS: false, requireMobileVerification: true, allowAnonymous: false, recommendedCompletionTime: 15 },
  { surveyType: "Consumer Expenditure Survey", minQuestions: 30, minCompletionPercentage: 95, requireGPS: true, requireMobileVerification: true, allowAnonymous: false, recommendedCompletionTime: 35 },
  { surveyType: "Tourism Survey", minQuestions: 20, minCompletionPercentage: 90, requireGPS: true, requireMobileVerification: false, allowAnonymous: false, recommendedCompletionTime: 20 },
  { surveyType: "Industry Survey", minQuestions: 30, minCompletionPercentage: 95, requireGPS: true, requireMobileVerification: true, allowAnonymous: false, recommendedCompletionTime: 30 },
  { surveyType: "Labour Force Survey", minQuestions: 20, minCompletionPercentage: 95, requireGPS: true, requireMobileVerification: true, allowAnonymous: false, recommendedCompletionTime: 20 },
  { surveyType: "General / Other", minQuestions: 10, minCompletionPercentage: 85, requireGPS: false, requireMobileVerification: false, allowAnonymous: true, recommendedCompletionTime: 10 }
];

export default function SurveyConfiguration() {
  const [thresholds, setThresholds] = useState<QualityThreshold[]>([]);
  const [selectedType, setSelectedType] = useState<string>("Household Survey");
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Load from local storage or set defaults
  useEffect(() => {
    const saved = localStorage.getItem("mospi_survey_quality_configs");
    if (saved) {
      try {
        setThresholds(JSON.parse(saved));
      } catch (e) {
        setThresholds(defaultThresholds);
      }
    } else {
      setThresholds(defaultThresholds);
      localStorage.setItem("mospi_survey_quality_configs", JSON.stringify(defaultThresholds));
    }
  }, []);

  const handleThresholdChange = (key: keyof QualityThreshold, value: any) => {
    const updated = thresholds.map(t => {
      if (t.surveyType === selectedType) {
        return { ...t, [key]: value };
      }
      return t;
    });
    setThresholds(updated);
  };

  const handleSave = () => {
    localStorage.setItem("mospi_survey_quality_configs", JSON.stringify(thresholds));
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  const currentConfig = thresholds.find(t => t.surveyType === selectedType) || thresholds[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Survey Quality Controls & Config"
        description="Establish mandatory data validation thresholds and quality constraints for MoSPI statistical surveys."
      />

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Left Column: Select Survey Type */}
        <div className="md:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm p-4 h-fit">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Survey Category</h3>
          <div className="space-y-1">
            {thresholds.map((t) => (
              <button
                key={t.surveyType}
                onClick={() => setSelectedType(t.surveyType)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
                  selectedType === t.surveyType
                    ? "bg-[#003366] text-white"
                    : "text-gray-700 hover:bg-slate-50"
                }`}
              >
                <span>{t.surveyType}</span>
                {selectedType === t.surveyType && <Sliders className="h-4 w-4 text-blue-200" />}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Configuration Form */}
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col relative">
          
          <div className="p-5 border-b border-gray-200 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-gray-900">{selectedType} Thresholds</h2>
              <p className="text-xs text-gray-500">Configure parameters required for deployment clearance.</p>
            </div>
            <span className="text-[11px] font-extrabold uppercase bg-blue-50 text-[#003366] px-2.5 py-1 rounded-full border border-blue-200 shadow-sm">
              Standard Compliance
            </span>
          </div>

          {currentConfig && (
            <div className="p-6 space-y-6 flex-1">
              
              {/* Minimum Questions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                    <ClipboardList className="h-4 w-4 text-slate-500" />
                    Minimum Questions Required
                  </label>
                  <span className="text-sm font-extrabold text-[#003366] bg-slate-100 px-2 py-0.5 rounded">
                    {currentConfig.minQuestions} Questions
                  </span>
                </div>
                <p className="text-xs text-gray-500">The survey must contain at least this many questions before Nodal Officers can publish it.</p>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={currentConfig.minQuestions}
                  onChange={(e) => handleThresholdChange("minQuestions", parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#003366]"
                />
              </div>

              {/* Completion Percentage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Minimum Target Completion Rate
                  </label>
                  <span className="text-sm font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {currentConfig.minCompletionPercentage}%
                  </span>
                </div>
                <p className="text-xs text-gray-500">The threshold for completed versus target sample units in field surveys before reports are finalized.</p>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={currentConfig.minCompletionPercentage}
                  onChange={(e) => handleThresholdChange("minCompletionPercentage", parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#10b981]"
                />
              </div>

              {/* Recommended Completion Time */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-purple-500" />
                    Recommended Completion Time
                  </label>
                  <span className="text-sm font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                    {currentConfig.recommendedCompletionTime || 15} Mins
                  </span>
                </div>
                <p className="text-xs text-gray-500">The suggested duration target in minutes for enumerators to complete the interview cycle.</p>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={currentConfig.recommendedCompletionTime || 15}
                  onChange={(e) => handleThresholdChange("recommendedCompletionTime", parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>

              <hr className="border-gray-200" />

              {/* Switches for GPS, Mobile and Anonymous */}
              <div className="grid sm:grid-cols-3 gap-4">
                
                {/* GPS Validation */}
                <label className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                  currentConfig.requireGPS 
                    ? "border-blue-200 bg-blue-50/20" 
                    : "border-gray-200 hover:bg-slate-50"
                }`}>
                  <input
                    type="checkbox"
                    checked={currentConfig.requireGPS}
                    onChange={(e) => handleThresholdChange("requireGPS", e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[#003366] focus:ring-[#003366]"
                  />
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      GPS Geo-fencing
                    </span>
                    <span className="text-[11px] text-gray-500 block leading-tight">Requires device location match with FSU coordinates.</span>
                  </div>
                </label>

                {/* Mobile Verification */}
                <label className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                  currentConfig.requireMobileVerification 
                    ? "border-blue-200 bg-blue-50/20" 
                    : "border-gray-200 hover:bg-slate-50"
                }`}>
                  <input
                    type="checkbox"
                    checked={currentConfig.requireMobileVerification}
                    onChange={(e) => handleThresholdChange("requireMobileVerification", e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[#003366] focus:ring-[#003366]"
                  />
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <Smartphone className="h-4 w-4 text-purple-500" />
                      Mobile OTP Verify
                    </span>
                    <span className="text-[11px] text-gray-500 block leading-tight">Enforces citizen telephone OTP authentication.</span>
                  </div>
                </label>

                {/* Allow Anonymous */}
                <label className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                  currentConfig.allowAnonymous 
                    ? "border-blue-200 bg-blue-50/20" 
                    : "border-gray-200 hover:bg-slate-50"
                }`}>
                  <input
                    type="checkbox"
                    checked={currentConfig.allowAnonymous}
                    onChange={(e) => handleThresholdChange("allowAnonymous", e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[#003366] focus:ring-[#003366]"
                  />
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <UserCheck className="h-4 w-4 text-emerald-500" />
                      Allow Anonymous
                    </span>
                    <span className="text-[11px] text-gray-500 block leading-tight">Allows citizen responses without identity lookup.</span>
                  </div>
                </label>

              </div>

              {/* Warning/Info Box */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 text-xs text-amber-800">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold">National Statistical Standards Warning</span>
                  <p className="leading-relaxed">
                    Adjusting these thresholds will retroactively alter the compliance rating and statistical completeness scores of all currently active drafts of type <strong>{selectedType}</strong>. Ensure all field surveyors are notified.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* Footer Save Row */}
          <div className="p-4 border-t border-gray-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> Vetted under National Quality Assurance Standards
            </span>
            <button
              onClick={handleSave}
              className="bg-[#003366] text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#1E3A8A] shadow-sm transition-all"
            >
              <Save className="h-4 w-4" /> Save Rules Config
            </button>
          </div>

        </div>

      </div>

      {/* Toast Alert */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 z-[999] bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg border border-emerald-500 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-sm font-bold">Survey quality thresholds updated successfully!</span>
        </div>
      )}
    </div>
  );
}
