import React, { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  FileText,
  Clock,
  Copy,
  Archive,
  ChevronDown
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

const registryData = [
  {
    id: "S-2026-001",
    name: "National Economic Survey Q1",
    version: "v2.1",
    status: "Published",
    createdBy: "Dr. A. Sharma",
    responses: "1.2M",
    publishedDate: "2026-01-15",
  },
  {
    id: "S-2026-042",
    name: "Rural Health Assessment",
    version: "v1.0",
    status: "Published",
    createdBy: "MoHFW Data Team",
    responses: "450K",
    publishedDate: "2026-03-01",
  },
  {
    id: "S-2026-105",
    name: "Agricultural Equipment Census",
    version: "v1.2 (Draft)",
    status: "Draft",
    createdBy: "R. Kumar",
    responses: "-",
    publishedDate: "-",
  },
  {
    id: "S-2025-992",
    name: "Urban Employment Index",
    version: "v4.0",
    status: "Closed",
    createdBy: "MoSPI Team B",
    responses: "2.1M",
    publishedDate: "2025-09-10",
  },
  {
    id: "S-2025-884",
    name: "Education Infrastructure",
    version: "v1.0",
    status: "Archived",
    createdBy: "Ministry of Ed.",
    responses: "310K",
    publishedDate: "2025-05-22",
  },
];

export default function SurveyRegistry() {
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Drafts", "Published", "Closed", "Archived"];

  const filteredData = activeTab === "All" 
    ? registryData 
    : registryData.filter(s => s.status + "s" === activeTab || s.status === activeTab);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Survey Registry"
        description="Master repository of all national survey schedules, versions, and historical archives."
      />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                  activeTab === tab 
                    ? "bg-white text-[#1e3a8a] border border-gray-300 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search surveys..." 
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#1e3a8a] bg-white"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-100 text-gray-600 text-xs uppercase font-bold tracking-wider sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 border-b border-gray-200">Survey Details</th>
                <th className="px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-slate-200 transition-colors">
                  <div className="flex items-center gap-1">Version <ChevronDown className="h-3 w-3" /></div>
                </th>
                <th className="px-6 py-4 border-b border-gray-200">Status</th>
                <th className="px-6 py-4 border-b border-gray-200">Created By</th>
                <th className="px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-slate-200 transition-colors">
                  <div className="flex items-center gap-1">Responses <ChevronDown className="h-3 w-3" /></div>
                </th>
                <th className="px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-slate-200 transition-colors">
                  <div className="flex items-center gap-1">Published <ChevronDown className="h-3 w-3" /></div>
                </th>
                <th className="px-6 py-4 border-b border-gray-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((s, i) => (
                <tr key={i} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-slate-100 border border-gray-200 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <div className="font-bold text-[#020b18]">{s.name}</div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">{s.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded border border-gray-200 text-xs">
                      {s.version}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      s.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      s.status === 'Draft' ? 'bg-slate-100 text-gray-600 border-gray-200' :
                      s.status === 'Closed' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-purple-50 text-purple-700 border-purple-200'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{s.createdBy}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{s.responses}</td>
                  <td className="px-6 py-4 text-gray-500">{s.publishedDate}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-[#1e3a8a] hover:bg-blue-50 rounded" title="Version History">
                        <Clock className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-[#1e3a8a] hover:bg-blue-50 rounded" title="Clone Survey">
                        <Copy className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-[#1e3a8a] hover:bg-blue-50 rounded" title="Archive">
                        <Archive className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-[#1e3a8a] hover:bg-blue-50 rounded">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 bg-white flex items-center justify-between text-sm text-gray-500">
          <div>Showing 1 to {filteredData.length} of {filteredData.length} entries</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-300 rounded bg-gray-50 text-gray-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1 border border-[#1e3a8a] rounded bg-[#1e3a8a] text-white">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-700">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-700">3</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-700">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
