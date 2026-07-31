import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Phone, Mail, Lock, UserCog, ArrowRight, ShieldCheck, ArrowLeft } from "lucide-react";
import indiaMap from "@/assets/india-outline.svg";

type OfficialRole = "admin" | "supervisor" | "enumerator";
type LoginMode = "official" | "citizen";

export default function LoginPage() {
  const navigate = useNavigate();
  
  const [loginMode, setLoginMode] = useState<LoginMode>("official");
  
  // Official State
  const [selectedRole, setSelectedRole] = useState<OfficialRole>("admin");
  const [showPassword, setShowPassword] = useState(false);
  
  // Citizen State
  const [otpStep, setOtpStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleOfficialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/${selectedRole}`);
  };

  const handleCitizenGetOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (phoneNumber.length > 0) {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:8081/api/v1/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: `+91${phoneNumber}` })
        });
        if (!res.ok) throw new Error("Failed to send OTP");
        setOtpStep("otp");
      } catch (err) {
        setErrorMsg("Failed to reach OTP Service. Is it running?");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCitizenLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (otp.length > 0) {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:8081/api/v1/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: `+91${phoneNumber}`, otp: otp })
        });
        if (!res.ok) throw new Error("Invalid OTP");
        const data = await res.json();
        // Assuming we get a token here, save it
        if (data.data?.token) localStorage.setItem("token", data.data.token);
        navigate("/citizen");
      } catch (err) {
        setErrorMsg("Invalid OTP or service unreachable.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 overflow-hidden px-4">
      
      {/* ── Top Left Back Button ── */}
      <div className="absolute top-6 left-6 sm:top-10 sm:left-10 z-20">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#003366] px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-[#002244] hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>
      
      {/* ── Background Map ── */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none mix-blend-multiply"
        style={{
          maskImage: `url(${indiaMap})`,
          maskSize: "cover",
          maskPosition: "center",
          maskRepeat: "no-repeat",
          WebkitMaskImage: `url(${indiaMap})`,
          WebkitMaskSize: "80vh",
          WebkitMaskPosition: "center",
          WebkitMaskRepeat: "no-repeat",
          backgroundImage: "radial-gradient(rgba(0, 78, 140, 1) 2.5px, transparent 2.5px)",
          backgroundSize: "18px 18px"
        }}
      />
      
      {/* ── Glow Effects ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ── Centered Login Card ── */}
      <div className="relative z-10 w-full max-w-[550px]">
        <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-[#004e8c]/20">
          
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#003366] to-[#004e8c] px-8 py-10 text-center relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
            <img
              src="/mospi-emblem.svg"
              alt="State Emblem of India"
              className="mx-auto h-20 w-20 object-contain brightness-0 invert opacity-95 mb-4"
            />
            <h1 className="text-2xl font-bold text-white tracking-wide drop-shadow-md">
              Digital India Survey Portal
            </h1>
            <p className="mt-1.5 text-sm font-medium text-blue-100 tracking-widest uppercase">
              Authentication Gateway
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => setLoginMode("official")}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${
                loginMode === "official"
                  ? "border-b-2 border-[#003366] text-[#003366] bg-blue-50/50"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Official Login
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode("citizen");
                setOtpStep("phone");
                setOtp("");
              }}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${
                loginMode === "citizen"
                  ? "border-b-2 border-[#003366] text-[#003366] bg-blue-50/50"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Citizen Login
            </button>
          </div>

          <div className="px-8 py-10 sm:px-12">
            {/* ── Official Login Flow ── */}
            {loginMode === "official" && (
              <form onSubmit={handleOfficialLogin} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#003366]">Official Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
                    <input
                      type="email"
                      required
                      defaultValue="admin@nic.in"
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 shadow-inner"
                      placeholder="name@nic.in"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#003366]">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      defaultValue="password123"
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-10 text-sm text-gray-900 outline-none transition-all focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 shadow-inner"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#003366]">Role</label>
                  <div className="relative">
                    <UserCog className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400" />
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as OfficialRole)}
                      className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 shadow-inner"
                    >
                      <option value="admin">Administrator (Nodal Officer)</option>
                      <option value="supervisor">Quality Supervisor</option>
                      <option value="enumerator">Field Enumerator</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#003366] py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0f235b] hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Authenticate via Parichay
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </form>
            )}

            {/* ── Citizen Login Flow ── */}
            {loginMode === "citizen" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {otpStep === "phone" ? (
                  <form onSubmit={handleCitizenGetOTP} className="space-y-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[#003366]">Mobile Number</label>
                      <div className="flex">
                        <div className="flex items-center justify-center rounded-l-xl border border-r-0 border-blue-200 bg-blue-50 px-4 text-sm font-bold text-[#003366]">
                          +91
                        </div>
                        <div className="relative flex-1">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                          <input
                            type="tel"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                            className="w-full rounded-r-xl border border-blue-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20"
                            placeholder="Enter mobile number"
                          />
                        </div>
                      </div>
                    </div>
                    
                    
                    {errorMsg && <div className="text-red-500 text-xs font-semibold">{errorMsg}</div>}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#004e8c] py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#003366] hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
                      >
                        {isLoading ? "Sending..." : "Generate OTP"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleCitizenLogin} className="space-y-6">
                    <div className="rounded-xl bg-blue-50 p-4 text-sm text-[#004e8c] border border-blue-100 flex items-center justify-between shadow-inner">
                      <span>An OTP has been sent to <strong>+91 {phoneNumber}</strong></span>
                      <button 
                        type="button" 
                        onClick={() => setOtpStep("phone")}
                        className="font-bold text-[#003366] hover:underline"
                      >
                        Change
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[#003366]">Enter OTP</label>
                      <input
                        type="text"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full rounded-xl border border-blue-200 bg-white py-3.5 px-4 text-center text-xl tracking-[0.5em] text-gray-900 outline-none transition-all focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20 shadow-inner"
                        placeholder="••••••"
                      />
                    </div>
                    
                    {errorMsg && <div className="text-red-500 text-xs font-semibold">{errorMsg}</div>}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#003366] py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#0f235b] hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
                      >
                        {isLoading ? "Verifying..." : "Verify & Continue"}
                        {!isLoading && <ArrowRight className="h-5 w-5" />}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Security Notice */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500 border-t border-gray-100 pt-6">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Secured with 256-bit encryption. Never share your OTP.</span>
            </div>
            <div className="mt-2 text-center text-[10px] text-gray-400">
              Hosted by National Informatics Centre (NIC)
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
