import { useState } from "react";
import {
  Globe,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Map,
  Users,
  Search,
  CheckSquare,
  Square,
  FileText
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import indiaMap from "@/assets/india-outline.svg";

export default function DeploymentCenter() {
  const [selectedSurvey, setSelectedSurvey] = useState("");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  // Toggle state
  const toggleState = (stateName: string) => {
    setSelectedZone(null); // Clear zone selection if manually picking states
    if (selectedStates.includes(stateName)) {
      setSelectedStates(selectedStates.filter(s => s !== stateName));
    } else {
      setSelectedStates([...selectedStates, stateName]);
    }
  };

  // Toggle Zone
  const selectZone = (zone: string, statesInZone: string[]) => {
    setSelectedZone(zone);
    setSelectedStates(statesInZone);
  };

  const southZone = ["Tamil Nadu", "Karnataka", "Kerala", "Andhra Pradesh", "Telangana"];
  const northZone = ["Punjab", "Haryana", "Himachal Pradesh", "Uttar Pradesh", "Uttarakhand"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deployment Center"
        description="Multi-region publishing and field investigator assignment for national rollouts."
      />

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-14rem)]">
        
        {/* Left Column: Configuration */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-slate-50">
            <h2 className="text-base font-bold text-[#020b18]">Deployment Configuration</h2>
            <p className="text-xs text-gray-500 mt-1">Select survey and configure geographic deployment.</p>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-6">
            
            {/* Survey Selection */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Select Survey</label>
              <select 
                value={selectedSurvey}
                onChange={(e) => setSelectedSurvey(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-[#1e3a8a] bg-white font-semibold text-gray-700"
              >
                <option value="">-- Choose a Survey --</option>
                <option value="National Economic Survey 2026">National Economic Survey 2026</option>
                <option value="Agricultural Census">Agricultural Census</option>
                <option value="Healthcare Infrastructure Assessment">Healthcare Infrastructure Assessment</option>
              </select>
            </div>

            {/* Deployment Channels (Multimodal) */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Delivery Channels</label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-lg cursor-pointer bg-blue-50/50 hover:bg-blue-50 transition-colors">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]" />
                  <span className="text-xs font-bold text-gray-700">Web App</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]" />
                  <span className="text-xs font-bold text-gray-700">WhatsApp Bot</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]" />
                  <span className="text-xs font-bold text-gray-700">IVR Voice Call</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]" />
                  <span className="text-xs font-bold text-gray-700">AI Avatar</span>
                </label>
              </div>
            </div>

            {/* Quick Select Zones */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Quick Select</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => selectZone("National", [...southZone, ...northZone])}
                  className={`py-2 text-sm font-semibold rounded-lg border ${selectedZone === "National" ? 'bg-blue-50 border-[#1e3a8a] text-[#1e3a8a]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  National Rollout
                </button>
                <button 
                  onClick={() => selectZone("South", southZone)}
                  className={`py-2 text-sm font-semibold rounded-lg border ${selectedZone === "South" ? 'bg-blue-50 border-[#1e3a8a] text-[#1e3a8a]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  Entire South Zone
                </button>
                <button 
                  onClick={() => selectZone("North", northZone)}
                  className={`py-2 text-sm font-semibold rounded-lg border ${selectedZone === "North" ? 'bg-blue-50 border-[#1e3a8a] text-[#1e3a8a]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  Entire North Zone
                </button>
              </div>
            </div>

            {/* Visual Hierarchy Tree */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block flex items-center justify-between">
                Geographic Tree Selection
                <Search className="h-3.5 w-3.5 text-gray-400" />
              </label>
              <div className="border border-gray-200 rounded-lg p-3 space-y-2 max-h-64 overflow-y-auto bg-slate-50/50">
                
                {/* Tree Item: Country */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                    <Globe className="h-4 w-4 text-[#1e3a8a]" />
                    <span className="font-bold text-sm text-gray-900">India</span>
                  </div>
                  
                  {/* Tree Children: States */}
                  <div className="pl-6 space-y-2 border-l border-gray-200 ml-2">
                    {/* State 1 */}
                    <div>
                      <div className="flex items-center gap-2 cursor-pointer group" onClick={() => toggleState("Karnataka")}>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                        {selectedStates.includes("Karnataka") ? (
                          <CheckSquare className="h-4 w-4 text-[#1e3a8a]" />
                        ) : (
                          <Square className="h-4 w-4 text-gray-300 group-hover:border-gray-400" />
                        )}
                        <span className="font-semibold text-sm text-gray-700">Karnataka</span>
                      </div>
                      
                      {/* Sub-children: Districts (Visible if state selected) */}
                      {selectedStates.includes("Karnataka") && (
                        <div className="pl-6 mt-2 space-y-2 border-l border-gray-200 ml-2">
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-[#10b981]" />
                            <span className="text-xs text-gray-600">Bengaluru Urban</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-[#10b981]" />
                            <span className="text-xs text-gray-600">Mysuru</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-[#10b981]" />
                            <span className="text-xs text-gray-600">Belagavi</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* State 2 */}
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => toggleState("Tamil Nadu")}>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                      {selectedStates.includes("Tamil Nadu") ? (
                        <CheckSquare className="h-4 w-4 text-[#1e3a8a]" />
                      ) : (
                        <Square className="h-4 w-4 text-gray-300" />
                      )}
                      <span className="font-semibold text-sm text-gray-700">Tamil Nadu</span>
                    </div>

                    {/* State 3 */}
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => toggleState("Kerala")}>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                      {selectedStates.includes("Kerala") ? (
                        <CheckSquare className="h-4 w-4 text-[#1e3a8a]" />
                      ) : (
                        <Square className="h-4 w-4 text-gray-300" />
                      )}
                      <span className="font-semibold text-sm text-gray-700">Kerala</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          <div className="p-4 border-t border-gray-200 bg-slate-50">
            <button 
              className="w-full bg-[#1e3a8a] text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-[#004e8c]"
            >
              <CheckCircle2 className="h-4 w-4" /> Deploy Survey
            </button>
          </div>
        </div>

        {/* Right Column: Preview & Map */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Assignment Preview Details */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Selected Survey</div>
              <div className="flex items-center gap-2 text-sm font-bold text-[#020b18]">
                <FileText className="h-4 w-4 text-[#2563eb]" /> {selectedSurvey || "None Selected"}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Target Regions</div>
              <div className="flex items-center gap-2 text-sm font-bold text-[#020b18]">
                <MapPin className="h-4 w-4 text-[#f59e0b]" /> {selectedStates.length} States Selected
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Est. Population Coverage</div>
              <div className="flex items-center gap-2 text-sm font-bold text-[#020b18]">
                <Users className="h-4 w-4 text-[#10b981]" /> ~2.4 Million
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Assignment Status</div>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                <CheckCircle2 className="h-4 w-4" /> Pending Publish
              </div>
            </div>
          </div>

          {/* Interactive Map Placeholder */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex-1 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#020b18]">Deployment Coverage Map</h3>
              <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#1e3a8a]"></span> Assigned Regions</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Active Data Collection</span>
              </div>
            </div>
            <div className="flex-1 bg-slate-50 border border-gray-200 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
              <div 
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `url(${indiaMap})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
              <Map className="h-12 w-12 text-[#1e3a8a]/40 mb-3 z-10" />
              <p className="text-sm font-bold text-gray-600 z-10">Interactive SVG India Map</p>
              <p className="text-xs text-gray-500 z-10 text-center max-w-sm mt-1">
                Visualizing coverage for {selectedStates.length > 0 ? selectedStates.join(", ") : "no regions selected yet"}. State boundaries will be filled with status colors.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
