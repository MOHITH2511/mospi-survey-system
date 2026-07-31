import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  WifiOff,
  MapPin,
  Save,
  Languages,
  BarChart3,
  Smartphone,
  Signal,
  Battery,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
} from "lucide-react";

const features = [
  {
    icon: WifiOff,
    title: "Offline Mode",
    description: "Full functionality without network connectivity",
  },
  {
    icon: MapPin,
    title: "GPS Capture",
    description: "Automatic location tagging for every response",
  },
  {
    icon: Save,
    title: "Auto Save",
    description: "Never lose data — continuous background sync",
  },
  {
    icon: Languages,
    title: "Multilingual",
    description: "Switch between 22 languages on the fly",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Visual completion indicators per section",
  },
];

export function EnumeratorExperience() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="mb-3 px-3 py-1 h-auto text-xs font-medium border-success/30 text-success bg-success-50"
          >
            <Smartphone className="w-3 h-3 mr-1" />
            Field Collection
          </Badge>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark tracking-tight">
            Enumerator Mobile Experience
          </h3>
          <p className="text-base text-muted-foreground mt-3 max-w-2xl mx-auto">
            A purpose-built mobile interface designed for field enumerators
            working in diverse conditions across India.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Mobile Phone Mockup */}
          <div className="flex justify-center">
            <div className="relative w-[280px]">
              {/* Phone Frame */}
              <div className="bg-dark rounded-[2.5rem] p-3 shadow-2xl shadow-dark/30">
                <div className="bg-white rounded-[2rem] overflow-hidden">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between px-5 py-2 bg-primary">
                    <span className="text-[9px] text-white/80 font-medium">
                      9:41 AM
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Signal className="w-3 h-3 text-white/60" />
                      <WifiOff className="w-3 h-3 text-accent" />
                      <Battery className="w-3 h-3 text-white/80" />
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="bg-primary px-4 pb-3">
                    <div className="flex items-center gap-2">
                      <ChevronLeft className="w-4 h-4 text-white/70" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-white">
                          PLFS 2025-26
                        </p>
                        <p className="text-[9px] text-white/60">
                          Section C: Employment Details
                        </p>
                      </div>
                      <Badge className="bg-accent/20 text-accent text-[8px] border-0 h-3.5 px-1.5">
                        Offline
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2.5 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full w-[65%] bg-accent rounded-full" />
                      </div>
                      <span className="text-[9px] text-white/70">65%</span>
                    </div>
                  </div>

                  {/* Survey Content */}
                  <div className="p-4 space-y-4">
                    {/* GPS Info */}
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-success-50 border border-success/10">
                      <MapPin className="w-3 h-3 text-success" />
                      <span className="text-[9px] text-success font-medium">
                        28.6139°N, 77.2090°E • GPS Locked
                      </span>
                    </div>

                    {/* Question */}
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground mb-1">
                        Q3.1
                      </p>
                      <p className="text-xs font-medium text-dark mb-3">
                        What is the principal employment status of this
                        household member?
                      </p>

                      <div className="space-y-1.5">
                        {[
                          {
                            label: "Self-employed (own account)",
                            selected: false,
                          },
                          {
                            label: "Regular wage/salaried",
                            selected: true,
                          },
                          { label: "Casual labour", selected: false },
                          { label: "Unemployed", selected: false },
                          { label: "Not in labour force", selected: false },
                        ].map((opt) => (
                          <div
                            key={opt.label}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[11px] transition-colors ${
                              opt.selected
                                ? "border-primary bg-primary-50 text-primary font-medium"
                                : "border-border text-muted-foreground"
                            }`}
                          >
                            {opt.selected ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-muted-foreground/30 flex-shrink-0" />
                            )}
                            {opt.label}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Language Switcher */}
                    <div className="flex items-center gap-1.5">
                      <Languages className="w-3 h-3 text-muted-foreground" />
                      <div className="flex gap-1">
                        {["EN", "हि", "বা"].map((lang, i) => (
                          <span
                            key={lang}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${
                              i === 0
                                ? "bg-primary text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="border-t border-border px-4 py-3 flex items-center justify-between">
                    <button className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Previous
                    </button>
                    <span className="text-[9px] text-muted-foreground font-mono">
                      Q 12 / 18
                    </span>
                    <button className="flex items-center gap-1 text-[11px] text-primary font-medium">
                      Next
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Auto Save Indicator */}
                  <div className="px-4 py-2 bg-surface border-t border-border">
                    <div className="flex items-center justify-center gap-1.5">
                      <Save className="w-3 h-3 text-success" />
                      <span className="text-[9px] text-muted-foreground">
                        Auto-saved • 3 responses queued for sync
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-5 bg-dark rounded-full" />
            </div>
          </div>

          {/* Feature List */}
          <div className="space-y-4">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-border/50 hover:shadow-md hover:border-primary/20 transition-all duration-300 bg-white group"
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-dark">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
