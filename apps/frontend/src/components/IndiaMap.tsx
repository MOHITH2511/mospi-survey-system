// src/components/IndiaMap.tsx
import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import indiaGeo from "../assets/india_state_geo.json";

interface StateData {
  respondents: number;
  percentage: number;
}

const surveyData: Record<string, StateData> = {
  "Uttar Pradesh":      { respondents: 3200, percentage: 22.6 },
  "Maharashtra":        { respondents: 2500, percentage: 17.6 },
  "Tamil Nadu":         { respondents: 2200, percentage: 15.5 },
  "West Bengal":        { respondents: 1900, percentage: 13.4 },
  "Karnataka":          { respondents: 1800, percentage: 12.7 },
  "Rajasthan":          { respondents: 1750, percentage: 12.3 },
  "Gujarat":            { respondents: 1600, percentage: 11.3 },
  "Madhya Pradesh":     { respondents: 1400, percentage: 9.9 },
  "Telangana":          { respondents: 1300, percentage: 9.2 },
  "Kerala":             { respondents: 1100, percentage: 7.8 },
  "Delhi":              { respondents: 1150, percentage: 8.1 },
  "Andhra Pradesh":     { respondents: 1200, percentage: 8.5 },
  "Bihar":              { respondents: 2100, percentage: 14.8 },
  "Assam":              { respondents: 850,  percentage: 6.0 },
  "Punjab":             { respondents: 800,  percentage: 5.6 },
  "Odisha":             { respondents: 900,  percentage: 6.4 },
  "Jharkhand":          { respondents: 700,  percentage: 4.9 },
  "Chhattisgarh":       { respondents: 600,  percentage: 4.2 },
  "Uttarakhand":        { respondents: 400,  percentage: 2.8 },
  "Haryana":            { respondents: 950,  percentage: 6.7 },
  "Himachal Pradesh":   { respondents: 250,  percentage: 1.8 },
  "Jammu and Kashmir":  { respondents: 350,  percentage: 2.5 },
  "Ladakh":             { respondents: 40,   percentage: 0.3 },
  "Arunachal Pradesh":  { respondents: 150,  percentage: 1.1 },
  "Nagaland":           { respondents: 110,  percentage: 0.8 },
  "Manipur":            { respondents: 180,  percentage: 1.3 },
  "Mizoram":            { respondents: 90,   percentage: 0.6 },
  "Tripura":            { respondents: 140,  percentage: 1.0 },
  "Meghalaya":          { respondents: 120,  percentage: 0.8 },
  "Sikkim":             { respondents: 50,   percentage: 0.4 },
  "Goa":                { respondents: 300,  percentage: 2.1 },
  "Chandigarh":         { respondents: 150,  percentage: 1.1 },
  "Puducherry":         { respondents: 100,  percentage: 0.7 },
  "Lakshadweep":        { respondents: 20,   percentage: 0.1 },
  "Andaman and Nicobar Islands":              { respondents: 60,   percentage: 0.4 },
  "Dadra and Nagar Haveli and Daman and Diu": { respondents: 80,   percentage: 0.6 },
};

// Max respondents for scale reference
const MAX_RESPONDENTS = 3200;

// Wide blue choropleth — light sky blue (low) to dark navy (high)
const getVolumeColor = (stateName: string, mode: "density" | "selection", selectedStates: string[]) => {
  if (mode === "selection") {
    return selectedStates.includes(stateName) ? "#2563eb" : "#cbd5e1";
  }
  const d = surveyData[stateName];
  if (!d) return "#dbeafe";
  const ratio = d.respondents / MAX_RESPONDENTS;
  if (ratio >= 0.75) return "#1e3a8a";
  if (ratio >= 0.55) return "#1d4ed8";
  if (ratio >= 0.38) return "#2563eb";
  if (ratio >= 0.25) return "#3b82f6";
  if (ratio >= 0.15) return "#60a5fa";
  if (ratio >= 0.08) return "#93c5fd";
  if (ratio >= 0.04) return "#bfdbfe";
  return "#dbeafe";
};

export interface IndiaMapProps {
  mode?: "density" | "selection";
  selectedStates?: string[];
  onStateClick?: (stateName: string) => void;
}



export const IndiaMap: React.FC<IndiaMapProps> = ({ mode = "density", selectedStates = [], onStateClick }) => {
  const [tooltip, setTooltip] = useState<{ name: string; respondents: number; percentage: number; x: number; y: number } | null>(null);

  return (
    <div style={{
      width: "100%",
      maxWidth: "820px",
      margin: "0 auto",
      position: "relative",
      background: "transparent",
      fontFamily: "Inter, system-ui, sans-serif",
    }}>

      {/* SVG Map */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 1000, center: [80, 22] }}
        style={{ width: "100%", height: "auto", display: "block" }}
        onMouseLeave={() => setTooltip(null)}
      >
        <Geographies geography={indiaGeo}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo: any) => {
              const name: string = geo.properties.st_nm || geo.properties.NAME_1 || "";
              const fillColor = getVolumeColor(name, mode, selectedStates);
              const isSelected = selectedStates.includes(name);
              const d = surveyData[name];

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  stroke="#ffffff"
                  strokeWidth={0.7}
                  style={{
                    default: {
                      outline: "none",
                      transition: "all 180ms ease",
                      fillOpacity: (mode === "selection" && !isSelected) ? 0.3 : 1,
                    },
                    hover: {
                      fill: mode === "selection"
                        ? (isSelected ? "#1d4ed8" : "#94a3b8")
                        : (d ? fillColor : "#60a5fa"),
                      stroke: "#ffffff",
                      strokeWidth: 1.2,
                      outline: "none",
                      cursor: onStateClick ? "pointer" : "default",
                      fillOpacity: 1,
                    },
                    pressed: { outline: "none", fillOpacity: 0.85 },
                  }}
                  onClick={() => onStateClick && onStateClick(name)}
                  onMouseMove={(e: any) => {
                    if (d) {
                      setTooltip({ name, respondents: d.respondents, percentage: d.percentage, x: e.clientX, y: e.clientY });
                    } else {
                      setTooltip({ name, respondents: 0, percentage: 0, x: e.clientX, y: e.clientY });
                    }
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Rich hover tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 animate-fade-in"
          style={{
            left: tooltip.x + 14,
            top: tooltip.y - 10,
            background: "#1e293b",
            color: "#f1f5f9",
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            whiteSpace: "nowrap",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 3 }}>
            {tooltip.name}
          </div>
          {tooltip.respondents > 0 ? (
            <div style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 500 }}>
              {tooltip.respondents.toLocaleString()} respondents ({tooltip.percentage}%)
            </div>
          ) : (
            <div style={{ color: "#64748b", fontSize: 11 }}>No data available</div>
          )}
        </div>
      )}
    </div>
  );
};
