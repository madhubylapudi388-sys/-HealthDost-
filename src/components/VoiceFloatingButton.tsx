import React from 'react';
import { Volume2, VolumeX, Bot, Sparkles, Mic, Pill } from 'lucide-react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/languages';
import { speechHelper } from '../utils/speechHelper';

interface VoiceFloatingButtonProps {
  isSpeaking: boolean;
  onToggleVoice: () => void;
  language: LanguageCode;
  onOpenAiAgent: () => void;
  onOpenTabletScanner?: () => void;
}

export const VoiceFloatingButton: React.FC<VoiceFloatingButtonProps> = ({
  isSpeaking,
  onToggleVoice,
  language,
  onOpenAiAgent,
  onOpenTabletScanner,
}) => {
  const t = TRANSLATIONS[language];
  const isSupported = speechHelper.getSupported();

  const getAiAgentLabel = () => {
    switch (language) {
      case 'hi':
        return 'AI दोस्त से बोलें';
      case 'te':
        return 'AI మిత్రుడితో మాట్లాడండి';
      case 'ta':
        return 'AI தோழனுடன் பேசுங்கள்';
      case 'bn':
        return 'AI বন্ধুর সাথে কথা বলুন';
      case 'mr':
        return 'AI मित्राशी बोला';
      case 'kn':
        return 'AI ಮಿತ್ರರೊಂದಿಗೆ ಮಾತನಾಡಿ';
      default:
        return 'Talk to AI Agent';
    }
  };

  const getTabletScannerLabel = () => {
    switch (language) {
      case 'hi':
        return 'दवा स्कैन करें';
      case 'te':
        return 'మందులు స్కాన్ చేయండి';
      case 'ta':
        return 'மருந்து ஸ்கேன்';
      default:
        return 'Scan Tablet';
    }
  };

  return (
    <div className="fixed bottom-4 right-3 z-40 sm:bottom-6 sm:right-6 flex flex-col sm:flex-row items-end sm:items-center gap-2">
      {/* Tablet Scanner Floating Action Button */}
      {onOpenTabletScanner && (
        <button
          id="tablet-scanner-floating-btn"
          onClick={onOpenTabletScanner}
          className="flex items-center gap-1.5 px-3.5 py-2 sm:py-2.5 rounded-full shadow-lg border border-white/80 bg-white/75 hover:bg-white/95 text-slate-800 text-xs font-bold transition-all transform active:scale-95 cursor-pointer backdrop-blur-md group"
          aria-label="Scan medicine tablet"
          title="Scan tablet for name, uses, and side effects"
        >
          <div className="p-1 rounded-full bg-amber-100/90 text-amber-800 group-hover:scale-110 transition-transform border border-amber-200/60 shadow-2xs">
            <Pill className="w-3.5 h-3.5" />
          </div>
          <span className="whitespace-nowrap font-cultural">{getTabletScannerLabel()}</span>
        </button>
      )}

      {/* AI Health Agent Voice Companion Button */}
      <button
        id="ai-agent-floating-btn"
        onClick={onOpenAiAgent}
        className="flex items-center gap-2 px-4 py-2.5 sm:py-3 rounded-full shadow-xl border border-white/30 bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 hover:from-slate-900 hover:to-black text-white text-xs sm:text-sm font-bold transition-all transform active:scale-95 cursor-pointer backdrop-blur-xl group"
        aria-label="Speak with AI Health Agent"
        title="Open interactive AI Health Companion"
      >
        <div className="relative">
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <span className="whitespace-nowrap font-cultural">{getAiAgentLabel()}</span>
        <span className="p-1 rounded-full bg-white/20 text-white border border-white/30">
          <Mic className="w-3 h-3" />
        </span>
      </button>

      {/* Screen Voice Readout Toggle (if speech synthesis supported) */}
      {isSupported && (
        <button
          id="voice-help-floating-btn"
          onClick={onToggleVoice}
          className={`flex items-center gap-2 px-3.5 py-2.5 sm:py-3 rounded-full shadow-lg border text-xs sm:text-sm font-bold transition-all transform active:scale-95 cursor-pointer backdrop-blur-md ${
            isSpeaking
              ? 'bg-amber-500/90 text-white border-amber-300/80 shadow-amber-500/30 ring-3 ring-amber-400/25'
              : 'bg-white/75 hover:bg-white/95 text-slate-700 border-white/80'
          }`}
          aria-label={isSpeaking ? t.voiceStop : t.voiceHelp}
          title={isSpeaking ? 'Stop voice readout' : 'Read screen aloud'}
        >
          {isSpeaking ? (
            <>
              <div className="flex items-center gap-0.5">
                <span className="w-1 h-3 bg-white rounded-full animate-pulse" />
                <span className="w-1 h-4 bg-white rounded-full animate-pulse delay-75" />
                <span className="w-1 h-2 bg-white rounded-full animate-pulse delay-150" />
              </div>
              <VolumeX className="w-4 h-4 ml-0.5" />
              <span className="whitespace-nowrap font-cultural">{t.voiceStop}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-slate-600" />
              <span className="whitespace-nowrap font-cultural text-[11px] sm:text-xs">
                {t.voiceHelp}
              </span>
            </>
          )}
        </button>
      )}
    </div>
  );
};



