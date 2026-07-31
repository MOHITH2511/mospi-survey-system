import { useNavigate } from "react-router-dom";
import {
  Users,
  TrendingUp,
  MapPin,
  Plus,
  Activity,
  Sparkles,
  Search,
  Filter,
  Database,
  Send,
  Settings,
  UserCheck,
  CheckCircle2
} from "lucide-react";
import { IndiaMap } from "@/components/IndiaMap";

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
  { id: "S-2026-PLFS", name: "Periodic Labour Force Survey (PLFS) Q2 2026", target: "Urban & Rural Districts", responses: "48,200", status: "Active" },
  { id: "S-2026-HCES", name: "Household Consumer Expenditure Survey (HCES) 2026", target: "Pan-India Households", responses: "32,800", status: "Active" },
  { id: "S-2026-ASI", name: "Annual Survey of Industries (ASI) 2026", target: "Industrial Clusters", responses: "24,500", status: "Active" },
  { id: "S-2026-HLTH", name: "Household Social Consumption: Health Survey", target: "Southern Districts", responses: "18,700", status: "Active" },
  { id: "S-2026-DLIT", name: "Digital Literacy Survey", target: "Selected Blocks", responses: "11,300", status: "Active" },
  { id: "S-2026-ASUSE", name: "Annual Survey of Unincorporated Sector Enterprises (ASUSE)", target: "Pan-India", responses: "-", status: "Active" },
  { id: "S-2026-TUS", name: "Time Use Survey (TUS)", target: "Selected Stratums", responses: "-", status: "Active" },
  { id: "S-2026-DTES", name: "Domestic Tourism Expenditure Survey (DTES)", target: "Tourism Stratum", responses: "-", status: "Active" },
  { id: "S-2026-TTRA", name: "National Household Travel Survey", target: "Metro Transit Zones", responses: "-", status: "Active" },
  { id: "S-2026-AGRI", name: "Agricultural Land & Holdings Survey", target: "Rural Blocks", responses: "-", status: "Active" },
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

      {/* KPI Cards (8 Grid) */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <DashboardStat
          label="Active Surveys"
          value="10"
          icon={Activity}
          trend="+2 this month"
        />
        <DashboardStat
          label="Published Surveys"
          value="24"
          icon={CheckCircle2}
          trend="+4 this quarter"
        />
        <DashboardStat
          label="Total Responses"
          value="186,450"
          icon={Users}
          trend="+18,320 this month"
        />
        <DashboardStat
          label="District Coverage"
          value="712 / 766"
          icon={MapPin}
          trend="92.9% National Coverage"
        />
        <DashboardStat
          label="Active Enumerators"
          value="4,850"
          icon={UserCheck}
          trend="+124 deployed today"
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
          <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col">
            <h3 className="text-base font-bold text-gray-900">State-wise Participation</h3>
            <p className="text-xs text-gray-500">Live response density across national zones.</p>
            <IndiaMap />
          </div>

          {/* AI Summary Card */}
          <div className="rounded-xl border border-[#1e3a8a]/20 bg-gradient-to-b from-[#f8fafc] to-blue-50/50 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-[#2563eb]" />
              <h3 className="text-base font-bold text-[#020b18]">AI Findings (Real-world Data)</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-emerald-500">
                <p className="text-sm text-gray-800 font-medium">Labour force participation increased in urban districts.</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-amber-500">
                <p className="text-sm text-gray-800 font-medium">Survey completion rates exceed 87% across southern states.</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-[#2563eb]">
                <p className="text-sm text-gray-800 font-medium">Agricultural holdings remain stable compared to previous quarter.</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-purple-500">
                <p className="text-sm text-gray-800 font-medium">Household expenditure reporting improved after voice-assisted surveys.</p>
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
