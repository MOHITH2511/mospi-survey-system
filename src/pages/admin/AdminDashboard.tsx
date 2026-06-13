import { useNavigate } from "react-router-dom";
import {
  Users,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Plus,
  Activity,
  Sparkles,
  Map as MapIcon,
  Search,
  Filter,
  Database,
  Send,
  Settings
} from "lucide-react";
import indiaMap from "@/assets/india-outline.svg";

// Note: Reusing the simple StatCard approach directly to match the 6 columns
function DashboardStat({ label, value, icon: Icon, trend }: { label: string; value: string; icon: React.ElementType; trend: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-600">{label}</h3>
        <Icon className="h-6 w-6 text-[#1e3a8a]" strokeWidth={2} />
      </div>
      <div className="text-2xl font-bold text-[#020b18]">{value}</div>
      <div className="mt-1 flex items-center text-xs font-medium text-emerald-600">
        <TrendingUp className="mr-1 h-3 w-3" />
        {trend}
      </div>
    </div>
  );
}

const surveyData = [
  { id: "S-2026-001", name: "National Economic Survey Q1", target: "Pan-India", responses: "1.2M", status: "Active" },
  { id: "S-2026-042", name: "Rural Health Assessment", target: "South Zone", responses: "450K", status: "Active" },
  { id: "S-2026-105", name: "Agricultural Equipment Census", target: "Punjab, Haryana", responses: "-", status: "Draft" },
  { id: "S-2025-992", name: "Urban Employment Index", target: "Metro Cities", responses: "2.1M", status: "Published" },
  { id: "S-2025-884", name: "Education Infrastructure", target: "North-East", responses: "310K", status: "Closed" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#020b18]">National Survey Command Center</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of national operations and survey metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/survey-builder")}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1e3a8a] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#004e8c] shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            Create New Survey
          </button>
        </div>
      </div>

      {/* KPI Cards (4 Grid) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStat
          label="Active Surveys"
          value="142"
          icon={Activity}
          trend="+12 this week"
        />
        <DashboardStat
          label="Published"
          value="85"
          icon={CheckCircle2}
          trend="+5 this month"
        />
        <DashboardStat
          label="Total Responses"
          value="4.2M"
          icon={Users}
          trend="+120K this month"
        />
        <DashboardStat
          label="District Coverage"
          value="684 / 766"
          icon={MapPin}
          trend="+14 new districts"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button 
          onClick={() => navigate("/admin/survey-builder")}
          className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-[#1e3a8a] hover:shadow-md transition-all text-left group"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-[#1e3a8a] group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
            <Plus className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#020b18]">Create Survey</h4>
            <p className="text-xs text-gray-500 mt-0.5">Start a new questionnaire</p>
          </div>
        </button>

        <button 
          onClick={() => navigate("/admin/question-bank")}
          className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-emerald-600 hover:shadow-md transition-all text-left group"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#020b18]">Question Bank</h4>
            <p className="text-xs text-gray-500 mt-0.5">Browse verified questions</p>
          </div>
        </button>

        <button 
          onClick={() => navigate("/admin/publish")}
          className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-amber-500 hover:shadow-md transition-all text-left group"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
            <Send className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#020b18]">Assign Survey</h4>
            <p className="text-xs text-gray-500 mt-0.5">Deploy to enumerators</p>
          </div>
        </button>

        <button 
          onClick={() => navigate("/admin/registry")}
          className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-purple-600 hover:shadow-md transition-all text-left group"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#020b18]">Manage Surveys</h4>
            <p className="text-xs text-gray-500 mt-0.5">View registry & versions</p>
          </div>
        </button>
      </div>

      {/* Mid Section: Map & AI Insights */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* State-wise Map Placeholder */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">State-wise Participation</h3>
              <p className="text-xs text-gray-500">Live response density across national zones.</p>
            </div>
            <button className="text-xs font-semibold text-[#1e3a8a] border border-[#1e3a8a]/20 px-3 py-1.5 rounded bg-blue-50">
              View Detailed Map
            </button>
          </div>
          <div className="flex-1 bg-slate-50 border border-gray-200 rounded-lg flex items-center justify-center relative p-6 min-h-[300px]">
            <img src={indiaMap} className="absolute inset-0 w-full h-full object-contain opacity-[0.15] pointer-events-none" alt="India Map" />
            <div className="z-10 flex flex-col items-center">
              <MapIcon className="h-10 w-10 text-[#1e3a8a] mb-2" />
              <p className="text-sm font-bold text-gray-700">Live Coverage Map</p>
              <p className="text-xs text-gray-500 mt-1 max-w-xs text-center">
                Geospatial visualization of survey deployment
              </p>
            </div>
          </div>
        </div>

        {/* AI Summary Card */}
        <div className="rounded-xl border border-[#1e3a8a]/20 bg-gradient-to-b from-[#f8fafc] to-blue-50/50 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-[#2563eb]" />
            <h3 className="text-base font-bold text-[#020b18]">AI Findings</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-emerald-500">
              <p className="text-sm text-gray-800 font-medium">Response rates in the Southern Region are 18% higher than the national average.</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-amber-500">
              <p className="text-sm text-gray-800 font-medium">Health Survey (S-2026-042) participation is surprisingly low in Tier-1 urban districts.</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-[#2563eb]">
              <p className="text-sm text-gray-800 font-medium">Agricultural households reported a 12% increase in machinery usage across Punjab.</p>
            </div>
            <button className="w-full mt-2 text-sm font-bold text-[#1e3a8a] py-2 border border-[#1e3a8a]/20 rounded bg-white hover:bg-blue-50 transition-colors">
              View All Insights →
            </button>
          </div>
        </div>
      </div>

      {/* Survey Status Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-b border-gray-100 gap-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">Recent Survey Activity</h3>
            <p className="text-xs text-gray-500">Latest operations and status updates.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search surveys..." 
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1e3a8a] w-full sm:w-64"
              />
            </div>
            <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-gray-600 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3 border-b border-gray-200">Survey Code</th>
                <th className="px-5 py-3 border-b border-gray-200">Name</th>
                <th className="px-5 py-3 border-b border-gray-200">Target Region</th>
                <th className="px-5 py-3 border-b border-gray-200">Responses</th>
                <th className="px-5 py-3 border-b border-gray-200">Status</th>
                <th className="px-5 py-3 border-b border-gray-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {surveyData.map((s, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-gray-500">{s.id}</td>
                  <td className="px-5 py-4 font-semibold text-gray-900">{s.name}</td>
                  <td className="px-5 py-4 text-gray-600">{s.target}</td>
                  <td className="px-5 py-4 font-medium text-gray-900">{s.responses}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      s.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                      s.status === 'Draft' ? 'bg-gray-100 text-gray-600' :
                      s.status === 'Published' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-[#2563eb] font-semibold text-xs hover:underline">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
