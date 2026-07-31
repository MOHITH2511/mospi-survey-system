import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, MapPin, Calendar, Users, ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";

const states = ["All India", "Andhra Pradesh", "Bihar", "Gujarat", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"];
const districts: Record<string, string[]> = {
  "All India": ["All Districts"],
  "Karnataka": ["Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Mangaluru", "Hubli-Dharwad"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
};

export default function PublishAssignment() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState("All India");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");

  const availableDistricts = districts[selectedState] || ["All Districts"];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Publish & Assignment"
        description="Configure survey deployment and assign to regions"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Assignment form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6 space-y-5">
            <h3 className="text-base font-semibold text-foreground">Geographic Assignment</h3>

            {/* State */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">State / UT</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={selectedState}
                  onChange={(e) => { setSelectedState(e.target.value); setSelectedDistrict("All Districts"); }}
                  className="w-full appearance-none rounded-xl border border-border bg-white pl-10 pr-10 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {states.map((s) => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* District */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">District</label>
              <div className="relative">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-border bg-white px-4 pr-10 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {availableDistricts.map((d) => <option key={d}>{d}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Schedule */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Schedule Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="date"
                  defaultValue="2026-07-01"
                  className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/admin")}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-700 active:scale-[0.98] inline-flex items-center justify-center gap-2"
          >
            <Send className="h-4 w-4" />
            Publish & Assign Survey
          </button>
        </div>

        {/* Summary card */}
        <div className="rounded-2xl border border-border bg-white p-5 h-fit space-y-4">
          <h3 className="text-base font-semibold text-foreground">Assignment Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-surface p-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Region</p>
                <p className="text-sm font-medium text-foreground">
                  {selectedState}{selectedDistrict !== "All Districts" ? ` → ${selectedDistrict}` : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-surface p-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Estimated Reach</p>
                <p className="text-sm font-medium text-foreground">
                  {selectedState === "All India" ? "~1.2M Citizens" : "~85K Citizens"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-surface p-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Scheduled</p>
                <p className="text-sm font-medium text-foreground">July 1, 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
