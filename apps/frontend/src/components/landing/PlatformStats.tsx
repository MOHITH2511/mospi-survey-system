import {
  CheckCircle,
  Languages,
  RefreshCw,
  Wifi,
  Mic,
  Sparkles,
} from "lucide-react";
import womanImg from "@/assets/woman_transparent.png";

const badges = [
  {
    id: "auto-validation",
    icon: CheckCircle,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
    label: "Auto Validation",
    sub: "Better data quality",
    position: "top-[4%] right-[4%]",
  },
  {
    id: "multilingual",
    icon: Languages,
    iconColor: "text-indigo-500",
    iconBg: "bg-indigo-50",
    label: "Multilingual",
    sub: "22+ languages",
    position: "top-[28%] left-[0%]",
  },
  {
    id: "realtime",
    icon: RefreshCw,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    label: "Real-time Sync",
    sub: "Instant data flow",
    position: "top-[30%] right-[0%]",
  },
  {
    id: "offline",
    icon: Wifi,
    iconColor: "text-slate-500",
    iconBg: "bg-slate-100",
    label: "Offline Support",
    sub: "Works anywhere",
    position: "top-[56%] left-[2%]",
  },
  {
    id: "voice",
    icon: Mic,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    label: "Voice Enabled",
    sub: "Speak naturally",
    position: "top-[58%] right-[0%]",
  },
  {
    id: "ai",
    icon: Sparkles,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-50",
    label: "AI Powered",
    sub: "Smart survey assistance",
    position: "bottom-[8%] left-[6%]",
  },
];

export function PlatformStats() {
  return (
    <section className="relative overflow-hidden bg-[#f0f4fa] min-h-screen flex items-center">
      {/* Subtle radial glow behind right side */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-[55%]"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 60% 45%, #dce8f8 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* ── LEFT: Copy ── */}
        <div className="flex flex-col gap-6">
          {/* Version badge */}
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-blue-200 bg-white px-3.5 py-1 text-xs font-medium text-blue-700 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            National Survey Platform v3.2
          </span>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-[1.1] text-[#0d1b3e]">
            Transform Survey
            <br />
            Operations
            <br />
            <span className="text-blue-600">with AI</span>
          </h1>

          {/* Sub-copy */}
          <p className="max-w-lg text-base sm:text-lg text-slate-500 leading-relaxed">
            Create, publish, monitor, and analyze large-scale surveys using an
            AI-powered survey operating system built for government and
            enterprise-scale data collection.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-800 active:scale-[.98] transition-all">
              Create Survey
              <span aria-hidden="true">→</span>
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:bg-slate-50 active:scale-[.98] transition-all">
              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-400">
                <span className="ml-0.5 border-y-[5px] border-l-[8px] border-r-0 border-y-transparent border-l-slate-600" />
              </span>
              Watch Demo
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-5 text-sm text-slate-500">
            {["STQC Certified", "GIGW Compliant", "NIC Hosted"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Woman + Badges ── */}
        <div className="relative w-full aspect-square max-w-[560px] mx-auto select-none">
          {/* Woman image */}
          <img
            src={womanImg}
            alt="Survey enumerator using the platform on a smartphone"
            className="absolute inset-0 w-full h-full object-contain object-bottom drop-shadow-xl"
            draggable={false}
          />

          {/* Feature badges — absolutely positioned */}
          {badges.map(({ id, icon: Icon, iconColor, iconBg, label, sub, position }) => (
            <div
              key={id}
              className={`absolute ${position} flex items-center gap-2.5 rounded-2xl bg-white/90 backdrop-blur-sm border border-white shadow-lg px-3.5 py-2.5 min-w-[155px]`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
              >
                <Icon className={`h-4.5 w-4.5 ${iconColor}`} size={18} />
              </span>
              <div className="leading-tight">
                <p className="text-[13px] font-semibold text-slate-800">
                  {label}
                </p>
                <p className="text-[11px] text-slate-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}