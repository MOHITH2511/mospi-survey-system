import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  FileUp,
  Code2,
  WifiOff,
  ShieldCheck,
  BarChart3,
  GitBranch,
  Languages,
} from "lucide-react";

const features = [
  {
    title: "AI Question Generation",
    description:
      "Automatically generate survey questions from objectives using advanced language models trained on statistical survey design.",
    icon: Brain,
    tag: "AI Powered",
    tagColor: "bg-primary-50 text-primary border-primary/20",
  },
  {
    title: "PDF-to-Survey Conversion",
    description:
      "Upload existing paper-based surveys in PDF format and let AI extract, structure, and convert them into digital survey JSON.",
    icon: FileUp,
    tag: "Automation",
    tagColor: "bg-accent-50 text-accent border-accent/20",
  },
  {
    title: "Dynamic JSON Survey Engine",
    description:
      "Render complex surveys with skip logic, piping, validations, and conditional sections — all driven by a declarative JSON schema.",
    icon: Code2,
    tag: "Core Engine",
    tagColor: "bg-primary-50 text-primary border-primary/20",
  },
  {
    title: "Offline Data Collection",
    description:
      "Enumerators can collect data in remote areas without connectivity. Responses auto-sync when network is available.",
    icon: WifiOff,
    tag: "Field Ready",
    tagColor: "bg-success-50 text-success border-success/20",
  },
  {
    title: "Quality Monitoring",
    description:
      "Real-time quality flags for GPS anomalies, response patterns, completion times, and data consistency checks.",
    icon: ShieldCheck,
    tag: "Data Quality",
    tagColor: "bg-red-50 text-red-600 border-red-200",
  },
  {
    title: "Real-Time Analytics",
    description:
      "Interactive dashboards with regional breakdowns, completion trends, response distributions, and exportable reports.",
    icon: BarChart3,
    tag: "Analytics",
    tagColor: "bg-primary-50 text-primary border-primary/20",
  },
  {
    title: "Survey Versioning",
    description:
      "Track every change to survey instruments with full version history, diff views, and rollback capabilities.",
    icon: GitBranch,
    tag: "Governance",
    tagColor: "bg-accent-50 text-accent border-accent/20",
  },
  {
    title: "Multilingual Support",
    description:
      "Deploy surveys in 22 scheduled languages of India with seamless language switching for enumerators and respondents.",
    icon: Languages,
    tag: "Accessibility",
    tagColor: "bg-success-50 text-success border-success/20",
  },
];

export function WhySurveyOS() {
  return (
    <section className="py-20 sm:py-24 bg-surface">
      <div className="w-full mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="text-center mb-14">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 h-auto text-sm font-medium border-primary/20 text-primary bg-primary-50"
          >
            Platform Capabilities
          </Badge>
          <h3 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-dark tracking-tight">
            Why National Survey Portal?
          </h3>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            A comprehensive survey operating system designed for the scale and
            complexity of national statistical operations.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-border/50 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group bg-white"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs h-5 px-2 font-medium border ${feature.tagColor}`}
                  >
                    {feature.tag}
                  </Badge>
                </div>
                <CardTitle className="text-base font-semibold text-dark mt-4">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
