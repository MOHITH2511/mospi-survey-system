import React from "react";
import {
  MapPin,
  Mic,
  Clock,
  AlertTriangle,
  FileWarning,
  ListX,
  Search,
  Filter,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

const alertsData = [
  { district: "Bengaluru Urban", metric: "Suspicious Completion Time", value: "14% of surveys < 2 mins", severity: "high" },
  { district: "Mysuru", metric: "GPS Compliance", value: "Dropped to 78%", severity: "medium" },
  { district: "Chennai", metric: "Duplicate Submissions", value: "24 flagged cases", severity: "high" },
  { district: "Madurai", metric: "Missing Responses", value: "High rate in Sec 3", severity: "medium" },
];

const districtTableData = [
  { name: "Bengaluru Urban", total: "45,200", completion: "92%", gps: "98%", voice: "45%", validation: "1.2%" },
  { name: "Mysuru", total: "18,400", completion: "88%", gps: "78%", voice: "32%", validation: "2.4%" },
  { name: "Chennai", total: "52,100", completion: "95%", gps: "96%", voice: "51%", validation: "0.8%" },
  { name: "Madurai", total: "22,300", completion: "84%", gps: "89%", voice: "28%", validation: "3.1%" },
  { name: "Coimbatore", total: "28,900", completion: "91%", gps: "94%", voice: "42%", validation: "1.5%" },
];

export default function MonitoringHub() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Field Operations Monitoring Hub"
        description="Real-time telemetrics, compliance tracking, and data quality assurance for live surveys."
      />

      {/* Top Telemetry Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-gray-500">
            <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase">Completion</span>
          </div>
          <div className="text-2xl font-bold text-[#020b18]">91.4%</div>
          <div className="text-xs text-emerald-600 flex items-center mt-1"><TrendingUp className="h-3 w-3 mr-1" /> +1.2%</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-gray-500">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-bold uppercase">GPS Match</span>
          </div>
          <div className="text-2xl font-bold text-[#020b18]">94.2%</div>
          <div className="text-xs text-emerald-600 flex items-center mt-1"><TrendingUp className="h-3 w-3 mr-1" /> Stable</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-gray-500">
            <Mic className="h-4 w-4 text-purple-500" />
            <span className="text-xs font-bold uppercase">Voice Used</span>
          </div>
          <div className="text-2xl font-bold text-[#020b18]">42.8%</div>
          <div className="text-xs text-emerald-600 flex items-center mt-1"><TrendingUp className="h-3 w-3 mr-1" /> +5.4%</div>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-red-600">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-bold uppercase">Suspicious Time</span>
          </div>
          <div className="text-2xl font-bold text-red-700">3.2%</div>
          <div className="text-xs text-red-600 flex items-center mt-1"><TrendingUp className="h-3 w-3 mr-1" /> Review Needed</div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-amber-700">
            <FileWarning className="h-4 w-4" />
            <span className="text-xs font-bold uppercase">Duplicates</span>
          </div>
          <div className="text-2xl font-bold text-amber-800">1.4%</div>
          <div className="text-xs text-amber-700 flex items-center mt-1">128 flagged</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-gray-500">
            <ListX className="h-4 w-4 text-rose-500" />
            <span className="text-xs font-bold uppercase">Validation Fails</span>
          </div>
          <div className="text-2xl font-bold text-[#020b18]">2.1%</div>
          <div className="text-xs text-emerald-600 flex items-center mt-1"><TrendingDown className="h-3 w-3 mr-1" /> Improving</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Alerts Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#020b18] flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" /> Live Data Alerts
              </h3>
            </div>
            <div className="space-y-3">
              {alertsData.map((alert, i) => (
                <div key={i} className={`p-3 rounded-lg border ${alert.severity === 'high' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold uppercase text-gray-800">{alert.district}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${alert.severity === 'high' ? 'bg-red-200 text-red-800' : 'bg-amber-200 text-amber-800'}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">{alert.metric}</div>
                  <div className="text-xs text-gray-600 mt-1">{alert.value}</div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
              View All Alerts
            </button>
          </div>
        </div>

        {/* District Monitoring Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
            <div>
              <h3 className="text-base font-bold text-[#020b18]">District Monitoring Table</h3>
              <p className="text-xs text-gray-500">Live operational metrics by geography.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search districts..." 
                  className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1e3a8a] bg-white w-48"
                />
              </div>
              <button className="p-1.5 border border-gray-300 rounded text-gray-600 bg-white hover:bg-gray-50">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white text-gray-500 text-xs uppercase font-bold tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3">District</th>
                  <th className="px-5 py-3">Total Responses</th>
                  <th className="px-5 py-3">Completion %</th>
                  <th className="px-5 py-3">GPS Match</th>
                  <th className="px-5 py-3">Voice Usage</th>
                  <th className="px-5 py-3 text-red-600">Validation Fails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {districtTableData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-gray-900">{row.name}</td>
                    <td className="px-5 py-3 text-gray-600">{row.total}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: row.completion }}></div>
                        </div>
                        <span className="font-semibold text-gray-900">{row.completion}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-medium text-blue-600">{row.gps}</td>
                    <td className="px-5 py-3 font-medium text-purple-600">{row.voice}</td>
                    <td className="px-5 py-3 font-medium text-red-600">{row.validation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
