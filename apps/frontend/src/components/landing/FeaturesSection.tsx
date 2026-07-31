import {
  CheckCircle,
  Languages,
  RefreshCw,
  Wifi,
  Mic,
  Sparkles,
} from "lucide-react";
import womanImg from "@/assets/woman_transparent.png";

const themeBlue = "#004e8c";

const featureCards = [
  {
    id: "auto-validation",
    icon: CheckCircle,
    label: "Auto Validation",
    sub: "Better data quality",
    position: { top: "10%", right: "-12%" },
  },
  {
    id: "multilingual",
    icon: Languages,
    label: "Multilingual",
    sub: "22+ Languages",
    position: { top: "25%", left: "-18%" },
  },
  {
    id: "realtime",
    icon: RefreshCw,
    label: "Real-time Sync",
    sub: "Instant data flow",
    position: { top: "40%", right: "-22%" },
  },
  {
    id: "offline",
    icon: Wifi,
    label: "Offline Support",
    sub: "Works anywhere",
    position: { top: "55%", left: "-15%" },
  },
  {
    id: "voice",
    icon: Mic,
    label: "Voice Enabled",
    sub: "Speak naturally",
    position: { top: "70%", right: "-10%" },
  },
  {
    id: "ai",
    icon: Sparkles,
    label: "AI Powered",
    sub: "Smart assistance",
    position: { bottom: "5%", left: "-8%" },
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:items-center lg:gap-x-16">
          
          {/* ── Left Column: Text Content ── */}
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Empowering Citizens Through <span className="text-[#1e3a8a]">Voice Intelligence</span>
            </h2>
            <p className="text-lg leading-relaxed text-gray-600">
              The Digital India Survey Portal leverages cutting-edge AI and voice recognition technology to make participating in government surveys accessible to everyone, regardless of literacy levels or language barriers.
            </p>
            
            <ul className="mt-6 flex flex-col gap-4">
              <li className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#004e8c]/20 bg-blue-50 text-[#004e8c]">
                  <Mic className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Accessibility-First Experience</h3>
                  <p className="mt-1 text-gray-600">Complete entire surveys simply by speaking naturally in your preferred local language.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#004e8c]/20 bg-blue-50 text-[#004e8c]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI-Powered Extraction</h3>
                  <p className="mt-1 text-gray-600">Our intelligent systems automatically convert your spoken responses into structured data.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#004e8c]/20 bg-blue-50 text-[#004e8c]">
                  <Wifi className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Remote Accessibility</h3>
                  <p className="mt-1 text-gray-600">Built to work flawlessly in rural areas with full offline support and auto-sync.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* ── Right Column: Woman Image & Floating Cards ── */}
          <div className="relative mx-auto w-full max-w-[500px] aspect-[1/1.1] select-none">
            {/* Radial glow background */}
            <div className="absolute inset-0 z-0 bg-blue-50/50 rounded-full blur-3xl transform scale-90" />
            
            {/* Woman image */}
            <img
              src={womanImg}
              alt="Citizen participating in a survey"
              className="absolute inset-x-0 bottom-0 z-10 w-full h-[110%] object-contain object-bottom drop-shadow-2xl"
              draggable={false}
            />

            {/* Floating feature cards — unified blue theme */}
            {featureCards.map(({ id, icon: Icon, label, sub, position }) => (
              <div
                key={id}
                className="absolute z-20 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/80 p-3 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white"
                style={position}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#004e8c]/20 bg-blue-50">
                  <Icon size={20} color={themeBlue} strokeWidth={2} />
                </div>
                <div className="hidden sm:block leading-tight">
                  <p className="text-sm font-bold text-slate-800 whitespace-nowrap">{label}</p>
                  <p className="text-xs text-slate-500 whitespace-nowrap">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
