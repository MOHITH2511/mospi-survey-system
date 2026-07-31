import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  UploadCloud, 
  FileText, 
  Cpu, 
  ArrowRight,
  ListTodo,
  FileQuestion,
  Loader2,
  AlertCircle
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default function SurveyImport() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [uploadedFileName, setUploadedFileName] = useState<string>("NSSO_Schedule_25.pdf");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setStep(2);

      const isText = file.name.endsWith('.txt') || file.name.endsWith('.csv');
      
      if (isText) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 5).slice(0, 15);
          sessionStorage.setItem("mospi_imported_questions", JSON.stringify(lines));
          sessionStorage.setItem("mospi_imported_filename", file.name);
          setTimeout(() => setStep(3), 1000);
        };
        reader.readAsText(file);
      } else {
        // Mock extraction for PDFs
        setTimeout(() => {
          const mockLines = [
            "What is your household size?",
            "What is the primary occupation of the head of household?",
            "What is your average monthly income?",
            "Do you own agricultural land?"
          ];
          sessionStorage.setItem("mospi_imported_questions", JSON.stringify(mockLines));
          sessionStorage.setItem("mospi_imported_filename", file.name);
          setStep(3);
        }, 2000);
      }
    }
  };


  return (
    <div className="space-y-6">
      <PageHeader
        title="Survey Import Center"
        description="Digitize legacy PDF schedules and legacy questionnaires using AI."
      />

      {/* Stepper */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-[#1e3a8a]' : 'text-gray-400'}`}>
            <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 mb-2 ${step >= 1 ? 'border-[#1e3a8a] bg-blue-50' : 'border-gray-200'}`}>
              <UploadCloud className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">1. Upload PDF</span>
          </div>
          <div className={`flex-1 h-0.5 mx-4 ${step >= 2 ? 'bg-[#1e3a8a]' : 'bg-gray-100'}`} />
          
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-[#1e3a8a]' : 'text-gray-400'}`}>
            <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 mb-2 ${step >= 2 ? 'border-[#1e3a8a] bg-blue-50' : 'border-gray-200'}`}>
              <Cpu className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">2. AI Parsing</span>
          </div>
          <div className={`flex-1 h-0.5 mx-4 ${step >= 3 ? 'bg-[#1e3a8a]' : 'bg-gray-100'}`} />
          
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-[#1e3a8a]' : 'text-gray-400'}`}>
            <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 mb-2 ${step >= 3 ? 'border-[#1e3a8a] bg-blue-50' : 'border-gray-200'}`}>
              <FileQuestion className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">3. Review</span>
          </div>
        </div>
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 shadow-sm text-center max-w-3xl mx-auto">
          <div className="h-20 w-20 bg-blue-50 text-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-6">
            <UploadCloud className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Legacy Survey Document</h2>
          <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
            Upload PDF or scanned schedules. Our AI engine will automatically extract sections, questions, and option codes.
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:bg-gray-50 transition-colors cursor-pointer">
            <input type="file" className="hidden" id="file-upload" onChange={handleFileUpload} accept=".pdf,.txt,.docx,.csv" />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center w-full h-full">
              <FileText className="h-8 w-8 text-gray-400 mb-3" />
              <span className="text-sm font-semibold text-[#1e3a8a]">Click to browse</span>
              <span className="text-xs text-gray-500 mt-1">Supports PDF, DOCX (Max 50MB)</span>
            </label>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <button 
              onClick={() => setStep(2)}
              className="bg-[#1e3a8a] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-[#004e8c] transition-colors"
            >
              Simulate Upload (NSSO_Schedule_25.pdf)
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Parsing */}
      {step === 2 && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 shadow-sm text-center max-w-3xl mx-auto">
          <div className="h-20 w-20 bg-blue-50 text-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Cpu className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Extracting Intelligence...</h2>
          <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
            Parsing {uploadedFileName}. Scanning for structural hierarchy, matrix questions, and option codings.
          </p>
          
          <div className="max-w-sm mx-auto space-y-4 text-left">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Loader2 className="h-4 w-4 text-[#1e3a8a] animate-spin" />
              <span>Detecting document sections...</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 opacity-0" />
              <span>Identifying statistical variables...</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Review Extraction Results</h2>
            <button 
              onClick={() => navigate('/admin/survey-builder')}
              className="bg-[#10b981] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-600 transition-colors flex items-center gap-2"
            >
              Confirm & Open in Builder <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Summary Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-1 h-fit">
              <h3 className="text-base font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Extraction Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Document</span>
                  <span className="text-sm font-semibold text-gray-900">{uploadedFileName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Detected Sections</span>
                  <span className="text-sm font-bold text-[#1e3a8a]">4 Sections</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Questions</span>
                  <span className="text-sm font-bold text-[#1e3a8a]">28 Questions</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Variable Codes Mapped</span>
                  <span className="text-sm font-bold text-[#10b981]">100% Match</span>
                </div>
              </div>

              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-xs font-medium">Please review Section 3 (Employment). The AI converted a dense table into a Matrix Question. Verify the row options.</p>
              </div>
            </div>

            {/* Structure Preview */}
            <div className="rounded-xl border border-gray-200 bg-white p-0 shadow-sm lg:col-span-2 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-slate-50 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">Detected Structure</h3>
                <span className="text-xs font-semibold text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">Editable in next step</span>
              </div>
              
              <div className="divide-y divide-gray-100">
                {/* Section 1 */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <ListTodo className="h-5 w-5 text-[#1e3a8a]" />
                    <h4 className="font-bold text-gray-900">1. Identification of Sample Household</h4>
                  </div>
                  <div className="pl-7 space-y-3">
                    <div className="bg-gray-50 border border-gray-200 rounded p-3 text-sm flex justify-between">
                      <span className="font-medium text-gray-700">1.1 State/UT Code</span>
                      <span className="text-xs font-mono bg-white px-1 border border-gray-200 rounded">Numeric (2)</span>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded p-3 text-sm flex justify-between">
                      <span className="font-medium text-gray-700">1.2 Sector (Rural-1, Urban-2)</span>
                      <span className="text-xs font-mono bg-white px-1 border border-gray-200 rounded">Single Select</span>
                    </div>
                  </div>
                </div>

                {/* Section 2 */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <ListTodo className="h-5 w-5 text-[#1e3a8a]" />
                    <h4 className="font-bold text-gray-900">2. Household Characteristics</h4>
                  </div>
                  <div className="pl-7 space-y-3">
                    <div className="bg-gray-50 border border-gray-200 rounded p-3 text-sm flex justify-between">
                      <span className="font-medium text-gray-700">2.1 Household size</span>
                      <span className="text-xs font-mono bg-white px-1 border border-gray-200 rounded">Numeric</span>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded p-3 text-sm flex justify-between">
                      <span className="font-medium text-gray-700">2.2 Principal occupation code</span>
                      <span className="text-xs font-mono bg-white px-1 border border-gray-200 rounded">NCO-2015 mapped</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
