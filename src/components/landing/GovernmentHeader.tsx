import { useState } from "react";
import { Link } from "react-router-dom";
import { Megaphone, Pause, Play, ChevronDown, LogIn, Globe } from "lucide-react";

export function GovernmentHeader() {
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);
  const [language, setLanguage] = useState("English");
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages = ["English", "हिन्दी", "தமிழ்", "తెలుగు", "বাংলা", "मराठी"];

  return (
    <header className="w-full font-sans">
      {/* ── Combined Emblem Bar ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="relative w-full px-4 sm:px-6 lg:px-12 pt-3 pb-4">
          {/* Accessibility controls — absolute top right */}
          <div className="absolute top-3 right-4 sm:right-6 lg:right-12 flex items-center justify-end gap-5 text-[13px] font-medium tracking-wide text-gray-600 z-20">
            <button className="hover:text-[#003366] transition-colors">Skip to main content</button>
            <span className="text-gray-300">|</span>

            {/* Font-size controls */}
            <div className="flex items-center gap-1.5">
              <button className="flex items-center justify-center h-6 w-6 rounded hover:bg-gray-100 hover:text-[#003366] transition-colors text-[12px] font-bold">
                A-
              </button>
              <button className="flex items-center justify-center h-6 w-6 rounded hover:bg-gray-100 hover:text-[#003366] transition-colors text-[14px] font-bold">
                A
              </button>
              <button className="flex items-center justify-center h-6 w-6 rounded hover:bg-gray-100 hover:text-[#003366] transition-colors text-[16px] font-bold">
                A+
              </button>
            </div>
            <span className="text-gray-300">|</span>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 rounded border border-gray-300 bg-gray-50 px-3 py-1 text-[13px] font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#003366]"
              >
                <Globe className="h-4 w-4" />
                <span>{language}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
              </button>

              {isLangOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsLangOpen(false)} />
                  <div className="absolute right-0 top-full z-40 mt-1 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-xl">
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setIsLangOpen(false);
                        }}
                        className={`block w-full px-3 py-2 text-left text-[12px] font-medium transition-colors hover:bg-blue-50 hover:text-[#003366] ${
                          language === lang ? "bg-blue-50 text-[#003366]" : "text-gray-600"
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Emblem + Login */}
          <div className="flex w-full items-end justify-between mt-1">
            {/* Left: Emblem + Text */}
            <div className="flex items-center gap-3">
              <img
                src="/mospi-emblem.svg"
                alt="State Emblem of India"
                className="h-20 w-20 sm:h-24 sm:w-24 object-contain"
              />
              <div className="flex flex-col justify-center">
                <span className="text-xs font-semibold tracking-wide text-gray-800 sm:text-sm">
                  Government Of India
                </span>
                <span className="text-base font-bold text-[#003366] sm:text-xl tracking-tight leading-tight">
                  Ministry of Statistics and
                </span>
                <span className="text-base font-bold text-[#003366] sm:text-xl tracking-tight leading-tight">
                  Programme Implementation
                </span>
              </div>
            </div>

            {/* Right: Login Button (aligned to bottom) */}
            <div className="pb-1">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-md bg-[#003366] px-5 py-2 text-xs font-bold text-white transition-all hover:bg-[#002244] shadow-md hover:shadow-lg"
              >
                <LogIn className="h-3.5 w-3.5" />
                LOGIN
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tier 3: Live Surveys Ticker ── */}
      <div className="flex items-stretch bg-gradient-to-r from-[#003366] to-[#004e8c] text-white shadow-inner">
        <div className="flex w-full items-stretch">
          {/* Label */}
          <div className="flex shrink-0 items-center gap-2 bg-[#002244] px-6 lg:px-12 py-3 text-xs font-bold tracking-widest uppercase shadow-md z-10">
            LIVE SURVEYS
            <Megaphone className="h-4 w-4 text-blue-300" />
          </div>

          {/* Scrolling Content */}
          <div className="relative flex flex-1 items-center overflow-hidden pl-6">
            <div
              className={`flex w-max whitespace-nowrap ${isMarqueePaused ? "" : "animate-[marquee_35s_linear_infinite]"}`}
              style={{ height: "40px" }}
            >
              <span className="flex shrink-0 items-center gap-12 pr-12 text-[14px] font-medium tracking-wide">
                <span className="flex items-center gap-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-white/50">
                  Compendium of Datasets and Registries in India, 2026
                </span>
                <span className="flex items-center gap-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-white/50">
                  Call for nominations/applications for National Award in Statistics - 2026
                </span>
                <span className="flex items-center gap-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-white/50">
                  National Citizen Satisfaction Survey 2026.
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-12 pr-12 text-[14px] font-medium tracking-wide">
                <span className="flex items-center gap-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-white/50">
                  Compendium of Datasets and Registries in India, 2026
                </span>
                <span className="flex items-center gap-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-white/50">
                  Call for nominations/applications for National Award in Statistics - 2026
                </span>
                <span className="flex items-center gap-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-white/50">
                  National Citizen Satisfaction Survey 2026.
                </span>
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex shrink-0 items-center justify-center bg-[#002244] px-6 lg:px-8 shadow-md z-10">
            <button
              onClick={() => setIsMarqueePaused(!isMarqueePaused)}
              className="text-white hover:text-blue-300 transition-colors p-1"
              aria-label={isMarqueePaused ? "Play announcements" : "Pause announcements"}
            >
              {isMarqueePaused ? (
                <Play className="h-4 w-4 fill-current" />
              ) : (
                <Pause className="h-4 w-4 fill-current" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
