export function Footer() {
  return (
    <footer className="bg-[#002244] text-white pt-12 pb-6 font-sans">
      <div className="w-full px-4 sm:px-6 lg:px-12">
        
        {/* ── Top Section ── */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
          
          {/* Left: Branding & Quick Links */}
          <div className="flex flex-col md:flex-row gap-10 lg:gap-20">
            {/* Branding */}
            <div className="flex flex-col gap-4 max-w-xs">
              <div className="flex items-center gap-3">
                <img
                  src="/mospi-emblem.svg"
                  alt="State Emblem of India"
                  className="h-16 w-16 object-contain brightness-0 invert"
                />
                <div className="flex flex-col justify-center">
                  <span className="text-[11px] font-medium tracking-wide text-gray-300">
                    Government Of India
                  </span>
                  <span className="text-[13px] font-bold tracking-tight leading-tight">
                    Ministry of Statistics and
                  </span>
                  <span className="text-[13px] font-bold tracking-tight leading-tight">
                    Programme Implementation
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-5">
              <h3 className="text-xl font-bold tracking-wide">Quick Links</h3>
              <nav className="flex flex-col gap-4">
                {[
                  "MoSPI Official Website",
                  "Microdata Portal",
                  "National Metadata Structure",
                  "Data Innovation Lab Portal",
                  "Feedback"
                ].map((link) => (
                  <a key={link} href="#" className="text-[13px] text-white hover:text-blue-200 transition-colors">
                    {link}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Right: Follow Us & Apps */}
          <div className="flex flex-col gap-5">
            <h3 className="text-xl font-bold tracking-wide">Follow us</h3>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="#" className="text-white hover:text-blue-200 transition-colors" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="text-white hover:text-blue-200 transition-colors" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="text-white hover:text-blue-200 transition-colors" aria-label="X (Twitter)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-blue-200 transition-colors" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>

            {/* App Install Badges */}
            <div className="mt-1">
              <p className="text-[13px] mb-3">Links to install GoIStats app</p>
              <div className="flex items-center gap-3">
                {/* Google Play Badge */}
                <button className="flex items-center justify-center gap-2 bg-black border border-[#444] rounded-md px-3 py-1.5 hover:bg-gray-900 transition-colors w-[130px]">
                  <svg viewBox="0 0 512 512" width="18" height="18">
                    <path d="M27.5 4.5v503c0 9.8 11.1 15.5 19.1 9.7l303.4-222-322.5-290.7z" fill="#42a5f5"/>
                    <path d="M350 295.2L498 211c18.7-10.7 18.7-37.3 0-48L350 78.8l-87.6 78.9z" fill="#fbc02d"/>
                    <path d="M27.5 507.5l322.5-212.3-138.8-125z" fill="#e53935"/>
                    <path d="M27.5 4.5L211.2 170.2l138.8-91.4z" fill="#4caf50"/>
                  </svg>
                  <div className="text-left flex flex-col justify-center">
                    <span className="text-[8px] font-medium leading-none mb-[2px] uppercase text-gray-200">Get it on</span>
                    <span className="text-[13px] font-semibold leading-none text-white">Google Play</span>
                  </div>
                </button>
                
                {/* App Store Badge */}
                <button className="flex items-center justify-center gap-1.5 bg-black border border-[#444] rounded-md px-3 py-1.5 hover:bg-gray-900 transition-colors w-[130px]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M16.365 14.526c-.035-2.909 2.404-4.321 2.516-4.39-1.365-1.996-3.468-2.274-4.22-2.316-1.782-.18-3.486 1.054-4.4 1.054-.91 0-2.327-.992-3.821-.963-1.954.032-3.766 1.134-4.773 2.883-2.046 3.551-.52 8.796 1.47 11.674.966 1.393 2.115 2.956 3.633 2.898 1.464-.061 2.023-.949 3.791-.949 1.758 0 2.277.949 3.81.921 1.572-.03 2.568-1.42 3.523-2.81 1.107-1.616 1.564-3.181 1.587-3.264-.035-.015-3.056-1.173-3.096-4.748M14.61 5.372c.808-.979 1.353-2.339 1.205-3.693-1.168.047-2.584.778-3.41 1.776-.656.786-1.306 2.164-1.127 3.498 1.3.102 2.523-.604 3.332-1.581"/></svg>
                  <div className="text-left flex flex-col justify-center">
                    <span className="text-[8px] font-medium leading-none mb-[2px] text-gray-200">Download on the</span>
                    <span className="text-[13px] font-semibold leading-none text-white">App Store</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Total Visitors */}
            <p className="text-[13px] mt-1">Total Visitors:415,691</p>
          </div>
        </div>

        {/* ── Middle Section (Terms) ── */}
        <div className="flex justify-center items-center gap-3 text-[13px] mb-6 text-white">
          <a href="#" className="hover:underline">Terms of Use</a>
          <span>Version No. 1.0</span>
        </div>

        {/* ── Bottom Section (Copyright) ── */}
        <div className="border-t border-white/20 pt-5 text-white">
          <p className="text-center text-[12px] opacity-90 leading-relaxed">
            © 2026 Designed, Developed and Managed by Data Informatics & Innovation Division, <a href="#" className="underline hover:text-blue-200">Ministry of Statistics & Programme Implementation</a>,Government of India
          </p>
        </div>
        
      </div>
    </footer>
  );
}
