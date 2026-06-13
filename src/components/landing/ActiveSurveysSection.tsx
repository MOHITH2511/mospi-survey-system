import { ArrowRight, ClipboardList } from "lucide-react";
import economicPoster from "@/assets/economic_survey.png";
import healthPoster from "@/assets/health_assesment.png";
import literacyPoster from "@/assets/literacy_survey.png";
import householdPoster from "@/assets/household_survey.png";

const surveys = [
  {
    id: 1,
    theme: "Economic",
    date: "Jan 15, 2026",
    title: "National Economic Census 2026",
    description: "Comprehensive survey of all economic establishments across rural and urban India to aid policy planning.",
    image: economicPoster,
  },
  {
    id: 2,
    theme: "Health",
    date: "Dec 20, 2025",
    title: "Citizen Health Assessment",
    description: "Tracking public health infrastructure accessibility and family health metrics at the district level.",
    image: healthPoster,
  },
  {
    id: 3,
    theme: "Education",
    date: "Nov 30, 2025",
    title: "Digital Literacy Survey",
    description: "Assessing digital skills, internet access, and e-learning adoption among students in remote areas.",
    image: literacyPoster,
  },
  {
    id: 4,
    theme: "Household",
    date: "Oct 15, 2025",
    title: "All-India Household Survey",
    description: "Gathering crucial data on living conditions, sanitation, and household amenities under the Swachh Bharat mission.",
    image: householdPoster,
  },
];

export function ActiveSurveysSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50/50 py-16 sm:py-24">
      
      {/* ── Custom Wavy Background (SVG Ribbons) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-70">
        <svg
          className="absolute w-full min-w-[1200px] h-[150%] object-cover"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-200 400C100 200 500 700 1000 350C1300 150 1600 500 1600 500"
            stroke="url(#ribbon1)"
            strokeWidth="3"
            className="animate-pulse"
            style={{ animationDuration: "8s" }}
          />
          <path
            d="M-200 420C150 250 450 750 950 400C1250 200 1600 550 1600 550"
            stroke="url(#ribbon2)"
            strokeWidth="10"
            opacity="0.5"
            className="animate-pulse"
            style={{ animationDuration: "12s", animationDelay: "1s" }}
          />
          <path
            d="M-200 500C200 300 400 800 1000 450C1400 200 1600 600 1600 600"
            stroke="url(#ribbon3)"
            strokeWidth="1.5"
            opacity="0.8"
          />
          <path
            d="M0 600C400 600 600 200 1200 250C1500 270 1600 100 1600 100"
            stroke="url(#ribbon1)"
            strokeWidth="6"
            opacity="0.25"
            className="animate-pulse"
            style={{ animationDuration: "10s", animationDelay: "3s" }}
          />
          <defs>
            <linearGradient id="ribbon1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF9933" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#138808" />
            </linearGradient>
            <linearGradient id="ribbon2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#138808" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF9933" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="ribbon3" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#FF9933" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#138808" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        
        {/* Section Container (More Transparent) */}
        <div className="relative overflow-hidden rounded-3xl bg-white/20 backdrop-blur-[6px] p-8 sm:p-12 shadow-lg border border-[#004e8c]/50">
          
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.2)_0%,transparent_40%)] pointer-events-none" />

          {/* Header */}
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-[#004e8c]/20 bg-white/60 p-3 text-[#004e8c] shadow-sm backdrop-blur-sm">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl tracking-tight">Live National Surveys</h2>
              </div>
              <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-xl">
                Participate in active surveys and contribute to data-driven governance. Your input shapes the future.
              </p>
            </div>
            
            <span 
              className="inline-flex items-center self-start sm:self-auto rounded-full px-5 py-2.5 text-xs font-bold text-white uppercase tracking-wider shadow-md border border-white/20"
              style={{ background: "linear-gradient(135deg, #002244 0%, #003366 50%, #004e8c 100%)" }}
            >
              <span className="mr-2.5 h-2 w-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              Accepting Responses
            </span>
          </div>

          {/* Grid */}
          <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {surveys.map((survey) => {
              return (
                <div 
                  key={survey.id} 
                  className="group flex flex-col overflow-hidden rounded-2xl border border-transparent bg-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-200"
                >
                  {/* Poster/Image Area */}
                  <div className="relative flex h-48 w-full items-center justify-center bg-gray-100 overflow-hidden">
                    {/* Theme Badge */}
                    <div className="absolute top-4 left-4 z-10 rounded-full border border-white/30 bg-black/50 px-3.5 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-md">
                      {survey.theme}
                    </div>
                    {/* Real Poster Image */}
                    <img 
                      src={survey.image} 
                      alt={survey.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Overlay gradient for image text readability (optional) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  {/* Content Area */}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-wider">{survey.date}</p>
                    <h3 className="mb-3 text-lg font-bold text-gray-900 leading-snug group-hover:text-[#003366] transition-colors">{survey.title}</h3>
                    <p className="mb-6 text-sm text-gray-600 line-clamp-3 flex-1 leading-relaxed">
                      {survey.description}
                    </p>
                    
                    <button className="inline-flex items-center text-sm font-bold text-[#004e8c] hover:text-[#002244] transition-colors group-hover:underline mt-auto">
                      Participate Now
                      <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
