import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Sparkles,
  Plus,
  Briefcase,
  Clock,
  DollarSign,
  ListChecks,
  MessageSquare,
  Target,
} from "lucide-react";

const aiSuggestions = [
  {
    question: "What is the principal employment status of the household member?",
    type: "Single Select",
    icon: Briefcase,
    category: "Employment Status",
    options: [
      "Self-employed (own account worker)",
      "Self-employed (employer)",
      "Regular wage/salaried employee",
      "Casual labour in public works",
      "Casual labour in other types of work",
    ],
  },
  {
    question: "What is the occupation classification (NCO-2015) of the member?",
    type: "Hierarchical Select",
    icon: ListChecks,
    category: "Occupation Classification",
    options: [
      "Managers",
      "Professionals",
      "Technicians and Associate Professionals",
      "Clerical Support Workers",
      "Service and Sales Workers",
    ],
  },
  {
    question: "How many hours did the member work during the reference week?",
    type: "Numeric",
    icon: Clock,
    category: "Hours Worked",
    options: null,
  },
  {
    question: "What is the monthly earnings category of the member?",
    type: "Range Select",
    icon: DollarSign,
    category: "Income Category",
    options: [
      "Less than ₹5,000",
      "₹5,000 – ₹10,000",
      "₹10,000 – ₹25,000",
      "₹25,000 – ₹50,000",
      "Above ₹50,000",
    ],
  },
];

export function AIAssistantShowcase() {
  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="w-full mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="text-center mb-14">
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 h-auto text-sm font-medium border-accent/30 text-accent bg-accent-50"
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            AI Assistant
          </Badge>
          <h3 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-dark tracking-tight">
            AI-Powered Survey Generation
          </h3>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            Describe your survey objective and let AI generate statistically
            sound survey questions, response options, and validation rules.
          </p>
        </div>

        <Card className="bg-dark border-0 shadow-2xl overflow-hidden max-w-6xl mx-auto">
          <CardContent className="p-0">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 flex items-center gap-2 justify-center">
                <Brain className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-white/60">
                  National Survey Portal AI Assistant
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Goal Input */}
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-1.5">
                    Survey Objective
                  </p>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-base text-white">
                      "Create a Household Employment Survey aligned with PLFS
                      methodology for quarterly labour force assessment across
                      urban and rural India"
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-5 h-5 text-dark" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-3">
                    AI Generated Questions
                  </p>

                  <div className="space-y-3">
                    {aiSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-primary/30 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <suggestion.icon className="w-4 h-4 text-accent" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                <Badge className="bg-white/10 text-white/60 text-[10px] border-0 h-4 px-2">
                                  {suggestion.category}
                                </Badge>
                                <Badge className="bg-primary/20 text-primary-300 text-[10px] border-0 h-4 px-2">
                                  {suggestion.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-white/90 leading-relaxed">
                                {suggestion.question}
                              </p>

                              {suggestion.options && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {suggestion.options.map((opt) => (
                                    <span
                                      key={opt}
                                      className="inline-block px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-white/50"
                                    >
                                      {opt}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            size="xs"
                            className="bg-primary/20 hover:bg-primary/40 text-primary-300 border-0 gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          >
                            <Plus className="w-3 h-3" />
                            Add
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="mt-4 flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                    <MessageSquare className="w-4 h-4 text-white/30" />
                    <span className="text-xs text-white/30 flex-1">
                      Refine suggestions or ask for more questions...
                    </span>
                    <Button
                      size="xs"
                      className="bg-accent text-dark border-0 hover:bg-accent-200"
                    >
                      <Sparkles className="w-3 h-3" />
                    </Button>
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
