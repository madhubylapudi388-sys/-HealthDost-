import React, { useState } from 'react';
import {
  Bell,
  BellRing,
  Download,
  Share2,
  FileText,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Heart,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LanguageCode, RiskCalculationResult } from '../types';
import { TRANSLATIONS } from '../data/languages';

interface PreventionPlanScreenProps {
  result: RiskCalculationResult;
  language: LanguageCode;
  onSaveReport: () => void;
  onShareReport: () => void;
  onOpenDetailedReport: () => void;
  onStartOver: () => void;
}

interface ActionItem {
  id: string;
  icon: string;
  title: string;
  benefit: string;
  difficulty: string;
}

export const PreventionPlanScreen: React.FC<PreventionPlanScreenProps> = ({
  result,
  language,
  onSaveReport,
  onShareReport,
  onOpenDetailedReport,
  onStartOver,
}) => {
  const t = TRANSLATIONS[language];

  // Local state for reminders (persists in component session)
  const [reminders, setReminders] = useState<Record<string, boolean>>({
    walk: true,
    salt: false,
    water: false,
    greens: false,
    checkup: true,
  });

  const [expandedAction, setExpandedAction] = useState<string | null>('walk');

  const handleToggleReminder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !reminders[id];
    setReminders((prev) => ({ ...prev, [id]: nextState }));

    if (nextState) {
      // Trigger a small cheerful confetti burst
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#10B981', '#34D399', '#FBBF24'],
        });
      } catch (e) {
        // silent fallback
      }
    }
  };

  const actionCards: ActionItem[] = [
    {
      id: 'walk',
      icon: '🚶',
      title: t.actions.walk.title,
      benefit: t.actions.walk.benefit,
      difficulty: 'Easy (Daily)',
    },
    {
      id: 'salt',
      icon: '🧂',
      title: t.actions.salt.title,
      benefit: t.actions.salt.benefit,
      difficulty: 'Simple habit',
    },
    {
      id: 'water',
      icon: '💧',
      title: t.actions.water.title,
      benefit: t.actions.water.benefit,
      difficulty: 'Very Easy',
    },
    {
      id: 'greens',
      icon: '🥗',
      title: t.actions.greens.title,
      benefit: t.actions.greens.benefit,
      difficulty: 'Healthy Food',
    },
    {
      id: 'checkup',
      icon: '🩺',
      title: t.actions.checkup.title,
      benefit: t.actions.checkup.benefit,
      difficulty: 'Every 3-6 months',
    },
  ];

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
      {/* 1. Header Card */}
      <div className="w-full bg-gradient-to-tr from-slate-900/90 via-slate-800/90 to-teal-950/80 text-white rounded-3xl p-6 sm:p-7 shadow-xl mb-5 text-center relative overflow-hidden backdrop-blur-xl border border-white/20">
        <div className="absolute top-0 right-0 w-36 h-36 bg-teal-400/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="w-12 h-12 mx-auto rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center mb-3 border border-white/30 shadow-inner">
          <Heart className="w-6 h-6 fill-white text-white" />
        </div>

        <h1 className="font-cultural text-xl sm:text-2xl font-extrabold tracking-tight mb-1">
          {t.actionPlanTitle}
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md mx-auto leading-relaxed">
          {t.actionPlanSubtitle}
        </p>
      </div>

      {/* 2. List of 3-5 Doable Action Cards */}
      <div className="w-full space-y-3 mb-6">
        {actionCards.map((item) => {
          const isRemindOn = !!reminders[item.id];
          const isExpanded = expandedAction === item.id;

          return (
            <div
              key={item.id}
              onClick={() => setExpandedAction(isExpanded ? null : item.id)}
              className={`w-full rounded-2xl transition-all p-4 cursor-pointer ${
                isRemindOn
                  ? 'glass-card border-emerald-400/80 shadow-md ring-2 ring-emerald-500/20'
                  : 'glass-card hover:border-white/90'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Icon & Title */}
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-3xl mt-0.5 select-none">{item.icon}</span>
                  <div>
                    <div className="font-cultural text-base font-bold text-slate-900 leading-snug">
                      {item.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-semibold text-slate-700 bg-white/80 px-2 py-0.5 rounded-full border border-white/80">
                        {item.difficulty}
                      </span>
                      <span className="text-[11px] text-amber-600 font-bold flex items-center gap-0.5">
                        {isExpanded ? 'Hide why this helps' : 'Tap to see why this helps'}
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reminder Toggle Pill */}
                <button
                  id={`reminder-toggle-${item.id}`}
                  onClick={(e) => handleToggleReminder(item.id, e)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                    isRemindOn
                      ? 'bg-emerald-600 text-white shadow-xs border border-emerald-400/40'
                      : 'bg-white/80 hover:bg-white text-slate-700 border border-white/80'
                  }`}
                  title="Toggle reminder"
                >
                  {isRemindOn ? (
                    <>
                      <BellRing className="w-3.5 h-3.5 text-amber-200" />
                      <span>{t.remindActive}</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-3.5 h-3.5 text-slate-500" />
                      <span>{t.remindMe}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Expandable 1-line "Why this helps" */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed glass-card-subtle p-3 rounded-xl">
                  <strong className="text-teal-900 font-bold block mb-0.5">
                    💡 Why this helps your body:
                  </strong>
                  {item.benefit}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Export & Share Action Buttons */}
      <div className="w-full flex flex-col gap-3 mb-6">
        <button
          id="btn-save-report"
          onClick={onSaveReport}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-black hover:to-slate-900 text-white font-bold text-base sm:text-lg shadow-md flex items-center justify-center gap-2.5 transition-transform active:scale-98 cursor-pointer border border-white/20 backdrop-blur-xs"
        >
          <Download className="w-5 h-5 text-amber-300" />
          <span>{t.saveReport}</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            id="btn-share-plan"
            onClick={onShareReport}
            className="py-3 px-4 rounded-2xl glass-card-interactive text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-sky-600" />
            <span>{t.shareWithDoctor}</span>
          </button>

          <button
            id="btn-plan-detailed"
            onClick={onOpenDetailedReport}
            className="py-3 px-4 rounded-2xl glass-card-interactive text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>{t.detailedView}</span>
          </button>
        </div>
      </div>

      {/* 4. Start Over Button */}
      <button
        id="btn-plan-start-over"
        onClick={onStartOver}
        className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 mb-6 underline cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Check health for another family member / Start Over</span>
      </button>

      {/* 5. Mandatory Safety Disclaimer */}
      <div className="w-full glass-card-subtle rounded-2xl p-4 text-slate-600 flex items-start gap-3">
        <Stethoscope className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold text-slate-800 block mb-0.5">
            Safety Reminder
          </span>
          {t.disclaimerShort}
        </div>
      </div>
    </div>
  );
};
