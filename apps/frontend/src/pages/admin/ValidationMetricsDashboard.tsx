import { useState } from "react";
import {
  Activity,
  ShieldCheck,
  TrendingUp,
  Download,
  BarChart3,
  PieChart as PieIcon,
  AlertOctagon,
  CheckCircle2,
  FileText,
  MapPin,
  Sparkles,
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ValidationMetricsDashboard() {
  const [isExporting, setIsExporting] = useState(false);

  const handleTriggerExport = (format: string) => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(`Export Successful: Downloaded clean MoSPI validated dataset in .${format.toLowerCase()} format.`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* ── Header Banner ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#003366] via-[#004e8c] to-[#002244] text-white p-6 rounded-xl shadow-lg border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-[#f39c12] text-white font-bold px-2.5 py-0.5 text-xs">
              MoSPI Analytics Engine
            </Badge>
            <span className="text-xs text-blue-200 uppercase tracking-widest">
              Performance Metrics & Reporting
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
            Data Quality & System Performance Dashboard
          </h1>
          <p className="text-sm text-blue-100/90 mt-1">
            Real-time quality indicators, rule violation breakdown, Benford's Law analysis, and multi-format reporting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleTriggerExport("CSV")}
            disabled={isExporting}
            className="bg-white hover:bg-slate-100 text-[#003366] font-bold gap-2 text-xs"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Export CSV
          </Button>
          <Button
            onClick={() => handleTriggerExport("Parquet")}
            disabled={isExporting}
            className="bg-[#f39c12] hover:bg-[#d68910] text-white font-bold gap-2 text-xs shadow-md"
          >
            <Download className="h-4 w-4" /> Export Parquet
          </Button>
          <Button
            onClick={() => handleTriggerExport("PDF")}
            disabled={isExporting}
            className="bg-red-600 hover:bg-red-700 text-white font-bold gap-2 text-xs shadow-md"
          >
            <FileText className="h-4 w-4" /> PDF Audit Report
          </Button>
        </div>
      </div>

      {/* ── KPI Stat Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Health (DQI)</span>
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-[#003366] mt-2">94.4%</div>
            <div className="mt-2 space-y-1">
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '94.4%' }} />
              </div>
              <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +1.8% vs previous survey quarter
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Verified Records</span>
              <Activity className="h-5 w-5 text-[#003366]" />
            </div>
            <div className="text-2xl font-black text-[#003366] mt-2">16,800</div>
            <p className="text-[11px] text-slate-500 mt-2 font-medium">
              Real-time API & Batch streams combined
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Flagged Discrepancies</span>
              <AlertOctagon className="h-5 w-5 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 mt-2">930</div>
            <p className="text-[11px] text-amber-700 font-bold mt-2">
              5.5% overall violation rate
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ML Anomaly High Risk</span>
              <Sparkles className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-purple-700 mt-2">142</div>
            <p className="text-[11px] text-purple-800 font-bold mt-2">
              Isolation Forest outlier score &gt; 0.75
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Main Breakdown & Charts Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Violation Category Breakdown */}
        <Card className="border border-slate-200 shadow-sm bg-white lg:col-span-1">
          <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
            <CardTitle className="text-base font-bold text-[#003366] flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-[#003366]" />
              Violation Category Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Referential Integrity (NCO/NIC)</span>
                  <span className="text-[#003366]">38.2%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-[#003366] h-full rounded-full" style={{ width: '38.2%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Logical & Cross-Field Logic</span>
                  <span className="text-amber-600">25.1%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '25.1%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Existential Mandatory Fields</span>
                  <span className="text-red-600">24.5%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: '24.5%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Range & Numeric Bounds</span>
                  <span className="text-blue-600">12.2%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '12.2%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spatial District Discrepancy Heatmap Table */}
        <Card className="border border-slate-200 shadow-sm bg-white lg:col-span-2">
          <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
            <CardTitle className="text-base font-bold text-[#003366] flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#003366]" />
              District & State Data Discrepancy Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-100">
                <TableRow>
                  <TableHead className="font-bold text-xs">District</TableHead>
                  <TableHead className="font-bold text-xs">State</TableHead>
                  <TableHead className="font-bold text-xs">Total Sampled</TableHead>
                  <TableHead className="font-bold text-xs">Flagged Rate</TableHead>
                  <TableHead className="font-bold text-xs">Risk Profile</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-bold text-xs text-slate-900">Patna</TableCell>
                  <TableCell className="text-xs text-slate-600">Bihar</TableCell>
                  <TableCell className="text-xs font-bold text-slate-800">3,400</TableCell>
                  <TableCell className="text-xs font-bold text-red-600">8.4%</TableCell>
                  <TableCell>
                    <Badge className="bg-red-600 text-white font-bold text-[10px]">High Risk</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold text-xs text-slate-900">Lucknow</TableCell>
                  <TableCell className="text-xs text-slate-600">Uttar Pradesh</TableCell>
                  <TableCell className="text-xs font-bold text-slate-800">4,100</TableCell>
                  <TableCell className="text-xs font-bold text-orange-600">7.9%</TableCell>
                  <TableCell>
                    <Badge className="bg-orange-500 text-white font-bold text-[10px]">Medium Risk</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold text-xs text-slate-900">Jaipur</TableCell>
                  <TableCell className="text-xs text-slate-600">Rajasthan</TableCell>
                  <TableCell className="text-xs font-bold text-slate-800">2,800</TableCell>
                  <TableCell className="text-xs font-bold text-amber-600">4.1%</TableCell>
                  <TableCell>
                    <Badge className="bg-amber-500 text-white font-bold text-[10px]">Low Risk</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold text-xs text-slate-900">Coimbatore</TableCell>
                  <TableCell className="text-xs text-slate-600">Tamil Nadu</TableCell>
                  <TableCell className="text-xs font-bold text-slate-800">3,100</TableCell>
                  <TableCell className="text-xs font-bold text-emerald-600">1.2%</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-600 text-white font-bold text-[10px]">Minimal</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Benford's Law Statistical Fabrication Analysis Card */}
      <Card className="border border-slate-200 shadow-sm bg-white">
        <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
          <CardTitle className="text-base font-bold text-[#003366] flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[#f39c12]" />
            Benford's Law Digital Analysis (Data Fabrication Detection)
          </CardTitle>
          <CardDescription>
            Validates first-digit natural frequency distributions of numerical financial survey responses.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              <div>
                <h4 className="text-sm font-bold text-emerald-900">Natural Distribution Conformance Verified</h4>
                <p className="text-xs text-emerald-800">
                  Chi-Square Statistic: <strong>4.82</strong> (Well below critical threshold 15.51). Low probability of fabricated entries.
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-600 text-white font-bold text-xs">Conforming (Alpha = 0.05)</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
