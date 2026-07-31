import { useTranslation } from "@/context/TranslationProvider";
import { Globe } from "lucide-react";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi (हिन्दी)" },
  { code: "bn", name: "Bengali (বাংলা)" },
  { code: "te", name: "Telugu (తెలుగు)" },
  { code: "mr", name: "Marathi (मराठी)" },
  { code: "ta", name: "Tamil (தமிழ்)" },
  { code: "ur", name: "Urdu (اردو)" },
  { code: "gu", name: "Gujarati (ગુજરાતી)" },
  { code: "kn", name: "Kannada (கನ್ನಡ)" },
  { code: "ml", name: "Malayalam (മലയാളம்)" },
  { code: "or", name: "Odia (ଓଡ଼ିଆ)" },
  { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
  { code: "as", name: "Assamese (অসমীয়া)" },
  { code: "mai", name: "Maithili (मैथिली)" },
  { code: "sa", name: "Sanskrit (संस्कृतम्)" },
  { code: "ks", name: "Kashmiri (कॉशुर)" },
  { code: "ne", name: "Nepali (नेपाली)" },
  { code: "gom", name: "Konkani (कोंकणी)" },
  { code: "sd", name: "Sindhi (سنڌي)" },
  { code: "doi", name: "Dogri (डोगरी)" },
  { code: "mni", name: "Manipuri (ꯃꯤꯇꯩꯂꯣꯟ)" },
  { code: "brx", name: "Bodo (बड़ो)" }
];

export const LanguageSwitcher = () => {
  const { currentLanguage, setLanguage, isLoading } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center">
        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#003366]" />
        <select
          value={currentLanguage}
          onChange={(e) => setLanguage(e.target.value)}
          className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-xs font-bold bg-white text-[#003366] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#003366]/20 transition-all cursor-pointer appearance-none"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="font-semibold text-gray-800">
              {lang.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-400">
          <svg className="fill-current h-4 w-4 text-[#003366]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {isLoading && (
        <span className="text-[11px] font-bold text-[#003366] animate-pulse">
          Translating...
        </span>
      )}
    </div>
  );
};
