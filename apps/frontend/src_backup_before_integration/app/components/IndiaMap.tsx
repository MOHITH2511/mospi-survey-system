import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ZoomIn, ZoomOut, Home, MapPin } from 'lucide-react';

interface MapDataPoint {
  regionCode: string;
  regionName: string;
  completed: number;
  pending: number;
  completionRate: number;
}

interface IndiaMapProps {
  data: MapDataPoint[];
  onRegionClick?: (region: MapDataPoint) => void;
}

// More accurate India map paths based on actual geography
const INDIA_STATES_PATHS = {
  // Jammu & Kashmir and Ladakh
  'JK': 'M 245 15 L 290 10 L 320 25 L 340 45 L 350 70 L 345 90 L 325 105 L 300 110 L 275 100 L 250 80 L 240 55 Z',
  'LA': 'M 340 45 L 380 35 L 410 50 L 420 75 L 410 95 L 385 100 L 360 90 L 345 70 Z',
  
  // North
  'HP': 'M 300 110 L 325 105 L 350 115 L 365 135 L 360 155 L 340 165 L 315 160 L 295 145 Z',
  'PB': 'M 295 145 L 315 160 L 330 175 L 325 195 L 305 205 L 285 195 L 275 175 Z',
  'HR': 'M 305 205 L 325 195 L 345 205 L 355 225 L 350 245 L 330 255 L 310 250 L 295 235 Z',
  'DL': 'M 330 230 L 345 230 L 345 248 L 330 248 Z',
  'UT': 'M 360 155 L 395 145 L 420 160 L 425 185 L 410 205 L 385 210 L 365 195 Z',
  'UK': 'M 365 195 L 385 210 L 405 225 L 410 250 L 395 270 L 370 265 L 355 245 Z',
  
  // Rajasthan - Large western state
  'RJ': 'M 200 180 L 275 175 L 310 250 L 335 310 L 345 380 L 330 430 L 300 460 L 260 470 L 220 450 L 190 400 L 170 330 L 165 260 L 180 210 Z',
  
  // Uttar Pradesh - Large northern state
  'UP': 'M 355 245 L 460 235 L 530 250 L 570 275 L 590 310 L 585 350 L 560 385 L 520 400 L 480 395 L 440 375 L 400 350 L 370 320 L 345 285 Z',
  
  // Bihar
  'BR': 'M 520 400 L 560 385 L 595 400 L 615 430 L 610 465 L 585 490 L 555 495 L 530 475 L 515 445 Z',
  
  // Jharkhand
  'JH': 'M 530 475 L 555 495 L 570 520 L 565 555 L 545 580 L 515 585 L 490 570 L 480 540 L 485 505 Z',
  
  // West Bengal
  'WB': 'M 585 490 L 625 480 L 660 500 L 680 535 L 685 575 L 670 615 L 645 640 L 615 645 L 590 630 L 575 600 L 570 560 L 565 520 Z',
  
  // Sikkim
  'SK': 'M 650 455 L 670 450 L 680 465 L 675 480 L 660 485 Z',
  
  // Northeast states
  'AS': 'M 685 445 L 760 435 L 810 455 L 835 485 L 830 525 L 800 550 L 760 555 L 720 540 L 695 510 L 690 475 Z',
  'AR': 'M 835 430 L 875 420 L 905 440 L 910 475 L 895 505 L 865 515 L 840 500 Z',
  'NL': 'M 840 500 L 865 515 L 870 540 L 855 550 L 835 540 Z',
  'MN': 'M 835 540 L 855 550 L 860 575 L 845 585 L 825 575 Z',
  'MZ': 'M 825 575 L 845 585 L 850 615 L 835 625 L 815 615 Z',
  'TR': 'M 670 615 L 695 625 L 700 650 L 685 665 L 665 655 Z',
  'ML': 'M 720 540 L 750 550 L 755 575 L 740 585 L 720 575 Z',
  
  // Madhya Pradesh - Central large state  
  'MP': 'M 300 460 L 390 445 L 470 460 L 530 485 L 550 540 L 540 600 L 510 650 L 460 680 L 400 690 L 350 680 L 310 650 L 280 600 L 265 540 L 270 490 Z',
  
  // Chhattisgarh
  'CT': 'M 480 540 L 530 530 L 565 555 L 575 600 L 570 650 L 540 685 L 505 690 L 470 675 L 450 640 L 450 590 Z',
  
  // Odisha
  'OR': 'M 515 585 L 565 580 L 595 605 L 615 645 L 620 695 L 610 745 L 580 785 L 540 805 L 505 805 L 475 780 L 460 740 L 455 695 L 465 650 L 490 610 Z',
  
  // Gujarat
  'GJ': 'M 90 285 L 165 260 L 230 280 L 280 320 L 300 380 L 305 440 L 290 490 L 260 520 L 220 530 L 180 515 L 145 480 L 120 435 L 100 380 L 85 330 Z',
  'DD': 'M 120 360 L 145 370 L 145 390 L 120 380 Z',
  'DN': 'M 120 435 L 145 445 L 145 465 L 120 455 Z',
  
  // Maharashtra - Large western state
  'MH': 'M 220 530 L 310 520 L 400 540 L 460 575 L 490 630 L 500 690 L 495 750 L 470 810 L 430 850 L 375 875 L 320 875 L 275 850 L 240 810 L 215 755 L 200 695 L 195 635 L 200 575 Z',
  'GO': 'M 245 855 L 280 870 L 285 895 L 260 905 L 235 890 Z',
  
  // Telangana
  'TG': 'M 450 590 L 500 580 L 540 605 L 555 645 L 550 690 L 525 725 L 490 735 L 460 720 L 445 685 L 440 645 Z',
  
  // Andhra Pradesh
  'AP': 'M 490 735 L 540 720 L 580 745 L 610 790 L 620 850 L 610 910 L 580 960 L 540 990 L 490 1000 L 450 985 L 425 945 L 415 895 L 420 840 L 440 785 L 470 750 Z',
  
  // Karnataka
  'KA': 'M 320 875 L 375 875 L 430 890 L 470 920 L 490 970 L 490 1030 L 470 1090 L 435 1140 L 390 1175 L 340 1190 L 290 1185 L 250 1160 L 225 1120 L 210 1070 L 205 1015 L 210 960 L 230 910 Z',
  
  // Tamil Nadu
  'TN': 'M 340 1190 L 390 1175 L 440 1185 L 490 1215 L 520 1265 L 530 1320 L 520 1375 L 485 1420 L 435 1445 L 380 1450 L 330 1435 L 290 1400 L 265 1355 L 255 1305 L 260 1250 L 285 1210 Z',
  'PY': 'M 405 1320 L 430 1330 L 430 1355 L 405 1345 Z',
  
  // Kerala
  'KL': 'M 210 1015 L 250 1030 L 280 1080 L 295 1140 L 300 1200 L 295 1260 L 280 1315 L 255 1360 L 225 1385 L 195 1375 L 175 1335 L 165 1280 L 165 1220 L 170 1160 L 185 1100 L 200 1050 Z',
  'LD': 'M 100 1120 L 130 1130 L 130 1160 L 100 1150 Z',
  
  // Andaman & Nicobar
  'AN': 'M 760 1400 L 780 1405 L 785 1440 L 780 1475 L 765 1485 L 750 1480 L 745 1450 L 750 1415 Z'
};

const getColorForRate = (rate: number) => {
  if (rate >= 75) return '#0D2C7A';
  if (rate >= 50) return '#6B8EAF';
  return '#FFB84D';
};

export function IndiaMap({ data, onRegionClick }: IndiaMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<MapDataPoint | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.3, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.3, 1));
  const handleReset = () => {
    setZoomLevel(1);
    setSelectedState(null);
  };

  const handleStateClick = (code: string) => {
    const regionData = data.find(d => d.regionCode === code);
    if (regionData) {
      setSelectedState(code === selectedState ? null : code);
      onRegionClick?.(regionData);
    }
  };

  const viewBoxWidth = 1000 / zoomLevel;
  const viewBoxHeight = 1500 / zoomLevel;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header with Zoom Controls */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base text-[#0D2C7A]">
            State-wise Survey Completion
          </h3>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleZoomOut} disabled={zoomLevel <= 1}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleZoomIn} disabled={zoomLevel >= 2.5}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleReset}>
              <Home className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 text-xs bg-slate-50 p-3 rounded-md">
          <span className="font-medium text-slate-700">Completion Rate:</span>
          <div className="flex items-center gap-2">
            <div className="w-5 h-4 bg-[#FFB84D] border border-slate-300 rounded" />
            <span>&lt; 50%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-4 bg-[#6B8EAF] border border-slate-300 rounded" />
            <span>50% - 74%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-4 bg-[#0D2C7A] border border-slate-300 rounded" />
            <span>≥ 75%</span>
          </div>
        </div>

        {/* Map */}
        <div 
          className="relative bg-gradient-to-br from-blue-50/30 to-slate-50 rounded-lg p-4 border border-slate-200"
          onMouseMove={handleMouseMove}
        >
          <svg 
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
            className="w-full h-auto"
            style={{ maxHeight: '700px' }}
          >
            {/* Ocean background */}
            <rect x="0" y="0" width="1000" height="1500" fill="#E8F4F8" />
            
            {/* India boundary - outer glow */}
            <g filter="url(#glow)">
              {Object.entries(INDIA_STATES_PATHS).map(([code, path]) => {
                const regionData = data.find(d => d.regionCode === code);
                const color = regionData ? getColorForRate(regionData.completionRate) : '#E5E7EB';
                const isSelected = selectedState === code;

                return (
                  <path
                    key={code}
                    d={path}
                    fill={color}
                    stroke={isSelected ? '#FF7722' : '#FFFFFF'}
                    strokeWidth={isSelected ? '3' : '1.5'}
                    className="cursor-pointer transition-all duration-200 hover:opacity-80"
                    onMouseEnter={() => regionData && setHoveredRegion(regionData)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => handleStateClick(code)}
                  />
                );
              })}
            </g>

            {/* State labels */}
            {zoomLevel < 1.8 && Object.entries(INDIA_STATES_PATHS).map(([code]) => {
              // Calculate approximate center for each state
              const centers: Record<string, [number, number]> = {
                'JK': [290, 55], 'LA': [390, 70], 'HP': [330, 135], 'PB': [305, 180],
                'HR': [325, 225], 'DL': [337, 239], 'UT': [390, 180], 'UK': [385, 240],
                'RJ': [260, 320], 'UP': [470, 310], 'BR': [565, 440], 'JH': [525, 535],
                'WB': [625, 565], 'SK': [665, 467], 'AS': [760, 495], 'AR': [870, 465],
                'NL': [850, 525], 'MN': [840, 560], 'MZ': [835, 600], 'TR': [682, 640],
                'ML': [735, 562], 'MP': [400, 570], 'CT': [510, 615], 'OR': [540, 695],
                'GJ': [190, 390], 'MH': [345, 695], 'GO': [262, 880], 'TG': [495, 655],
                'AP': [505, 875], 'KA': [340, 1045], 'TN': [395, 1320], 'PY': [417, 1337],
                'KL': [232, 1200], 'LD': [115, 1140], 'AN': [767, 1442]
              };

              const center = centers[code];
              if (!center) return null;

              return (
                <text
                  key={`label-${code}`}
                  x={center[0]}
                  y={center[1]}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[10px] font-bold fill-white pointer-events-none"
                  style={{ paintOrder: 'stroke', stroke: '#000', strokeWidth: '2px', strokeLinecap: 'round', strokeLinejoin: 'round' }}
                >
                  {code}
                </text>
              );
            })}

            {/* SVG Filter for glow */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
          </svg>

          {/* Tooltip */}
          {hoveredRegion && (
            <div
              className="fixed z-50 bg-white border-2 border-slate-300 rounded-lg shadow-xl p-3 pointer-events-none"
              style={{
                left: mousePos.x + 20,
                top: mousePos.y - 80,
              }}
            >
              <div className="flex items-start gap-2 mb-2">
                <MapPin className="h-4 w-4 text-[#0D2C7A] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm text-[#0D2C7A]">{hoveredRegion.regionName}</div>
                  <div className="text-xs text-slate-500">{hoveredRegion.regionCode}</div>
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between gap-6">
                  <span className="text-slate-600">Completion:</span>
                  <span className="font-semibold text-[#0D2C7A]">{hoveredRegion.completionRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between gap-6">
                  <span className="text-slate-600">Completed:</span>
                  <span className="font-medium text-green-600">{hoveredRegion.completed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between gap-6">
                  <span className="text-slate-600">Pending:</span>
                  <span className="font-medium text-orange-600">{hoveredRegion.pending.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
