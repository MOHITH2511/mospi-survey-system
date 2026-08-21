import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  AlignLeft,
  Type,
  Hash,
  ListTodo,
  ListChecks,
  Calendar,
  MapPin,
  Image as ImageIcon,
  Mic,
  Grid3X3,
  Plus,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Settings,
  Save,
  Eye,
  Database,
  List,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Archive,
  Clock,
  Smartphone,
  RefreshCw
} from "lucide-react";
import {
  getAutomaticValidation
} from "./SurveyTemplates";

// --- Types ---
export type QuestionType = 'short_text' | 'long_text' | 'number' | 'single_select' | 'multi_select' | 'dropdown' | 'date' | 'gps' | 'image' | 'audio' | 'matrix';

export interface SurveyOption { id: string; code: string; label: string; }

export interface StatisticalMetadata {
  questionCode: string;
  variableName: string;
  dataType: string;
  classificationMapping: string;
  referenceStandard: string;
  prepopulationSource?: string;
}

export interface SkipLogicRule {
  id: string;
  operator?: string;
  conditionValue: string;
  targetQuestionId: string;
}

export interface ValidationRules {
  required: boolean;
  min: string;
  max: string;
  minLength?: string;
  maxLength?: string;
  minNumeric?: string;
  maxNumeric?: string;
  minSelections?: string;
  maxSelections?: string;
  minDate?: string;
  maxDate?: string;
  regex: string;
  custom: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  helpText: string;
  optionsSource?: 'custom' | 'master';
  options?: SurveyOption[];
  metadata: StatisticalMetadata;
  validation: ValidationRules;
  skipLogic?: SkipLogicRule[];
  tag?: string;
}

export interface Section {
  id: string;
  title: string;
  isCollapsed: boolean;
  questions: Question[];
}

// --- Initial Data ---
const initialSections: Section[] = [];

const formatSectionTitle = (title: string): string => {
  let clean = title.trim();
  // Remove messy instructions in brackets/parentheses like "(To be canvassed only...)"
  clean = clean.replace(/\([^)]+\)/g, "").trim();
  clean = clean.replace(/\[[^\]]+\]/g, "").trim();
  
  // Format "SECTION [1]" -> "Section 1"
  if (/^SECTION\s*$/i.test(clean)) {
    return "Section 1: General Information";
  }

  // Capitalize properly
  clean = clean.replace(/^section\s*(\d+)\s*([a-z]?)\s*[:\-\.]?/i, (match, num, letter) => {
    return `Section ${num}${letter ? letter.toUpperCase() : ''}: `;
  });

  return clean || "General Section";
};

const formatQuestionText = (text: string, category: string): string => {
  let clean = text.trim();
  
  // Remove leading symbols, dots, or question numbers (e.g. "Q11.1 ", "Q 6.7 ", "1.12. ", ". ")
  clean = clean.replace(/^(Q\s*\d+(\.\d+)*[:\-\s]*|\d+(\.\d+)*[:\-\s]*|[\.\-\:\s]+)/i, "");
  
  // Clean multiple spaces and trim
  clean = clean.replace(/\s+/g, " ").trim();

  // Handle specific raw database string anomalies
  clean = clean.replace(/:\s*To be ascertained in the field\./ig, "");
  clean = clean.replace(/To be ascertained in the field.*/ig, "");
  clean = clean.replace(/:\s*2\s*0\s*2\s*3/ig, "2023");
  clean = clean.replace(/o\s+rural\s+o\s+urban/ig, "Rural or Urban");

  if (!clean) return "New Question?";

  // If already ends with a question mark, return it capitalized
  if (clean.endsWith("?")) {
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }

  // Handle specific common short topics
  const lower = clean.toLowerCase();
  if (lower === "household size") {
    return "What is the total number of members in the household?";
  }
  if (lower.startsWith("mobile number") || lower.startsWith("land line number") || lower.startsWith("phone number")) {
    return `What is the ${lower}?`;
  }
  
  // If it's a very short topic
  const words = clean.split(" ");
  if (words.length <= 4 && !lower.includes("sector") && !lower.includes("code")) {
    const catLower = (category || "").toLowerCase();
    if (catLower.includes("house") || catLower.includes("consumption") || catLower.includes("income") || catLower.includes("expenditure") || catLower.includes("transport")) {
      return `What is the estimated monthly expenditure on ${lower}?`;
    }
    return `Please specify details about ${lower}?`;
  }

  // Capitalize first letter and append question mark if not present
  if (!clean.endsWith("?") && !clean.endsWith(".")) {
    const firstWord = clean.split(" ")[0].toLowerCase();
    if (["whether", "is", "does", "do", "are", "have", "can", "if", "what", "which", "how", "who"].includes(firstWord)) {
      return `${clean.charAt(0).toUpperCase() + clean.slice(1)}?`;
    }
    // Convert statements to polite requests or questions where appropriate
    return `${clean.charAt(0).toUpperCase() + clean.slice(1)}.`;
  }
  
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};

const QUESTION_TYPES: { id: QuestionType; label: string; icon: React.ElementType }[] = [
  { id: 'short_text', label: 'Short Text', icon: Type },
  { id: 'long_text', label: 'Long Text', icon: AlignLeft },
  { id: 'number', label: 'Number', icon: Hash },
  { id: 'single_select', label: 'Single Select', icon: ListTodo },
  { id: 'multi_select', label: 'Multi Select', icon: ListChecks },
  { id: 'dropdown', label: 'Dropdown', icon: List },
  { id: 'date', label: 'Date', icon: Calendar },
  { id: 'gps', label: 'GPS Location', icon: MapPin },
  { id: 'image', label: 'Image Upload', icon: ImageIcon },
  { id: 'audio', label: 'Audio Response', icon: Mic },
  { id: 'matrix', label: 'Matrix Question', icon: Grid3X3 },
];

// --- Main Component ---
export default function AISurveyBuilder() {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<{ secId: string, qIdx: number } | null>(null);
  
  // AI State
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [surveyTitle, setSurveyTitle] = useState("");
  const [surveyId, setSurveyId] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [surveyType, setSurveyType] = useState<string>("Household Survey");
  const [publishValidationErrors, setPublishValidationErrors] = useState<string[] | null>(null);
  const [showPublishClearanceModal, setShowPublishClearanceModal] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const location = useLocation();

  // Load existing survey if ID is in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");
    if (id) {
      setSurveyId(id);
      fetch(`http://localhost:8080/api/surveys/${id}`)
        .then(res => res.json())
        .then(data => {
          setSurveyTitle(data.title);
          setSurveyType(data.description || "Household Survey");
          try {
            const parsed = JSON.parse(data.schemaJson);
            const loadedSections = Array.isArray(parsed) ? parsed : parsed.sections;
            if (loadedSections) {
              setSections(loadedSections);
            }
          } catch(e) {}
        })
        .catch(err => console.error("Failed to load survey:", err));
    }
  }, [location.search]);

  // JSON Preview State
  const [showJsonPreviewModal, setShowJsonPreviewModal] = useState(false);
  const [jsonPreviewContent, setJsonPreviewContent] = useState("");
  const [jsonPreviewMode, setJsonPreviewMode] = useState<"draft" | "publish">("draft");

  const confirmJsonSave = async () => {
    try {
      const parsedDraft = JSON.parse(jsonPreviewContent);
      if (parsedDraft.sections) {
        setSections(parsedDraft.sections);
      }
      if (parsedDraft.title) {
        setSurveyTitle(parsedDraft.title);
      }
      
      const currentSurveyId = parsedDraft.id || surveyId || crypto.randomUUID();
      if (!surveyId) setSurveyId(currentSurveyId);

      const savedDrafts = localStorage.getItem("mospi_survey_drafts");
      let drafts = [];
      if (savedDrafts) {
        try { drafts = JSON.parse(savedDrafts); } catch (e) { drafts = []; }
      }
      const existingIdx = drafts.findIndex((d: any) => d.id === currentSurveyId);
      if (existingIdx >= 0) { drafts[existingIdx] = parsedDraft; } 
      else { drafts.push(parsedDraft); }
      
      localStorage.setItem("mospi_survey_drafts", JSON.stringify(drafts));
      if (jsonPreviewMode === "publish") {
        localStorage.setItem(`mospi_survey_published_${parsedDraft.title || "unnamed"}`, "true");
      }

      const response = await fetch("http://localhost:8080/api/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentSurveyId,
          title: parsedDraft.title || surveyTitle,
          description: parsedDraft.surveyType || surveyType,
          status: jsonPreviewMode === "publish" ? "published" : "draft",
          schemaJson: JSON.stringify(parsedDraft.sections || parsedDraft)
        })
      });
      if (!response.ok) throw new Error("Failed to save to database");
      
      setShowJsonPreviewModal(false);
      
      if (jsonPreviewMode === "publish") {
        setPublishValidationErrors([]);
        setPublishSuccess(true);
        setShowPublishClearanceModal(true);
      } else {
        alert("Draft saved to Database successfully!");
      }
    } catch (error) {
      console.error(error);
      alert("Invalid JSON or failed to save.");
    }
  };

  const saveSurveyDirectly = async (mode: "draft" | "publish") => {
    let currentSurveyId = surveyId;
    if (!currentSurveyId) {
      currentSurveyId = crypto.randomUUID();
      setSurveyId(currentSurveyId);
    }

    const draft = {
      id: currentSurveyId,
      title: surveyTitle,
      surveyType: surveyType,
      sections: sections,
      updatedAt: new Date().toLocaleString(),
      isPublished: mode === "publish"
    };

    const savedDrafts = localStorage.getItem("mospi_survey_drafts");
    let drafts = [];
    if (savedDrafts) {
      try { drafts = JSON.parse(savedDrafts); } catch (e) { drafts = []; }
    }
    const existingIdx = drafts.findIndex((d: any) => d.id === currentSurveyId);
    if (existingIdx >= 0) { drafts[existingIdx] = draft; } 
    else { drafts.push(draft); }
    
    localStorage.setItem("mospi_survey_drafts", JSON.stringify(drafts));
    if (mode === "publish") {
      localStorage.setItem(`mospi_survey_published_${draft.title || "unnamed"}`, "true");
    }

    try {
      const response = await fetch("http://localhost:8080/api/surveys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentSurveyId,
          title: draft.title || surveyTitle,
          description: draft.surveyType || surveyType,
          status: mode === "publish" ? "published" : "draft",
          schemaJson: JSON.stringify(draft.sections || draft)
        })
      });
      if (!response.ok) throw new Error("Failed to save to database");
      
      if (mode === "publish") {
        setPublishValidationErrors([]);
        setPublishSuccess(true);
        setShowPublishClearanceModal(true);
      } else {
        alert("Draft saved to Database successfully!");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save to database.");
    }
  };

  // Load quality configurations from localStorage or set default
  const getQualityThreshold = () => {
    const defaultThresholds = [
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
    const saved = localStorage.getItem("mospi_survey_quality_configs");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = parsed.find((p: any) => p.surveyType === surveyType);
        return match || parsed[0] || defaultThresholds[0];
      } catch (e) {
        return defaultThresholds.find(t => t.surveyType === surveyType) || defaultThresholds[0];
      }
    }
    return defaultThresholds.find(t => t.surveyType === surveyType) || defaultThresholds[0];
  };

  const initialThreshold = getQualityThreshold();

  const [minQuestions, setMinQuestions] = useState(initialThreshold.minQuestions);
  const [minCompletionPercentage, setMinCompletionPercentage] = useState(initialThreshold.minCompletionPercentage);
  const [requireGPS, setRequireGPS] = useState(initialThreshold.requireGPS);
  const [requireMobileVerification, setRequireMobileVerification] = useState(initialThreshold.requireMobileVerification);
  const [allowAnonymous, setAllowAnonymous] = useState(initialThreshold.allowAnonymous !== undefined ? initialThreshold.allowAnonymous : false);
  const [recommendedCompletionTime, setRecommendedCompletionTime] = useState(initialThreshold.recommendedCompletionTime || 15);

  // Sync thresholds when surveyType changes
  useEffect(() => {
    const active = getQualityThreshold();
    setMinQuestions(active.minQuestions);
    setMinCompletionPercentage(active.minCompletionPercentage);
    setRequireGPS(active.requireGPS);
    setRequireMobileVerification(active.requireMobileVerification);
    setAllowAnonymous(active.allowAnonymous !== undefined ? active.allowAnonymous : false);
    setRecommendedCompletionTime(active.recommendedCompletionTime || 15);
  }, [surveyType]);

  // Save changes to localStorage when edited
  const saveThresholdConfig = (updated: {
    minQuestions?: number;
    minCompletionPercentage?: number;
    requireGPS?: boolean;
    requireMobileVerification?: boolean;
    allowAnonymous?: boolean;
    recommendedCompletionTime?: number;
  }) => {
    const defaultThresholds = [
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
    const saved = localStorage.getItem("mospi_survey_quality_configs");
    let list = [...defaultThresholds];
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }

    const current = {
      surveyType,
      minQuestions: updated.minQuestions !== undefined ? updated.minQuestions : minQuestions,
      minCompletionPercentage: updated.minCompletionPercentage !== undefined ? updated.minCompletionPercentage : minCompletionPercentage,
      requireGPS: updated.requireGPS !== undefined ? updated.requireGPS : requireGPS,
      requireMobileVerification: updated.requireMobileVerification !== undefined ? updated.requireMobileVerification : requireMobileVerification,
      allowAnonymous: updated.allowAnonymous !== undefined ? updated.allowAnonymous : allowAnonymous,
      recommendedCompletionTime: updated.recommendedCompletionTime !== undefined ? updated.recommendedCompletionTime : recommendedCompletionTime,
    };

    const idx = list.findIndex((p: any) => p.surveyType === surveyType);
    if (idx >= 0) {
      list[idx] = current;
    } else {
      list.push(current);
    }
    localStorage.setItem("mospi_survey_quality_configs", JSON.stringify(list));

    if (updated.minQuestions !== undefined) setMinQuestions(updated.minQuestions);
    if (updated.minCompletionPercentage !== undefined) setMinCompletionPercentage(updated.minCompletionPercentage);
    if (updated.requireGPS !== undefined) setRequireGPS(updated.requireGPS);
    if (updated.requireMobileVerification !== undefined) setRequireMobileVerification(updated.requireMobileVerification);
    if (updated.allowAnonymous !== undefined) setAllowAnonymous(updated.allowAnonymous);
    if (updated.recommendedCompletionTime !== undefined) setRecommendedCompletionTime(updated.recommendedCompletionTime);
  };

  // Validate and calculate score
  const validateSurvey = () => {
    const warnings: string[] = [];
    const criticalErrors: string[] = [];
    const allQuestions = sections.flatMap(s => s.questions);
    const totalQuestions = allQuestions.length;

    // Check 1: Missing Title
    if (!surveyTitle.trim()) {
      criticalErrors.push("Survey Title is required before publishing.");
    }

    // Check 2: Missing Sections
    if (sections.length === 0) {
      criticalErrors.push("At least one Section must be added before publishing.");
    } else {
      sections.forEach((sec, idx) => {
        if (!sec.title.trim()) {
          criticalErrors.push(`Section ${idx + 1} has an empty Title.`);
        }
        if (sec.questions.length === 0) {
          warnings.push(`Section "${sec.title || `Section ${idx + 1}`}" has no questions.`);
        }
      });
    }

    // Check 3: Question Count below threshold
    if (totalQuestions < minQuestions) {
      criticalErrors.push(`Question count (${totalQuestions}) is below the minimum required threshold of ${minQuestions} for ${surveyType}.`);
    }

    // Check 4: Configuration thresholds validation
    if (minQuestions <= 0 || minCompletionPercentage <= 0) {
      criticalErrors.push("Survey thresholds must be configured with values greater than zero.");
    }

    let questionsWithValidation = 0;
    let requiredQuestionsCount = 0;

    allQuestions.forEach((q, idx) => {
      const qNum = idx + 1;
      
      if (!q.metadata.questionCode.trim()) {
        criticalErrors.push(`Q${qNum} (${q.label.substring(0, 20)}...): Missing Question Code in statistical metadata.`);
      }
      if (!q.metadata.variableName.trim()) {
        criticalErrors.push(`Q${qNum} (${q.label.substring(0, 20)}...): Missing Variable Name in statistical metadata.`);
      }
      if (!q.metadata.dataType.trim()) {
        criticalErrors.push(`Q${qNum} (${q.label.substring(0, 20)}...): Missing Data Type in statistical metadata.`);
      }

      if (q.validation.required) {
        requiredQuestionsCount++;
      }

      // Check validation coverage
      const val = q.validation;
      const hasValRule = val.required || val.minLength || val.maxLength || val.regex || val.minNumeric || val.maxNumeric || val.minSelections || val.maxSelections || val.minDate || val.maxDate;
      if (hasValRule) {
        questionsWithValidation++;
      } else {
        if (q.type === 'number') {
          warnings.push(`Q${qNum} (${q.label.substring(0, 20)}...): Numeric question has no configured min/max range limits.`);
        } else if (['short_text', 'long_text'].includes(q.type)) {
          warnings.push(`Q${qNum} (${q.label.substring(0, 20)}...): Text question has no length validations.`);
        } else if (['single_select', 'multi_select'].includes(q.type)) {
          warnings.push(`Q${qNum} (${q.label.substring(0, 20)}...): Choice question has no selection constraints.`);
        } else if (q.type === 'date') {
          warnings.push(`Q${qNum} (${q.label.substring(0, 20)}...): Date question has no date range limits.`);
        }
      }
    });

    // Score Calculations (Weighted: 20% each factor)
    // 1. Number of Questions vs Category Threshold (20%)
    const qCountScore = totalQuestions === 0 ? 0 : Math.min(100, (totalQuestions / minQuestions) * 100);

    // 2. Validation Coverage (20%)
    const valCoverageScore = totalQuestions === 0 ? 0 : (questionsWithValidation / totalQuestions) * 100;

    // 3. Required Fields Coverage (20%)
    const requiredScore = totalQuestions === 0 ? 0 : (requiredQuestionsCount / totalQuestions) * 100;

    // 4. Section Completeness (20%)
    let sectionCompleteness = 100;
    if (sections.length === 0) {
      sectionCompleteness = 0;
    } else {
      sections.forEach(s => {
        if (s.questions.length === 0) sectionCompleteness -= 25;
        if (!s.title.trim()) sectionCompleteness -= 25;
      });
      sectionCompleteness = Math.max(0, sectionCompleteness);
    }

    // 5. Configuration Completeness (20%)
    let configCompleteness = 100;
    if (!surveyTitle.trim()) configCompleteness -= 30;
    if (!surveyType.trim()) configCompleteness -= 20;
    if (minQuestions <= 0) configCompleteness -= 15;
    if (minCompletionPercentage <= 0) configCompleteness -= 15;
    if (requireGPS === undefined) configCompleteness -= 10;
    if (requireMobileVerification === undefined) configCompleteness -= 10;
    configCompleteness = Math.max(0, configCompleteness);

    const finalScore = totalQuestions === 0 ? 0 : Math.round(
      0.2 * qCountScore +
      0.2 * valCoverageScore +
      0.2 * requiredScore +
      0.2 * sectionCompleteness +
      0.2 * configCompleteness
    );

    let rating: "Poor" | "Good" | "Excellent" = "Poor";
    if (finalScore >= 80) rating = "Excellent";
    else if (finalScore >= 50) rating = "Good";

    return {
      score: finalScore,
      rating,
      warnings,
      criticalErrors,
      totalQuestions
    };
  };

  // validateSurvey is defined but not run on render scope as quality cards are removed

  // Automatically load imported questions from Survey Import Center
  useEffect(() => {
    const importedQuestionsJSON = sessionStorage.getItem("mospi_imported_questions");
    const importedFileName = sessionStorage.getItem("mospi_imported_filename");
    
    if (importedQuestionsJSON) {
      try {
        const questions = JSON.parse(importedQuestionsJSON);
        if (Array.isArray(questions) && questions.length > 0) {
          const fName = importedFileName || "Imported_Document";
          
          const newQs: Question[] = [];
          questions.forEach((qText, index) => {
            let type: QuestionType = "short_text";
            const lowerQ = qText.toLowerCase();
            if (lowerQ.includes("how many") || lowerQ.includes("age") || lowerQ.includes("amount") || lowerQ.includes("salary") || lowerQ.includes("size")) type = "number";
            else if (lowerQ.includes("date") || lowerQ.includes("when") || lowerQ.includes("year")) type = "date";
            else if (lowerQ.includes("describe") || lowerQ.includes("explain")) type = "long_text";
            else if (lowerQ.includes("primary") || lowerQ.includes("select") || lowerQ.includes("choose") || lowerQ.includes("occupation")) type = "single_select";
            
            const newQ: Question = {
              id: `q-${crypto.randomUUID()}-ext-${index}`,
              type,
              label: qText.length > 150 ? qText.substring(0, 150) + "..." : qText,
              helpText: "Imported from document",
              metadata: { questionCode: `Q_EXT_${index+1}`, variableName: `ext_var_${index+1}`, dataType: type === "number" ? "numeric" : "text", classificationMapping: "", referenceStandard: "" },
              validation: { required: false, min: "", max: "", regex: "", custom: "" },
              skipLogic: [],
              tag: "From Document"
            };

            if (type === "single_select") {
              newQ.optionsSource = "custom";
              newQ.options = [
                { id: `opt-${crypto.randomUUID()}-1`, code: "1", label: "Option 1" },
                { id: `opt-${crypto.randomUUID()}-2`, code: "2", label: "Option 2" }
              ];
            }
            newQs.push(newQ);
          });
          
          newQs.push({
            id: `q-${crypto.randomUUID()}-ai-1`,
            type: "long_text",
            label: "Describe any related challenges or feedback (AI Generated Extra)",
            helpText: "AI generated contextual question.",
            metadata: { questionCode: "Q_AI_01", variableName: "ai_feedback", dataType: "text", classificationMapping: "", referenceStandard: "" },
            validation: { required: false, min: "", max: "", regex: "", custom: "" },
            skipLogic: [],
            tag: "AI Extra Question"
          });
          
          newQs.push({
            id: `q-${crypto.randomUUID()}-ai-2`,
            type: "single_select",
            label: "How would you rate the overall accessibility? (AI Generated Extra)",
            helpText: "AI generated satisfaction question.",
            optionsSource: "custom",
            options: [
              { id: `opt-${crypto.randomUUID()}-1`, code: "1", label: "Good" },
              { id: `opt-${crypto.randomUUID()}-2`, code: "2", label: "Average" },
              { id: `opt-${crypto.randomUUID()}-3`, code: "3", label: "Poor" }
            ],
            metadata: { questionCode: "Q_AI_02", variableName: "ai_rating", dataType: "categorical", classificationMapping: "", referenceStandard: "" },
            validation: { required: true, min: "", max: "", regex: "", custom: "" },
            skipLogic: [],
            tag: "AI Extra Question"
          });

          const newSecId = `sec-${crypto.randomUUID()}`;
          setSections([{
            id: newSecId,
            title: `Extracted Section - ${fName}`,
            isCollapsed: false,
            questions: newQs
          }]);
          setActiveSectionId(newSecId);
          setSurveyTitle(`Survey from ${fName}`);

          sessionStorage.removeItem("mospi_imported_questions");
          sessionStorage.removeItem("mospi_imported_filename");
        }
      } catch (e) {
        console.error("Failed to parse imported questions");
      }
    }
  }, []);

  // Get currently selected question
  const selectedQuestion: Question | null = (() => {
    for (const sec of sections) {
      const q = sec.questions.find(qs => qs.id === selectedQuestionId);
      if (q) return q;
    }
    return null;
  })();

  // --- Handlers ---
  const handleDragStart = (secId: string, qIdx: number) => setDraggedItem({ secId, qIdx });
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (targetSecId: string, targetQIdx: number) => {
    if (!draggedItem) return;
    if (draggedItem.secId === targetSecId && draggedItem.qIdx === targetQIdx) {
      setDraggedItem(null);
      return;
    }
    
    setSections(prev => {
      const newSections = prev.map(s => ({ ...s, questions: [...s.questions] }));
      const sourceSec = newSections.find(s => s.id === draggedItem.secId)!;
      const targetSec = newSections.find(s => s.id === targetSecId)!;
      
      const [moved] = sourceSec.questions.splice(draggedItem.qIdx, 1);
      targetSec.questions.splice(targetQIdx, 0, moved);
      return newSections;
    });
    setDraggedItem(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setIsExtracting(true);
      
      const isText = file.name.endsWith('.txt') || file.name.endsWith('.csv');
      
      if (isText) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          // Split by newline, remove empty lines, limit to reasonable amount
          const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 5);
          const parsedQuestions = lines.slice(0, 15);
          
          setIsExtracting(false);
          setAiPrompt(prev => prev + (prev ? "\n\n" : "") + `[Extracted ${parsedQuestions.length} questions from ${file.name}]: Please include these questions as-is and generate 2 additional relevant questions.`);
        };
        reader.readAsText(file);
      } else {
        // Mock extraction for PDFs/DOCX since browser JS cannot read them directly
        setTimeout(() => {
          setIsExtracting(false);
          setAiPrompt(prev => prev + (prev ? "\n\n" : "") + `[Extracted data from ${file.name}]: Please include the extracted questions and generate 2 additional relevant questions.`);
        }, 1500);
      }
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim() && !uploadedFileName) return;
    setIsGenerating(true);

    // Automatically set title based on prompt keywords
    let generatedTitle = "AI Generated Survey";
    const promptLower = aiPrompt.toLowerCase();
    if (promptLower.includes("health")) generatedTitle = "National Health Survey";
    else if (promptLower.includes("labour") || promptLower.includes("labor") || promptLower.includes("employment")) generatedTitle = "National Employment & Labor Survey";
    else if (promptLower.includes("agriculture") || promptLower.includes("crop") || promptLower.includes("farm")) generatedTitle = "National Agricultural Assessment Survey";
    else if (promptLower.includes("education") || promptLower.includes("school")) generatedTitle = "National Educational Standards Survey";
    else if (promptLower.includes("expenditure") || promptLower.includes("consumption")) generatedTitle = "Consumer Expenditure Survey";
    else if (promptLower.includes("tourism") || promptLower.includes("travel")) generatedTitle = "Tourism & Travel Assessment Survey";
    else if (promptLower.includes("industry") || promptLower.includes("manufacturing")) generatedTitle = "National Industrial Growth Survey";
    else if (promptLower.includes("household")) generatedTitle = "Household Socio-Economic Survey";
    else {
      const excludedWords = ["i", "am", "creating", "a", "survey", "to", "understand", "please", "suggest", "questions", "about", "the", "for", "in", "need"];
      const words = aiPrompt.split(/[\s,]+/).filter(w => w.length > 2 && !excludedWords.includes(w.toLowerCase())).slice(0, 5);
      if (words.length > 0) {
        generatedTitle = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") + " Survey";
      } else {
        generatedTitle = "Custom AI Survey";
      }
    }
    setSurveyTitle(generatedTitle);

    // Detect survey category/type
    let detectedCategory = "General / Other";
    if (promptLower.includes("health")) detectedCategory = "Health Survey";
    else if (promptLower.includes("labour") || promptLower.includes("labor") || promptLower.includes("plfs") || promptLower.includes("unemployment")) detectedCategory = "Labour Force Survey";
    else if (promptLower.includes("employment") || promptLower.includes("occupation") || promptLower.includes("job")) detectedCategory = "Employment Survey";
    else if (promptLower.includes("expenditure") || promptLower.includes("consumption")) detectedCategory = "Consumer Expenditure Survey";
    else if (promptLower.includes("household")) detectedCategory = "Household Survey";
    else if (promptLower.includes("agriculture")) detectedCategory = "Agriculture Survey";
    else if (promptLower.includes("education")) detectedCategory = "Education Survey";
    else if (promptLower.includes("tourism")) detectedCategory = "Tourism Survey";
    else if (promptLower.includes("industry")) detectedCategory = "Industry Survey";
    else if (promptLower.includes("digital") || promptLower.includes("internet") || promptLower.includes("smartphone") || promptLower.includes("mobile")) detectedCategory = "Digital Access Survey";
    setSurveyType(detectedCategory);

    try {
      const response = await fetch("http://localhost:8000/recommend-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          top_k: minQuestions,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate: ${response.statusText}`);
      }

      const data = await response.json();
      const generatedSections: Section[] = [];

      const determineQuestionType = (text: string): QuestionType => {
        const lower = text.toLowerCase();
        if (lower.includes("how many") || lower.includes("age") || lower.includes("amount") || lower.includes("salary") || lower.includes("size") || lower.includes("income") || lower.includes("count") || lower.includes("number of") || lower.includes("quantity")) {
          return "number";
        }
        if (lower.includes("date") || lower.includes("when") || lower.includes("year") || lower.includes("month")) {
          return "date";
        }
        if (lower.includes("describe") || lower.includes("explain") || lower.includes("details") || lower.includes("comment") || lower.includes("remarks")) {
          return "long_text";
        }
        if (lower.includes("primary") || lower.includes("select") || lower.includes("choose") || lower.includes("occupation") || lower.includes("status") || lower.includes("type of") || lower.includes("yes/no") || lower.includes("gender") || lower.includes("level of")) {
          return "single_select";
        }
        if (lower.includes("which of") || lower.includes("select all") || lower.includes("check all")) {
          return "multi_select";
        }
        return "short_text";
      };

      const sectionKeys = Object.keys(data.grouped_by_section || {});
      if (sectionKeys.length > 0) {
        sectionKeys.forEach((secTitle) => {
          const displayTitle = secTitle === "Uncategorized" ? "General Assessment" : formatSectionTitle(secTitle);
          const apiQuestions = data.grouped_by_section[secTitle] || [];
          const questionsList: Question[] = apiQuestions.map((qItem: any, index: number) => {
            const qId = qItem.question_id || `q-${crypto.randomUUID()}-${index}`;
            const label = formatQuestionText(qItem.text, qItem.category || "");
            const source = qItem.source || "ai_generated";
            const tag = source === "ai_generated" ? "AI Suggested" : "From Database";
            const type = determineQuestionType(label);
            
            const newQ: Question = {
              id: qId,
              type,
              label,
              helpText: source === "ai_generated" ? "AI generated contextual question" : "Retrieved from standard library",
              metadata: {
                questionCode: `Q_${source === "ai_generated" ? "AI" : "DB"}_${index + 1}`,
                variableName: `var_${source === "ai_generated" ? "ai" : "db"}_${index + 1}`,
                dataType: type === "number" ? "numeric" : type === "date" ? "date" : "text",
                classificationMapping: "",
                referenceStandard: ""
              },
              validation: { required: false, min: "", max: "", regex: "", custom: "" },
              skipLogic: [],
              tag
            };

            if (['single_select', 'multi_select', 'dropdown'].includes(type)) {
              newQ.optionsSource = "custom";
              const lower = label.toLowerCase();
              const isYesNo = lower.includes("yes/no") || lower.includes("yes or no") || lower.includes("do you") || lower.includes("is there");
              newQ.options = isYesNo ? [
                { id: `opt-${crypto.randomUUID()}-1`, code: "1", label: "Yes" },
                { id: `opt-${crypto.randomUUID()}-2`, code: "2", label: "No" }
              ] : [
                { id: `opt-${crypto.randomUUID()}-1`, code: "1", label: "Option 1" },
                { id: `opt-${crypto.randomUUID()}-2`, code: "2", label: "Option 2" }
              ];
            }
            return newQ;
          });

          generatedSections.push({
            id: `sec-${crypto.randomUUID()}`,
            title: displayTitle,
            isCollapsed: false,
            questions: questionsList
          });
        });
      }

      if (generatedSections.length > 0) {
        setSections(generatedSections);
        setActiveSectionId(generatedSections[0].id);
      } else {
        // Fallback if no sections grouped
        const allQuestions = [...(data.items || []), ...(data.generated_questions || [])];
        if (allQuestions.length > 0) {
          const mappedQuestions = allQuestions.map((qItem: any, index: number) => {
            const qId = qItem.question_id || `q-${crypto.randomUUID()}-${index}`;
            const label = formatQuestionText(qItem.text, qItem.category || "");
            const source = qItem.source || "ai_generated";
            const tag = source === "ai_generated" ? "AI Suggested" : "From Database";
            const type = determineQuestionType(label);
            const newQ: Question = {
              id: qId,
              type,
              label,
              helpText: source === "ai_generated" ? "AI generated contextual question" : "Retrieved from standard library",
              metadata: {
                questionCode: `Q_${source === "ai_generated" ? "AI" : "DB"}_${index + 1}`,
                variableName: `var_${source === "ai_generated" ? "ai" : "db"}_${index + 1}`,
                dataType: type === "number" ? "numeric" : type === "date" ? "date" : "text",
                classificationMapping: "",
                referenceStandard: ""
              },
              validation: { required: false, min: "", max: "", regex: "", custom: "" },
              skipLogic: [],
              tag
            };
            if (['single_select', 'multi_select', 'dropdown'].includes(type)) {
              newQ.optionsSource = "custom";
              const lower = label.toLowerCase();
              const isYesNo = lower.includes("yes/no") || lower.includes("yes or no") || lower.includes("do you") || lower.includes("is there");
              newQ.options = isYesNo ? [
                { id: `opt-${crypto.randomUUID()}-1`, code: "1", label: "Yes" },
                { id: `opt-${crypto.randomUUID()}-2`, code: "2", label: "No" }
              ] : [
                { id: `opt-${crypto.randomUUID()}-1`, code: "1", label: "Option 1" },
                { id: `opt-${crypto.randomUUID()}-2`, code: "2", label: "Option 2" }
              ];
            }
            return newQ;
          });
          const newSecId = `sec-${crypto.randomUUID()}`;
          const newSec = {
            id: newSecId,
            title: "Generated Survey Questions",
            isCollapsed: false,
            questions: mappedQuestions
          };
          setSections([newSec]);
          setActiveSectionId(newSecId);
        }
      }
    } catch (error) {
      console.error(error);
      alert("Error generating survey: " + error);
    } finally {
      setIsGenerating(false);
      setShowAIModal(false);
      setAiPrompt("");
      setUploadedFileName(null);
    }
  };

  const addSection = () => {
    const newSecId = `sec-${crypto.randomUUID()}`;
    setSections([...sections, {
      id: newSecId,
      title: `Section ${sections.length + 1}`,
      isCollapsed: false,
      questions: []
    }]);
    setActiveSectionId(newSecId);
  };

  const updateSectionTitle = (secId: string, title: string) => {
    setSections(sections.map(s => s.id === secId ? { ...s, title } : s));
  };
  const addQuestion = (type: QuestionType) => {
    if (sections.length === 0) return;
    const newQuestion: Question = {
      id: `q-${crypto.randomUUID()}`,
      type,
      label: `New ${type.replace('_', ' ')} question`,
      helpText: "",
      metadata: { questionCode: "", variableName: "", dataType: "", classificationMapping: "", referenceStandard: "" },
      validation: { required: false, min: "", max: "", minLength: "", maxLength: "", minNumeric: "", maxNumeric: "", regex: "", custom: "" },
      skipLogic: [],
      optionsSource: ['single_select', 'multi_select', 'dropdown'].includes(type) ? 'custom' : undefined,
      options: ['single_select', 'multi_select', 'dropdown'].includes(type) ? [{ id: `opt-${crypto.randomUUID()}`, code: '1', label: 'Option 1' }] : undefined
    };
    
    const targetSectionId = activeSectionId || sections[0].id;
    
    setSections(sections.map(sec => {
      if (sec.id === targetSectionId) {
        return { ...sec, questions: [...sec.questions, newQuestion] };
      }
      return sec;
    }));
    setSelectedQuestionId(newQuestion.id);
  };

  const updateSelectedQuestion = (updates: Partial<Question>) => {
    if (!selectedQuestionId) return;
    setSections(sections.map(sec => ({
      ...sec,
      questions: sec.questions.map(q => {
        if (q.id === selectedQuestionId) {
          let merged = { ...q, ...updates };
          if (merged.type === 'number' && updates.label !== undefined) {
            const autoVal = getAutomaticValidation(updates.label, merged.metadata.variableName);
            merged.validation = {
              ...merged.validation,
              minNumeric: autoVal.minNumeric !== undefined ? autoVal.minNumeric : merged.validation.minNumeric,
              maxNumeric: autoVal.maxNumeric !== undefined ? autoVal.maxNumeric : merged.validation.maxNumeric,
            };
          }
          return merged;
        }
        return q;
      })
    })));
  };

  const updateMetadata = (field: keyof StatisticalMetadata, value: string) => {
    if (!selectedQuestion) return;
    let updatedMetadata = { ...selectedQuestion.metadata, [field]: value };
    let updatedValidation = { ...selectedQuestion.validation };
    if (selectedQuestion.type === 'number' && field === 'variableName') {
      const autoVal = getAutomaticValidation(selectedQuestion.label, value);
      updatedValidation = {
        ...selectedQuestion.validation,
        minNumeric: autoVal.minNumeric !== undefined ? autoVal.minNumeric : selectedQuestion.validation.minNumeric,
        maxNumeric: autoVal.maxNumeric !== undefined ? autoVal.maxNumeric : selectedQuestion.validation.maxNumeric,
      };
    }
    updateSelectedQuestion({
      metadata: updatedMetadata,
      validation: updatedValidation
    });
  };

  const moveQuestion = (secId: string, qId: string, direction: 'up' | 'down') => {
    setSections(sections.map(sec => {
      if (sec.id !== secId) return sec;
      const idx = sec.questions.findIndex(q => q.id === qId);
      if (idx === -1) return sec;
      if (direction === 'up' && idx > 0) {
        const newQs = [...sec.questions];
        [newQs[idx - 1], newQs[idx]] = [newQs[idx], newQs[idx - 1]];
        return { ...sec, questions: newQs };
      }
      if (direction === 'down' && idx < sec.questions.length - 1) {
        const newQs = [...sec.questions];
        [newQs[idx], newQs[idx + 1]] = [newQs[idx + 1], newQs[idx]];
        return { ...sec, questions: newQs };
      }
      return sec;
    }));
  };

  const deleteQuestion = (secId: string, qId: string) => {
    setSections(sections.map(sec => {
      if (sec.id !== secId) return sec;
      return { ...sec, questions: sec.questions.filter(q => q.id !== qId) };
    }));
    if (selectedQuestionId === qId) setSelectedQuestionId(null);
  };

  const toggleSection = (secId: string) => {
    setActiveSectionId(secId);
    setSections(sections.map(sec => sec.id === secId ? { ...sec, isCollapsed: !sec.isCollapsed } : sec));
  };

  const handleSaveDraft = async () => {
    if (!surveyTitle.trim()) {
      alert("Please enter or generate a survey title first.");
      return;
    }
    try {
      const validation = validateSurvey();
      console.log("Draft validation check:", validation);
    } catch (err) {
      console.error(err);
    }
    
    saveSurveyDirectly("draft");
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col -m-6 lg:-m-8">
      {/* Top Toolbar */}
      <div className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between shrink-0 shadow-sm z-10 relative">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-bold text-[#020b18]">AI Survey Builder</h1>
            <p className="text-xs text-gray-500">{surveyTitle ? `Draft: ${surveyTitle}` : "New Survey Draft"}</p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shadow-sm flex items-center gap-1.5">
            MoSPI Standard: {surveyType}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm font-semibold text-gray-600 flex items-center gap-2 hover:text-[#1e3a8a]">
            <Eye className="h-4 w-4" /> Preview
          </button>
          <button 
            onClick={() => setSelectedQuestionId(null)} 
            className="text-sm font-semibold text-gray-600 flex items-center gap-2 hover:text-[#1e3a8a] border-l border-gray-200 pl-3"
          >
            <Settings className="h-4 w-4" /> Survey Settings
          </button>
          <button 
            onClick={() => {
              const draft = {
                id: surveyId || crypto.randomUUID(),
                title: surveyTitle,
                surveyType: surveyType,
                sections: sections,
                updatedAt: new Date().toLocaleString(),
                isPublished: false
              };
              setJsonPreviewContent(JSON.stringify(draft, null, 2));
              setJsonPreviewMode("draft");
              setShowJsonPreviewModal(true);
            }}
            className="text-sm font-semibold text-gray-600 flex items-center gap-2 hover:text-[#1e3a8a] border-l border-gray-200 pl-3"
          >
            <Database className="h-4 w-4" /> Edit JSON
          </button>
          <button 
            onClick={handleSaveDraft}
            className="ml-2 bg-slate-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-200 shadow-sm"
          >
            <Save className="h-4 w-4" /> Save Draft
          </button>
          <button 
            onClick={async () => {
              if (!surveyTitle.trim()) {
                alert("Please enter a survey title first.");
                return;
              }
              const validation = validateSurvey();
              if (validation.criticalErrors && validation.criticalErrors.length > 0) {
                 setPublishValidationErrors(validation.criticalErrors);
                 setPublishSuccess(false);
                 setShowPublishClearanceModal(true);
                 return;
              }

              saveSurveyDirectly("publish");
            }}
            className="bg-[#003366] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#1E3A8A] shadow-sm"
          >
            Publish Survey
          </button>
        </div>
      </div>

      {/* 3-Panel Layout */}
      <div className="flex-1 flex overflow-hidden bg-slate-50">
        
        {/* LEFT PANEL: Palette */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-100 bg-slate-50/50">
            <button 
              onClick={() => setShowAIModal(true)}
              className="w-full mb-4 bg-gradient-to-r from-[#1e3a8a] to-blue-600 text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:from-[#1e3a8a] hover:to-blue-700 shadow-sm"
            >
              <Sparkles className="h-4 w-4" /> Generate with AI
            </button>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Question Types</h2>
          </div>
          <div className="p-3 overflow-y-auto space-y-1">
            {QUESTION_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => addQuestion(type.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-[#1e3a8a]/5 hover:text-[#1e3a8a] transition-colors border border-transparent hover:border-[#1e3a8a]/20"
              >
                <type.icon className="h-4 w-4 text-gray-400" />
                {type.label}
              </button>
            ))}
          </div>
          <div className="mt-auto p-4 border-t border-gray-100 bg-slate-50/50">
            <button 
              onClick={addSection}
              className="w-full border border-dashed border-[#1e3a8a]/40 bg-white text-[#1e3a8a] py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4" /> Add Section
            </button>
          </div>
        </div>

        {/* CENTER PANEL: Canvas */}
        <div className="flex-1 overflow-y-auto p-8 flex justify-center">
          <div className="w-full max-w-3xl space-y-6 pb-20">
            {sections.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-2 mb-6">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Survey Title</label>
                <input
                  type="text"
                  value={surveyTitle}
                  onChange={(e) => setSurveyTitle(e.target.value)}
                  className="w-full text-xl font-bold text-[#020b18] border-b border-gray-200 hover:border-[#1e3a8a]/40 focus:border-[#1e3a8a] outline-none transition-colors py-1 bg-transparent"
                  placeholder="Enter Survey Title..."
                />
              </div>
            )}

            {sections.length === 0 && (
              <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-300 rounded-2xl bg-white min-h-[450px]">
                <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <AlignLeft className="h-8 w-8 text-[#1e3a8a] opacity-50" />
                </div>
                <h3 className="text-xl font-bold text-[#020b18] mb-2">Start Building Your Survey</h3>
                <p className="text-sm text-gray-500 max-w-sm mb-8">
                  Begin building your survey layout manually, or describe your goals to let our AI construct an intelligent draft.
                </p>
                <div className="w-full max-w-sm space-y-4">
                  <div className="flex items-center gap-3 w-full">
                    <button 
                      onClick={() => {
                        if (!surveyTitle.trim()) {
                          setSurveyTitle("Untitled Survey");
                        }
                        addSection();
                      }} 
                      className="flex-1 px-5 py-2.5 bg-white border border-[#1e3a8a] text-[#1e3a8a] font-bold text-sm rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Start Manually
                    </button>
                    <button 
                      onClick={() => setShowAIModal(true)} 
                      className="flex-1 px-5 py-2.5 bg-gradient-to-r from-[#1e3a8a] to-blue-600 text-white font-bold text-sm rounded-lg hover:from-[#1e3a8a] hover:to-blue-700 flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Sparkles className="h-4 w-4" /> Generate with AI
                    </button>
                  </div>
                </div>
              </div>
            )}

            {sections.map(section => (
              <div key={section.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${activeSectionId === section.id ? 'border-[#1e3a8a] ring-1 ring-[#1e3a8a]' : 'border-gray-200'}`}>
                <div 
                  className="bg-slate-50 border-b border-gray-200 p-4 flex items-center justify-between cursor-pointer hover:bg-slate-100"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    {section.isCollapsed ? <ChevronRight className="h-5 w-5 text-gray-500 shrink-0" /> : <ChevronDown className="h-5 w-5 text-gray-500 shrink-0" />}
                    <input 
                      value={section.title}
                      onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="text-base font-bold text-[#020b18] bg-transparent border border-transparent hover:border-gray-300 focus:border-[#1e3a8a] focus:bg-white outline-none rounded px-2 py-1 w-full max-w-sm transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-gray-700 rounded"><ArrowUp className="h-4 w-4" /></button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-700 rounded"><ArrowDown className="h-4 w-4" /></button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 rounded ml-2"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>

                {/* Questions */}
                {!section.isCollapsed && (
                  <div className="p-4 space-y-4">
                    {section.questions.map((q, idx) => {
                      const isSelected = selectedQuestionId === q.id;
                      const TypeIcon = QUESTION_TYPES.find(t => t.id === q.type)?.icon || Type;

                      return (
                        <div 
                          key={q.id}
                          onClick={() => { setSelectedQuestionId(q.id); setActiveSectionId(section.id); }}
                          draggable
                          onDragStart={() => handleDragStart(section.id, idx)}
                          onDragOver={handleDragOver}
                          onDrop={() => handleDrop(section.id, idx)}
                          className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
                            isSelected 
                              ? "border-[#1e3a8a] bg-blue-50/30 shadow-sm" 
                              : "border-gray-200 bg-white hover:border-[#1e3a8a]/30"
                          } ${draggedItem?.qIdx === idx && draggedItem?.secId === section.id ? "opacity-50" : ""}`}
                        >
                          {/* Selection Indicator */}
                          {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1e3a8a] rounded-l-md" />}

                          <div className="flex gap-4">
                            <div className="mt-1">
                              <TypeIcon className={`h-5 w-5 ${isSelected ? 'text-[#1e3a8a]' : 'text-gray-400'}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Q{idx + 1}</span>
                                {q.validation.required && <span className="text-red-500 text-lg leading-none">*</span>}
                                {q.tag && (
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm ${
                                    q.tag === 'AI Suggested' 
                                      ? 'bg-gradient-to-r from-[#1e3a8a] to-blue-600 text-white shadow-sm border-none' 
                                      : 'bg-slate-100 text-gray-700 border border-gray-200'
                                  }`}>
                                    {q.tag === 'AI Suggested' ? <Sparkles className="h-3 w-3" /> : <Archive className="h-3 w-3 text-gray-400" />}
                                    {q.tag}
                                  </span>
                                )}
                              </div>
                              <h3 className="text-sm font-semibold text-gray-900 mb-1">{q.label}</h3>
                              {q.helpText && <p className="text-xs text-gray-500 mb-3">{q.helpText}</p>}
                              
                              {/* Preview of field */}
                              <div className="mt-2 pointer-events-none opacity-60">
                                {['short_text', 'number', 'date'].includes(q.type) && (
                                  <div className="h-10 w-full md:w-2/3 border border-gray-300 rounded bg-gray-50" />
                                )}
                                {q.type === 'single_select' && q.options && (
                                  <div className="space-y-2">
                                    {q.options.slice(0, 3).map(opt => (
                                      <div key={opt.id} className="flex items-center gap-2">
                                        <div className="h-4 w-4 rounded-full border border-gray-400 shrink-0" />
                                        <span className="text-base font-medium text-gray-900">{opt.label}</span>
                                      </div>
                                    ))}
                                    {q.options.length > 3 && <div className="text-xs text-gray-400 ml-6">+{q.options.length - 3} more options</div>}
                                  </div>
                                )}
                                {q.type === 'dropdown' && (
                                  <div className="h-10 w-full md:w-2/3 border border-gray-300 rounded bg-gray-50 flex items-center justify-between px-3">
                                    <span className="text-base font-medium text-gray-900 opacity-60">Select an option...</span>
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Question Actions */}
                            {isSelected && (
                              <div className="flex flex-col items-center gap-1 ml-4 border-l border-gray-200 pl-2">
                                <button onClick={(e) => { e.stopPropagation(); moveQuestion(section.id, q.id, 'up'); }} className="p-1.5 text-gray-400 hover:text-[#1e3a8a] hover:bg-blue-50 rounded"><ArrowUp className="h-4 w-4" /></button>
                                <button onClick={(e) => { e.stopPropagation(); moveQuestion(section.id, q.id, 'down'); }} className="p-1.5 text-gray-400 hover:text-[#1e3a8a] hover:bg-blue-50 rounded"><ArrowDown className="h-4 w-4" /></button>
                                <button className="p-1.5 text-gray-400 hover:text-[#1e3a8a] hover:bg-blue-50 rounded mt-2"><Copy className="h-4 w-4" /></button>
                                <button onClick={(e) => { e.stopPropagation(); deleteQuestion(section.id, q.id); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL: Properties Editor */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto shrink-0 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
          {selectedQuestion ? (
            <div className="p-5 pb-28 space-y-6">
              <div>
                <h2 className="text-base font-bold text-[#020b18] mb-1">Question Properties</h2>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{selectedQuestion.type.replace('_', ' ')}</p>
              </div>

              {/* Basic Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Question Label</label>
                  <textarea 
                    value={selectedQuestion.label}
                    onChange={(e) => updateSelectedQuestion({ label: e.target.value })}
                    className="w-full text-sm border border-gray-300 rounded-lg p-2.5 outline-none focus:border-[#1e3a8a] resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Help Text</label>
                  <input 
                    type="text"
                    value={selectedQuestion.helpText}
                    onChange={(e) => updateSelectedQuestion({ helpText: e.target.value })}
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#1e3a8a]"
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-gray-200 rounded-lg">
                  <span className="text-sm font-semibold text-gray-700">Mandatory Response</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={selectedQuestion.validation.required} onChange={(e) => updateSelectedQuestion({ validation: { ...selectedQuestion!.validation, required: e.target.checked } })} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#10b981]"></div>
                  </label>
                </div>

                {/* Text Validation Controls */}
                {['short_text', 'long_text'].includes(selectedQuestion.type) && (
                  <div className="space-y-3 p-3 bg-slate-50/50 border border-gray-200 rounded-lg">
                    <span className="text-xs font-bold text-gray-600 block uppercase tracking-wider">Text Validations</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Min Length</label>
                        <input
                          type="number"
                          value={selectedQuestion.validation.minLength || ""}
                          onChange={(e) => updateSelectedQuestion({ validation: { ...selectedQuestion!.validation, minLength: e.target.value } })}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#1e3a8a] bg-white font-semibold text-gray-800"
                          placeholder="None"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Max Length</label>
                        <input
                          type="number"
                          value={selectedQuestion.validation.maxLength || ""}
                          onChange={(e) => updateSelectedQuestion({ validation: { ...selectedQuestion!.validation, maxLength: e.target.value } })}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#1e3a8a] bg-white font-semibold text-gray-800"
                          placeholder="None"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Regex Pattern</label>
                      <input
                        type="text"
                        value={selectedQuestion.validation.regex || ""}
                        onChange={(e) => updateSelectedQuestion({ validation: { ...selectedQuestion!.validation, regex: e.target.value } })}
                        className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#1e3a8a] bg-white font-mono font-semibold text-gray-800"
                        placeholder="e.g. ^[A-Z]{5}\d{4}[A-Z]$"
                      />
                    </div>
                  </div>
                )}

                {/* Numeric Validation Controls */}
                {selectedQuestion.type === 'number' && (
                  <div className="space-y-3 p-3 bg-slate-50/50 border border-gray-200 rounded-lg">
                    <span className="text-xs font-bold text-gray-600 block uppercase tracking-wider">Numeric Limits</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Min Value</label>
                        <input
                          type="number"
                          value={selectedQuestion.validation.minNumeric || ""}
                          onChange={(e) => updateSelectedQuestion({ validation: { ...selectedQuestion!.validation, minNumeric: e.target.value } })}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#1e3a8a] bg-white font-semibold text-gray-800"
                          placeholder="Min"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Max Value</label>
                        <input
                          type="number"
                          value={selectedQuestion.validation.maxNumeric || ""}
                          onChange={(e) => updateSelectedQuestion({ validation: { ...selectedQuestion!.validation, maxNumeric: e.target.value } })}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#1e3a8a] bg-white font-semibold text-gray-800"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Choice Validation Controls */}
                {['single_select', 'multi_select', 'dropdown'].includes(selectedQuestion.type) && (
                  <div className="space-y-3 p-3 bg-slate-50/50 border border-gray-200 rounded-lg">
                    <span className="text-xs font-bold text-gray-600 block uppercase tracking-wider">Choice Selections</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Min Select</label>
                        <input
                          type="number"
                          value={selectedQuestion.validation.minSelections || ""}
                          onChange={(e) => updateSelectedQuestion({ validation: { ...selectedQuestion!.validation, minSelections: e.target.value } })}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#1e3a8a] bg-white font-semibold text-gray-800"
                          placeholder="Min"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Max Select</label>
                        <input
                          type="number"
                          value={selectedQuestion.validation.maxSelections || ""}
                          onChange={(e) => updateSelectedQuestion({ validation: { ...selectedQuestion!.validation, maxSelections: e.target.value } })}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#1e3a8a] bg-white font-semibold text-gray-800"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Date Validation Controls */}
                {selectedQuestion.type === 'date' && (
                  <div className="space-y-3 p-3 bg-slate-50/50 border border-gray-200 rounded-lg">
                    <span className="text-xs font-bold text-gray-600 block uppercase tracking-wider">Date Limits</span>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Min Date</label>
                        <input
                          type="date"
                          value={selectedQuestion.validation.minDate || ""}
                          onChange={(e) => updateSelectedQuestion({ validation: { ...selectedQuestion!.validation, minDate: e.target.value } })}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#1e3a8a] bg-white font-semibold text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Max Date</label>
                        <input
                          type="date"
                          value={selectedQuestion.validation.maxDate || ""}
                          onChange={(e) => updateSelectedQuestion({ validation: { ...selectedQuestion!.validation, maxDate: e.target.value } })}
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#1e3a8a] bg-white font-semibold text-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Option Coding (If applicable) */}
              {['single_select', 'multi_select', 'dropdown'].includes(selectedQuestion.type) && (
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                    Options Source
                  </h3>
                  <div className="flex bg-gray-100 p-1 rounded-lg mb-2">
                    <button 
                      className={`flex-1 text-xs font-bold py-1.5 rounded-md ${selectedQuestion.optionsSource !== 'master' ? 'bg-white shadow text-[#1e3a8a]' : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => updateSelectedQuestion({ optionsSource: 'custom' })}
                    >
                      Custom Codes
                    </button>
                    <button 
                      className={`flex-1 text-xs font-bold py-1.5 rounded-md ${selectedQuestion.optionsSource === 'master' ? 'bg-white shadow text-[#1e3a8a]' : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => updateSelectedQuestion({ optionsSource: 'master' })}
                    >
                      Master List
                    </button>
                  </div>

                  {selectedQuestion.optionsSource === 'master' ? (
                    <div className="mt-2 space-y-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Select Master Classification</label>
                      <select 
                        value={selectedQuestion.metadata.classificationMapping}
                        onChange={e => updateMetadata('classificationMapping', e.target.value)}
                        className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#1e3a8a] bg-white"
                      >
                        <option value="">-- Select Master List --</option>
                        <option value="States and Districts (LGD)">States and Districts (LGD)</option>
                        <option value="NCO-2015 (Occupations)">NCO-2015 (Occupations)</option>
                        <option value="NIC-2008 (Industries)">NIC-2008 (Industries)</option>
                        <option value="Relationship to Head">Relationship to Head (Standard)</option>
                      </select>
                      <p className="text-[10px] text-gray-400 mt-1">Options will be auto-populated from the central database during deployment.</p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between mt-4">
                        Custom Codes
                        <button 
                          onClick={() => updateSelectedQuestion({ options: [...(selectedQuestion!.options || []), { id: `opt-${crypto.randomUUID()}`, code: '', label: '' }] })}
                          className="text-[#2563eb] hover:underline normal-case"
                        >Add Option</button>
                      </h3>
                      <div className="space-y-2 mt-2">
                        {selectedQuestion.options?.map((opt, i) => (
                          <div key={opt.id} className="flex items-center gap-2">
                            <div className="cursor-move text-gray-400"><MoreVertical className="h-4 w-4" /></div>
                            <input 
                              type="text" 
                              value={opt.code} 
                              onChange={(e) => {
                                const newOpts = [...(selectedQuestion!.options || [])];
                                newOpts[i].code = e.target.value;
                                updateSelectedQuestion({ options: newOpts });
                              }}
                              placeholder="Code"
                              className="w-12 text-center text-xs font-mono border border-gray-300 rounded p-1 outline-none focus:border-[#1e3a8a] bg-slate-50" 
                            />
                            <input 
                              type="text" 
                              value={opt.label} 
                              onChange={(e) => {
                                const newOpts = [...(selectedQuestion!.options || [])];
                                newOpts[i].label = e.target.value;
                                updateSelectedQuestion({ options: newOpts });
                              }}
                              placeholder="Label"
                              className="flex-1 text-sm border border-gray-300 rounded p-1 outline-none focus:border-[#1e3a8a]" 
                            />
                            <button 
                              onClick={() => {
                                const newOpts = (selectedQuestion!.options || []).filter((_, idx) => idx !== i);
                                updateSelectedQuestion({ options: newOpts });
                              }}
                              className="text-gray-400 hover:text-red-500"
                            ><Trash2 className="h-4 w-4" /></button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* National Statistical Metadata */}
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5" />
                  Statistical Metadata
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Question Code</label>
                  <input type="text" value={selectedQuestion.metadata.questionCode} onChange={e => updateMetadata('questionCode', e.target.value)} className="w-full text-xs font-mono border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-[#1e3a8a]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Variable Name</label>
                  <input type="text" value={selectedQuestion.metadata.variableName} onChange={e => updateMetadata('variableName', e.target.value)} className="w-full text-xs font-mono border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-[#1e3a8a]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Data Type</label>
                    <select value={selectedQuestion.metadata.dataType} onChange={e => updateMetadata('dataType', e.target.value)} className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-[#1e3a8a] bg-white">
                      <option value="numeric">Numeric</option>
                      <option value="categorical">Categorical</option>
                      <option value="text">Text</option>
                      <option value="boolean">Boolean</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Classification</label>
                    <input type="text" value={selectedQuestion.metadata.classificationMapping} onChange={e => updateMetadata('classificationMapping', e.target.value)} placeholder="e.g. NCO-2015" className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-[#1e3a8a]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Reference Standard</label>
                  <input type="text" value={selectedQuestion.metadata.referenceStandard} onChange={e => updateMetadata('referenceStandard', e.target.value)} className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-[#1e3a8a]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Pre-population Source (Aadhaar, PDS, etc.)</label>
                  <select value={selectedQuestion.metadata.prepopulationSource || ''} onChange={e => updateMetadata('prepopulationSource', e.target.value)} className="w-full text-xs border border-gray-300 rounded px-2.5 py-1.5 outline-none focus:border-[#1e3a8a] bg-white">
                    <option value="">None (Ask manually)</option>
                    <option value="aadhaar">Aadhaar Database</option>
                    <option value="pds">Public Distribution System (PDS)</option>
                    <option value="secc">SECC 2011</option>
                    <option value="npr">National Population Register</option>
                  </select>
                </div>
              </div>

              {/* Skip Logic Rule Builder */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    Skip Logic Mapping
                  </h3>
                  <button 
                    onClick={() => {
                      const currentRules = selectedQuestion.skipLogic || [];
                      updateSelectedQuestion({ skipLogic: [...currentRules, { id: `rule-${crypto.randomUUID()}`, operator: 'equals', conditionValue: '', targetQuestionId: '' }] });
                    }}
                    className="text-[#2563eb] text-xs font-bold hover:underline"
                  >
                    + Add Rule
                  </button>
                </div>
                
                {(selectedQuestion.skipLogic || []).length > 0 && (
                  <div className="space-y-3">
                    {(selectedQuestion.skipLogic || []).map((rule, index) => (
                      <div key={rule.id} className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 relative">
                        <button 
                          onClick={() => {
                            const newRules = selectedQuestion.skipLogic!.filter(r => r.id !== rule.id);
                            updateSelectedQuestion({ skipLogic: newRules });
                          }}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <div className="grid grid-cols-1 gap-3 pr-6">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-bold">
                                Operator
                              </div>
                              <select 
                                value={rule.operator || 'equals'}
                                onChange={(e) => {
                                  const newRules = [...selectedQuestion.skipLogic!];
                                  newRules[index].operator = e.target.value;
                                  updateSelectedQuestion({ skipLogic: newRules });
                                }}
                                className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#1e3a8a] bg-white"
                              >
                                {['single_select', 'dropdown', 'multi_select'].includes(selectedQuestion.type) ? (
                                  <>
                                    <option value="equals">Equals</option>
                                    <option value="not_equals">Does Not Equal</option>
                                  </>
                                ) : ['number', 'date'].includes(selectedQuestion.type) ? (
                                  <>
                                    <option value="equals">Equals</option>
                                    <option value="greater_than">Greater Than</option>
                                    <option value="less_than">Less Than</option>
                                  </>
                                ) : (
                                  <>
                                    <option value="equals">Equals</option>
                                    <option value="contains">Contains</option>
                                  </>
                                )}
                              </select>
                            </div>
                            
                            <div>
                              <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-bold">
                                Value
                              </div>
                              {['single_select', 'dropdown', 'multi_select'].includes(selectedQuestion.type) && selectedQuestion.options ? (
                                <select 
                                  value={rule.conditionValue}
                                  onChange={(e) => {
                                    const newRules = [...selectedQuestion.skipLogic!];
                                    newRules[index].conditionValue = e.target.value;
                                    updateSelectedQuestion({ skipLogic: newRules });
                                  }}
                                  className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#1e3a8a] bg-white"
                                >
                                  <option value="">-- Select Option --</option>
                                  {selectedQuestion.options.map(opt => (
                                    <option key={opt.id} value={opt.id}>{opt.label || `Code: ${opt.code}`}</option>
                                  ))}
                                </select>
                              ) : (
                                <input 
                                  type={selectedQuestion.type === 'number' ? 'number' : selectedQuestion.type === 'date' ? 'date' : 'text'}
                                  value={rule.conditionValue || ''}
                                  onChange={(e) => {
                                    const newRules = [...selectedQuestion.skipLogic!];
                                    newRules[index].conditionValue = e.target.value;
                                    updateSelectedQuestion({ skipLogic: newRules });
                                  }}
                                  placeholder="Enter value..."
                                  className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#1e3a8a] bg-white"
                                />
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-bold">
                              THEN jump to
                            </div>
                            <select
                              value={rule.targetQuestionId}
                              onChange={(e) => {
                                const newRules = [...selectedQuestion.skipLogic!];
                                newRules[index].targetQuestionId = e.target.value;
                                updateSelectedQuestion({ skipLogic: newRules });
                              }}
                              className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#1e3a8a] bg-white"
                            >
                              <option value="">-- Select Target --</option>
                              <option value="end_survey">End of Survey (Submit)</option>
                              {sections.flatMap(s => s.questions)
                                .filter(q => q.id !== selectedQuestionId)
                                .map(q => (
                                  <option key={q.id} value={q.id}>{q.label ? (q.label.substring(0, 30) + (q.label.length > 30 ? '...' : '')) : q.id}</option>
                                ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-slate-50 flex items-center gap-2">
                <Settings className="h-5 w-5 text-[#1e3a8a]" />
                <h2 className="text-sm font-bold text-[#020b18]">Global Survey Settings</h2>
              </div>
              <div className="p-6 flex-1 overflow-y-auto space-y-8">
                
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    Survey Classification
                  </h3>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-750 mb-1">Survey Category / Type</label>
                    <select
                      value={surveyType}
                      onChange={(e) => setSurveyType(e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 bg-white font-semibold text-gray-700 outline-none focus:border-[#1e3a8a]"
                    >
                      <option value="Household Survey">Household Survey</option>
                      <option value="Agriculture Survey">Agriculture Survey</option>
                      <option value="Employment Survey">Employment Survey</option>
                      <option value="Health Survey">Health Survey</option>
                      <option value="Education Survey">Education Survey</option>
                      <option value="Consumer Expenditure Survey">Consumer Expenditure Survey</option>
                      <option value="Tourism Survey">Tourism Survey</option>
                      <option value="Industry Survey">Industry Survey</option>
                      <option value="Labour Force Survey">Labour Force Survey</option>
                      <option value="General / Other">General / Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    Survey Quality Thresholds
                  </h3>
                  <div className="space-y-3 p-3 bg-slate-50/50 border border-gray-200 rounded-lg">


                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Rec. Completion Time (Mins)</label>
                      <input 
                        type="number"
                        value={recommendedCompletionTime}
                        onChange={(e) => saveThresholdConfig({ recommendedCompletionTime: parseInt(e.target.value) || 0 })}
                        className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-[#1e3a8a] bg-white font-semibold text-gray-800"
                      />
                    </div>
                    
                    <label className="flex items-center justify-between py-1.5 cursor-pointer">
                      <span className="text-xs font-semibold text-gray-700">Require GPS Validation</span>
                      <input 
                        type="checkbox"
                        checked={requireGPS}
                        onChange={(e) => saveThresholdConfig({ requireGPS: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]"
                      />
                    </label>

                    <label className="flex items-center justify-between py-1.5 cursor-pointer">
                      <span className="text-xs font-semibold text-gray-700">Require Mobile Verification</span>
                      <input 
                        type="checkbox"
                        checked={requireMobileVerification}
                        onChange={(e) => saveThresholdConfig({ requireMobileVerification: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]"
                      />
                    </label>

                    <label className="flex items-center justify-between py-1.5 cursor-pointer">
                      <span className="text-xs font-semibold text-gray-700">Allow Anonymous Responses</span>
                      <input 
                        type="checkbox"
                        checked={allowAnonymous}
                        onChange={(e) => saveThresholdConfig({ allowAnonymous: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]"
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    Data Privacy & Consent
                  </h3>
                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]" />
                    <div>
                      <span className="text-sm font-bold text-gray-900 block">Require Consent Form</span>
                      <span className="text-xs text-gray-500">Show standard MoSPI data privacy consent form before survey starts.</span>
                    </div>
                  </label>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    Paradata Tracking
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm font-bold text-gray-900">Capture GPS Location</span>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]" />
                    </label>
                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-bold text-gray-900">Track Question Timestamps</span>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]" />
                    </label>
                    <label className="flex items-center justify-between p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-bold text-gray-900">Log Device Identity</span>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]" />
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    Offline Capabilities
                  </h3>
                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]" />
                    <div>
                      <span className="text-sm font-bold text-gray-900 block">Enable Offline Sync</span>
                      <span className="text-xs text-gray-500">Allow enumerators to collect data without internet connection.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* AI Generator Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-[#1e3a8a]/20">
            <div className="bg-[#1e3a8a] p-5 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-200" /> AI Survey Architect
                </h3>
                <p className="text-blue-100 text-xs mt-0.5">Describe your survey goals or demographic targets.</p>
              </div>
              <button onClick={() => setShowAIModal(false)} className="text-white/70 hover:text-white">
                ✕
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Survey Context & Requirements</label>
              
              {/* Document Upload Area */}
              <div className="mb-4">
                <label className="flex items-center justify-center w-full h-24 px-4 transition bg-slate-50 border-2 border-gray-300 border-dashed rounded-xl appearance-none cursor-pointer hover:border-[#1e3a8a] hover:bg-blue-50 focus:outline-none">
                  <div className="flex flex-col items-center space-y-1 text-center">
                    {isExtracting ? (
                      <div className="flex flex-col items-center">
                        <RefreshCw className="h-6 w-6 text-[#1e3a8a] animate-spin mb-1" />
                        <span className="text-sm font-medium text-gray-600">Extracting local document data...</span>
                      </div>
                    ) : uploadedFileName ? (
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 text-[#1e3a8a]">
                          <Database className="h-5 w-5" />
                          <span className="text-sm font-bold">{uploadedFileName}</span>
                        </div>
                        <span className="text-xs text-emerald-600 font-semibold mt-1">Ready for AI processing</span>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">
                          <span className="text-[#1e3a8a] font-bold underline">Click to upload</span> a document (PDF, TXT, DOCX)
                        </span>
                        <span className="text-xs text-gray-500">AI will extract questions and add related extras</span>
                      </>
                    )}
                  </div>
                  <input type="file" name="file_upload" className="hidden" onChange={handleFileUpload} accept=".pdf,.txt,.docx,.csv" disabled={isExtracting} />
                </label>
              </div>

              <textarea 
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="e.g. I need 5 questions for a rural agricultural survey assessing water usage and crop rotation..."
                className="w-full text-sm border border-gray-300 rounded-lg p-3 outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] min-h-[100px] resize-none mb-4"
                disabled={isExtracting}
              />
              <div className="mb-6 flex items-center justify-between border border-gray-200 rounded-lg p-3 bg-slate-50">
                <label className="text-sm font-bold text-gray-700">Number of Questions to Generate:</label>
                <input 
                  type="number"
                  min="1"
                  max="50"
                  value={minQuestions}
                  onChange={(e) => setMinQuestions(parseInt(e.target.value) || 1)}
                  className="w-20 text-center text-sm border border-gray-300 rounded-md py-1.5 outline-none focus:border-[#1e3a8a] font-semibold text-gray-800 bg-white shadow-sm"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => { setShowAIModal(false); setUploadedFileName(null); setAiPrompt(""); }}
                  className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAIGenerate}
                  disabled={isGenerating || isExtracting || (!aiPrompt.trim() && !uploadedFileName)}
                  className="bg-gradient-to-r from-[#1e3a8a] to-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:from-[#1e3a8a] hover:to-blue-700 disabled:opacity-50 transition-all"
                >
                  {isGenerating ? (
                    <span className="animate-pulse">Analyzing & Generating...</span>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Generate Survey
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Publish Clearance Gateway Modal */}
      {showPublishClearanceModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className={`p-5 text-white flex justify-between items-center ${publishSuccess ? 'bg-emerald-600' : 'bg-red-700'}`}>
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  {publishSuccess ? (
                    <><CheckCircle2 className="h-5 w-5" /> National Compliance Met</>
                  ) : (
                    <><AlertTriangle className="h-5 w-5" /> Clearance Certificate Denied</>
                  )}
                </h3>
                <p className="text-xs opacity-90 mt-0.5">National Quality Assurance Standards (NQAS) Verification</p>
              </div>
              <button onClick={() => setShowPublishClearanceModal(false)} className="text-white hover:text-white/80 font-bold text-sm">
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {publishSuccess ? (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-semibold leading-relaxed">
                    ✓ The survey draft successfully matches all required quality validation standards, minimum question count ({minQuestions}), and mandatory metadata properties.
                  </div>
                  <div className="text-center py-4">
                    <span className="text-xs text-gray-500 font-bold uppercase block mb-1">Assigned Survey Status</span>
                    <span className="text-lg font-black text-emerald-700 uppercase bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200 shadow-sm inline-block">
                      Clearance Issued & Published
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-800 text-xs font-semibold leading-relaxed">
                    ⚠️ Publishing has been blocked. This survey fails one or more critical MoSPI validation policies. Please resolve the following issues:
                  </div>
                  <div className="border border-red-200 rounded-xl bg-slate-50 p-4 max-h-56 overflow-y-auto space-y-2">
                    {publishValidationErrors && publishValidationErrors.map((err, i) => (
                      <div key={i} className="text-xs text-red-700 font-semibold flex items-start gap-1.5 leading-relaxed">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{err}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowPublishClearanceModal(false)}
                  className="px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-slate-100 rounded-lg border border-gray-200"
                >
                  Close
                </button>
                {publishSuccess && (
                  <button
                    onClick={() => {
                      setShowPublishClearanceModal(false);
                      window.location.href = "/admin/publish";
                    }}
                    className="bg-[#003366] text-white px-5 py-2.5 text-xs font-bold rounded-lg hover:bg-[#1E3A8A] shadow-sm animate-pulse"
                  >
                    Go to Deployment Center
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* JSON Preview Modal */}
      {showJsonPreviewModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="bg-[#1e3a8a] p-4 text-white flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-200" /> JSON Schema Preview
                </h3>
                <p className="text-blue-100 text-xs mt-0.5">
                  Review or edit the raw JSON before saving to the database.
                </p>
              </div>
              <button onClick={() => setShowJsonPreviewModal(false)} className="text-white hover:text-white/80 font-bold text-sm">
                ✕
              </button>
            </div>
            <div className="flex-1 p-4 overflow-hidden flex flex-col min-h-[75vh]">
              <textarea 
                value={jsonPreviewContent}
                onChange={e => setJsonPreviewContent(e.target.value)}
                className="w-full flex-1 font-mono text-xs md:text-sm bg-[#1e1e1e] text-[#d4d4d4] border border-slate-300 rounded-lg p-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none min-h-[60vh] whitespace-pre overflow-auto"
                spellCheck={false}
              />
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between gap-3 shrink-0">
              <button
                onClick={() => {
                  try {
                    setJsonPreviewContent(JSON.stringify(JSON.parse(jsonPreviewContent), null, 2));
                  } catch (e) { alert("Invalid JSON"); }
                }}
                className="px-5 py-2.5 text-xs font-bold text-[#1e3a8a] bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200"
              >
                Format JSON
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowJsonPreviewModal(false)}
                  className="px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-slate-200 rounded-lg border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmJsonSave}
                  className="bg-[#003366] text-white px-6 py-2.5 text-xs font-bold rounded-lg hover:bg-[#1E3A8A] shadow-sm flex items-center gap-2"
                >
                  <Save className="h-4 w-4" /> 
                  {jsonPreviewMode === "publish" ? "Confirm & Publish" : "Confirm Save Draft"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
