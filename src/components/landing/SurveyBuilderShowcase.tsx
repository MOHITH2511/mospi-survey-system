import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GripVertical,
  Type,
  List,
  CheckSquare,
  Calendar,
  Hash,
  ToggleLeft,
  MapPin,
  Image,
  Settings,
  Layers,
  GitBranch,
  ShieldCheck,
  ChevronRight,
  Plus,
} from "lucide-react";

const questionTypes = [
  { icon: Type, label: "Text Input", color: "text-primary" },
  { icon: List, label: "Single Select", color: "text-primary-700" },
  { icon: CheckSquare, label: "Multi Select", color: "text-success" },
  { icon: Hash, label: "Numeric", color: "text-accent" },
  { icon: Calendar, label: "Date Picker", color: "text-primary-600" },
  { icon: ToggleLeft, label: "Yes / No", color: "text-success" },
  { icon: MapPin, label: "GPS Location", color: "text-red-500" },
  { icon: Image, label: "Photo Capture", color: "text-primary-400" },
];

const surveySections = [
  {
    name: "Section A: Identification",
    questions: 8,
    status: "Complete",
    statusColor: "bg-success/10 text-success",
  },
  {
    name: "Section B: Demographics",
    questions: 12,
    status: "Complete",
    statusColor: "bg-success/10 text-success",
  },
  {
    name: "Section C: Employment",
    questions: 15,
    status: "In Progress",
    statusColor: "bg-accent/10 text-accent",
  },
  {
    name: "Section D: Income",
    questions: 10,
    status: "Pending",
    statusColor: "bg-muted text-muted-foreground",
  },
  {
    name: "Section E: Expenditure",
    questions: 18,
    status: "Pending",
    statusColor: "bg-muted text-muted-foreground",
  },
];

export function SurveyBuilderShowcase() {
  return (
    <section className="py-20 sm:py-24 bg-surface">
      <div className="w-full mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="text-center mb-14">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 h-auto text-sm font-medium border-primary/20 text-primary bg-primary-50"
          >
            Survey Builder
          </Badge>
          <h3 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-dark tracking-tight">
            Enterprise Survey Builder
          </h3>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            Design complex survey instruments with an intuitive drag-and-drop
            interface, advanced logic, and validation rules.
          </p>
        </div>

        {/* Builder Mockup */}
        <Card className="bg-white border-border shadow-xl overflow-hidden">
          <CardContent className="p-0">
            {/* Builder Top Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-dark border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-sm font-medium text-white/70">
                  Survey Builder — PLFS 2025-26 Quarterly Schedule
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-success/20 text-success text-xs border-0 h-5 px-2">
                  Auto-saved
                </Badge>
                <span className="text-xs text-white/40">v2.4</span>
              </div>
            </div>

            {/* Builder Content */}
            <div className="grid lg:grid-cols-12 min-h-[480px]">
              {/* Left Panel - Question Palette */}
              <div className="lg:col-span-2 border-r border-border bg-surface p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Question Types
                </p>
                <div className="space-y-1.5">
                  {questionTypes.map((qt) => (
                    <div
                      key={qt.label}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-white cursor-grab text-sm group transition-colors"
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground" />
                      <qt.icon className={`w-4 h-4 ${qt.color}`} />
                      <span className="text-muted-foreground group-hover:text-dark text-sm">
                        {qt.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center - Survey Canvas */}
              <div className="lg:col-span-7 p-5 bg-white">
                <Tabs defaultValue="sections" className="w-full">
                  <TabsList className="mb-5 h-9">
                    <TabsTrigger value="sections" className="text-sm">
                      <Layers className="w-4 h-4 mr-1.5" />
                      Sections
                    </TabsTrigger>
                    <TabsTrigger value="logic" className="text-sm">
                      <GitBranch className="w-4 h-4 mr-1.5" />
                      Logic
                    </TabsTrigger>
                    <TabsTrigger value="validation" className="text-sm">
                      <ShieldCheck className="w-4 h-4 mr-1.5" />
                      Validation
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="sections" className="space-y-2">
                    {surveySections.map((section) => (
                      <div
                        key={section.name}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group"
                      >
                        <GripVertical className="w-5 h-5 text-muted-foreground/30 group-hover:text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-medium text-dark truncate">
                            {section.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {section.questions} questions
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-[9px] h-4 px-1.5 border-0 ${section.statusColor}`}
                        >
                          {section.status}
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
                      </div>
                    ))}

                    <button className="w-full flex items-center justify-center gap-2 p-3.5 rounded-lg border border-dashed border-border hover:border-primary/30 text-muted-foreground hover:text-primary transition-colors text-sm">
                      <Plus className="w-4 h-4" />
                      Add New Section
                    </button>
                  </TabsContent>

                  <TabsContent value="logic" className="space-y-3">
                    <div className="p-4 rounded-lg bg-primary-50/50 border border-primary/10">
                      <p className="text-xs font-medium text-dark mb-2">
                        Skip Logic Rules
                      </p>
                      <div className="space-y-2 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-2 p-2 bg-white rounded-md border border-border">
                          <span className="text-primary font-medium">IF</span>
                          <span>Q3.Employment = "Unemployed"</span>
                          <span className="text-accent font-medium">THEN</span>
                          <span>Skip to Section D</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded-md border border-border">
                          <span className="text-primary font-medium">IF</span>
                          <span>Q1.Age &lt; 15</span>
                          <span className="text-accent font-medium">THEN</span>
                          <span>Skip to Section E</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="validation" className="space-y-3">
                    <div className="p-4 rounded-lg bg-success-50/50 border border-success/10">
                      <p className="text-xs font-medium text-dark mb-2">
                        Validation Rules
                      </p>
                      <div className="space-y-2 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-2 p-2 bg-white rounded-md border border-border">
                          <ShieldCheck className="w-3 h-3 text-success flex-shrink-0" />
                          <span>Age must be between 0 and 120</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded-md border border-border">
                          <ShieldCheck className="w-3 h-3 text-success flex-shrink-0" />
                          <span>Income cannot exceed annual limit of ₹99,99,999</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-white rounded-md border border-border">
                          <ShieldCheck className="w-3 h-3 text-success flex-shrink-0" />
                          <span>Phone number must match 10-digit pattern</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Panel - Properties */}
              <div className="lg:col-span-3 border-l border-border bg-surface p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Question Properties
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground block mb-1">
                      Question Label
                    </label>
                    <div className="px-2.5 py-1.5 rounded-md border border-border bg-white text-xs text-dark">
                      What is your current employment status?
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground block mb-1">
                      Field Type
                    </label>
                    <div className="px-2.5 py-1.5 rounded-md border border-border bg-white text-xs text-dark flex items-center gap-1.5">
                      <List className="w-3 h-3 text-primary" />
                      Single Select
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground block mb-1">
                      Required
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-4 rounded-full bg-primary relative">
                        <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white" />
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        Mandatory
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground block mb-1">
                      Options
                    </label>
                    <div className="space-y-1">
                      {[
                        "Self-employed",
                        "Regular wage/salaried",
                        "Casual labour",
                        "Unemployed",
                        "Not in labour force",
                      ].map((opt) => (
                        <div
                          key={opt}
                          className="px-2 py-1 rounded border border-border bg-white text-[10px] text-dark flex items-center gap-1.5"
                        >
                          <div className="w-2.5 h-2.5 rounded-full border border-primary/30" />
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground block mb-1">
                      <Settings className="w-3 h-3 inline mr-1" />
                      NIC/NCC Code Mapping
                    </label>
                    <div className="px-2.5 py-1.5 rounded-md border border-border bg-primary-50/50 text-[10px] text-primary font-mono">
                      NCO-2015 → Block 5.3
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
