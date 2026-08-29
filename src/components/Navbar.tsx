import React, { useState } from 'react';
import { Heart, Volume2, VolumeX, RotateCcw, Globe, User, Shield, LogOut, History, Bot, Sparkles, Pill, MapPin } from 'lucide-react';
import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../data/languages';
import { useAuth } from '../context/AuthContext';
import { AppLogoIcon } from './AppLogo';

interface NavbarProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onReset: () => void;
  isSpeaking: boolean;
  onToggleVoice: () => void;
  showRestartButton?: boolean;
  onOpenAuthModal: () => void;
  onOpenHistory: () => void;
  onOpenAiAgent: () => void;
  onOpenTabletScanner?: () => void;
  onOpenNearbyClinics?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  onReset,
  isSpeaking,
  onToggleVoice,
  showRestartButton = false,
  onOpenAuthModal,
  onOpenHistory,
  onOpenAiAgent,
  onOpenTabletScanner,
  onOpenNearbyClinics,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, userProfile, signOut } = useAuth();
  const t = TRANSLATIONS[currentLanguage];

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-white/60 shadow-xs">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo and Brand */}
        <button
          id="nav-logo-btn"
          onClick={onReset}
          className="flex items-center gap-2.5 text-left focus:outline-hidden group cursor-pointer"
          title="HealthDost Home"
        >
          <div className="group-hover:scale-105 transition-transform drop-shadow-xs">
            <AppLogoIcon size="md" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-sky-600 leading-none">
                Health<span className="text-emerald-600">Dost</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/70 text-emerald-700 border border-emerald-200/80 px-1.5 py-0.5 rounded-full shadow-2xs backdrop-blur-xs">
                AI Health
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-tight">
              {t.tagline}
            </p>
          </div>
        </button>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Find Nearby Clinics Button */}
          {onOpenNearbyClinics && (
            <button
              id="nav-nearby-clinics-btn"
              onClick={onOpenNearbyClinics}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-300/80 bg-emerald-50/80 hover:bg-emerald-100/90 text-emerald-900 text-xs font-bold transition-all cursor-pointer shadow-xs backdrop-blur-xs active:scale-95"
              title="Find Nearby Clinics, PHCs & Ayushman Arogya Mandirs (Live GPS)"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
              <span className="hidden sm:inline">Clinics</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </button>
          )}

          {/* Scan Tablet / Medicine Button */}
          {onOpenTabletScanner && (
            <button
              id="nav-scan-tablet-btn"
              onClick={onOpenTabletScanner}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-white/80 bg-white/65 hover:bg-white/90 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs backdrop-blur-xs hover:border-slate-300 active:scale-95"
              title="Scan Tablets & Medicines for uses & side effects"
            >
              <Pill className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">Scan Tablet</span>
            </button>
          )}

          {/* AI Health Agent Launcher Button */}
          <button
            id="nav-ai-agent-btn"
            onClick={onOpenAiAgent}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-800/90 to-slate-900/90 hover:from-slate-800 hover:to-slate-950 text-white text-xs font-bold transition-all shadow-xs border border-white/20 backdrop-blur-md cursor-pointer active:scale-95"
            title="Speak with HealthDost AI Health Agent"
          >
            <Bot className="w-3.5 h-3.5 text-emerald-300 animate-bounce" />
            <span className="hidden sm:inline">AI Agent</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* History / Records Nav Button */}
          <button
            id="nav-history-btn"
            onClick={onOpenHistory}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-white/80 bg-white/65 hover:bg-white/90 text-slate-700 text-xs font-semibold transition-all shadow-2xs backdrop-blur-xs cursor-pointer active:scale-95"
            title="Saved Health Records & Cloud History"
          >
            <History className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Records</span>
          </button>

          {/* User Account / Auth Button */}
          <div className="relative">
            {user ? (
              <button
                id="nav-user-profile-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-white/80 bg-white/80 hover:bg-white text-slate-800 text-xs font-bold transition-all shadow-xs backdrop-blur-xs cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">
                  {userProfile?.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden md:inline max-w-[90px] truncate">
                  {userProfile?.displayName || user.email?.split('@')[0] || 'Account'}
                </span>
                {userProfile?.role !== 'patient' && (
                  <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-amber-100 text-amber-800 font-extrabold">
                    {userProfile?.role === 'asha_worker' ? 'ASHA' : 'Doctor'}
                  </span>
                )}
              </button>
            ) : (
              <button
                id="nav-signin-btn"
                onClick={onOpenAuthModal}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-900 text-white text-xs font-bold shadow-xs border border-white/20 backdrop-blur-md transition-all cursor-pointer active:scale-95"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* User Dropdown Menu */}
            {userMenuOpen && user && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 glass-modal rounded-2xl shadow-xl border border-white/80 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {userProfile?.displayName || 'User'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email || 'Guest User'}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 capitalize">
                      Role: {userProfile?.role?.replace('_', ' ') || 'Citizen'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onOpenHistory();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-white/80 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <History className="w-4 h-4 text-slate-500" />
                    <span>View Cloud Records</span>
                  </button>

                  <button
                    onClick={async () => {
                      setUserMenuOpen(false);
                      await signOut();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Voice Helper Toggle */}
          <button
            id="nav-voice-toggle"
            onClick={onToggleVoice}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer backdrop-blur-xs ${
              isSpeaking
                ? 'bg-amber-500 text-white border-amber-400 shadow-xs animate-pulse'
                : 'bg-white/70 text-slate-700 border-white/80 hover:bg-white/90 shadow-2xs'
            }`}
            title={isSpeaking ? t.voiceStop : t.voiceHelp}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.voiceStop}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">{t.voiceHelp}</span>
              </>
            )}
          </button>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              id="nav-lang-picker-btn"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-white/80 bg-white/70 hover:bg-white/90 text-slate-700 text-xs font-semibold transition-colors cursor-pointer shadow-2xs backdrop-blur-xs"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-bold">
                {SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage)?.nativeName}
              </span>
            </button>

            {langMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 glass-modal rounded-2xl shadow-xl border border-white/80 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    {t.selectLanguage}
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors cursor-pointer ${
                        currentLanguage === lang.code
                          ? 'bg-slate-100/80 text-slate-900 font-bold'
                          : 'text-slate-600 hover:bg-white/80 font-medium'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="text-xs text-slate-400 font-normal">
                        {lang.englishName}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Optional Reset/Home Button */}
          {showRestartButton && (
            <button
              id="nav-restart-btn"
              onClick={onReset}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white/70 border border-transparent transition-colors cursor-pointer backdrop-blur-xs"
              title="Start Over"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

