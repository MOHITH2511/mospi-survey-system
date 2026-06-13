import React, { useState } from "react";
import {
  Search,
  Filter,
  Globe2,
  Copy,
  Eye,
  FileEdit,
  Database,
  CheckCircle2
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

const categories = ["All", "Household", "Health", "Employment", "Agriculture", "Education", "Infrastructure"];

const questionsData = [
  {
    id: "Q_OCC_01",
    category: "Employment",
    text: "What is your primary occupation?",
    code: "Q_OCC_01",
    type: "Single Select",
    usageCount: 142,
    languages: ["EN", "HI", "TA", "TE", "MR"],
    standard: "NCO-2015",
    isVerified: true,
  },
  {
    id: "Q_HH_SIZE",
    category: "Household",
    text: "How many members are in the household?",
    code: "Q_HH_SIZE",
    type: "Numeric",
    usageCount: 521,
    languages: ["EN", "HI", "BN", "GU", "KN", "ML", "TA", "TE", "MR", "OR", "PA"],
    standard: "Census Master",
    isVerified: true,
  },
  {
    id: "Q_AGR_LAND",
    category: "Agriculture",
    text: "Total area of operational holding (in hectares)",
    code: "Q_AGR_LAND",
    type: "Numeric",
    usageCount: 84,
    languages: ["EN", "HI", "PB", "GJ"],
    standard: "Agri-Census",
    isVerified: true,
  },
  {
    id: "Q_HLT_DIS",
    category: "Health",
    text: "Does any member of the household suffer from a chronic illness?",
    code: "Q_HLT_DIS",
    type: "Single Select",
    usageCount: 19,
    languages: ["EN", "HI", "KN", "ML"],
    standard: "NFHS",
    isVerified: false,
  },
];

export default function QuestionBank() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredQuestions = activeCategory === "All" 
    ? questionsData 
    : questionsData.filter(q => q.category === activeCategory);

  return (
    <div className="space-y-6">
      <PageHeader
        title="National Question Bank"
        description="Repository of standardized, translated, and officially verified statistical questions."
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search questions by text, code, or standard..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1e3a8a] bg-slate-50"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="h-4 w-4" /> Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1e3a8a] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#004e8c]">
            <Database className="h-4 w-4" /> Propose Question
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeCategory === cat 
                ? "bg-[#1e3a8a] text-white shadow-sm" 
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Question Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredQuestions.map((q) => (
          <div key={q.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 flex-1">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-gray-600 border border-gray-200 font-mono">
                  {q.code}
                </span>
                {q.isVerified && (
                  <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold border border-emerald-100">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </div>
                )}
              </div>
              
              <h3 className="text-base font-bold text-[#020b18] mb-2 leading-snug line-clamp-2">
                {q.text}
              </h3>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                  {q.type}
                </span>
                <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                  Ref: {q.standard}
                </span>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">{q.usageCount}</span>
                <span>Surveys</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 font-semibold text-gray-900">
                  <Globe2 className="h-3.5 w-3.5 text-[#2563eb]" /> {q.languages.length}
                </div>
                <span>Languages</span>
              </div>
            </div>

            <div className="grid grid-cols-3 border-t border-gray-100 divide-x divide-gray-100">
              <button className="flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#1e3a8a] transition-colors">
                <Eye className="h-3.5 w-3.5" /> Preview
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#1e3a8a] transition-colors">
                <FileEdit className="h-3.5 w-3.5" /> Edit
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-[#1e3a8a] bg-blue-50/50 hover:bg-blue-50 transition-colors">
                <Copy className="h-3.5 w-3.5" /> Reuse
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
