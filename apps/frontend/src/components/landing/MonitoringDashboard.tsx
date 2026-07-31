import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

const qualityFlags = [
  {
    type: "GPS Anomaly",
    count: 234,
    severity: "high",
    icon: MapPin,
    description: "Location mismatch with assigned district",
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    type: "Rapid Completion",
    count: 89,
    severity: "medium",
    icon: Clock,
    description: "Survey completed under minimum threshold",
    color: "text-accent",
    bg: "bg-accent-50",
  },
  {
    type: "Pattern Detected",
    count: 56,
    severity: "medium",
    icon: AlertTriangle,
    description: "Repetitive answer patterns in Section B",
    color: "text-accent",
    bg: "bg-accent-50",
  },
  {
    type: "Verification Failed",
    count: 12,
    severity: "low",
    icon: ShieldCheck,
    description: "Aadhaar validation mismatch",
    color: "text-primary",
    bg: "bg-primary-50",
  },
];

const enumeratorPerformance = [
  { name: "Rajesh Kumar", district: "Lucknow", surveys: 342, quality: 98.2, status: "excellent" },
  { name: "Priya Sharma", district: "Jaipur", surveys: 289, quality: 97.8, status: "excellent" },
  { name: "Arjun Patel", district: "Ahmedabad", surveys: 276, quality: 95.4, status: "good" },
  { name: "Meera Devi", district: "Patna", surveys: 234, quality: 94.1, status: "good" },
  { name: "Vikram Singh", district: "Chandigarh", surveys: 198, quality: 88.3, status: "review" },
];

export function MonitoringDashboard() {
  return (
    <section className="py-16 sm:py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="mb-3 px-3 py-1 h-auto text-xs font-medium border-red-200 text-red-600 bg-red-50"
          >
            <ShieldCheck className="w-3 h-3 mr-1" />
            Quality Monitoring
          </Badge>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark tracking-tight">
            Real-Time Monitoring Dashboard
          </h3>
          <p className="text-base text-muted-foreground mt-3 max-w-2xl mx-auto">
            Detect anomalies, verify data quality, and monitor enumerator
            performance in real-time across all active surveys.
          </p>
        </div>

        <Card className="bg-white border-border shadow-xl overflow-hidden">
          <CardContent className="p-0">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-dark border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-xs font-medium text-white/70">
                  Quality Monitoring — PLFS 2025-26
                </span>
              </div>
              <Badge className="bg-red-500/20 text-red-400 text-[9px] border-0 h-4">
                391 flags active
              </Badge>
            </div>

            <div className="p-5">
              {/* Top Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                {[
                  {
                    label: "Data Quality Score",
                    value: "94.7%",
                    icon: ShieldCheck,
                    color: "text-success",
                    bg: "bg-success-50",
                  },
                  {
                    label: "GPS Validation Rate",
                    value: "97.3%",
                    icon: MapPin,
                    color: "text-primary",
                    bg: "bg-primary-50",
                  },
                  {
                    label: "Avg. Completion Time",
                    value: "38 min",
                    icon: Clock,
                    color: "text-accent",
                    bg: "bg-accent-50",
                  },
                  {
                    label: "Active Enumerators",
                    value: "4,218",
                    icon: Users,
                    color: "text-primary-700",
                    bg: "bg-primary-50",
                  },
                  {
                    label: "Verified Responses",
                    value: "89,432",
                    icon: CheckCircle2,
                    color: "text-success",
                    bg: "bg-success-50",
                  },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="p-3 rounded-xl border border-border bg-white"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className={`w-6 h-6 rounded-md ${metric.bg} flex items-center justify-center`}
                      >
                        <metric.icon
                          className={`w-3 h-3 ${metric.color}`}
                        />
                      </div>
                    </div>
                    <p className="text-lg font-bold text-dark">
                      {metric.value}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-5">
                {/* Quality Flags */}
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-dark flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-accent" />
                      Data Quality Flags
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {qualityFlags.map((flag) => (
                      <div
                        key={flag.type}
                        className="flex items-center gap-3 p-2.5 rounded-lg border border-border hover:border-red-200 transition-colors"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg ${flag.bg} flex items-center justify-center flex-shrink-0`}
                        >
                          <flag.icon className={`w-4 h-4 ${flag.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-medium text-dark">
                              {flag.type}
                            </p>
                            <Badge
                              variant="outline"
                              className={`text-[8px] h-3.5 px-1 border-0 ${
                                flag.severity === "high"
                                  ? "bg-red-50 text-red-600"
                                  : flag.severity === "medium"
                                  ? "bg-accent-50 text-accent"
                                  : "bg-primary-50 text-primary"
                              }`}
                            >
                              {flag.severity}
                            </Badge>
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {flag.description}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-dark">
                          {flag.count}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Enumerator Performance */}
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-dark flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Enumerator Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {enumeratorPerformance.map((enumerator) => (
                        <div
                          key={enumerator.name}
                          className="flex items-center gap-3 p-2.5 rounded-lg border border-border"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                            {enumerator.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-dark truncate">
                              {enumerator.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {enumerator.district} • {enumerator.surveys}{" "}
                              surveys
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs font-bold text-dark">
                              {enumerator.quality}%
                            </p>
                            {enumerator.status === "excellent" ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-success ml-auto" />
                            ) : enumerator.status === "good" ? (
                              <AlertCircle className="w-3.5 h-3.5 text-accent ml-auto" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-red-500 ml-auto" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
