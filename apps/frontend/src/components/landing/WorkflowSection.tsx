import { Badge } from "@/components/ui/badge";
import {
  PenTool,
  Brain,
  Send,
  Smartphone,
  ShieldCheck,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    title: "Survey Design",
    description: "Build survey instruments with drag-and-drop or JSON",
    icon: PenTool,
    color: "bg-primary",
  },
  {
    title: "AI Assistance",
    description: "Auto-generate questions from research objectives",
    icon: Brain,
    color: "bg-primary-700",
  },
  {
    title: "Survey Publishing",
    description: "Deploy to mobile apps across all target regions",
    icon: Send,
    color: "bg-primary-600",
  },
  {
    title: "Field Data Collection",
    description: "Offline-capable mobile collection with GPS",
    icon: Smartphone,
    color: "bg-accent",
  },
  {
    title: "Monitoring & Validation",
    description: "Real-time quality checks and anomaly detection",
    icon: ShieldCheck,
    color: "bg-success",
  },
  {
    title: "Analytics & Reporting",
    description: "Interactive dashboards and exportable reports",
    icon: BarChart3,
    color: "bg-primary",
  },
];

export function WorkflowSection() {
  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="w-full mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="text-center mb-14">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 h-auto text-sm font-medium border-primary/20 text-primary bg-primary-50"
          >
            End-to-End Platform
          </Badge>
          <h3 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-dark tracking-tight">
            Complete Survey Lifecycle
          </h3>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            From survey design to analytics — a unified platform for every stage
            of the survey operation lifecycle.
          </p>
        </div>

        {/* Desktop Workflow */}
        <div className="hidden lg:block">
          <div className="relative flex items-start justify-between">
            {/* Connecting Line */}
            <div className="absolute top-10 left-[8%] right-[8%] h-0.5 bg-gradient-to-r from-primary via-accent to-success" />

            {steps.map((step, index) => (
              <div key={step.title} className="relative flex flex-col items-center text-center w-44 group">
                {/* Icon Circle */}
                <div
                  className={`relative z-10 w-20 h-20 rounded-2xl ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <step.icon className="w-9 h-9 text-white" />
                </div>

                {/* Step Number */}
                <div className="absolute -top-2 -right-1 w-6 h-6 rounded-full bg-dark text-white text-xs font-bold flex items-center justify-center z-20">
                  {index + 1}
                </div>

                {/* Arrow (except last) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-9 -right-6 z-20">
                    <ArrowRight className="w-5 h-5 text-muted-foreground/30" />
                  </div>
                )}

                {/* Text */}
                <h4 className="text-base font-semibold text-dark mt-5">
                  {step.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1.5 leading-snug px-1">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Workflow */}
        <div className="lg:hidden space-y-5">
          {steps.map((step, index) => (
            <div key={step.title} className="flex items-start gap-5">
              <div className="relative flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-xl ${step.color} flex items-center justify-center shadow-md flex-shrink-0`}
                >
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-10 bg-border mt-2" />
                )}
              </div>
              <div className="pt-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground">
                    STEP {index + 1}
                  </span>
                </div>
                <h4 className="text-base font-semibold text-dark">
                  {step.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
