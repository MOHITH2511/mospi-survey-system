import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  Brain,
  Code2,
  Eye,
  ArrowRight,
  CheckCircle2,
  FileJson,
} from "lucide-react";

const steps = [
  {
    step: 1,
    title: "Upload Survey PDF",
    description: "Drop your existing paper-based survey instrument",
    icon: Upload,
    color: "bg-primary",
    content: (
      <div className="border-2 border-dashed border-primary/20 rounded-xl p-6 text-center bg-primary-50/30">
        <Upload className="w-8 h-8 text-primary/40 mx-auto mb-2" />
        <p className="text-xs font-medium text-dark">
          PLFS_Schedule_2025.pdf
        </p>
        <p className="text-[10px] text-muted-foreground mt-1">
          2.4 MB â€¢ 48 pages â€¢ Uploaded
        </p>
        <div className="mt-3 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-success" />
          <span className="text-[10px] text-success font-medium">
            PDF parsed successfully
          </span>
        </div>
      </div>
    ),
  },
  {
    step: 2,
    title: "AI Extraction",
    description: "AI extracts questions, options, and logic",
    icon: Brain,
    color: "bg-accent",
    content: (
      <div className="space-y-2">
        {[
          { label: "Questions detected", value: "142", status: "done" },
          { label: "Sections identified", value: "12", status: "done" },
          { label: "Skip patterns found", value: "23", status: "done" },
          { label: "Validation rules inferred", value: "67", status: "done" },
          { label: "Confidence score", value: "96.8%", status: "done" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between p-2 rounded-md bg-white border border-border"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3 text-success" />
              <span className="text-[11px] text-muted-foreground">
                {item.label}
              </span>
            </div>
            <span className="text-xs font-semibold text-dark">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    step: 3,
    title: "Generated JSON",
    description: "Structured JSON schema output",
    icon: Code2,
    color: "bg-primary-700",
    content: (
      <div className="bg-dark rounded-lg p-3 font-mono text-[10px] text-white/80 leading-relaxed overflow-hidden">
        <pre className="whitespace-pre-wrap">
          {`{
  "surveyId": "PLFS-2025-Q4",
  "version": "2.4.1",
  "sections": [
    {
      "id": "sec_identification",
      "title": "Identification",
      "questions": [
        {
          "id": "q1_state",
          "type": "select",
          "label": "State/UT Code",
          "required": true,
          "options": "states_ut_codes",
          "validation": {
            "pattern": "^[0-9]{2}$"
          }
        }
      ]
    }
  ]
}`}
        </pre>
      </div>
    ),
  },
  {
    step: 4,
    title: "Preview & Import",
    description: "Review and import into the survey builder",
    icon: Eye,
    color: "bg-success",
    content: (
      <div className="space-y-3">
        <div className="p-3 rounded-lg bg-success-50/50 border border-success/10">
          <div className="flex items-center gap-2 mb-2">
            <FileJson className="w-4 h-4 text-success" />
            <span className="text-xs font-medium text-dark">
              Survey Preview Ready
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 rounded bg-white border border-border">
              <span className="text-muted-foreground">Total Questions</span>
              <p className="font-semibold text-dark">142</p>
            </div>
            <div className="p-2 rounded bg-white border border-border">
              <span className="text-muted-foreground">Sections</span>
              <p className="font-semibold text-dark">12</p>
            </div>
            <div className="p-2 rounded bg-white border border-border">
              <span className="text-muted-foreground">Languages</span>
              <p className="font-semibold text-dark">Hindi, English</p>
            </div>
            <div className="p-2 rounded bg-white border border-border">
              <span className="text-muted-foreground">Estimated Time</span>
              <p className="font-semibold text-dark">45 min</p>
            </div>
          </div>
        </div>
        <Button
          size="sm"
          className="w-full bg-primary hover:bg-primary-700 text-white gap-2"
        >
          <FileText className="w-3.5 h-3.5" />
          Import to Survey Builder
        </Button>
      </div>
    ),
  },
];

export function PDFImportShowcase() {
  return (
    <section className="py-20 sm:py-24 bg-surface">
      <div className="w-full mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="text-center mb-14">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 h-auto text-sm font-medium border-primary/20 text-primary bg-primary-50"
          >
            <FileText className="w-3 h-3 mr-1" />
            PDF Import
          </Badge>
          <h3 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-dark tracking-tight">
            PDF to Digital Survey
          </h3>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            Convert existing paper-based survey instruments into digital surveys
            with AI-powered extraction and automatic JSON generation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, index) => (
            <div key={s.step} className="relative">
              {/* Connector Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-8 -right-4 z-10">
                  <ArrowRight className="w-5 h-5 text-muted-foreground/20" />
                </div>
              )}

              <Card className="h-full border-border/50 hover:shadow-lg hover:border-primary/20 transition-all duration-300 bg-white">
                <CardContent className="p-4 space-y-3">
                  {/* Step Header */}
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center`}
                    >
                      <s.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                        Step {s.step}
                      </p>
                      <p className="text-sm font-semibold text-dark leading-tight">
                        {s.title}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground">
                    {s.description}
                  </p>

                  {/* Step Content */}
                  {s.content}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
