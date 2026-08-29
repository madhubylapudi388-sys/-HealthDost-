import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Heart,
  Check,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  X,
  Scale,
  Ruler,
  AlertCircle,
  Activity,
  Flame,
  Wine,
  Utensils,
  Dna,
} from 'lucide-react';
import { UserAnswers, LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/languages';

interface QuestionFlowProps {
  answers: UserAnswers;
  onChange: (updated: Partial<UserAnswers>) => void;
  onComplete: () => void;
  onEmergencyTriggered: () => void;
  language: LanguageCode;
  onBackToHome: () => void;
  onStepChange?: (step: number) => void;
}

export const QuestionFlow: React.FC<QuestionFlowProps> = ({
  answers,
  onChange,
  onComplete,
  onEmergencyTriggered,
  language,
  onBackToHome,
  onStepChange,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showHowToCheckModal, setShowHowToCheckModal] = useState<string | null>(null);
  const totalSteps = 8;
  const t = TRANSLATIONS[language];

  // Helper to handle emergency step selection
  const handleEmergencyAnswer = (isEmergency: boolean) => {
    if (isEmergency) {
      onChange({ hasEmergencySymptoms: true });
      onEmergencyTriggered();
    } else {
      onChange({ hasEmergencySymptoms: false });
      setCurrentStep(2);
      if (onStepChange) onStepChange(2);
    }
  };

  // Helper for BMI calculation
  const heightM = answers.heightCm ? answers.heightCm / 100 : 1.65;
  const weight = answers.weightKg || 65;
  const currentBmi = Number((weight / (heightM * heightM)).toFixed(1));

  // Determine BMI category text
  let bmiCategoryLabel = t.questions.biomarkers.bmiNormal;
  let bmiColor = 'text-emerald-800 bg-emerald-100/80 border-emerald-200';
  if (currentBmi < 18.5) {
    bmiCategoryLabel = 'Underweight';
    bmiColor = 'text-amber-800 bg-amber-100/80 border-amber-200';
  } else if (currentBmi >= 25 && currentBmi < 30) {
    bmiCategoryLabel = t.questions.biomarkers.bmiOverweight;
    bmiColor = 'text-amber-800 bg-amber-100/80 border-amber-200';
  } else if (currentBmi >= 30) {
    bmiCategoryLabel = t.questions.biomarkers.bmiObese;
    bmiColor = 'text-rose-800 bg-rose-100/80 border-rose-200';
  }

  // Next step validation helper
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return !!answers.ageGroup;
      case 3:
        return !!answers.gender;
      case 4:
        return !!answers.activityLevel;
      case 5:
        return !!answers.smoking && !!answers.alcohol && !!answers.dietQuality;
      case 6:
        return (
          answers.familyHistory.diabetes ||
          answers.familyHistory.heartDisease ||
          answers.familyHistory.highBP ||
          answers.familyHistory.noneOrUnsure
        );
      case 7:
        return true; // Optional biomarker
      case 8:
        return true; // Optional biomarker
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (onStepChange) onStepChange(nextStep);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      if (onStepChange) onStepChange(prevStep);
    } else {
      onBackToHome();
    }
  };

  const remainingSteps = totalSteps - currentStep;
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  const STEP_TITLES = [
    'Safety',
    'Age',
    'Gender',
    'Activity',
    'Lifestyle',
    'Family',
    'Height & Weight',
    'Vitals',
  ];

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 flex flex-col">
      {/* 1. Visual Progress Bar & Step Counter Header */}
      <div
        id="questionnaire-progress-container"
        className="w-full glass-card rounded-3xl p-3.5 sm:p-4 mb-4"
      >
        {/* Counter & Remaining Badge */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm font-extrabold text-slate-800 font-cultural">
              {t.stepOf} {currentStep} of {totalSteps}
            </span>
            <span className="hidden xs:inline-block text-xs font-semibold text-slate-600 bg-white/70 border border-white/80 px-2 py-0.5 rounded-full shadow-2xs backdrop-blur-xs">
              {STEP_TITLES[currentStep - 1]}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              id="question-remaining-counter"
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border shadow-2xs backdrop-blur-xs ${
                remainingSteps === 0
                  ? 'bg-emerald-100/90 text-emerald-800 border-emerald-200'
                  : 'bg-white/70 text-slate-600 border-white/80'
              }`}
            >
              {remainingSteps === 0 ? '✨ Final Question' : `${remainingSteps} remaining`}
            </span>
            <span className="text-xs font-bold text-sky-700">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Continuous Animated Progress Bar */}
        <div className="w-full h-2.5 bg-slate-200/70 rounded-full overflow-hidden flex mb-3 border border-white/40">
          <div
            id="question-progress-bar-fill"
            className="h-full bg-gradient-to-r from-sky-500 via-teal-500 to-amber-500 rounded-full transition-all duration-300 ease-out shadow-xs"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 8-Step Segmented Step Counter Pills */}
        <div className="grid grid-cols-8 gap-1 pt-0.5" aria-label="Question steps navigation progress">
          {Array.from({ length: totalSteps }, (_, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div
                key={stepNum}
                title={`Step ${stepNum}: ${STEP_TITLES[i]}`}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  isCompleted
                    ? 'bg-sky-600'
                    : isCurrent
                    ? 'bg-amber-500 ring-2 ring-amber-400/40 shadow-xs'
                    : 'bg-slate-200/80'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* 2. Main Question Card */}
      <div className="w-full glass-card rounded-3xl p-5 sm:p-6 flex flex-col mb-5">
        {/* Step 1: Emergency Alert Screen Check */}
        {currentStep === 1 && (
          <div>
            <div className="flex items-center gap-2 text-rose-800 bg-rose-100/80 px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-bold w-fit mb-3 shadow-2xs backdrop-blur-xs">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Safety Check</span>
            </div>

            <h2 className="font-cultural text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight mb-2">
              {t.questions.emergency.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium mb-6">
              {t.questions.emergency.subtitle}
            </p>

            <div className="flex flex-col gap-3">
              <button
                id="emergency-opt-no"
                onClick={() => handleEmergencyAnswer(false)}
                className="w-full py-4 px-5 rounded-2xl glass-card-interactive text-slate-900 text-left font-bold text-base sm:text-lg flex items-center justify-between transition-all group cursor-pointer border-emerald-300/80 bg-emerald-50/70 hover:bg-emerald-100/80 active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">😊</span>
                  <span>{t.questions.emergency.noSevere}</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              <button
                id="emergency-opt-chest-pain"
                onClick={() => handleEmergencyAnswer(true)}
                className="w-full py-3.5 px-5 rounded-2xl glass-rose text-rose-950 text-left font-bold text-sm sm:text-base flex items-center justify-between transition-all active:scale-98 cursor-pointer hover:border-rose-400"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💔</span>
                  <span>{t.questions.emergency.yesChestPain}</span>
                </div>
                <span className="text-xs bg-rose-600 text-white font-bold px-2.5 py-1 rounded-lg shadow-2xs">
                  Emergency
                </span>
              </button>

              <button
                id="emergency-opt-breathing"
                onClick={() => handleEmergencyAnswer(true)}
                className="w-full py-3.5 px-5 rounded-2xl glass-rose text-rose-950 text-left font-bold text-sm sm:text-base flex items-center justify-between transition-all active:scale-98 cursor-pointer hover:border-rose-400"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">😮‍💨</span>
                  <span>{t.questions.emergency.yesBreathing}</span>
                </div>
                <span className="text-xs bg-rose-600 text-white font-bold px-2.5 py-1 rounded-lg shadow-2xs">
                  Emergency
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Age Group */}
        {currentStep === 2 && (
          <div>
            <h2 className="font-cultural text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight mb-1">
              {t.questions.age.title}
            </h2>
            <p className="text-sm text-slate-600 font-medium mb-5">
              {t.questions.age.subtitle}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'under30', label: t.questions.age.under30, icon: '🌱', range: '< 30' },
                { id: '30to45', label: t.questions.age.age30to45, icon: '🚶', range: '30-45' },
                { id: '46to60', label: t.questions.age.age46to60, icon: '⏳', range: '46-60' },
                { id: 'above60', label: t.questions.age.above60, icon: '🧓', range: '60+' },
              ].map((opt) => {
                const isSelected = answers.ageGroup === opt.id;
                return (
                  <button
                    key={opt.id}
                    id={`age-opt-${opt.id}`}
                    onClick={() => onChange({ ageGroup: opt.id as any })}
                    className={`py-4 px-4 rounded-2xl border text-left flex items-center gap-3.5 transition-all active:scale-98 cursor-pointer backdrop-blur-xs ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/90 text-sky-950 shadow-xs ring-2 ring-sky-400/30 font-bold scale-[1.01]'
                        : 'border-white/80 bg-white/60 hover:bg-white/90 text-slate-800'
                    }`}
                  >
                    <span className="text-3xl">{opt.icon}</span>
                    <div className="flex-1">
                      <div className="text-base font-bold leading-tight">{opt.label}</div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Gender / Biological Sex */}
        {currentStep === 3 && (
          <div>
            <h2 className="font-cultural text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight mb-1">
              {t.questions.gender.title}
            </h2>
            <p className="text-sm text-slate-600 font-medium mb-5">
              {t.questions.gender.subtitle}
            </p>

            <div className="flex flex-col gap-3">
              {[
                { id: 'male', label: t.questions.gender.male, icon: '👨' },
                { id: 'female', label: t.questions.gender.female, icon: '👩' },
                { id: 'other', label: t.questions.gender.other, icon: '🧑' },
              ].map((opt) => {
                const isSelected = answers.gender === opt.id;
                return (
                  <button
                    key={opt.id}
                    id={`gender-opt-${opt.id}`}
                    onClick={() => onChange({ gender: opt.id as any })}
                    className={`py-4 px-5 rounded-2xl border text-left flex items-center gap-4 transition-all active:scale-98 cursor-pointer backdrop-blur-xs ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/90 text-sky-950 shadow-xs ring-2 ring-sky-400/30 font-bold scale-[1.01]'
                        : 'border-white/80 bg-white/60 hover:bg-white/90 text-slate-800'
                    }`}
                  >
                    <span className="text-3xl">{opt.icon}</span>
                    <span className="text-lg font-bold flex-1">{opt.label}</span>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Daily Physical Activity */}
        {currentStep === 4 && (
          <div>
            <h2 className="font-cultural text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight mb-1">
              {t.questions.activity.title}
            </h2>
            <p className="text-sm text-slate-600 font-medium mb-5">
              {t.questions.activity.subtitle}
            </p>

            <div className="flex flex-col gap-3">
              {[
                {
                  id: 'active',
                  label: t.questions.activity.active,
                  desc: t.questions.activity.activeDesc,
                  icon: '🏃',
                  highlight: 'Protective habit 🟢',
                },
                {
                  id: 'moderate',
                  label: t.questions.activity.moderate,
                  desc: t.questions.activity.moderateDesc,
                  icon: '🚶',
                  highlight: 'Moderate',
                },
                {
                  id: 'low',
                  label: t.questions.activity.low,
                  desc: t.questions.activity.lowDesc,
                  icon: '🪑',
                  highlight: 'Sitting mostly',
                },
              ].map((opt) => {
                const isSelected = answers.activityLevel === opt.id;
                return (
                  <button
                    key={opt.id}
                    id={`activity-opt-${opt.id}`}
                    onClick={() => onChange({ activityLevel: opt.id as any })}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all active:scale-98 cursor-pointer backdrop-blur-xs ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/90 text-sky-950 shadow-xs ring-2 ring-sky-400/30 font-bold scale-[1.01]'
                        : 'border-white/80 bg-white/60 hover:bg-white/90 text-slate-800'
                    }`}
                  >
                    <span className="text-3xl mt-0.5">{opt.icon}</span>
                    <div className="flex-1">
                      <div className="text-base font-bold leading-snug">{opt.label}</div>
                      <div className="text-xs text-slate-500 font-normal mt-0.5">
                        {opt.desc}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Lifestyle & Daily Habits */}
        {currentStep === 5 && (
          <div>
            <h2 className="font-cultural text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight mb-1">
              {t.questions.lifestyle.title}
            </h2>
            <p className="text-sm text-slate-600 font-medium mb-4">
              {t.questions.lifestyle.subtitle}
            </p>

            <div className="space-y-4">
              {/* Smoking */}
              <div className="glass-card-subtle p-3.5 rounded-2xl">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>{t.questions.lifestyle.smokingTitle}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'never', label: t.questions.lifestyle.never, icon: '🚫' },
                    { id: 'occasional', label: t.questions.lifestyle.sometimes, icon: '🚬' },
                    { id: 'regular', label: t.questions.lifestyle.regular, icon: '🚭' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      id={`smoke-opt-${s.id}`}
                      onClick={() => onChange({ smoking: s.id as any })}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        answers.smoking === s.id
                          ? 'bg-slate-900 text-white border-slate-800 shadow-xs'
                          : 'bg-white/70 text-slate-800 border-white/80 hover:bg-white'
                      }`}
                    >
                      <span className="text-base">{s.icon}</span>
                      <span className="text-center">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Alcohol */}
              <div className="glass-card-subtle p-3.5 rounded-2xl">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                  <Wine className="w-4 h-4 text-slate-600" />
                  <span>{t.questions.lifestyle.alcoholTitle}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'never', label: t.questions.lifestyle.never, icon: '🚫' },
                    { id: 'occasional', label: t.questions.lifestyle.sometimes, icon: '🍷' },
                    { id: 'regular', label: t.questions.lifestyle.regular, icon: '🍻' },
                  ].map((a) => (
                    <button
                      key={a.id}
                      id={`alcohol-opt-${a.id}`}
                      onClick={() => onChange({ alcohol: a.id as any })}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        answers.alcohol === a.id
                          ? 'bg-slate-900 text-white border-slate-800 shadow-xs'
                          : 'bg-white/70 text-slate-800 border-white/80 hover:bg-white'
                      }`}
                    >
                      <span className="text-base">{a.icon}</span>
                      <span className="text-center">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Diet Type */}
              <div className="glass-card-subtle p-3.5 rounded-2xl">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                  <Utensils className="w-4 h-4 text-emerald-600" />
                  <span>{t.questions.lifestyle.dietTitle}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    {
                      id: 'balanced',
                      label: t.questions.lifestyle.dietBalanced,
                      icon: '🥗',
                    },
                    {
                      id: 'oily_sweet',
                      label: t.questions.lifestyle.dietOilySweet,
                      icon: '🍩',
                    },
                    {
                      id: 'high_salt',
                      label: t.questions.lifestyle.dietHighSalt,
                      icon: '🧂',
                    },
                  ].map((d) => (
                    <button
                      key={d.id}
                      id={`diet-opt-${d.id}`}
                      onClick={() => onChange({ dietQuality: d.id as any })}
                      className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                        answers.dietQuality === d.id
                          ? 'bg-slate-900 text-white border-slate-800 shadow-xs'
                          : 'bg-white/70 text-slate-800 border-white/80 hover:bg-white'
                      }`}
                    >
                      <span className="text-xl">{d.icon}</span>
                      <span className="flex-1">{d.label}</span>
                      {answers.dietQuality === d.id && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Family History */}
        {currentStep === 6 && (
          <div>
            <h2 className="font-cultural text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight mb-1">
              {t.questions.familyHistory.title}
            </h2>
            <p className="text-sm text-slate-600 font-medium mb-4">
              {t.questions.familyHistory.subtitle}
            </p>

            <div className="flex flex-col gap-2.5">
              {[
                {
                  id: 'diabetes',
                  label: t.questions.familyHistory.diabetes,
                  icon: '🩸',
                  checked: answers.familyHistory.diabetes,
                  onToggle: () =>
                    onChange({
                      familyHistory: {
                        ...answers.familyHistory,
                        diabetes: !answers.familyHistory.diabetes,
                        noneOrUnsure: false,
                      },
                    }),
                },
                {
                  id: 'heartDisease',
                  label: t.questions.familyHistory.heart,
                  icon: '❤️',
                  checked: answers.familyHistory.heartDisease,
                  onToggle: () =>
                    onChange({
                      familyHistory: {
                        ...answers.familyHistory,
                        heartDisease: !answers.familyHistory.heartDisease,
                        noneOrUnsure: false,
                      },
                    }),
                },
                {
                  id: 'highBP',
                  label: t.questions.familyHistory.bp,
                  icon: '🩺',
                  checked: answers.familyHistory.highBP,
                  onToggle: () =>
                    onChange({
                      familyHistory: {
                        ...answers.familyHistory,
                        highBP: !answers.familyHistory.highBP,
                        noneOrUnsure: false,
                      },
                    }),
                },
                {
                  id: 'noneOrUnsure',
                  label: t.questions.familyHistory.none,
                  icon: '✨',
                  checked: answers.familyHistory.noneOrUnsure,
                  onToggle: () =>
                    onChange({
                      familyHistory: {
                        diabetes: false,
                        heartDisease: false,
                        highBP: false,
                        noneOrUnsure: true,
                      },
                    }),
                },
              ].map((item) => (
                <button
                  key={item.id}
                  id={`fam-check-${item.id}`}
                  onClick={item.onToggle}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3.5 transition-all active:scale-98 cursor-pointer backdrop-blur-xs ${
                    item.checked
                      ? 'border-sky-500 bg-sky-50/90 text-sky-950 shadow-xs font-bold'
                      : 'border-white/80 bg-white/60 hover:bg-white/90 text-slate-800'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-base font-bold flex-1">{item.label}</span>
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                      item.checked
                        ? 'bg-sky-600 border-sky-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {item.checked && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 7: Optional Biomarkers - Height & Weight (Auto BMI) */}
        {currentStep === 7 && (
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="font-cultural text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                {t.questions.biomarkers.title}
              </h2>
              <button
                onClick={() => setShowHowToCheckModal('bmi')}
                className="text-xs text-sky-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{t.howToCheck}</span>
              </button>
            </div>

            <p className="text-sm text-slate-600 font-medium mb-4">
              {t.questions.biomarkers.subtitle}
            </p>

            {answers.bmiSkipped ? (
              <div className="glass-card-subtle p-4 rounded-2xl text-center">
                <p className="text-sm text-slate-600 mb-3">
                  You chose to skip weight and height.
                </p>
                <button
                  onClick={() => onChange({ bmiSkipped: false })}
                  className="text-xs font-bold text-amber-600 underline cursor-pointer"
                >
                  Click here if you want to enter your weight/height
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Weight Stepper / Slider */}
                <div className="glass-card-subtle p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-sky-600" />
                      {t.questions.biomarkers.weight}
                    </span>
                    <span className="text-lg font-black text-slate-800 bg-white/90 px-2.5 py-0.5 rounded-lg border border-white shadow-2xs backdrop-blur-xs">
                      {answers.weightKg || 65} kg
                    </span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="140"
                    step="1"
                    value={answers.weightKg || 65}
                    onChange={(e) => onChange({ weightKg: Number(e.target.value) })}
                    className="w-full accent-sky-600 h-2 bg-slate-200/80 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold mt-1">
                    <span>35 kg</span>
                    <span>65 kg (Average)</span>
                    <span>140 kg</span>
                  </div>
                </div>

                {/* Height Stepper / Slider */}
                <div className="glass-card-subtle p-4 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                      <Ruler className="w-4 h-4 text-sky-600" />
                      {t.questions.biomarkers.height}
                    </span>
                    <span className="text-lg font-black text-slate-800 bg-white/90 px-2.5 py-0.5 rounded-lg border border-white shadow-2xs backdrop-blur-xs">
                      {answers.heightCm || 165} cm
                      <span className="text-xs text-slate-500 font-normal ml-1">
                        ({Math.floor((answers.heightCm || 165) / 30.48)} ft{' '}
                        {Math.round(((answers.heightCm || 165) % 30.48) / 2.54)} in)
                      </span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="120"
                    max="210"
                    step="1"
                    value={answers.heightCm || 165}
                    onChange={(e) => onChange({ heightCm: Number(e.target.value) })}
                    className="w-full accent-sky-600 h-2 bg-slate-200/80 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold mt-1">
                    <span>120 cm (4 ft)</span>
                    <span>165 cm (5.4 ft)</span>
                    <span>210 cm (6.9 ft)</span>
                  </div>
                </div>

                {/* Live Calculated BMI Display */}
                <div className="glass-card-subtle p-3.5 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {t.questions.biomarkers.calcBmi}
                    </div>
                    <div className="text-xs text-slate-500">
                      {bmiCategoryLabel}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-xl text-sm font-black border shadow-2xs backdrop-blur-xs ${bmiColor}`}>
                    BMI: {currentBmi}
                  </div>
                </div>

                {/* Skip button */}
                <button
                  id="btn-skip-bmi"
                  onClick={() => onChange({ bmiSkipped: true })}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline block text-center w-full py-1 cursor-pointer"
                >
                  {t.skipStep}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 8: Blood Pressure & Blood Sugar */}
        {currentStep === 8 && (
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="font-cultural text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                Medical Numbers (BP & Sugar)
              </h2>
              <button
                onClick={() => setShowHowToCheckModal('bp_sugar')}
                className="text-xs text-sky-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{t.howToCheck}</span>
              </button>
            </div>

            <p className="text-sm text-slate-600 font-medium mb-4">
              Select if you know your recent test readings.
            </p>

            <div className="space-y-4">
              {/* Blood Pressure Option */}
              <div className="glass-card-subtle p-4 rounded-2xl">
                <div className="text-sm font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-amber-500" />
                  <span>{t.questions.biomarkers.bpTitle}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'normal', label: t.questions.biomarkers.normal, icon: '🟢' },
                    { id: 'high', label: t.questions.biomarkers.high, icon: '🔴' },
                    { id: 'unknown', label: t.questions.biomarkers.unsure, icon: '❓' },
                  ].map((bp) => (
                    <button
                      key={bp.id}
                      id={`bp-opt-${bp.id}`}
                      onClick={() => onChange({ bloodPressure: bp.id as any })}
                      className={`p-2.5 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        answers.bloodPressure === bp.id
                          ? 'bg-slate-900 text-white border-slate-800 shadow-xs'
                          : 'bg-white/70 text-slate-800 border-white/80 hover:bg-white'
                      }`}
                    >
                      <span className="text-lg">{bp.icon}</span>
                      <span className="text-center">{bp.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Blood Sugar Option */}
              <div className="glass-card-subtle p-4 rounded-2xl">
                <div className="text-sm font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                  <span className="text-base">🩸</span>
                  <span>{t.questions.biomarkers.sugarTitle}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'normal', label: t.questions.biomarkers.normal, icon: '🟢' },
                    { id: 'high', label: t.questions.biomarkers.high, icon: '🔴' },
                    { id: 'unknown', label: t.questions.biomarkers.unsure, icon: '❓' },
                  ].map((bs) => (
                    <button
                      key={bs.id}
                      id={`sugar-opt-${bs.id}`}
                      onClick={() => onChange({ bloodSugar: bs.id as any })}
                      className={`p-2.5 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        answers.bloodSugar === bs.id
                          ? 'bg-slate-900 text-white border-slate-800 shadow-xs'
                          : 'bg-white/70 text-slate-800 border-white/80 hover:bg-white'
                      }`}
                    >
                      <span className="text-lg">{bs.icon}</span>
                      <span className="text-center">{bs.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Bottom Sticky Action Buttons */}
      <div className="w-full flex items-center justify-between gap-3 pt-2">
        <button
          id="btn-question-back"
          onClick={handleBack}
          className="py-3.5 px-5 rounded-2xl border border-white/80 bg-white/70 hover:bg-white text-slate-800 font-bold text-sm sm:text-base flex items-center gap-1.5 transition-all active:scale-95 shadow-xs cursor-pointer backdrop-blur-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t.previous}</span>
        </button>

        {currentStep > 1 && (
          <button
            id="btn-question-next"
            onClick={handleNext}
            disabled={!canProceed()}
            className={`py-3.5 px-7 rounded-2xl text-white font-bold text-base sm:text-lg shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer border border-white/30 backdrop-blur-xs ${
              canProceed()
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-orange-500/25'
                : 'bg-slate-300/80 text-slate-500 shadow-none cursor-not-allowed border-transparent'
            }`}
          >
            <span>{currentStep === totalSteps ? t.seeResults : t.next}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* "How to check" Educational Modal */}
      {showHowToCheckModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="glass-modal rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-800 font-cultural font-bold text-lg">
                <HelpCircle className="w-5 h-5 text-sky-600" />
                <span>Simple Health Guide</span>
              </div>
              <button
                onClick={() => setShowHowToCheckModal(null)}
                className="p-1.5 rounded-full text-slate-500 hover:text-slate-800 bg-white/80 border border-white/80 cursor-pointer shadow-2xs"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {showHowToCheckModal === 'bmi' ? (
              <div className="space-y-3 text-sm text-slate-600">
                <p>
                  <strong className="text-slate-900">How to measure:</strong> You can check your height against any wall using a simple measuring tape, and your weight on a digital or spring scale at any local chemist or clinic.
                </p>
                <p>
                  <strong className="text-slate-900">What is BMI?</strong> It is a simple comparison between your height and weight to see if your joints and heart are under extra load.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-slate-600">
                <p>
                  <strong className="text-slate-900">Where to get checked:</strong> You can get a free BP and blood sugar finger-prick test at any government Primary Health Centre (PHC), ASHA worker camp, or nearby pharmacy in just 3 minutes.
                </p>
                <p>
                  <strong className="text-slate-900">Normal Readings:</strong> BP is ideally around 120/80. Fasting blood sugar is usually under 100 mg/dL.
                </p>
              </div>
            )}

            <button
              onClick={() => setShowHowToCheckModal(null)}
              className="w-full mt-5 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-sm shadow-md cursor-pointer border border-white/20"
            >
              Got it, continue!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
