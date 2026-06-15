// src/components/IndiaMap.tsx
import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import indiaGeo from "../assets/india_state_geo.json";

interface StateData {
  respondents: number;
  percentage: number;
}

// Dummy data for visualization
const placeholderData: Record<string, StateData> = {
  "Andhra Pradesh": { respondents: 1200, percentage: 8.5 },
  "Arunachal Pradesh": { respondents: 150, percentage: 1.1 },
  "Assam": { respondents: 850, percentage: 6.0 },
  "Bihar": { respondents: 2100, percentage: 14.8 },
  "Chhattisgarh": { respondents: 600, percentage: 4.2 },
  "Goa": { respondents: 300, percentage: 2.1 },
  "Gujarat": { respondents: 1600, percentage: 11.3 },
  "Haryana": { respondents: 950, percentage: 6.7 },
  "Himachal Pradesh": { respondents: 250, percentage: 1.8 },
  "Jharkhand": { respondents: 700, percentage: 4.9 },
  "Karnataka": { respondents: 1800, percentage: 12.7 },
  "Kerala": { respondents: 1100, percentage: 7.8 },
  "Madhya Pradesh": { respondents: 1400, percentage: 9.9 },
  "Maharashtra": { respondents: 2500, percentage: 17.6 },
  "Manipur": { respondents: 180, percentage: 1.3 },
  "Meghalaya": { respondents: 120, percentage: 0.8 },
  "Mizoram": { respondents: 90, percentage: 0.6 },
  "Nagaland": { respondents: 110, percentage: 0.8 },
  "Orissa": { respondents: 900, percentage: 6.4 },
  "Punjab": { respondents: 800, percentage: 5.6 },
  "Rajasthan": { respondents: 1750, percentage: 12.3 },
  "Sikkim": { respondents: 50, percentage: 0.4 },
  "Tamil Nadu": { respondents: 2200, percentage: 15.5 },
  "Telangana": { respondents: 1300, percentage: 9.2 },
  "Tripura": { respondents: 140, percentage: 1.0 },
  "Uttar Pradesh": { respondents: 3200, percentage: 22.6 },
  "Uttaranchal": { respondents: 400, percentage: 2.8 },
  "West Bengal": { respondents: 1900, percentage: 13.4 },
  "Andaman and Nicobar": { respondents: 60, percentage: 0.4 },
  "Chandigarh": { respondents: 150, percentage: 1.1 },
  "Dadra and Nagar Haveli": { respondents: 50, percentage: 0.4 },
  "Daman and Diu": { respondents: 30, percentage: 0.2 },
  "Delhi": { respondents: 1150, percentage: 8.1 },
  "Jammu and Kashmir": { respondents: 350, percentage: 2.5 },
  "Ladakh": { respondents: 40, percentage: 0.3 },
  "Lakshadweep": { respondents: 20, percentage: 0.1 },
  "Puducherry": { respondents: 100, percentage: 0.7 }
};

export interface IndiaMapProps {
  mode?: "density" | "selection";
  selectedStates?: string[];
  onStateClick?: (stateName: string) => void;
}

const getFillColor = (stateName: string, mode: "density" | "selection", selectedStates: string[]) => {
  if (mode === "selection") {
    // #1e3a8a (blue-900) for selected, #bfdbfe (blue-200) for unselected
    return selectedStates.includes(stateName) ? "#1e3a8a" : "#bfdbfe"; 
  }

  const data = placeholderData[stateName];
  // Base light blue if no data
  if (!data) return "#dbeafe"; // Tailwind blue-100 for no-data
  
  // Calculate intensity based on respondents (max ~3500)
  const maxRespondents = 3500;
  const intensity = Math.min(1, data.respondents / maxRespondents);
  
  // Interpolate from a very visible light blue (Tailwind blue-300: #93c5fd, rgb: 147, 197, 253) 
  // to a dark blue (Tailwind blue-900: #1e3a8a, rgb: 30, 58, 138)
  const r = Math.round(147 - intensity * (147 - 30));
  const g = Math.round(197 - intensity * (197 - 58));
  const b = Math.round(253 - intensity * (253 - 138));
  
  return `rgb(${r},${g},${b})`;
};

export const IndiaMap: React.FC<IndiaMapProps> = ({ mode = "density", selectedStates = [], onStateClick }) => {
  const [tooltip, setTooltip] = useState<{content: string, x: number, y: number} | null>(null);

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto", position: "relative" }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 1000, center: [80, 22] }}
        style={{ width: "100%", height: "auto" }}
        onMouseLeave={() => setTooltip(null)}
      >
        <Geographies geography={indiaGeo}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geo.properties.NAME_1 || geo.properties.name || "";
              const defaultColor = getFillColor(name, mode, selectedStates);
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={defaultColor}
                  stroke="#ffffff"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none", transition: "fill 200ms" },
                    hover: { fill: "#2563eb", outline: "none", cursor: onStateClick ? "pointer" : "default" },
                    pressed: { outline: "none" }
                  }}
                  onClick={() => {
                    if (onStateClick) {
                      onStateClick(name);
                    }
                  }}
                  onMouseMove={(e) => {
                    let content = name;
                    if (mode === "density") {
                      const d = placeholderData[name];
                      const respondents = d?.respondents?.toLocaleString() ?? "N/A";
                      const perc = d?.percentage ?? "N/A";
                      content = `${name}\n${respondents} respondents (${perc}%)`;
                    } else {
                      content = `${name}\n${selectedStates.includes(name) ? "Assigned Region" : "Not Assigned"}`;
                    }

                    setTooltip({
                      content,
                      x: e.clientX,
                      y: e.clientY
                    });
                  }}
                  onMouseLeave={() => {
                    setTooltip(null);
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 bg-slate-900/90 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg backdrop-blur-sm border border-slate-700/50 transition-opacity duration-200"
          style={{
            left: `${tooltip.x + 15}px`,
            top: `${tooltip.y + 15}px`,
            transform: 'translate(0, 0)',
            whiteSpace: 'pre-line'
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};
