import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { AlertTriangle } from "lucide-react";

const flags = [
  { id: "FLG-001", survey: "PLFS Q4 2025", respondent: "R-44821", reason: "GPS location mismatch — reported location 15km from assigned village", severity: "High", flaggedOn: "Jun 10, 2026", status: "Open" },
  { id: "FLG-002", survey: "Census Pre-listing", respondent: "R-31209", reason: "Completion time anomaly — survey completed in 45 seconds (avg 4.2 min)", severity: "High", flaggedOn: "Jun 10, 2026", status: "Open" },
  { id: "FLG-003", survey: "Health Survey NHS-6", respondent: "R-55102", reason: "Duplicate response detected — same household ID submitted twice", severity: "Medium", flaggedOn: "Jun 9, 2026", status: "Under Review" },
  { id: "FLG-004", survey: "PLFS Q4 2025", respondent: "R-44903", reason: "Voice transcription confidence below 60% for 3 consecutive answers", severity: "Medium", flaggedOn: "Jun 9, 2026", status: "Open" },
  { id: "FLG-005", survey: "Agricultural Census", respondent: "R-67221", reason: "Inconsistent data — reported 50 acres but household income below ₹10,000", severity: "Low", flaggedOn: "Jun 8, 2026", status: "Resolved" },
  { id: "FLG-006", survey: "Consumer Expenditure", respondent: "R-12384", reason: "All questions answered with identical response pattern", severity: "High", flaggedOn: "Jun 8, 2026", status: "Open" },
];

const severityStyle: Record<string, string> = {
  High: "bg-red-50 text-red-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-blue-50 text-blue-600",
};

const statusStyle: Record<string, string> = {
  Open: "bg-red-50 text-red-600",
  "Under Review": "bg-amber-50 text-amber-700",
  Resolved: "bg-emerald-50 text-emerald-700",
};

export default function QualityFlags() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Quality Flags"
        description="Flagged responses requiring review and action"
        action={
          <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
            <AlertTriangle className="h-4 w-4" />
            {flags.filter((f) => f.status === "Open").length} Open Flags
          </div>
        }
      />

      <DataTable
        columns={[
          { key: "id", header: "Flag ID", render: (r) => <span className="font-mono text-xs">{String(r.id)}</span> },
          { key: "survey", header: "Survey" },
          { key: "respondent", header: "Respondent", render: (r) => <span className="font-mono text-xs">{String(r.respondent)}</span> },
          { key: "reason", header: "Reason", render: (r) => <span className="text-xs leading-relaxed max-w-xs block">{String(r.reason)}</span> },
          {
            key: "severity",
            header: "Severity",
            render: (r) => (
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${severityStyle[String(r.severity)] || ""}`}>
                {String(r.severity)}
              </span>
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (r) => (
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyle[String(r.status)] || ""}`}>
                {String(r.status)}
              </span>
            ),
          },
        ]}
        data={flags}
      />
    </div>
  );
}
