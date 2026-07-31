import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { BarChart3, Users, Clock, Globe } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const responseData = [
  { week: "W1", responses: 12400 },
  { week: "W2", responses: 15800 },
  { week: "W3", responses: 14200 },
  { week: "W4", responses: 18900 },
  { week: "W5", responses: 22100 },
  { week: "W6", responses: 19600 },
  { week: "W7", responses: 25400 },
  { week: "W8", responses: 28700 },
];

const stateData = [
  { state: "UP", completed: 245000 },
  { state: "MH", completed: 198000 },
  { state: "TN", completed: 176000 },
  { state: "KA", completed: 152000 },
  { state: "RJ", completed: 134000 },
  { state: "GJ", completed: 128000 },
  { state: "WB", completed: 112000 },
  { state: "MP", completed: 98000 },
];

const langData = [
  { name: "Hindi", value: 38, color: "#2563eb" },
  { name: "Tamil", value: 18, color: "#7c3aed" },
  { name: "Telugu", value: 15, color: "#10b981" },
  { name: "Kannada", value: 12, color: "#f59e0b" },
  { name: "English", value: 10, color: "#64748b" },
  { name: "Others", value: 7, color: "#ec4899" },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Comprehensive survey performance and data insights"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Responses" value="1.84M" icon={BarChart3} trend={{ value: "+23.2% this month", direction: "up" }} iconColor="#2563eb" iconBg="#eff6ff" />
        <StatCard label="Unique Citizens" value="1.12M" icon={Users} trend={{ value: "+15.8% this month", direction: "up" }} iconColor="#7c3aed" iconBg="#f5f3ff" />
        <StatCard label="Avg. Completion Time" value="4.2 min" icon={Clock} trend={{ value: "-18% faster", direction: "up" }} iconColor="#10b981" iconBg="#ecfdf5" />
        <StatCard label="Languages Used" value="22" icon={Globe} trend={{ value: "+3 new languages", direction: "up" }} iconColor="#f59e0b" iconBg="#fffbeb" />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Response trends */}
        <div className="rounded-2xl border border-border bg-white p-5">
          <h3 className="mb-1 text-sm font-semibold text-foreground">Response Trends</h3>
          <p className="mb-4 text-xs text-muted-foreground">Weekly responses over 8 weeks</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={responseData}>
              <defs>
                <linearGradient id="gradResp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Area type="monotone" dataKey="responses" stroke="#2563eb" strokeWidth={2} fill="url(#gradResp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Completion by state */}
        <div className="rounded-2xl border border-border bg-white p-5">
          <h3 className="mb-1 text-sm font-semibold text-foreground">Completion by State</h3>
          <p className="mb-4 text-xs text-muted-foreground">Top 8 states by completed surveys</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stateData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis dataKey="state" type="category" tick={{ fontSize: 12 }} stroke="#94a3b8" width={30} />
              <Tooltip />
              <Bar dataKey="completed" fill="#2563eb" radius={[0, 6, 6, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Language + Quality */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-5">
          <h3 className="mb-1 text-sm font-semibold text-foreground">Language Distribution</h3>
          <p className="mb-4 text-xs text-muted-foreground">Survey responses by language</p>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={langData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {langData.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {langData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-sm text-foreground">{d.name}</span>
                  <span className="ml-auto text-sm font-semibold text-foreground">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <h3 className="mb-1 text-sm font-semibold text-foreground">Quality Metrics</h3>
          <p className="mb-4 text-xs text-muted-foreground">Data quality indicators</p>
          <div className="space-y-4">
            {[
              { label: "Data Completeness", value: 94, color: "#10b981" },
              { label: "Voice Accuracy", value: 97, color: "#2563eb" },
              { label: "GPS Compliance", value: 91, color: "#7c3aed" },
              { label: "Duplicate Detection", value: 99, color: "#f59e0b" },
            ].map((m) => (
              <div key={m.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="font-semibold text-foreground">{m.value}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${m.value}%`, backgroundColor: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
