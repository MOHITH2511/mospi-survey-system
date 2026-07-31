import { Activity, Target, MapPin, Mic } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";

const surveyProgress = [
  { survey: "PLFS Q4 2025", assigned: 45000, completed: 41400, rate: "92%", quality: "4.8", status: "Active" },
  { survey: "Census Pre-listing 2026", assigned: 120000, completed: 98400, rate: "82%", quality: "4.5", status: "Active" },
  { survey: "Health Survey NHS-6", assigned: 30000, completed: 28500, rate: "95%", quality: "4.9", status: "Active" },
  { survey: "Consumer Expenditure R80", assigned: 55000, completed: 33000, rate: "60%", quality: "4.3", status: "In Progress" },
  { survey: "Agricultural Census", assigned: 80000, completed: 72000, rate: "90%", quality: "4.7", status: "Active" },
];

const statusStyle: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  "In Progress": "bg-amber-50 text-amber-700",
};

export default function SupervisorDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Monitoring Dashboard"
        description="Real-time survey quality and compliance metrics"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Completion Rate" value="92%" icon={Target} trend={{ value: "+3.2% this week", direction: "up" }} iconColor="#10b981" iconBg="#ecfdf5" />
        <StatCard label="Quality Score" value="4.7/5" icon={Activity} trend={{ value: "Above threshold", direction: "up" }} iconColor="#2563eb" iconBg="#eff6ff" />
        <StatCard label="GPS Compliance" value="98%" icon={MapPin} trend={{ value: "Excellent", direction: "up" }} iconColor="#7c3aed" iconBg="#f5f3ff" />
        <StatCard label="Voice Usage" value="76%" icon={Mic} trend={{ value: "+8% vs last month", direction: "up" }} iconColor="#f59e0b" iconBg="#fffbeb" />
      </div>

      <div className="rounded-2xl border border-border bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Survey Progress</h3>
        <DataTable
          columns={[
            { key: "survey", header: "Survey" },
            { key: "assigned", header: "Assigned", render: (r) => <span>{Number(r.assigned).toLocaleString()}</span> },
            { key: "completed", header: "Completed", render: (r) => <span>{Number(r.completed).toLocaleString()}</span> },
            { key: "rate", header: "Rate", render: (r) => <span className="font-semibold text-foreground">{String(r.rate)}</span> },
            { key: "quality", header: "Quality", render: (r) => <span className="font-semibold text-foreground">{String(r.quality)}/5</span> },
            {
              key: "status",
              header: "Status",
              render: (r) => (
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyle[String(r.status)] || "bg-muted text-muted-foreground"}`}>
                  {String(r.status)}
                </span>
              ),
            },
          ]}
          data={surveyProgress}
        />
      </div>
    </div>
  );
}
