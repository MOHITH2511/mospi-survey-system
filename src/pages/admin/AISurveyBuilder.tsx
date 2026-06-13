import React, { useState } from "react";
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
  Archive,
  Clock,
  Smartphone
} from "lucide-react";

// --- Types ---
type QuestionType = 'short_text' | 'long_text' | 'number' | 'single_select' | 'multi_select' | 'dropdown' | 'date' | 'gps' | 'image' | 'audio' | 'matrix';

interface SurveyOption { id: string; code: string; label: string; }

interface StatisticalMetadata {
  questionCode: string;
  variableName: string;
  dataType: string;
  classificationMapping: string;
  referenceStandard: string;
  prepopulationSource?: string;
}

interface SkipLogicRule {
  id: string;
  operator?: string;
  conditionValue: string;
  targetQuestionId: string;
}

interface ValidationRules {
  required: boolean;
  min: string;
  max: string;
  regex: string;
  custom: string;
}

interface Question {
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

interface Section {
  id: string;
  title: string;
  isCollapsed: boolean;
  questions: Question[];
}

// --- Initial Data ---
const initialSections: Section[] = [];

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

  // Get currently selected question
  let selectedQuestion: Question | null = null;
  sections.forEach(sec => {
    const q = sec.questions.find(q => q.id === selectedQuestionId);
    if (q) {
      selectedQuestion = q;
    }
  });

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

  const handleAIGenerate = () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const newQs: Question[] = [
        {
          id: `q-${crypto.randomUUID()}-1`,
          type: "single_select",
          label: "What is the primary source of irrigation for your land?",
          helpText: "Select the most frequently used method.",
          optionsSource: "custom",
          options: [
            { id: `opt-${crypto.randomUUID()}-1`, code: "1", label: "Canal" },
            { id: `opt-${crypto.randomUUID()}-2`, code: "2", label: "Tube well" },
            { id: `opt-${crypto.randomUUID()}-3`, code: "3", label: "Rainfed" }
          ],
          metadata: { questionCode: "Q_IRR_01", variableName: "irrigation_source", dataType: "categorical", classificationMapping: "", referenceStandard: "" },
          validation: { required: true, min: "", max: "", regex: "", custom: "" },
          skipLogic: [],
          tag: "AI Suggested"
        },
        {
          id: `q-${crypto.randomUUID()}-2`,
          type: "number",
          label: "Total land area owned (in Hectares)?",
          helpText: "Include all parcels of land.",
          metadata: { questionCode: "Q_LND_01", variableName: "land_area", dataType: "numeric", classificationMapping: "", referenceStandard: "" },
          validation: { required: true, min: "0", max: "100", regex: "", custom: "" },
          skipLogic: [],
          tag: "From S-2024-012"
        }
      ];

      setSections(prev => {
        if (prev.length === 0) {
          const newSecId = `sec-${crypto.randomUUID()}`;
          setActiveSectionId(newSecId);
          return [{
            id: newSecId,
            title: "Generated Section",
            isCollapsed: false,
            questions: newQs
          }];
        }
        const targetSecId = activeSectionId || prev[0].id;
        return prev.map(sec => {
          if (sec.id === targetSecId) {
            return { ...sec, questions: [...sec.questions, ...newQs] };
          }
          return sec;
        });
      });
      setIsGenerating(false);
      setShowAIModal(false);
      setAiPrompt("");
    }, 1500);
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
      validation: { required: false, min: "", max: "", regex: "", custom: "" },
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
      questions: sec.questions.map(q => q.id === selectedQuestionId ? { ...q, ...updates } : q)
    })));
  };

  const updateMetadata = (field: keyof StatisticalMetadata, value: string) => {
    if (!selectedQuestion) return;
    updateSelectedQuestion({
      metadata: { ...selectedQuestion.metadata, [field]: value }
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

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col -m-6 lg:-m-8">
      {/* Top Toolbar */}
      <div className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between shrink-0 shadow-sm z-10 relative">
        <div>
          <h1 className="text-lg font-bold text-[#020b18]">AI Survey Builder</h1>
          <p className="text-xs text-gray-500">{surveyTitle ? `Draft: ${surveyTitle}` : "New Survey Draft"}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm font-semibold text-gray-600 flex items-center gap-2 hover:text-[#1e3a8a]">
            <Eye className="h-4 w-4" /> Preview
          </button>
          <button className="text-sm font-semibold text-gray-600 flex items-center gap-2 hover:text-[#1e3a8a] border-l border-gray-200 pl-3">
            <Settings className="h-4 w-4" /> Survey Settings
          </button>
          <button className="ml-2 bg-[#1e3a8a] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#004e8c] shadow-sm">
            <Save className="h-4 w-4" /> Save Draft
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
              className="w-full mb-4 bg-[#1e3a8a] text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#1e3a8a]/90 shadow-sm"
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
            {sections.length === 0 && (
              <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-300 rounded-2xl bg-white min-h-[450px]">
                <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <AlignLeft className="h-8 w-8 text-[#1e3a8a] opacity-50" />
                </div>
                <h3 className="text-xl font-bold text-[#020b18] mb-2">Start Building Your Survey</h3>
                <p className="text-sm text-gray-500 max-w-sm mb-8">
                  Enter your survey title to begin manually, or describe your goals to let our AI construct an intelligent draft.
                </p>
                <div className="w-full max-w-sm space-y-4">
                  <input
                    type="text"
                    value={surveyTitle}
                    onChange={(e) => setSurveyTitle(e.target.value)}
                    placeholder="Enter Survey Title..."
                    className="w-full text-center border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] font-semibold text-[#020b18]"
                  />
                  <div className="flex items-center gap-3 w-full">
                    <button 
                      onClick={addSection} 
                      disabled={!surveyTitle.trim()}
                      className="flex-1 px-5 py-2.5 bg-white border border-[#1e3a8a] text-[#1e3a8a] font-bold text-sm rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                    >
                      Start Manually
                    </button>
                    <button 
                      onClick={() => setShowAIModal(true)} 
                      className="flex-1 px-5 py-2.5 bg-[#1e3a8a] text-white font-bold text-sm rounded-lg hover:bg-[#1e3a8a]/90 flex items-center justify-center gap-2 shadow-sm"
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
                                      ? 'bg-[#1e3a8a] text-white' 
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
            <div className="p-5 space-y-6">
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
              <textarea 
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="e.g. I need 5 questions for a rural agricultural survey assessing water usage and crop rotation..."
                className="w-full text-sm border border-gray-300 rounded-lg p-3 outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] min-h-[120px] resize-none mb-4"
              />
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowAIModal(false)}
                  className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAIGenerate}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="bg-[#1e3a8a] text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#1e3a8a]/90 disabled:opacity-50 transition-all"
                >
                  {isGenerating ? (
                    <span className="animate-pulse">Generating...</span>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> Generate Questions
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
