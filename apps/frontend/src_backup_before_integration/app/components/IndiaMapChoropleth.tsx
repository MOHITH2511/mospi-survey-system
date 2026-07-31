import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { cn } from '../components/ui/utils';
import { MapPin, ZoomIn, ZoomOut, Home } from 'lucide-react';

interface MapDataPoint {
  regionCode: string;
  regionName: string;
  completed: number;
  pending: number;
  flagged: number;
  completionRate: number;
  lastUpdated: Date;
}

interface IndiaMapChoroplethProps {
  data: MapDataPoint[];
  onRegionClick?: (region: MapDataPoint) => void;
}

// More realistic SVG paths for Indian states (simplified but recognizable shapes)
const statePaths: Record<string, string> = {
  // North
  'JK': 'M180,30 L240,20 L280,40 L300,70 L285,100 L250,110 L200,95 L175,70 Z',
  'HP': 'M250,110 L285,100 L320,120 L315,145 L280,155 L245,145 Z',
  'PB': 'M245,145 L280,155 L295,170 L285,190 L250,185 L235,170 Z',
  'HR': 'M250,185 L285,190 L295,210 L285,230 L250,225 Z',
  'DL': 'M265,210 L280,210 L280,225 L265,225 Z',
  'UT': 'M315,145 L340,135 L355,155 L345,175 L320,180 L305,165 Z',
  'UK': 'M305,165 L320,180 L340,195 L330,215 L305,210 L295,190 Z',
  
  // East
  'RJ': 'M200,200 L250,185 L285,230 L300,280 L290,340 L250,360 L200,340 L175,290 L165,240 Z',
  'UP': 'M295,210 L380,200 L430,220 L460,250 L455,290 L420,315 L375,310 L340,295 L310,270 L300,240 Z',
  'BR': 'M420,315 L455,290 L490,310 L495,345 L475,375 L445,385 L420,365 Z',
  'JH': 'M420,365 L445,385 L465,410 L455,445 L425,460 L400,445 L395,410 Z',
  'WB': 'M475,375 L515,365 L545,390 L555,425 L545,465 L520,490 L490,485 L470,455 L465,420 Z',
  'SK': 'M515,365 L535,355 L545,370 L540,390 L520,395 Z',
  'AS': 'M560,360 L620,350 L655,370 L665,395 L650,425 L615,435 L575,425 L560,400 Z',
  'AR': 'M655,345 L695,335 L720,355 L715,385 L690,405 L665,395 Z',
  'NL': 'M665,395 L690,405 L685,425 L665,420 Z',
  'MN': 'M665,420 L685,425 L682,445 L662,440 Z',
  'MZ': 'M662,440 L680,445 L677,465 L657,460 Z',
  'TR': 'M545,465 L570,475 L565,495 L540,490 Z',
  'ML': 'M560,400 L590,410 L585,430 L560,425 Z',
  
  // Central
  'MP': 'M250,360 L340,345 L390,360 L420,385 L415,435 L385,470 L340,475 L295,465 L260,440 L235,400 Z',
  'CT': 'M340,395 L390,385 L420,400 L420,445 L395,475 L360,475 L335,455 Z',
  'OR': 'M395,445 L445,445 L475,470 L485,510 L470,555 L435,575 L400,565 L385,530 L380,490 Z',
  
  // West
  'GJ': 'M130,285 L200,270 L250,300 L265,350 L250,400 L215,420 L175,410 L145,380 L125,340 Z',
  'DD': 'M145,340 L165,350 L160,365 L140,355 Z',
  'DN': 'M145,380 L165,390 L160,405 L140,395 Z',
  
  // South-Central
  'MH': 'M215,420 L295,420 L340,440 L360,480 L365,530 L350,575 L310,600 L260,595 L220,570 L200,525 L195,470 Z',
  'GA': 'M215,580 L240,590 L240,610 L215,600 Z',
  'TG': 'M360,450 L405,445 L425,475 L425,515 L405,545 L370,545 L355,515 Z',
  'AP': 'M365,530 L405,520 L440,540 L460,580 L450,630 L420,665 L380,675 L350,665 L335,630 L330,590 Z',
  'KA': 'M260,595 L310,600 L350,620 L365,665 L360,715 L330,755 L285,765 L245,750 L225,710 L220,655 Z',
  'TN': 'M285,765 L330,755 L375,765 L405,800 L395,850 L360,880 L310,885 L270,870 L250,835 L245,795 Z',
  'PY': 'M330,820 L350,825 L345,845 L325,840 Z',
  'KL': 'M220,710 L260,720 L275,765 L275,815 L260,860 L235,875 L215,855 L210,810 L205,760 Z',
  'LD': 'M140,745 L160,750 L155,770 L135,765 Z',
  'AN': 'M510,930 L535,935 L540,960 L535,985 L515,980 L510,955 Z',
};

// Mock district data
const districtData: Record<string, Array<{ name: string; completed: number; pending: number; completionRate: number }>> = {
  'MH': [
    { name: 'Mumbai', completed: 1234, pending: 234, completionRate: 84.1 },
    { name: 'Pune', completed: 987, pending: 312, completionRate: 76.0 },
    { name: 'Nagpur', completed: 756, pending: 189, completionRate: 80.0 },
    { name: 'Thane', completed: 892, pending: 267, completionRate: 77.0 },
    { name: 'Nashik', completed: 654, pending: 176, completionRate: 78.8 },
  ],
  'DL': [
    { name: 'New Delhi', completed: 892, pending: 156, completionRate: 85.1 },
    { name: 'South Delhi', completed: 767, pending: 198, completionRate: 79.5 },
    { name: 'North Delhi', completed: 645, pending: 234, completionRate: 73.4 },
    { name: 'East Delhi', completed: 589, pending: 178, completionRate: 76.8 },
    { name: 'West Delhi', completed: 528, pending: 113, completionRate: 82.4 },
  ],
  'KA': [
    { name: 'Bangalore Urban', completed: 1567, pending: 289, completionRate: 84.4 },
    { name: 'Mysuru', completed: 678, pending: 156, completionRate: 81.3 },
    { name: 'Mangaluru', completed: 543, pending: 167, completionRate: 76.5 },
    { name: 'Hubli-Dharwad', completed: 489, pending: 189, completionRate: 72.1 },
    { name: 'Belgaum', completed: 735, pending: 197, completionRate: 78.9 },
  ],
  'TN': [
    { name: 'Chennai', completed: 1678, pending: 312, completionRate: 84.3 },
    { name: 'Coimbatore', completed: 876, pending: 198, completionRate: 81.6 },
    { name: 'Madurai', completed: 734, pending: 223, completionRate: 76.7 },
    { name: 'Tiruchirappalli', completed: 567, pending: 156, completionRate: 78.4 },
    { name: 'Salem', completed: 934, pending: 234, completionRate: 80.0 },
  ],
  'UP': [
    { name: 'Lucknow', completed: 987, pending: 456, completionRate: 68.4 },
    { name: 'Kanpur', completed: 876, pending: 678, completionRate: 56.4 },
    { name: 'Agra', completed: 734, pending: 534, completionRate: 57.9 },
    { name: 'Varanasi', completed: 645, pending: 489, completionRate: 56.9 },
    { name: 'Prayagraj', completed: 892, pending: 767, completionRate: 53.8 },
    { name: 'Meerut', completed: 567, pending: 456, completionRate: 55.4 },
    { name: 'Noida', completed: 1234, pending: 678, completionRate: 64.5 },
  ],
  'GJ': [
    { name: 'Ahmedabad', completed: 1234, pending: 456, completionRate: 73.0 },
    { name: 'Surat', completed: 987, pending: 389, completionRate: 71.7 },
    { name: 'Vadodara', completed: 678, pending: 267, completionRate: 71.8 },
    { name: 'Rajkot', completed: 567, pending: 189, completionRate: 75.0 },
    { name: 'Bhavnagar', completed: 424, pending: 155, completionRate: 73.2 },
  ],
};

const getColorForCompletionRate = (rate: number) => {
  if (rate >= 75) return '#4A90A4'; // Moonstone Blue
  if (rate >= 50) return '#A8B8C0'; // Light Grey
  return '#FFD966'; // Yellow
};

const getColorClass = (rate: number) => {
  if (rate >= 75) return 'fill-[#4A90A4] hover:fill-[#3A7A94]';
  if (rate >= 50) return 'fill-[#A8B8C0] hover:fill-[#98A8B0]';
  return 'fill-[#FFD966] hover:fill-[#EFC956]';
};

export function IndiaMapChoropleth({ data, onRegionClick }: IndiaMapChoroplethProps) {
  const [hoveredRegion, setHoveredRegion] = useState<MapDataPoint | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 750, height: 1000 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
    if (zoomLevel <= 1.5) {
      setSelectedState(null);
    }
  };

  const handleReset = () => {
    setZoomLevel(1);
    setSelectedState(null);
    setViewBox({ x: 0, y: 0, width: 750, height: 1000 });
  };

  const handleStateClick = (code: string, regionData: MapDataPoint) => {
    if (selectedState === code) {
      setSelectedState(null);
      setZoomLevel(1);
    } else {
      setSelectedState(code);
      setZoomLevel(2);
      onRegionClick?.(regionData);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">
            {selectedState 
              ? `${data.find(d => d.regionCode === selectedState)?.regionName || selectedState} - District Level Data` 
              : 'State Wise Count - (Establishment)'}
          </h3>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleZoomOut} disabled={zoomLevel <= 1}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleZoomIn} disabled={zoomLevel >= 3}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleReset}>
              <Home className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 text-sm bg-white p-4 rounded-lg border shadow-sm">
          <span className="font-semibold text-slate-700">Range :-</span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-5 bg-[#FFD966] border border-slate-400 rounded" />
            <span className="text-slate-700">• 1 to 1 Lakh - <span className="font-medium">Yellow</span></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-5 bg-[#A8B8C0] border border-slate-400 rounded" />
            <span className="text-slate-700">• 1 Lakh - 10 Lakh - <span className="font-medium">Light Grey</span></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-5 bg-[#4A90A4] border border-slate-400 rounded" />
            <span className="text-slate-700">• Above 10 Lakh - <span className="font-medium">Moonstone Blue</span></span>
          </div>
        </div>

        {/* Map */}
        <div className="relative bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-lg p-4 border" onMouseMove={handleMouseMove}>
          <svg 
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width / zoomLevel} ${viewBox.height / zoomLevel}`} 
            className="w-full h-auto" 
            style={{ maxHeight: '600px' }}
          >
            {/* Background */}
            <rect x="0" y="0" width="750" height="1000" fill="transparent" />
            
            {/* Render states */}
            {Object.entries(statePaths).map(([code, path]) => {
              const regionData = data.find(d => d.regionCode === code);
              
              const colorClass = regionData 
                ? getColorClass(regionData.completionRate)
                : 'fill-slate-200 hover:fill-slate-300';

              const isSelected = selectedState === code;

              return (
                <path
                  key={code}
                  d={path}
                  className={cn(
                    'cursor-pointer transition-all duration-200 stroke-slate-400',
                    isSelected ? 'stroke-[3] stroke-blue-600' : 'stroke-[1.5]',
                    colorClass
                  )}
                  onMouseEnter={() => regionData && setHoveredRegion(regionData)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={() => regionData && handleStateClick(code, regionData)}
                />
              );
            })}

            {/* State labels */}
            {zoomLevel < 2 && Object.entries(statePaths).map(([code]) => {
              // Calculate approximate center for label (simplified)
              const centers: Record<string, { x: number; y: number }> = {
                'MH': { x: 280, y: 500 },
                'DL': { x: 272, y: 217 },
                'KA': { x: 285, y: 680 },
                'TN': { x: 330, y: 825 },
                'UP': { x: 375, y: 250 },
                'GJ': { x: 190, y: 345 },
                'RJ': { x: 240, y: 280 },
                'WB': { x: 510, y: 425 },
                'MP': { x: 330, y: 410 },
                'AP': { x: 400, y: 600 },
                'TG': { x: 390, y: 495 },
                'BR': { x: 455, y: 345 },
                'OR': { x: 435, y: 510 },
                'KL': { x: 240, y: 785 },
                'JH': { x: 422, y: 425 },
                'AS': { x: 615, y: 395 },
                'PB': { x: 265, y: 167 },
                'CT': { x: 375, y: 435 },
                'HR': { x: 267, y: 207 },
                'JK': { x: 230, y: 65 },
                'HP': { x: 280, y: 127 },
                'UK': { x: 322, y: 195 },
              };

              const center = centers[code];
              if (!center) return null;

              return (
                <text
                  key={`label-${code}`}
                  x={center.x}
                  y={center.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[11px] font-semibold fill-slate-700 pointer-events-none"
                  style={{ textShadow: '0 0 3px white, 0 0 3px white' }}
                >
                  {code}
                </text>
              );
            })}
          </svg>

          {/* Tooltip */}
          {hoveredRegion && (
            <div
              className="fixed z-50 bg-white border-2 border-slate-300 rounded-lg shadow-xl p-4 pointer-events-none"
              style={{
                left: mousePos.x + 20,
                top: mousePos.y - 100,
              }}
            >
              <div className="flex items-start gap-2 mb-2">
                <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">{hoveredRegion.regionName}</div>
                  <div className="text-xs text-slate-500">{hoveredRegion.regionCode}</div>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between gap-8">
                  <span className="text-slate-600">Completion Rate:</span>
                  <span className="font-semibold">{hoveredRegion.completionRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-slate-600">Completed:</span>
                  <span className="font-medium text-green-600">{hoveredRegion.completed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="text-slate-600">Pending:</span>
                  <span className="font-medium text-orange-600">{hoveredRegion.pending.toLocaleString()}</span>
                </div>
                {hoveredRegion.flagged > 0 && (
                  <div className="flex justify-between gap-8">
                    <span className="text-slate-600">Flagged:</span>
                    <span className="font-medium text-red-600">{hoveredRegion.flagged}</span>
                  </div>
                )}
                <div className="pt-1 border-t text-xs text-slate-500">
                  Click to view districts
                </div>
              </div>
            </div>
          )}
        </div>

        {/* District Details Table */}
        {selectedState && districtData[selectedState] && (
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 border-b">
              <h4 className="font-semibold text-sm">
                Districts in {data.find(d => d.regionCode === selectedState)?.regionName}
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium text-slate-600">District</th>
                    <th className="text-right px-4 py-2 font-medium text-slate-600">Completed</th>
                    <th className="text-right px-4 py-2 font-medium text-slate-600">Pending</th>
                    <th className="text-right px-4 py-2 font-medium text-slate-600">Completion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {districtData[selectedState].map((district, idx) => (
                    <tr key={district.name} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-4 py-2">{district.name}</td>
                      <td className="px-4 py-2 text-right text-green-600 font-medium">
                        {district.completed.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-right text-orange-600 font-medium">
                        {district.pending.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <span 
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                          style={{ 
                            backgroundColor: getColorForCompletionRate(district.completionRate),
                            color: 'white'
                          }}
                        >
                          {district.completionRate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Stats Grid */}
        {!selectedState && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 text-xs">
            {data.slice(0, 24).map((region) => (
              <div 
                key={region.regionCode}
                className="flex items-center justify-between gap-2 p-2 bg-white border rounded cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleStateClick(region.regionCode, region)}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full border border-slate-300" 
                    style={{ backgroundColor: getColorForCompletionRate(region.completionRate) }}
                  />
                  <span className="font-medium">{region.regionCode}</span>
                </div>
                <span className="text-slate-600">{region.completionRate.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
