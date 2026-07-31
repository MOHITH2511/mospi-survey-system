import { Search, ChevronDown, Activity, Users, ShieldCheck } from "lucide-react";
import indiaMap from "@/assets/india-outline.svg";

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: "#020b18",
        backgroundImage: `
          radial-gradient(circle at 50% 30%, rgba(0, 78, 140, 0.35) 0%, transparent 70%),
          linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 64px 64px, 64px 64px",
      }}
    >
      {/* ── Dotted Indian Map — Left Side ── */}
      <div
        className="absolute z-0 opacity-[0.22] pointer-events-none mix-blend-screen"
        style={{
          top: "5%",
          left: "-8%",
          width: "55%",
          height: "90%",
          maskImage: `url(${indiaMap})`,
          maskSize: "contain",
          maskPosition: "center",
          maskRepeat: "no-repeat",
          WebkitMaskImage: `url(${indiaMap})`,
          WebkitMaskSize: "contain",
          WebkitMaskPosition: "center",
          WebkitMaskRepeat: "no-repeat",
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 1) 2px, transparent 2px)",
          backgroundSize: "14px 14px"
        }}
      />


      {/* ── Content Container ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">

        {/* Heading */}
        <p className="mb-3 text-lg font-medium tracking-wide text-blue-200/80 sm:text-xl">
          Welcome to the
        </p>
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl">
          Digital India Survey Portal
        </h1>

        {/* Tagline */}
        <p className="mx-auto mb-12 max-w-3xl text-base leading-relaxed text-blue-100/70 sm:text-lg">
          A unified platform enabling citizens to participate in government surveys, provide feedback, and support data-driven public policy under the Digital India Mission.
        </p>

        {/* ── Search Bar ── */}
        <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl sm:flex-row">
          <div className="relative flex flex-1 items-center px-4 py-3">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search surveys"
              className="w-full bg-transparent px-3 py-2 text-gray-900 placeholder-gray-500 outline-none"
              disabled
            />
          </div>

          <div className="hidden items-center border-l border-gray-200 px-4 sm:flex">
            <span className="text-sm font-medium text-gray-600">All Categories</span>
            <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
          </div>

          <button className="bg-[#004e8c] px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-[#003366] sm:py-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
            Search
          </button>
        </div>

        {/* ── Quick Links ── */}
        <div className="mt-12 flex flex-wrap justify-center gap-4 sm:gap-6">
          <button className="rounded-md border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30">
            Participate in Survey
          </button>
          <button className="rounded-md border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30">
            View Dashboards
          </button>
          <button className="rounded-md border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30">
            Submit Feedback
          </button>
        </div>
      </div>

      {/* ── Floating Stats Bar (Bottom of Hero) ── */}
      <div className="absolute bottom-0 left-0 w-full border-t border-white/10 bg-[#020813]/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl justify-between px-4 py-4 sm:px-6 lg:px-8 overflow-x-auto gap-8">
          <div className="flex items-center gap-4 min-w-max">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">14,354</p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-blue-200/60">Active Surveys</p>
            </div>
          </div>

          <div className="flex items-center gap-4 min-w-max">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">2.4M+</p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-blue-200/60">Citizen Responses</p>
            </div>
          </div>

          <div className="flex items-center gap-4 min-w-max">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">100%</p>
              <p className="text-[11px] font-medium uppercase tracking-wider text-blue-200/60">Secure & Verified</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}