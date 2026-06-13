import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  ChevronRight,
  Search,
  Filter,
  Mic,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { PageHeader } from "@/components/dashboard/PageHeader";

interface Respondent {
  id: string;
  name: string;
  phone: string;
  location: string;
  survey: string;
  status: "pending" | "in_progress" | "follow_up" | "completed" | "assisted";
  lastContact: string;
  progress: number;
  needsAssistance: boolean;
  reason?: string;
}

const respondents: Respondent[] = [
  { id: "R001", name: "Lakshmi Devi", phone: "+91 98XXX-XX101", location: "Bengaluru Urban, KA", survey: "PLFS Q4 2025", status: "pending", lastContact: "Never", progress: 0, needsAssistance: false },
  { id: "R002", name: "Rajesh Kumar", phone: "+91 87XXX-XX202", location: "Mysuru, KA", survey: "PLFS Q4 2025", status: "in_progress", lastContact: "Jun 10, 2026", progress: 45, needsAssistance: false },
  { id: "R003", name: "Meena Kumari", phone: "+91 76XXX-XX303", location: "Belagavi, KA", survey: "PLFS Q4 2025", status: "follow_up", lastContact: "Jun 8, 2026", progress: 20, needsAssistance: true, reason: "No smartphone access" },
  { id: "R004", name: "Venkatesh Gowda", phone: "+91 99XXX-XX404", location: "Dharwad, KA", survey: "Health Survey NHS-6", status: "follow_up", lastContact: "Jun 7, 2026", progress: 60, needsAssistance: true, reason: "Language barrier" },
  { id: "R005", name: "Anitha B.", phone: "+91 88XXX-XX505", location: "Tumkur, KA", survey: "PLFS Q4 2025", status: "completed", lastContact: "Jun 11, 2026", progress: 100, needsAssistance: false },
  { id: "R006", name: "Manjunath H.", phone: "+91 77XXX-XX606", location: "Raichur, KA", survey: "Health Survey NHS-6", status: "assisted", lastContact: "Jun 12, 2026", progress: 100, needsAssistance: false },
  { id: "R007", name: "Savitri Bai", phone: "+91 66XXX-XX707", location: "Gulbarga, KA", survey: "Agricultural Census", status: "follow_up", lastContact: "Jun 6, 2026", progress: 0, needsAssistance: true, reason: "Accessibility issues" },
  { id: "R008", name: "Ramanna K.", phone: "+91 95XXX-XX808", location: "Shimoga, KA", survey: "Consumer Expenditure R80", status: "pending", lastContact: "Never", progress: 0, needsAssistance: false },
  { id: "R009", name: "Padmavathi R.", phone: "+91 84XXX-XX909", location: "Hassan, KA", survey: "PLFS Q4 2025", status: "in_progress", lastContact: "Jun 11, 2026", progress: 75, needsAssistance: false },
  { id: "R010", name: "Srinivas M.", phone: "+91 73XXX-XX010", location: "Mangalore, KA", survey: "Health Survey NHS-6", status: "follow_up", lastContact: "Jun 9, 2026", progress: 10, needsAssistance: true, reason: "No smartphone access" },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-gray-600", bg: "bg-gray-100" },
  in_progress: { label: "In Progress", color: "text-blue-700", bg: "bg-blue-50" },
  follow_up: { label: "Follow-Up Needed", color: "text-amber-700", bg: "bg-amber-50" },
  completed: { label: "Completed", color: "text-emerald-700", bg: "bg-emerald-50" },
  assisted: { label: "Assisted", color: "text-purple-700", bg: "bg-purple-50" },
};

export default function EnumeratorDashboard() {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const pending = respondents.filter(r => r.status === "pending").length;
  const followUp = respondents.filter(r => r.status === "follow_up").length;
  const completed = respondents.filter(r => ["completed", "assisted"].includes(r.status)).length;
  const needsHelp = respondents.filter(r => r.needsAssistance).length;

  const filtered = respondents.filter(r => {
    const matchesFilter = filter === "all" || r.status === filter;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Field Operations Dashboard"
        description="Track assigned respondents, manage follow-ups, and assist citizens with survey completion."
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending Respondents" value={pending} icon={Clock} iconColor="#f59e0b" iconBg="#fffbeb" />
        <StatCard label="Follow-Up Required" value={followUp} icon={AlertCircle} iconColor="#ef4444" iconBg="#fef2f2" trend={{ value: "Needs attention", direction: "down" }} />
        <StatCard label="Completed / Assisted" value={completed} icon={CheckCircle2} iconColor="#10b981" iconBg="#ecfdf5" />
        <StatCard label="Need Assistance" value={needsHelp} icon={Users} iconColor="#7c3aed" iconBg="#f5f3ff" trend={{ value: "No smartphone / accessibility", direction: "flat" }} />
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-gray-400" />
            {["all", "pending", "in_progress", "follow_up", "completed", "assisted"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  filter === f 
                    ? "bg-[#1e3a8a] text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f === "all" ? "All" : statusConfig[f]?.label || f}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name or location..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#1e3a8a] bg-white"
            />
          </div>
        </div>

        {/* Respondent List */}
        <div className="divide-y divide-gray-100">
          {filtered.map(r => {
            const isCompleted = ["completed", "assisted"].includes(r.status);
            return (
              <div key={r.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 hover:bg-slate-50/50 transition-colors cursor-pointer group">
                {/* Avatar */}
                <div className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-bold shrink-0 ${
                  isCompleted ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-[#1e3a8a]"
                }`}>
                  {r.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="text-base font-bold text-gray-900">{r.name}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                      isCompleted 
                        ? "bg-emerald-50 text-emerald-700" 
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {isCompleted ? "Completed" : "Not Completed"}
                    </span>
                  </div>
                  <div className="flex items-center gap-5 text-sm text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {r.location}</span>
                    <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {r.phone}</span>
                    <span>Survey: {r.survey}</span>
                  </div>
                </div>

                {/* Action */}
                <div className="flex items-center gap-3 shrink-0">
                  {!isCompleted && (
                    <>
                      <button 
                        onClick={() => navigate("/citizen/survey")}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1e3a8a] text-white text-sm font-bold rounded-lg hover:bg-[#1e3a8a]/90 transition-colors"
                      >
                        <Mic className="h-4 w-4" /> Take Survey
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
                        <Phone className="h-4 w-4" /> Contact
                      </button>
                    </>
                  )}
                  {isCompleted && (
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  )}
                  <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-slate-50 flex items-center justify-between text-xs text-gray-500">
          <span>Showing {filtered.length} of {respondents.length} respondents</span>
          <span className="font-bold text-[#1e3a8a]">Response Recovery Rate: {Math.round((completed / respondents.length) * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
