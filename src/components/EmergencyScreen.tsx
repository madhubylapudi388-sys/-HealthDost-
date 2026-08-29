import React from 'react';
import { PhoneCall, AlertOctagon, HeartCrack, Hospital, ArrowLeft, ShieldAlert, MapPin } from 'lucide-react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/languages';

interface EmergencyScreenProps {
  language: LanguageCode;
  onGoBack: () => void;
  onReset: () => void;
  onOpenNearbyClinics?: () => void;
}

export const EmergencyScreen: React.FC<EmergencyScreenProps> = ({
  language,
  onGoBack,
  onReset,
  onOpenNearbyClinics,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Alert Banner Box */}
      <div className="glass-rose border-rose-300/80 rounded-3xl p-6 sm:p-7 shadow-2xl text-center backdrop-blur-xl">
        {/* Pulsing Emergency Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shadow-xl shadow-rose-500/40 animate-bounce mb-4 border-2 border-white/80">
          <AlertOctagon className="w-10 h-10" />
        </div>

        <span className="inline-block px-3.5 py-1 bg-rose-600/90 text-white text-xs font-black uppercase tracking-widest rounded-full mb-2.5 shadow-xs backdrop-blur-xs border border-white/20">
          {t.emergencyAlert}
        </span>

        <h1 className="font-cultural text-2xl sm:text-3xl font-extrabold text-rose-950 leading-tight mb-3">
          {t.emergencyTitle}
        </h1>

        <p className="text-base sm:text-lg text-rose-900/90 font-medium leading-relaxed mb-6">
          {t.emergencyDesc}
        </p>

        {/* Big Direct Call Actions */}
        <div className="flex flex-col gap-3 mb-6">
          <a
            id="emergency-call-108"
            href="tel:108"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-lg sm:text-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer border border-white/30 backdrop-blur-xs"
          >
            <PhoneCall className="w-6 h-6 animate-pulse" />
            <span>Call Ambulance (108)</span>
          </a>

          <a
            id="emergency-call-112"
            href="tel:112"
            className="w-full py-3.5 px-6 rounded-2xl bg-slate-900/90 hover:bg-black text-white font-bold text-base sm:text-lg shadow-md flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer border border-white/20 backdrop-blur-xs"
          >
            <PhoneCall className="w-5 h-5 text-amber-300" />
            <span>Call National Emergency (112)</span>
          </a>

          {onOpenNearbyClinics && (
            <button
              id="emergency-find-hospitals-btn"
              onClick={onOpenNearbyClinics}
              className="w-full py-3.5 px-6 rounded-2xl bg-white/80 hover:bg-white text-rose-950 border border-rose-300/80 font-bold text-sm sm:text-base shadow-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer backdrop-blur-xs active:scale-98"
            >
              <MapPin className="w-5 h-5 text-rose-600 animate-pulse" />
              <span>Find Nearest Emergency Hospitals & Trauma Centers (GPS)</span>
            </button>
          )}
        </div>

        {/* Immediate Safe Action Steps */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 text-left mb-6 border-white/80">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-900 mb-2.5 flex items-center gap-1.5 font-cultural">
            <Hospital className="w-4 h-4 text-rose-600" />
            <span>What to do right now:</span>
          </div>
          <ul className="space-y-2.5 text-sm text-slate-700 font-medium">
            <li className="flex items-start gap-2.5">
              <span className="font-extrabold text-rose-600 bg-rose-100/90 w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 border border-rose-200">1</span>
              <span>Sit down in a comfortable resting position. Do not exert yourself or walk fast.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-extrabold text-rose-600 bg-rose-100/90 w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 border border-rose-200">2</span>
              <span>Loosen any tight clothing around your chest or neck.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="font-extrabold text-rose-600 bg-rose-100/90 w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 border border-rose-200">3</span>
              <span>Immediately ask a family member, neighbour, or local ASHA worker to take you to the nearest hospital or clinic.</span>
            </li>
          </ul>
        </div>

        {/* Mandatory Safety Notice */}
        <div className="flex items-center justify-center gap-2 text-xs text-rose-900 bg-rose-100/80 py-2.5 px-3 rounded-xl border border-rose-200 shadow-2xs backdrop-blur-xs">
          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{t.disclaimerShort}</span>
        </div>

        {/* Return Button if accidentally tapped */}
        <div className="mt-6 pt-4 border-t border-rose-200/60 flex items-center justify-center gap-4">
          <button
            id="emergency-back-btn"
            onClick={onGoBack}
            className="text-xs sm:text-sm font-semibold text-rose-800 hover:text-rose-950 underline flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>I tapped this by mistake, go back</span>
          </button>
        </div>
      </div>
    </div>
  );
};
