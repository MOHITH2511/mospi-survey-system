import { useNavigate } from "react-router-dom";
import { FileText, CheckCircle2, Clock, Mic, ClipboardList, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { PageHeader } from "@/components/dashboard/PageHeader";

import economicPoster from "@/assets/economic_survey.png";
import healthPoster from "@/assets/health_assesment.png";
import literacyPoster from "@/assets/literacy_survey.png";
import householdPoster from "@/assets/household_survey.png";

const liveSurveys = [
  { id: 1, theme: "Economic", title: "National Economic Census 2026", description: "Comprehensive survey of all economic establishments across rural and urban India.", image: economicPoster },
  { id: 2, theme: "Health", title: "Citizen Health Assessment", description: "Tracking public health infrastructure accessibility and family health metrics.", image: healthPoster },
  { id: 3, theme: "Education", title: "Digital Literacy Survey", description: "Assessing digital skills, internet access, and e-learning adoption.", image: literacyPoster },
  { id: 4, theme: "Household", title: "All-India Household Survey", description: "Gathering crucial data on living conditions and household amenities.", image: householdPoster },
];

const surveys = [
  { id: 1, name: "Periodic Labour Force Survey (PLFS) Q4 2025", status: "pending", questions: 24, deadline: "Jul 15, 2026", lang: "Hindi" },
  { id: 2, name: "Annual Survey of Industries 2025-26", status: "pending", questions: 18, deadline: "Jul 30, 2026", lang: "Hindi" },
  { id: 3, name: "Consumer Expenditure Survey Round 80", status: "pending", questions: 32, deadline: "Aug 10, 2026", lang: "Hindi" },
  { id: 4, name: "Household Census Pre-listing 2026", status: "completed", questions: 15, completedOn: "Jun 5, 2026", lang: "Hindi" },
  { id: 5, name: "National Health Survey (NHS-6)", status: "completed", questions: 28, completedOn: "May 22, 2026", lang: "Tamil" },
  { id: 6, name: "Crop Estimation Survey Kharif 2025", status: "completed", questions: 12, completedOn: "May 8, 2026", lang: "Telugu" },
  { id: 7, name: "Time Use Survey Pilot", status: "completed", questions: 20, completedOn: "Apr 18, 2026", lang: "Kannada" },
  { id: 8, name: "Socio-Economic Caste Census Update", status: "completed", questions: 22, completedOn: "Apr 2, 2026", lang: "Hindi" },
  { id: 9, name: "NSSO Housing Condition Survey", status: "completed", questions: 16, completedOn: "Mar 15, 2026", lang: "Hindi" },
  { id: 10, name: "Urban Employment Survey Pilot", status: "completed", questions: 14, completedOn: "Feb 28, 2026", lang: "English" },
  { id: 11, name: "Drinking Water & Sanitation Survey", status: "completed", questions: 19, completedOn: "Feb 10, 2026", lang: "Tamil" },
];

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  completed: "bg-emerald-50 text-emerald-700",
};

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const pending = surveys.filter((s) => s.status === "pending");
  const completed = surveys.filter((s) => s.status === "completed");

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Surveys"
        description="Welcome back! Here are your survey assignments."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Pending Surveys"
          value={pending.length}
          icon={Clock}
          iconColor="#f59e0b"
          iconBg="#fffbeb"
        />
        <StatCard
          label="Completed Surveys"
          value={completed.length}
          icon={CheckCircle2}
          iconColor="#10b981"
          iconBg="#ecfdf5"
        />
        <StatCard
          label="Total Participation"
          value={surveys.length}
          icon={FileText}
          trend={{ value: "Active since Jan 2026", direction: "flat" }}
          iconColor="#2563eb"
          iconBg="#eff6ff"
        />
      </div>

      {/* Live National Surveys */}
      <div className="rounded-xl border border-blue-200/50 bg-[#f8fbff] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg border border-[#1e3a8a]/20 bg-blue-50 p-2 text-[#1e3a8a]">
              <ClipboardList className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Live National Surveys</h2>
          </div>
          <span className="inline-flex items-center rounded-full bg-[#1e3a8a] px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            Accepting Responses
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {liveSurveys.map((s) => (
            <div key={s.id} className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
              <div className="relative h-53 w-full overflow-hidden bg-gray-100">
                <div className="absolute top-2 left-2 z-10 rounded-full bg-black/40 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                  {s.theme}
                </div>
                <img src={s.image} alt={s.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-gray-900 mb-1 leading-snug">{s.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 flex-1 mb-3">{s.description}</p>
                <button
                  onClick={() => navigate("/citizen/survey")}
                  className="inline-flex items-center text-xs font-bold text-[#1e3a8a] hover:text-[#1e3a8a]/80 transition-colors"
                >
                  Participate <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending surveys */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Pending Surveys</h2>
          {pending.map((s) => (
            <div
              key={s.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyles[s.status]}`}>
                    Pending
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {s.questions} questions · Due {s.deadline}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
              </div>
              <button
                onClick={() => navigate("/citizen/survey")}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a8a] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1e3a8a]/90 active:scale-[0.98] shrink-0"
              >
                <Mic className="h-4 w-4" />
                Start Survey
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Completed surveys */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-foreground">Completed</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {completed.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-border bg-white p-4 transition-all hover:shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-xs text-muted-foreground">
                  Completed {s.completedOn} · {s.lang}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground">{s.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.questions} questions answered</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
