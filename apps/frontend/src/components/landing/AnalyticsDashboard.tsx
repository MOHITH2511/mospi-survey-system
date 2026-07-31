import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Map,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const regionData = [
  { region: "North Zone", surveys: 42, responses: "523K", completion: 87, trend: "up" },
  { region: "South Zone", surveys: 38, responses: "478K", completion: 91, trend: "up" },
  { region: "East Zone", surveys: 35, responses: "312K", completion: 79, trend: "down" },
  { region: "West Zone", surveys: 32, responses: "445K", completion: 85, trend: "up" },
  { region: "Central Zone", surveys: 28, responses: "267K", completion: 82, trend: "up" },
  { region: "North-East", surveys: 22, responses: "134K", completion: 74, trend: "down" },
];

export function AnalyticsDashboard() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="mb-3 px-3 py-1 h-auto text-xs font-medium border-primary/20 text-primary bg-primary-50"
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            Analytics
          </Badge>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark tracking-tight">
            Comprehensive Analytics Dashboard
          </h3>
          <p className="text-base text-muted-foreground mt-3 max-w-2xl mx-auto">
            Interactive visualizations for regional progress, completion trends,
            response distributions, and quality metrics.
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
                  Analytics — All Surveys Overview
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/40">
                  Last updated: 5 min ago
                </span>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Charts Row */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Completion Trend */}
                <Card className="border-border/50 col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-dark flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-primary" />
                      Completion Trends
                      <Badge className="bg-success-50 text-success text-[8px] border-0 h-3.5 px-1.5 ml-auto">
                        +12.4%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-1.5 h-28">
                      {[
                        { month: "Jan", value: 45 },
                        { month: "Feb", value: 52 },
                        { month: "Mar", value: 48 },
                        { month: "Apr", value: 61 },
                        { month: "May", value: 55 },
                        { month: "Jun", value: 67 },
                        { month: "Jul", value: 72 },
                        { month: "Aug", value: 68 },
                        { month: "Sep", value: 78 },
                        { month: "Oct", value: 82 },
                        { month: "Nov", value: 89 },
                        { month: "Dec", value: 94 },
                      ].map((bar) => (
                        <div
                          key={bar.month}
                          className="flex-1 flex flex-col items-center gap-1"
                        >
                          <div
                            className="w-full rounded-t bg-gradient-to-t from-primary to-primary-500 hover:from-primary-700 hover:to-primary-400 transition-colors cursor-pointer"
                            style={{ height: `${bar.value}%` }}
                          />
                          <span className="text-[8px] text-muted-foreground">
                            {bar.month}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Response Distribution */}
                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-dark flex items-center gap-2">
                      <PieChart className="w-3.5 h-3.5 text-accent" />
                      Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative w-24 h-24 mx-auto">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#EFF6FF"
                          strokeWidth="12"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#1E3A8A"
                          strokeWidth="12"
                          strokeDasharray="175.93 251.33"
                          strokeDashoffset="0"
                          transform="rotate(-90 50 50)"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth="12"
                          strokeDasharray="50.27 251.33"
                          strokeDashoffset="-175.93"
                          transform="rotate(-90 50 50)"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="12"
                          strokeDasharray="25.13 251.33"
                          strokeDashoffset="-226.2"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-dark">
                          2.4M
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      {[
                        { label: "Urban", pct: "70%", color: "bg-primary" },
                        { label: "Rural", pct: "20%", color: "bg-accent" },
                        { label: "Semi-Urban", pct: "10%", color: "bg-success" },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-1.5">
                            <div
                              className={`w-2 h-2 rounded-full ${item.color}`}
                            />
                            <span className="text-[10px] text-muted-foreground">
                              {item.label}
                            </span>
                          </div>
                          <span className="text-[10px] font-medium text-dark">
                            {item.pct}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quality Metrics */}
                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-semibold text-dark flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-success" />
                      Quality
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: "Data Accuracy", value: "98.2%", bar: 98 },
                      { label: "Completeness", value: "94.7%", bar: 95 },
                      { label: "Consistency", value: "96.1%", bar: 96 },
                      { label: "Timeliness", value: "91.3%", bar: 91 },
                    ].map((metric) => (
                      <div key={metric.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-muted-foreground">
                            {metric.label}
                          </span>
                          <span className="text-[10px] font-semibold text-dark">
                            {metric.value}
                          </span>
                        </div>
                        <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-success to-success/60 rounded-full"
                            style={{ width: `${metric.bar}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Regional Progress Table */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-dark flex items-center gap-2">
                    <Map className="w-4 h-4 text-primary" />
                    Regional Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          {[
                            "Region",
                            "Active Surveys",
                            "Responses",
                            "Completion",
                            "Trend",
                          ].map((header) => (
                            <th
                              key={header}
                              className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider py-2 px-3 text-left"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {regionData.map((row) => (
                          <tr
                            key={row.region}
                            className="border-b border-border/50 hover:bg-surface transition-colors"
                          >
                            <td className="py-2.5 px-3 text-xs font-medium text-dark">
                              {row.region}
                            </td>
                            <td className="py-2.5 px-3 text-xs text-muted-foreground">
                              {row.surveys}
                            </td>
                            <td className="py-2.5 px-3 text-xs font-medium text-dark">
                              {row.responses}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-surface rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      row.completion >= 85
                                        ? "bg-success"
                                        : row.completion >= 75
                                        ? "bg-accent"
                                        : "bg-red-500"
                                    }`}
                                    style={{
                                      width: `${row.completion}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-[10px] font-medium text-dark">
                                  {row.completion}%
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              {row.trend === "up" ? (
                                <ArrowUpRight className="w-3.5 h-3.5 text-success" />
                              ) : (
                                <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
