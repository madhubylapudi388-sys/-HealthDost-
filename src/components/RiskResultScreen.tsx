import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Heart,
  Activity,
  ArrowRight,
  Share2,
  FileText,
  HelpCircle,
  Stethoscope,
  Info,
  Zap,
  BookmarkCheck,
  Check,
  CloudUpload,
  Pill,
  MapPin,
} from 'lucide-react';
import { RiskCalculationResult, LanguageCode, UserAnswers, SampleProfile } from '../types';
import { TRANSLATIONS, SUPPORTED_LANGUAGES } from '../data/languages';
import { SAMPLE_PROFILES } from '../utils/sampleData';
import { SpeedometerGauge } from './SpeedometerGauge';
import { useAuth } from '../context/AuthContext';
import { saveAssessmentRecord } from '../services/dbService';

interface RiskResultScreenProps {
  result: RiskCalculationResult;
  userAnswers: UserAnswers;
  language: LanguageCode;
  onGoToPrevention: () => void;
  onOpenDetailedReport: () => void;
  onShare: () => void;
  onSelectSample?: (sample: SampleProfile) => void;
  onOpenAuthModal?: () => void;
  onOpenHistory?: () => void;
  onOpenAiAgent?: () => void;
  onOpenTabletScanner?: () => void;
  onOpenNearbyClinics?: () => void;
}

export const RiskResultScreen: React.FC<RiskResultScreenProps> = ({
  result,
  userAnswers,
  language,
  onGoToPrevention,
  onOpenDetailedReport,
  onShare,
  onSelectSample,
  onOpenAuthModal,
  onOpenHistory,
  onOpenAiAgent,
  onOpenTabletScanner,
  onOpenNearbyClinics,
}) => {
  const [whyExpanded, setWhyExpanded] = useState(true);
  const [savedToCloud, setSavedToCloud] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user, userProfile } = useAuth();
  const [aiExplanation, setAiExplanation] = useState<{
    summary: string;
    actionAdvice: string;
  } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const t = TRANSLATIONS[language];
  const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  // Auto save to Firestore if user is already authenticated
  useEffect(() => {
    let active = true;
    async function autoSaveIfLoggedIn() {
      if (user && !savedToCloud && !isSaving) {
        try {
          setIsSaving(true);
          await saveAssessmentRecord({
            userId: user.uid,
            userEmail: user.email || '',
            patientName: userProfile?.displayName || (userAnswers.gender === 'female' ? 'Citizen (F)' : 'Citizen (M)'),
            overallScore: result.overallScore,
            riskLevel: result.riskLevel,
            diabetesScore: result.diabetesScore,
            heartScore: result.heartScore,
            bmiValue: result.bmiValue,
            bmiCategory: result.bmiCategory,
            answers: userAnswers,
            topRiskFactors: result.topRiskFactors,
            plainLanguageSummary: result.plainLanguageSummary,
            createdAt: new Date().toISOString(),
          });
          if (active) setSavedToCloud(true);
        } catch (err) {
          console.warn('Auto-save assessment error:', err);
        } finally {
          if (active) setIsSaving(false);
        }
      }
    }
    autoSaveIfLoggedIn();
    return () => {
      active = false;
    };
  }, [user, result]);

  const handleManualSave = async () => {
    if (!user) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }
    if (savedToCloud) return;

    try {
      setIsSaving(true);
      await saveAssessmentRecord({
        userId: user.uid,
        userEmail: user.email || '',
        patientName: userProfile?.displayName || 'Citizen',
        overallScore: result.overallScore,
        riskLevel: result.riskLevel,
        diabetesScore: result.diabetesScore,
        heartScore: result.heartScore,
        bmiValue: result.bmiValue,
        bmiCategory: result.bmiCategory,
        answers: userAnswers,
        topRiskFactors: result.topRiskFactors,
        plainLanguageSummary: result.plainLanguageSummary,
        createdAt: new Date().toISOString(),
      });
      setSavedToCloud(true);
    } catch (err) {
      console.error('Save record failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch server-side Gemini plain-language explanation
  useEffect(() => {
    let isMounted = true;
    async function fetchAiExplanation() {
      try {
        setLoadingAi(true);
        const topFactorTitles = result.topRiskFactors.map((f) => f.title);
        const res = await fetch('/api/gemini/explain-risk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            riskCategory: result.riskLevel,
            overallScore: result.overallScore,
            topFactors: topFactorTitles,
            userProfile: {
              age: userAnswers.ageGroup,
              gender: userAnswers.gender,
              smoking: userAnswers.smoking,
              alcohol: userAnswers.alcohol,
              activity: userAnswers.activityLevel,
              diet: userAnswers.dietQuality,
              bmi: result.bmiValue,
              bp: userAnswers.bloodPressure,
              sugar: userAnswers.bloodSugar,
            },
            languageName: langMeta?.englishName || 'English',
          }),
        });

        const data = await res.json();
        if (isMounted && data.success && data.data) {
          setAiExplanation(data.data);
        }
      } catch (err) {
        console.warn('AI summary fetch notice:', err);
      } finally {
        if (isMounted) setLoadingAi(false);
      }
    }

    fetchAiExplanation();
    return () => {
      isMounted = false;
    };
  }, [result, userAnswers, language, langMeta]);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
      {/* Optional Sample Switcher Bar for Evaluators */}
      {onSelectSample && (
        <div className="w-full glass-card rounded-2xl p-2.5 sm:p-3 mb-4 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 shrink-0 font-cultural">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Sample Presets:</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {SAMPLE_PROFILES.slice(0, 3).map((s) => {
              const isCurrent =
                (s.riskLevel === 'low' && result.riskLevel === 'low') ||
                (s.riskLevel === 'moderate' && result.riskLevel === 'moderate') ||
                (s.riskLevel === 'high' && result.riskLevel === 'high');

              const dot = s.riskLevel === 'low' ? '🟢' : s.riskLevel === 'moderate' ? '🟡' : '🔴';

              return (
                <button
                  key={s.id}
                  onClick={() => onSelectSample(s)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white/70 hover:bg-white text-slate-700 border border-white/80'
                  }`}
                >
                  <span>{dot}</span>
                  <span className="capitalize">{s.riskLevel}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 1. Main Score Card with Speedometer */}
      <div className="w-full glass-card rounded-3xl p-5 sm:p-7 text-center mb-5 relative overflow-hidden">
        <h1 className="font-cultural text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          {t.resultHeader}
        </h1>

        {/* Speedometer Gauge Visual */}
        <SpeedometerGauge
          score={result.overallScore}
          riskLevel={result.riskLevel}
          language={language}
        />

        {/* 1-2 sentence Plain Language Summary */}
        <div className="mt-4 p-4 rounded-2xl glass-card-subtle text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
          {aiExplanation?.summary || result.plainLanguageSummary}
        </div>

        {/* Gemini AI Live Translator & Context Badge */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-bold text-sky-800 bg-sky-100/80 py-1.5 px-3 rounded-full border border-sky-200 shadow-2xs backdrop-blur-xs w-fit mx-auto">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>
            {loadingAi
              ? 'Generating personalized explanation...'
              : `AI Health Guidance • ${langMeta?.nativeName || 'English'}`}
          </span>
        </div>
      </div>

      {/* 2. Expandable "Why This Result?" Section */}
      <div className="w-full glass-card rounded-3xl p-4 sm:p-5 mb-5">
        <button
          id="btn-toggle-why"
          onClick={() => setWhyExpanded(!whyExpanded)}
          className="w-full flex items-center justify-between text-left py-1 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🔍</span>
            <span className="font-cultural text-base sm:text-lg font-extrabold text-slate-900">
              {t.whyThisResult}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/80 border border-white/80 flex items-center justify-center text-slate-600 shadow-2xs">
            {whyExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {whyExpanded && (
          <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-4 animate-in fade-in">
            {/* Contributing Risk Factors */}
            {result.topRiskFactors.length > 0 && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2 flex items-center gap-1">
                  <span>⚠️</span> {t.topFactors}
                </div>
                <div className="space-y-2">
                  {result.topRiskFactors.slice(0, 3).map((factor) => (
                    <div
                      key={factor.id}
                      className="p-3.5 rounded-2xl glass-amber flex items-start gap-3"
                    >
                      <span className="text-2xl mt-0.5">{factor.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-900">{factor.title}</div>
                        <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {factor.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Protective Positive Habits */}
            {result.protectiveFactors.length > 0 && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1">
                  <span>🌟</span> {t.protectiveFactorsTitle}
                </div>
                <div className="space-y-2">
                  {result.protectiveFactors.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl glass-emerald flex items-start gap-3"
                    >
                      <span className="text-2xl mt-0.5">{item.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-emerald-950">{item.title}</div>
                        <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Primary CTA: See My Daily Prevention Plan */}
      <button
        id="btn-goto-prevention"
        onClick={onGoToPrevention}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:from-orange-600 active:to-orange-700 text-white font-bold text-lg sm:text-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-3 transition-all transform active:scale-98 cursor-pointer mb-3 border border-white/30 backdrop-blur-xs"
      >
        <span>View My 3-Step Prevention Plan</span>
        <ArrowRight className="w-6 h-6" />
      </button>

      {/* AI Health Agent Discussion Card */}
      {onOpenAiAgent && (
        <button
          id="btn-ask-ai-agent-results"
          onClick={onOpenAiAgent}
          className="w-full glass-card-interactive rounded-2xl p-4 mb-3 flex items-center justify-between gap-3 text-left transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0 border border-white/20">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>Speak with HealthDost AI</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-200">
                  Voice Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Ask questions about your {result.riskLevel} risk score, diet, exercise, or doctor visits
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
        </button>
      )}

      {/* Tablet Scanner Quick Action */}
      {onOpenTabletScanner && (
        <button
          id="btn-scan-tablet-results"
          onClick={onOpenTabletScanner}
          className="w-full glass-card-interactive rounded-2xl p-3.5 mb-3 flex items-center justify-between gap-3 text-left transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100/90 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-amber-200/60 shadow-2xs">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">
                Scan Your Current Tablets / Prescriptions
              </div>
              <p className="text-[11px] text-slate-500">
                Check active salt, indications, and side effects with AI camera scanner
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
        </button>
      )}

      {/* Find Nearby Clinics & Free Govt PHCs Action */}
      {onOpenNearbyClinics && (
        <button
          id="btn-nearby-clinics-results"
          onClick={onOpenNearbyClinics}
          className="w-full glass-emerald rounded-2xl p-3.5 mb-3 flex items-center justify-between gap-3 text-left transition-all cursor-pointer group hover:border-emerald-400"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs border border-white/20">
              <MapPin className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                <span>Find Nearby Clinics & Free Govt PHCs</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-200/90 text-emerald-950 border border-emerald-300">
                  Live GPS
                </span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Locate closest Ayushman Arogya Mandirs with free blood pressure & sugar tests
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform shrink-0" />
        </button>
      )}

      {/* Cloud Database Persistence Banner */}
      <div className="w-full glass-card rounded-2xl p-3.5 mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${savedToCloud ? 'bg-emerald-100/90 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
            {savedToCloud ? <Check className="w-4 h-4" /> : <CloudUpload className="w-4 h-4" />}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">
              {savedToCloud ? 'Saved in Cloud Database' : user ? 'Save to Cloud History' : 'Save & Track in Cloud'}
            </div>
            <div className="text-[11px] text-slate-500">
              {savedToCloud
                ? 'Synced with Firestore'
                : user
                ? 'Store in your persistent profile'
                : 'Sign in to access your assessment anywhere'}
            </div>
          </div>
        </div>

        <button
          onClick={handleManualSave}
          disabled={isSaving || savedToCloud}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            savedToCloud
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-slate-900 hover:bg-black text-white shadow-xs border border-white/20'
          }`}
        >
          {isSaving ? 'Saving...' : savedToCloud ? 'Saved ✓' : user ? 'Save Record' : 'Sign In to Save'}
        </button>
      </div>

      {/* Secondary Actions: Share & Detailed Tech Report */}
      <div className="w-full grid grid-cols-2 gap-3 mb-5">
        <button
          id="btn-share-result"
          onClick={onShare}
          className="py-3 px-4 rounded-2xl glass-card-interactive text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-sky-600" />
          <span>{t.shareWithDoctor}</span>
        </button>

        <button
          id="btn-open-detailed"
          onClick={onOpenDetailedReport}
          className="py-3 px-4 rounded-2xl glass-card-interactive text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4 text-slate-600" />
          <span>{t.detailedView}</span>
        </button>
      </div>

      {/* 4. Mandatory Safety Disclaimer */}
      <div className="w-full glass-card-subtle rounded-2xl p-4 text-slate-600 flex items-start gap-3">
        <Stethoscope className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold text-slate-800 block mb-0.5">
            Medical Disclaimer & Next Steps
          </span>
          {t.disclaimerShort} {t.disclaimerFull}
        </div>
      </div>
    </div>
  );
};
