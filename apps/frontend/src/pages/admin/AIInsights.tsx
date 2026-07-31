
import {
  Sparkles,
  Tractor,
  BarChart3,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Mic,
  CheckCircle2
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const trendData = [
  { month: "Jan", rural: 4000, urban: 2400 },
  { month: "Feb", rural: 3000, urban: 1398 },
  { month: "Mar", rural: 2000, urban: 9800 },
  { month: "Apr", rural: 2780, urban: 3908 },
  { month: "May", rural: 1890, urban: 4800 },
  { month: "Jun", rural: 2390, urban: 3800 },
  { month: "Jul", rural: 3490, urban: 4300 },
];

export default function AIInsights() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Insights Engine"
        description="Automated analysis, anomaly detection, and deep statistical findings across all national surveys."
      />

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column: AI Findings */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2 px-1 mb-2">
            <Sparkles className="h-5 w-5 text-[#2563eb]" />
            <h2 className="text-lg font-bold text-[#020b18]">Key Findings</h2>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-emerald-300 transition-colors cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">
                  Urban Labour Force Growth (PLFS)
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  PLFS Q2 2026 data shows a notable rise in urban labor force participation rates, especially in Tier-2 cities, driven by manufacturing and services sector growth.
                </p>
                <div className="mt-3 flex items-center text-xs font-bold text-[#2563eb]">
                  View Labour Force Report <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-blue-300 transition-colors cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-50 text-[#2563eb] flex items-center justify-center shrink-0 border border-blue-100">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#2563eb] transition-colors">
                  High Southern States Survey Completion
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Field telemetry reports show exceptional performance across Karnataka, Kerala, Andhra Pradesh, and Tamil Nadu, where completion rates have consistently crossed the 87% threshold.
                </p>
                <div className="mt-3 flex items-center text-xs font-bold text-[#2563eb]">
                  View Telemetry Breakdown <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-amber-300 transition-colors cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <Tractor className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-amber-700 transition-colors">
                  Agricultural Holdings Remain Stable
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Preliminary reports from the Agricultural Land & Holdings Survey reveal that the average operational holding size and distribution patterns have stabilized nationally compared to the previous quarter.
                </p>
                <div className="mt-3 flex items-center text-xs font-bold text-amber-600">
                  Investigate Agricultural Data <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-purple-300 transition-colors cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                <Mic className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors">
                  Voice-Assisted Reporting Efficiency
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  The integration of multi-lingual voice dictation in the Household Consumer Expenditure Survey (HCES) has reduced data entry errors and improved reporting of daily micro-expenditures by 14%.
                </p>
                <div className="mt-3 flex items-center text-xs font-bold text-purple-600">
                  Explore Voice Analytics <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Deep Dive Visualizations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#020b18] flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                  Rural vs Urban Participation Trends
                </h3>
              </div>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 outline-none focus:border-[#1e3a8a] bg-white text-gray-600 font-semibold">
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="p-6">
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRural" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorUrban" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{fontSize: 12, fill: '#64748b'}} stroke="#e2e8f0" />
                    <YAxis tick={{fontSize: 12, fill: '#64748b'}} stroke="#e2e8f0" />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="rural" stroke="#10b981" fillOpacity={1} fill="url(#colorRural)" name="Rural Responses" />
                    <Area type="monotone" dataKey="urban" stroke="#2563eb" fillOpacity={1} fill="url(#colorUrban)" name="Urban Responses" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <div className="h-3 w-3 rounded-full bg-[#10b981]"></div> Rural
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <div className="h-3 w-3 rounded-full bg-[#2563eb]"></div> Urban
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-dashed border-[#1e3a8a]/30 rounded-xl p-6 text-center">
            <Lightbulb className="h-8 w-8 text-[#f59e0b] mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-1">Generate Custom Report</h3>
            <p className="text-sm text-gray-500 mb-4 max-w-sm mx-auto">
              Ask the AI engine to cross-reference specific variables, geographic zones, or historical datasets.
            </p>
            <div className="max-w-lg mx-auto flex gap-2">
              <input 
                type="text" 
                placeholder="e.g. Compare agricultural income vs employment in Punjab..." 
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1e3a8a] shadow-sm"
              />
              <button className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-[#004e8c]">
                Analyze
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
