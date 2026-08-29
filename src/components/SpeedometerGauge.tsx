import React from 'react';
import { RiskLevel } from '../types';
import { TRANSLATIONS } from '../data/languages';
import { LanguageCode } from '../types';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

interface SpeedometerGaugeProps {
  score: number; // 0 to 100
  riskLevel: RiskLevel;
  language: LanguageCode;
}

export const SpeedometerGauge: React.FC<SpeedometerGaugeProps> = ({
  score,
  riskLevel,
  language,
}) => {
  const t = TRANSLATIONS[language];

  // Map 0-100 score to angle (-90deg to +90deg for half-circle)
  const angle = Math.min(Math.max((score / 100) * 180 - 90, -85), 85);

  let riskColor = '#285037'; // Earth Olive/Forest
  let riskBg = 'bg-[#eef5f0] text-[#285037] border-[#c2ded0]';
  let riskBadgeColor = 'bg-[#285037] text-white';
  let RiskIcon = ShieldCheck;
  let riskText = t.riskLevels.low;

  if (riskLevel === 'high') {
    riskColor = '#c2410c'; // Warm Terracotta / Red
    riskBg = 'bg-[#fff1ec] text-[#9a3412] border-[#fdba74]';
    riskBadgeColor = 'bg-[#c2410c] text-white';
    RiskIcon = AlertOctagon;
    riskText = t.riskLevels.high;
  } else if (riskLevel === 'moderate') {
    riskColor = '#d97706'; // Warm Amber/Ochre
    riskBg = 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]';
    riskBadgeColor = 'bg-[#d97706] text-white';
    RiskIcon = AlertTriangle;
    riskText = t.riskLevels.moderate;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center py-2">
      {/* SVG Semi-circle Speedometer */}
      <div className="relative w-64 h-36 flex items-end justify-center overflow-visible">
        <svg
          viewBox="0 0 200 115"
          className="w-full h-full drop-shadow-xs overflow-visible"
        >
          {/* Definitions for gradients */}
          <defs>
            <linearGradient id="gaugeTrack" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#285037" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
          </defs>

          {/* Background Arc: 3 colored segments */}
          {/* Low Zone (Olive Green): 0 to 33% */}
          <path
            d="M 20 100 A 80 80 0 0 1 55 35"
            fill="none"
            stroke="#285037"
            strokeWidth="16"
            strokeLinecap="round"
            className="opacity-90"
          />
          {/* Moderate Zone (Ochre): 34% to 66% */}
          <path
            d="M 60 31 A 80 80 0 0 1 140 31"
            fill="none"
            stroke="#d97706"
            strokeWidth="16"
            className="opacity-90"
          />
          {/* High Zone (Terracotta): 67% to 100% */}
          <path
            d="M 145 35 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#c2410c"
            strokeWidth="16"
            strokeLinecap="round"
            className="opacity-90"
          />

          {/* Scale Labels */}
          <text x="22" y="112" fontSize="9" fill="#285037" fontWeight="bold" textAnchor="middle">
            0
          </text>
          <text x="100" y="24" fontSize="9" fill="#d97706" fontWeight="bold" textAnchor="middle">
            50
          </text>
          <text x="178" y="112" fontSize="9" fill="#c2410c" fontWeight="bold" textAnchor="middle">
            100
          </text>

          {/* Gauge Center Pivot */}
          <circle cx="100" cy="100" r="8" fill="#33332d" />
          <circle cx="100" cy="100" r="4" fill="#FFFFFF" />

          {/* Gauge Needle Pointer */}
          <g transform={`rotate(${angle}, 100, 100)`}>
            <polygon
              points="97,100 103,100 100,28"
              fill="#33332d"
              className="transition-transform duration-700 ease-out"
            />
            <circle cx="100" cy="28" r="3.5" fill={riskColor} />
          </g>
        </svg>

        {/* Floating Score Display in Center */}
        <div className="absolute bottom-0 text-center flex flex-col items-center">
          <span className="text-3xl font-extrabold tracking-tight text-[#33332d] leading-none font-cultural">
            {score}
            <span className="text-sm font-semibold text-[#7a7960]">/100</span>
          </span>
          <span className="text-[11px] font-bold text-[#7a7960] uppercase tracking-wider mt-0.5">
            Awareness Score
          </span>
        </div>
      </div>

      {/* Traffic Light System (Color + Icon + Word) */}
      <div
        className={`mt-4 px-4 py-2.5 rounded-2xl border-2 flex items-center gap-2.5 shadow-xs transition-all ${riskBg}`}
      >
        <div className={`p-1.5 rounded-full flex items-center justify-center ${riskBadgeColor}`}>
          <RiskIcon className="w-5 h-5 fill-current" />
        </div>
        <div className="text-left">
          <div className="text-xs font-semibold uppercase tracking-wider opacity-80">
            Current Risk Category
          </div>
          <div className="text-base sm:text-lg font-extrabold tracking-tight leading-tight font-cultural">
            {riskText}
          </div>
        </div>
      </div>
    </div>
  );
};
