import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { FileText, UserCheck, Settings, Send, Shield, LogIn } from "lucide-react";

const iconMap: Record<string, typeof FileText> = {
  survey_publish: Send,
  user_login: LogIn,
  config_change: Settings,
  approval: UserCheck,
  access: Shield,
  export: FileText,
};

const logs = [
  { id: "LOG-1001", action: "Survey published", user: "Admin — Rajesh Kumar", type: "survey_publish", details: "Published PLFS Q4 2025 to 28 states", timestamp: "Jun 11, 2026 09:14 AM" },
  { id: "LOG-1002", action: "User login", user: "Supervisor — Priya Sharma", type: "user_login", details: "Logged in from 103.25.xx.xx (New Delhi)", timestamp: "Jun 11, 2026 08:52 AM" },
  { id: "LOG-1003", action: "Quality flag resolved", user: "Supervisor — Priya Sharma", type: "approval", details: "Resolved FLG-005 (Agricultural Census inconsistency)", timestamp: "Jun 10, 2026 04:30 PM" },
  { id: "LOG-1004", action: "Survey config updated", user: "Admin — Rajesh Kumar", type: "config_change", details: "Added Odia language to Health Survey NHS-6", timestamp: "Jun 10, 2026 02:15 PM" },
  { id: "LOG-1005", action: "Data export", user: "Admin — Anil Gupta", type: "export", details: "Exported 45,000 responses from Consumer Expenditure R80", timestamp: "Jun 10, 2026 11:00 AM" },
  { id: "LOG-1006", action: "Access revoked", user: "Admin — Rajesh Kumar", type: "access", details: "Revoked access for inactive supervisor ID SUP-2281", timestamp: "Jun 9, 2026 03:45 PM" },
  { id: "LOG-1007", action: "Survey published", user: "Admin — Anil Gupta", type: "survey_publish", details: "Published Agricultural Census to 156 districts", timestamp: "Jun 9, 2026 10:00 AM" },
  { id: "LOG-1008", action: "User login", user: "Admin — Rajesh Kumar", type: "user_login", details: "Logged in from 49.36.xx.xx (Mumbai)", timestamp: "Jun 8, 2026 09:30 AM" },
];

export default function AuditLogs() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Chronological record of all system activities"
      />

      <DataTable
        columns={[
          {
            key: "id",
            header: "Log ID",
            render: (r) => <span className="font-mono text-xs text-muted-foreground">{String(r.id)}</span>,
          },
          {
            key: "action",
            header: "Action",
            render: (r) => {
              const Icon = iconMap[String(r.type)] || FileText;
              return (
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{String(r.action)}</span>
                </div>
              );
            },
          },
          { key: "user", header: "User" },
          {
            key: "details",
            header: "Details",
            render: (r) => <span className="text-xs text-muted-foreground max-w-xs block">{String(r.details)}</span>,
          },
          {
            key: "timestamp",
            header: "Timestamp",
            render: (r) => <span className="text-xs text-muted-foreground whitespace-nowrap">{String(r.timestamp)}</span>,
          },
        ]}
        data={logs}
      />
    </div>
  );
}
