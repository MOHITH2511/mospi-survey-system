import { useState } from "react";
import {
  ClipboardCheck,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  Sliders,
  Play,
  Search,
  Zap,
  ShieldAlert,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface InconsistencyRecord {
  id: string;
  householdId: string;
  surveyName: string;
  enumerator: string;
  district: string;
  state: string;
  field: string;
  ruleCategory: "Existential" | "Referential" | "Logical" | "Range";
  ruleId: string;
  description: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Flagged" | "Under Review" | "Resolved";
  value: string;
}

export default function DataValidationWorkbench() {
  const [activeTab, setActiveTab] = useState("interactive");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("All");

  // Sample Survey Records for Interactive & Inconsistency Validation
  const [records, setRecords] = useState<InconsistencyRecord[]>([
    {
      id: "REC-101",
      householdId: "HH-2026-9941",
      surveyName: "PLFS 2026",
      enumerator: "Ramesh Kumar (ENUM-401)",
      district: "Patna",
      state: "Bihar",
      field: "employment_status",
      ruleCategory: "Logical",
      ruleId: "RULE_LOGICAL_AGE_EMP",
      description: "Respondent marked 'Employed' but Age is recorded as 12",
      severity: "Critical",
      status: "Flagged",
      value: "Employed (Age: 12)"
    },
    {
      id: "REC-102",
      householdId: "HH-2026-8812",
      surveyName: "HCES 2026",
      enumerator: "Anita Roy (ENUM-112)",
      district: "Lucknow",
      state: "Uttar Pradesh",
      field: "monthly_expenditure",
      ruleCategory: "Logical",
      ruleId: "RULE_LOGICAL_INC_EXP",
      description: "Monthly Expenditure (₹95,000) exceeds 5x Income (₹15,000)",
      severity: "High",
      status: "Flagged",
      value: "Exp: ₹95,000 | Inc: ₹15,000"
    },
    {
      id: "REC-103",
      householdId: "HH-2026-7734",
      surveyName: "PLFS 2026",
      enumerator: "Suresh P (ENUM-305)",
      district: "Jaipur",
      state: "Rajasthan",
      field: "occupation_code",
      ruleCategory: "Referential",
      ruleId: "RULE_REF_NCO",
      description: "Occupation code '9999' not found in NCO-2015 dictionary",
      severity: "High",
      status: "Flagged",
      value: "Code: 9999"
    },
    {
      id: "REC-104",
      householdId: "HH-2026-6651",
      surveyName: "HCES 2026",
      enumerator: "Mohan Lal (ENUM-220)",
      district: "Darbhanga",
      state: "Bihar",
      field: "state_code",
      ruleCategory: "Existential",
      ruleId: "RULE_EXIST_002",
      description: "Missing mandatory District location metadata",
      severity: "Medium",
      status: "Flagged",
      value: "State: 10 | District: NULL"
    }
  ]);

  // Dynamic Integrity Check Rules State
  const [rules] = useState([
    {
      id: "RULE_EXIST_001",
      name: "Mandatory Household ID",
      category: "Existential",
      field: "household_id",
      severity: "Critical",
      active: true
    },
    {
      id: "RULE_REF_NCO",
      name: "NCO-2015 Occupation Taxonomy Check",
      category: "Referential",
      field: "occupation_code",
      severity: "High",
      active: true
    },
    {
      id: "RULE_LOGICAL_AGE_EMP",
      name: "Minimum Age of Employment Verification",
      category: "Logical",
      field: "employment_status",
      severity: "Critical",
      active: true
    },
    {
      id: "RULE_LOGICAL_INC_EXP",
      name: "Income-to-Expenditure Feasibility Ratio",
      category: "Logical",
      field: "monthly_expenditure",
      severity: "High",
      active: true
    }
  ]);

  // Interactive Form Simulator State
  const [simRecord, setSimRecord] = useState({
    householdId: "HH-2026-9900",
    stateCode: "10",
    districtCode: "140",
    age: "14",
    empStatus: "Employed",
    income: "20000",
    expenditure: "110000",
    occCode: "9999"
  });

  const [simResults, setSimResults] = useState<any[]>([]);

  const handleRunSimValidation = () => {
    const violations = [];
    const ageNum = parseFloat(simRecord.age);
    if (ageNum < 15 && simRecord.empStatus.toLowerCase() === "employed") {
      violations.push({
        ruleId: "RULE_LOGICAL_AGE_EMP",
        category: "Logical",
        message: `Child labor logic violation: Age is ${simRecord.age} but status is 'Employed'`,
        severity: "Critical"
      });
    }

    const inc = parseFloat(simRecord.income);
    const exp = parseFloat(simRecord.expenditure);
    if (inc > 0 && exp > inc * 5) {
      violations.push({
        ruleId: "RULE_LOGICAL_INC_EXP",
        category: "Logical",
        message: `Financial Ratio Anomaly: Expenditure (₹${exp}) is > 5x Income (₹${inc})`,
        severity: "High"
      });
    }

    if (simRecord.occCode === "9999") {
      violations.push({
        ruleId: "RULE_REF_NCO",
        category: "Referential",
        message: `Occupation Code '9999' is invalid in NCO-2015 Taxonomy`,
        severity: "High"
      });
    }

    setSimResults(violations);
  };

  const handleResolveRecord = (id: string) => {
    setRecords(prev =>
      prev.map(r => (r.id === id ? { ...r, status: "Resolved" } : r))
    );
  };

  const filteredRecords = records.filter(r => {
    const matchesSearch =
      r.householdId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === "All" || r.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      {/* ── Top Header Banner ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#003366] via-[#004e8c] to-[#002244] text-white p-6 rounded-xl shadow-lg border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-[#f39c12] text-white font-bold px-2.5 py-0.5 text-xs">
              MoSPI HSD Core Engine
            </Badge>
            <span className="text-xs text-blue-200 uppercase tracking-widest">
              Data Validation Platform
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
            Data Validation & Inconsistency Workbench
          </h1>
          <p className="text-sm text-blue-100/90 mt-1">
            Real-time streaming checks, periodic batch validation execution, and automated ML anomaly flagging.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setActiveTab("batch")}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 gap-2"
          >
            <UploadCloud className="h-4 w-4" />
            Batch Ingestion
          </Button>
          <Button
            onClick={handleRunSimValidation}
            className="bg-[#f39c12] hover:bg-[#d68910] text-white font-bold gap-2 shadow-md"
          >
            <Zap className="h-4 w-4" />
            Run Validation Check
          </Button>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="grid grid-cols-3 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
          <TabsTrigger
            value="interactive"
            className="data-[state=active]:bg-[#003366] data-[state=active]:text-white font-bold text-sm py-2.5 gap-2"
          >
            <ClipboardCheck className="h-4 w-4" />
            Interactive Inconsistency Workbench
          </TabsTrigger>
          <TabsTrigger
            value="batch"
            className="data-[state=active]:bg-[#003366] data-[state=active]:text-white font-bold text-sm py-2.5 gap-2"
          >
            <UploadCloud className="h-4 w-4" />
            Batch Processing & Ingestion Engine
          </TabsTrigger>
          <TabsTrigger
            value="rules"
            className="data-[state=active]:bg-[#003366] data-[state=active]:text-white font-bold text-sm py-2.5 gap-2"
          >
            <Sliders className="h-4 w-4" />
            Dynamic Integrity Rule Builder
          </TabsTrigger>
        </TabsList>

        {/* ── TAB 1: INTERACTIVE WORKBENCH ── */}
        <TabsContent value="interactive" className="space-y-6">
          {/* Quick Simulation & Live Inspector Card */}
          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-[#003366] flex items-center gap-2">
                    <Zap className="h-5 w-5 text-[#f39c12]" />
                    Interactive Real-Time Rule Simulator
                  </CardTitle>
                  <CardDescription>
                    Input raw response fields to test real-time integrity and ML logic instant checking.
                  </CardDescription>
                </div>
                <Button
                  onClick={handleRunSimValidation}
                  size="sm"
                  className="bg-[#003366] hover:bg-[#002244] text-white font-bold gap-1.5"
                >
                  <Play className="h-3.5 w-3.5" /> Evaluate Form Payload
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase">Household ID</label>
                  <Input
                    value={simRecord.householdId}
                    onChange={e => setSimRecord({ ...simRecord, householdId: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase">Age</label>
                  <Input
                    value={simRecord.age}
                    onChange={e => setSimRecord({ ...simRecord, age: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase">Employment Status</label>
                  <Input
                    value={simRecord.empStatus}
                    onChange={e => setSimRecord({ ...simRecord, empStatus: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase">NCO Occupation Code</label>
                  <Input
                    value={simRecord.occCode}
                    onChange={e => setSimRecord({ ...simRecord, occCode: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase">Monthly Income (₹)</label>
                  <Input
                    value={simRecord.income}
                    onChange={e => setSimRecord({ ...simRecord, income: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase">Monthly Expenditure (₹)</label>
                  <Input
                    value={simRecord.expenditure}
                    onChange={e => setSimRecord({ ...simRecord, expenditure: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase">State Code</label>
                  <Input
                    value={simRecord.stateCode}
                    onChange={e => setSimRecord({ ...simRecord, stateCode: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase">District Code</label>
                  <Input
                    value={simRecord.districtCode}
                    onChange={e => setSimRecord({ ...simRecord, districtCode: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              {simResults.length > 0 ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-red-700 flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4" /> Rule Violations Detected ({simResults.length}):
                  </p>
                  <ul className="space-y-1 text-sm text-red-800">
                    {simResults.map((v, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Badge className="bg-red-600 text-white text-[10px] font-bold">{v.severity}</Badge>
                        <span className="font-mono text-xs text-red-900 font-bold">[{v.ruleId}]</span>
                        <span>{v.message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Form Payload is fully compliant across all existential, referential, and logical rules!
                </div>
              )}
            </CardContent>
          </Card>

          {/* Flagged Inconsistent Data Table */}
          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-bold text-[#003366]">
                    Automated Inconsistency Flagging Register
                  </CardTitle>
                  <CardDescription>
                    Live Queue of individual & aggregate level flagged survey data records requiring review.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Filter by Household ID..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-9 h-9 text-xs"
                    />
                  </div>

                  <select
                    value={selectedSeverity}
                    onChange={e => setSelectedSeverity(e.target.value)}
                    className="h-9 px-3 text-xs font-bold border border-slate-300 rounded-md bg-white text-slate-700"
                  >
                    <option value="All">All Severities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-100">
                  <TableRow>
                    <TableHead className="font-bold text-xs">Household ID</TableHead>
                    <TableHead className="font-bold text-xs">Survey / Location</TableHead>
                    <TableHead className="font-bold text-xs">Category</TableHead>
                    <TableHead className="font-bold text-xs">Discrepancy Details</TableHead>
                    <TableHead className="font-bold text-xs">Severity</TableHead>
                    <TableHead className="font-bold text-xs">Status</TableHead>
                    <TableHead className="font-bold text-xs text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map(rec => (
                    <TableRow key={rec.id} className="hover:bg-slate-50/80">
                      <TableCell className="font-bold font-mono text-xs text-[#003366]">
                        {rec.householdId}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-semibold text-slate-900">{rec.surveyName}</div>
                        <div className="text-[11px] text-slate-500">{rec.district}, {rec.state}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[11px] font-bold border-slate-300">
                          {rec.ruleCategory}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-slate-800 font-medium">{rec.description}</div>
                        <div className="text-[11px] font-mono text-amber-700 mt-0.5">{rec.value}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-[10px] font-bold uppercase ${
                            rec.severity === "Critical"
                              ? "bg-red-600 text-white"
                              : rec.severity === "High"
                              ? "bg-orange-500 text-white"
                              : "bg-amber-500 text-white"
                          }`}
                        >
                          {rec.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-[10px] font-bold ${
                            rec.status === "Resolved"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-900"
                          }`}
                        >
                          {rec.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {rec.status !== "Resolved" ? (
                          <Button
                            size="sm"
                            onClick={() => handleResolveRecord(rec.id)}
                            className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Resolve
                          </Button>
                        ) : (
                          <span className="text-xs text-emerald-600 font-bold flex items-center justify-end gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── TAB 2: BATCH PROCESSING ── */}
        <TabsContent value="batch" className="space-y-6">
          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
              <CardTitle className="text-lg font-bold text-[#003366] flex items-center gap-2">
                <UploadCloud className="h-5 w-5 text-[#003366]" />
                Periodic Batch Ingestion & Dataset Validation Trigger
              </CardTitle>
              <CardDescription>
                Upload large historical survey datasets (CSV, Parquet, Excel, JSON) for automated multi-threaded validation.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="border-2 border-dashed border-slate-300 hover:border-[#003366] rounded-xl p-8 text-center bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer">
                <FileSpreadsheet className="h-12 w-12 text-[#003366] mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">
                  Drag & Drop Batch Survey Dataset File Here
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Supports CSV, Excel (.xlsx), JSON, and Apache Parquet files up to 500 MB.
                </p>
                <Button className="mt-4 bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs gap-2">
                  <UploadCloud className="h-4 w-4" /> Select Dataset File
                </Button>
              </div>

              {/* Ingestion Batch Logs Table */}
              <div>
                <h4 className="text-sm font-bold text-[#003366] uppercase tracking-wider mb-3">
                  Recent Batch Validation Execution History
                </h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-100">
                      <TableRow>
                        <TableHead className="font-bold text-xs">Batch ID</TableHead>
                        <TableHead className="font-bold text-xs">Survey Dataset</TableHead>
                        <TableHead className="font-bold text-xs">Source</TableHead>
                        <TableHead className="font-bold text-xs">Total Records</TableHead>
                        <TableHead className="font-bold text-xs">Clean / Flagged</TableHead>
                        <TableHead className="font-bold text-xs">Quality Index</TableHead>
                        <TableHead className="font-bold text-xs text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-mono text-xs font-bold text-[#003366]">BATCH-2026-0801</TableCell>
                        <TableCell className="text-xs font-bold text-slate-800">PLFS_Historical_Sample_2026.parquet</TableCell>
                        <TableCell className="text-xs text-slate-600">Batch File Upload</TableCell>
                        <TableCell className="text-xs font-bold text-slate-900">12,500</TableCell>
                        <TableCell className="text-xs">
                          <span className="text-emerald-700 font-bold">11,820</span> / <span className="text-red-600 font-bold">680</span>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-100 text-emerald-800 font-bold text-[11px]">94.6% DQI</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-emerald-600 text-white font-bold text-[10px]">Completed</Badge>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-mono text-xs font-bold text-[#003366]">BATCH-2026-0802</TableCell>
                        <TableCell className="text-xs font-bold text-slate-800">HCES_Realtime_Stream_Q2.json</TableCell>
                        <TableCell className="text-xs text-slate-600">eSigma API Gateway</TableCell>
                        <TableCell className="text-xs font-bold text-slate-900">4,300</TableCell>
                        <TableCell className="text-xs">
                          <span className="text-emerald-700 font-bold">4,050</span> / <span className="text-red-600 font-bold">250</span>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-100 text-emerald-800 font-bold text-[11px]">94.1% DQI</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-emerald-600 text-white font-bold text-[10px]">Completed</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── TAB 3: DYNAMIC INTEGRITY RULES ── */}
        <TabsContent value="rules" className="space-y-6">
          <Card className="border border-slate-200 shadow-sm bg-white">
            <CardHeader className="bg-slate-50 border-b border-slate-200 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-[#003366] flex items-center gap-2">
                    <Sliders className="h-5 w-5 text-[#003366]" />
                    Facility for Defining Integrity Validation Rules
                  </CardTitle>
                  <CardDescription>
                    Configure existential, referential (NCO/NIC dictionaries), range, and cross-field logic rules.
                  </CardDescription>
                </div>
                <Button className="bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs gap-1.5">
                  <Plus className="h-4 w-4" /> Add Custom Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-100">
                  <TableRow>
                    <TableHead className="font-bold text-xs">Rule ID</TableHead>
                    <TableHead className="font-bold text-xs">Rule Name & Description</TableHead>
                    <TableHead className="font-bold text-xs">Category</TableHead>
                    <TableHead className="font-bold text-xs">Target Field</TableHead>
                    <TableHead className="font-bold text-xs">Severity</TableHead>
                    <TableHead className="font-bold text-xs text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map(rule => (
                    <TableRow key={rule.id} className="hover:bg-slate-50">
                      <TableCell className="font-mono text-xs font-bold text-[#003366]">{rule.id}</TableCell>
                      <TableCell>
                        <div className="text-xs font-bold text-slate-900">{rule.name}</div>
                        <div className="text-[11px] text-slate-500">Evaluates ongoing and batch data submissions</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-bold border-slate-300">{rule.category}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-700">{rule.field}</TableCell>
                      <TableCell>
                        <Badge
                          className={`text-[10px] font-bold uppercase ${
                            rule.severity === "Critical"
                              ? "bg-red-600 text-white"
                              : "bg-orange-500 text-white"
                          }`}
                        >
                          {rule.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-emerald-100 text-emerald-800 font-bold text-[10px]">Active</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
