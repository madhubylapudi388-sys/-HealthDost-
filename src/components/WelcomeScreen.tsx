import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Zap,
  Activity,
  Award,
  Globe,
  Info,
  Bot,
  Mic,
  Pill,
  Camera,
  MapPin,
} from 'lucide-react';
import { LanguageCode, SampleProfile } from '../types';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../data/languages';
import { SAMPLE_PROFILES } from '../utils/sampleData';
import { AppLogoIcon } from './AppLogo';

interface WelcomeScreenProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onStart: () => void;
  onSelectSample: (profile: SampleProfile) => void;
  onOpenAiAgent?: () => void;
  onOpenTabletScanner?: () => void;
  onOpenNearbyClinics?: () => void;
  onOpenLogin?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  currentLanguage,
  onLanguageChange,
  onStart,
  onSelectSample,
  onOpenAiAgent,
  onOpenTabletScanner,
  onOpenNearbyClinics,
  onOpenLogin,
}) => {
  const [showSampleDrawer, setShowSampleDrawer] = useState(false);
  const t = TRANSLATIONS[currentLanguage];

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Health Boost AI Login Portal Banner */}
      {onOpenLogin && (
        <div
          onClick={onOpenLogin}
          className="w-full glass-card-interactive bg-gradient-to-r from-sky-600/85 via-blue-600/85 to-teal-600/85 rounded-3xl p-4 sm:p-5 text-white shadow-lg mb-5 cursor-pointer transition-all flex items-center justify-between gap-3 group border border-white/40"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md text-white border border-white/30">
              <Sparkles className="w-5 h-5 text-emerald-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight">
                  Health Boost AI Login
                </span>
                <span className="text-[10px] font-extrabold uppercase bg-white/25 text-white px-2 py-0.5 rounded-full border border-white/30">
                  Portal
                </span>
              </div>
              <p className="text-xs text-blue-50 font-medium">
                Log in to sync health cards, diet suggestions & habit streaks
              </p>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-white/20 text-white group-hover:translate-x-1 transition-transform border border-white/30">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      )}

      {/* 1. Native-Script Language Picker Grid */}
      <div className="w-full glass-card rounded-3xl p-4 sm:p-5 mb-6">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Globe className="w-4 h-4 text-sky-600" />
            <span>{t.selectLanguage}</span>
          </div>
          <span className="text-[11px] font-bold text-slate-700 bg-white/80 border border-white/90 px-2.5 py-0.5 rounded-full shadow-2xs backdrop-blur-xs">
            7 Languages
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                id={`lang-select-${lang.code}`}
                onClick={() => onLanguageChange(lang.code)}
                className={`py-2.5 px-3 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer backdrop-blur-xs ${
                  isSelected
                    ? 'border-sky-500/80 bg-sky-50/90 text-sky-950 shadow-xs ring-2 ring-sky-400/30 font-bold scale-[1.02]'
                    : 'border-white/80 bg-white/55 hover:bg-white/90 text-slate-700 font-medium hover:border-slate-300'
                }`}
              >
                <span className="text-base sm:text-lg font-bold leading-tight font-cultural">
                  {lang.nativeName}
                </span>
                <span className="text-[11px] text-slate-500 font-normal">
                  {lang.englishName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Hero Mascot / Logo Card */}
      <div className="w-full glass-card rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center relative overflow-hidden mb-6">
        {/* Subtle glass chromatic highlights */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-sky-400/15 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-emerald-400/15 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none" />

        {/* Official Health Dost Brand Logo */}
        <div className="relative mb-4 group">
          <div className="p-1 rounded-3xl bg-gradient-to-tr from-sky-400/80 via-teal-400/80 to-emerald-400/80 shadow-lg border border-white/60 backdrop-blur-md">
            <AppLogoIcon size="xl" className="border-0 shadow-none bg-transparent" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-sky-600 to-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border-2 border-white/90 shadow-xs uppercase tracking-wider backdrop-blur-xs">
            AI DOST
          </div>
        </div>

        {/* App Title and Single-line Friendly Greeting */}
        <h1 className="font-cultural text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight mb-1">
          {t.appName}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 font-medium max-w-md mx-auto mb-6">
          {t.tagline}
        </p>

        {/* Primary Action: Start Health Check Button */}
        <button
          id="btn-start-check"
          onClick={onStart}
          className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 active:from-amber-700 text-white text-lg sm:text-xl font-bold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 group cursor-pointer mb-3 border border-white/30 backdrop-blur-xs"
        >
          <Activity className="w-6 h-6 text-amber-100 group-hover:scale-110 transition-transform" />
          <span>{t.startCheck}</span>
          <ChevronRight className="w-6 h-6 text-amber-100 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Secondary Action: Try a Sample Check Button */}
        <button
          id="btn-try-sample-check"
          onClick={() => {
            onSelectSample(SAMPLE_PROFILES[0]);
          }}
          className="w-full py-3 px-6 rounded-2xl glass-card-interactive text-slate-800 text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2 cursor-pointer mb-3 group"
        >
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500 group-hover:scale-110 transition-transform" />
          <span>{t.trySample} (Instant Demo)</span>
        </button>

        {/* AI Health Agent Voice Interaction Button */}
        {onOpenAiAgent && (
          <button
            id="btn-open-ai-agent-welcome"
            onClick={onOpenAiAgent}
            className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-slate-800/90 to-slate-900/90 hover:from-slate-800 hover:to-slate-950 text-white text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md mb-3 group border border-white/20 backdrop-blur-md active:scale-95"
          >
            <Bot className="w-5 h-5 text-emerald-300 group-hover:scale-110 transition-transform" />
            <span>Speak with HealthDost AI (Voice & Text)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
          </button>
        )}

        {/* Scan Tablet / Medicine Button */}
        {onOpenTabletScanner && (
          <button
            id="btn-open-tablet-scanner-welcome"
            onClick={onOpenTabletScanner}
            className="w-full py-3 px-6 rounded-2xl glass-card-interactive text-slate-800 text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer mb-3 group"
          >
            <div className="p-1 rounded-lg bg-amber-100/80 text-amber-800 group-hover:scale-110 transition-transform border border-amber-200/60">
              <Pill className="w-4 h-4" />
            </div>
            <span>Scan Tablets & Medicines</span>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200/60">
              Uses & Side Effects
            </span>
          </button>
        )}

        {/* Find Nearby Clinics & PHCs Button */}
        {onOpenNearbyClinics && (
          <button
            id="btn-open-nearby-clinics-welcome"
            onClick={onOpenNearbyClinics}
            className="w-full py-3 px-6 rounded-2xl glass-emerald hover:bg-emerald-100/90 active:bg-emerald-200 text-emerald-950 text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xs mb-4 group active:scale-95"
          >
            <div className="p-1 rounded-lg bg-emerald-600 text-white group-hover:scale-110 transition-transform shadow-xs">
              <MapPin className="w-4 h-4 animate-bounce" />
            </div>
            <span>Find Nearby Clinics & PHCs</span>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-700 text-white">
              Live GPS
            </span>
          </button>
        )}

        {/* Guest Flow Promise */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
          <UserCheck className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span>{t.guestFlowNotice}</span>
        </div>
      </div>

      {/* 3. Sample Check Presets (Low, Moderate, High Risk Demonstrations) */}
      <div className="w-full glass-card rounded-3xl p-4 sm:p-5 mb-6">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="font-cultural text-sm font-bold text-slate-800">
              Simulate Instant Check by Risk Level
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-700 bg-white/80 border border-white/90 px-2.5 py-0.5 rounded-full shadow-2xs backdrop-blur-xs">
            Low • Moderate • High
          </span>
        </div>

        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
          Select any pre-configured profile below to bypass questions and view the instant Risk Result & explanation:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {SAMPLE_PROFILES.slice(0, 3).map((sample) => {
            const isLow = sample.riskLevel === 'low';
            const isMod = sample.riskLevel === 'moderate';
            const isHigh = sample.riskLevel === 'high';

            const cardClass = isLow
              ? 'glass-emerald hover:border-emerald-400'
              : isMod
              ? 'glass-amber hover:border-amber-400'
              : 'glass-rose hover:border-rose-400';

            const riskDot = isLow ? '🟢' : isMod ? '🟡' : '🔴';

            return (
              <button
                key={sample.id}
                id={`sample-profile-btn-${sample.id}`}
                onClick={() => onSelectSample(sample)}
                className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between group cursor-pointer ${cardClass}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border border-white/70 bg-white/70 flex items-center gap-1 leading-none shadow-2xs">
                      <span>{riskDot}</span>
                      <span className="capitalize text-slate-800">{sample.riskLevel} Risk</span>
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-amber-600 mb-0.5 transition-colors">
                    {sample.name}
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {sample.tagline}
                  </p>
                </div>
                <div className="pt-2 mt-2 border-t border-white/60 flex items-center justify-between text-[11px] font-bold text-slate-700 group-hover:text-amber-600">
                  <span>Test {sample.riskLevel}</span>
                  <span>→</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Community Awareness Stat Card */}
      <div className="w-full glass-card-subtle rounded-2xl p-4 flex items-center gap-3.5 mb-6">
        <div className="w-10 h-10 rounded-xl bg-sky-100/80 text-sky-700 flex items-center justify-center shrink-0 border border-sky-200/60 shadow-2xs">
          <Award className="w-5 h-5" />
        </div>
        <div className="text-xs text-slate-700 font-medium leading-snug">
          <span className="font-bold text-slate-900 block mb-0.5">Community Awareness Impact</span>
          {t.communityStat}
        </div>
      </div>

      {/* 5. Mandatory Safety Disclaimer */}
      <div className="w-full glass-card-subtle rounded-2xl p-4 text-slate-600 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold text-slate-900 block mb-0.5">Important Safety Notice</span>
          {t.disclaimerShort}
        </div>
      </div>
    </div>
  );
};
