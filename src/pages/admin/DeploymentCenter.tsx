import { useState } from "react";
import {
  Globe,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Users,
  Search,
  CheckSquare,
  Square,
  FileText
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { IndiaMap } from "@/components/IndiaMap";

export default function DeploymentCenter() {
  const [selectedSurvey, setSelectedSurvey] = useState("");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  // Toggle state
  const toggleState = (stateName: string) => {
    if (selectedStates.includes(stateName)) {
      setSelectedStates(selectedStates.filter(s => s !== stateName));
    } else {
      setSelectedStates([...selectedStates, stateName]);
    }
  };

  // Toggle Zone (multi-select)
  const selectZone = (_zone: string, statesInZone: string[]) => {
    // Check if all states in this zone are already selected
    const allSelected = statesInZone.every(s => selectedStates.includes(s));
    
    if (allSelected) {
      // Deselect the entire zone
      setSelectedStates(selectedStates.filter(s => !statesInZone.includes(s)));
    } else {
      // Add all states from this zone that aren't already selected
      const newStates = [...selectedStates];
      statesInZone.forEach(s => {
        if (!newStates.includes(s)) newStates.push(s);
      });
      setSelectedStates(newStates);
    }
  };

  // Define zones and states
  const zones = {
    North: ["Jammu and Kashmir", "Ladakh", "Punjab", "Himachal Pradesh", "Haryana", "Chandigarh", "Delhi", "Uttaranchal", "Uttar Pradesh"],
    South: ["Andhra Pradesh", "Karnataka", "Kerala", "Tamil Nadu", "Telangana", "Puducherry", "Lakshadweep", "Andaman and Nicobar"],
    East: ["Bihar", "Jharkhand", "Orissa", "West Bengal"],
    West: ["Rajasthan", "Gujarat", "Maharashtra", "Goa", "Dadra and Nagar Haveli", "Daman and Diu"],
    Central: ["Madhya Pradesh", "Chhattisgarh"],
    NorthEast: ["Arunachal Pradesh", "Assam", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura"]
  };

  const allStates = Object.values(zones).flat();

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
                  onClick={() => selectZone("National", allStates)}
                  className={`py-2 text-sm font-semibold rounded-lg border ${allStates.every(s => selectedStates.includes(s)) ? 'bg-blue-50 border-[#1e3a8a] text-[#1e3a8a]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  National Rollout
                </button>
                <button 
                  onClick={() => selectZone("South", zones.South)}
                  className={`py-2 text-sm font-semibold rounded-lg border ${zones.South.every(s => selectedStates.includes(s)) ? 'bg-blue-50 border-[#1e3a8a] text-[#1e3a8a]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  Entire South Zone
                </button>
                <button 
                  onClick={() => selectZone("North", zones.North)}
                  className={`py-2 text-sm font-semibold rounded-lg border ${zones.North.every(s => selectedStates.includes(s)) ? 'bg-blue-50 border-[#1e3a8a] text-[#1e3a8a]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  Entire North Zone
                </button>
                <button 
                  onClick={() => {
                    setSelectedStates([]);
                  }}
                  className={`py-2 text-sm font-semibold rounded-lg border border-red-200 text-red-600 hover:bg-red-50`}
                >
                  Clear Selection
                </button>
              </div>
            </div>

            {/* Visual Hierarchy Tree */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                Geographic Tree Selection
                <Search className="h-3.5 w-3.5 text-gray-400" />
              </label>
              <div className="border border-gray-200 rounded-lg p-3 space-y-2 max-h-64 overflow-y-auto bg-slate-50/50">
                
                {/* Tree Item: Country */}
                <div>
                  <div className="flex items-center gap-2 mb-2 sticky top-0 bg-slate-50/90 py-1 z-10 backdrop-blur-sm">
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                    <Globe className="h-4 w-4 text-[#1e3a8a]" />
                    <span className="font-bold text-sm text-gray-900">India</span>
                  </div>
                  
                  {/* Tree Children: Dynamically Rendered Zones and States */}
                  <div className="pl-6 space-y-3 border-l border-gray-200 ml-2">
                    {Object.entries(zones).map(([zoneName, states]) => (
                      <div key={zoneName}>
                        <div 
                          className="flex items-center gap-2 mb-1.5 cursor-pointer group"
                          onClick={() => selectZone(zoneName, states)}
                        >
                          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                          {states.every(s => selectedStates.includes(s)) ? (
                            <CheckSquare className="h-4 w-4 text-[#1e3a8a]" />
                          ) : states.some(s => selectedStates.includes(s)) ? (
                            <div className="h-4 w-4 bg-[#1e3a8a] rounded-[3px] flex items-center justify-center">
                              <div className="h-0.5 w-2.5 bg-white rounded-full"></div>
                            </div>
                          ) : (
                            <Square className="h-4 w-4 text-gray-300 group-hover:border-gray-400 transition-colors" />
                          )}
                          <span className="font-bold text-xs text-gray-600 uppercase tracking-wider">{zoneName} Zone</span>
                        </div>
                        
                        <div className="pl-6 space-y-1.5 border-l border-gray-100 ml-2 py-1">
                          {states.map(stateName => (
                            <div 
                              key={stateName} 
                              className="flex items-center gap-2 cursor-pointer group hover:bg-blue-50/50 rounded px-1 -ml-1 transition-colors" 
                              onClick={() => toggleState(stateName)}
                            >
                              <ChevronRight className="h-3 w-3 text-gray-300" />
                              {selectedStates.includes(stateName) ? (
                                <CheckSquare className="h-4 w-4 text-[#1e3a8a]" />
                              ) : (
                                <Square className="h-4 w-4 text-gray-300 group-hover:border-gray-400 transition-colors" />
                              )}
                              <span className={`text-sm ${selectedStates.includes(stateName) ? 'font-bold text-[#1e3a8a]' : 'font-medium text-gray-700'}`}>
                                {stateName}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
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
            <div className="flex-1 bg-slate-50 border border-gray-200 rounded-lg flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
              <IndiaMap 
                mode="selection" 
                selectedStates={selectedStates} 
                onStateClick={toggleState} 
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
