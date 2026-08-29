import React, { useState, useEffect } from 'react';
import { UserAnswers, LanguageCode, RiskCalculationResult, SampleProfile } from './types';
import { TRANSLATIONS } from './data/languages';
import { calculateRisk } from './utils/riskCalculator';
import { speechHelper } from './utils/speechHelper';
import { downloadHealthCardPNG } from './utils/canvasExport';
import { Navbar } from './components/Navbar';
import { VoiceFloatingButton } from './components/VoiceFloatingButton';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuestionFlow } from './components/QuestionFlow';
import { EmergencyScreen } from './components/EmergencyScreen';
import { RiskResultScreen } from './components/RiskResultScreen';
import { PreventionPlanScreen } from './components/PreventionPlanScreen';
import { DetailedReportModal } from './components/DetailedReportModal';
import { ShareModal } from './components/ShareModal';
import { AuthModal } from './components/AuthModal';
import { HealthHistoryDashboard } from './components/HealthHistoryDashboard';
import { AiHealthAgentModal } from './components/AiHealthAgentModal';
import { TabletScannerModal } from './components/TabletScannerModal';
import { HealthBoostLoginPage } from './components/HealthBoostLoginPage';
import { NearbyClinicsModal } from './components/NearbyClinicsModal';
import { ClinicFacilityType } from './types';

const initialAnswers: UserAnswers = {
  hasEmergencySymptoms: false,
  ageGroup: '',
  gender: '',
  activityLevel: '',
  smoking: '',
  alcohol: '',
  dietQuality: '',
  familyHistory: {
    diabetes: false,
    heartDisease: false,
    highBP: false,
    noneOrUnsure: false,
  },
  weightKg: 65,
  heightCm: 165,
  bmiSkipped: false,
  bloodPressure: '',
  bloodSugar: '',
};

export default function App() {
  const [currentView, setCurrentView] = useState<
    'welcome' | 'questions' | 'emergency' | 'results' | 'prevention' | 'history' | 'login'
  >('welcome');
  const [language, setLanguage] = useState<LanguageCode>('hi'); // Default to Hindi for Indian accessibility, switchable anytime
  const [questionStep, setQuestionStep] = useState(1);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>(initialAnswers);
  const [calculatedResult, setCalculatedResult] = useState<RiskCalculationResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAiAgentModal, setShowAiAgentModal] = useState(false);
  const [showTabletScannerModal, setShowTabletScannerModal] = useState(false);
  const [showNearbyClinicsModal, setShowNearbyClinicsModal] = useState(false);
  const [clinicFilter, setClinicFilter] = useState<ClinicFacilityType>('all');
  const [clinicEmergencyOnly, setClinicEmergencyOnly] = useState(false);

  const t = TRANSLATIONS[language];

  const handleOpenNearbyClinics = (filter: ClinicFacilityType = 'all', emergencyOnly = false) => {
    setClinicFilter(filter);
    setClinicEmergencyOnly(emergencyOnly);
    setShowNearbyClinicsModal(true);
  };

  // Helper to construct readable text for SpeechSynthesis based on current view & active step
  const getScreenTextForVoice = (): string => {
    if (showNearbyClinicsModal) {
      return `Nearby Clinics and Healthcare Centers. Using your live browser geolocation to find closest Ayushman Arogya Mandirs, Primary Health Centres, and Jan Aushadhi Kendras.`;
    }
    if (showDetailedReport && calculatedResult) {
      return `${t.detailedView}. Overall Score ${calculatedResult.overallScore} out of 100. Risk Category: ${calculatedResult.riskLevel}. Non-diagnostic health triage breakdown.`;
    }
    if (showShareModal && calculatedResult) {
      return `Share Health Card. Share your assessment with your family, doctor, or ASHA community health worker.`;
    }

    if (currentView === 'welcome') {
      return `${t.appName}. ${t.tagline}. ${t.startCheck}. ${t.trySample}. ${t.disclaimerShort}`;
    }

    if (currentView === 'emergency') {
      return `${t.emergencyAlert}. ${t.emergencyTitle}. ${t.emergencyDesc}. ${t.emergencyCallNow}. 108 for ambulance, 112 for national emergency.`;
    }

    if (currentView === 'results' && calculatedResult) {
      const riskName =
        calculatedResult.riskLevel === 'low'
          ? t.riskLevels.low
          : calculatedResult.riskLevel === 'moderate'
          ? t.riskLevels.moderate
          : t.riskLevels.high;
      const topFactors = calculatedResult.topRiskFactors.map((f) => f.title).join(', ');
      return `${t.resultHeader}. ${riskName}. Score ${calculatedResult.overallScore} out of 100. ${calculatedResult.plainLanguageSummary}. ${topFactors ? `Key factors: ${topFactors}.` : ''} ${t.disclaimerShort}`;
    }

    if (currentView === 'prevention') {
      return `${t.actionPlanTitle}. ${t.actions.walk.title}. ${t.actions.salt.title}. ${t.actions.water.title}. ${t.actions.checkup.title}. ${t.disclaimerShort}`;
    }

    if (currentView === 'questions') {
      switch (questionStep) {
        case 1:
          return `${t.questions.emergency.title}. ${t.questions.emergency.subtitle}. ${t.questions.emergency.noSevere}. ${t.questions.emergency.yesChestPain}.`;
        case 2:
          return `${t.questions.age.title}. ${t.questions.age.subtitle}. ${t.questions.age.under30}, ${t.questions.age.age30to45}, ${t.questions.age.age46to60}, ${t.questions.age.above60}.`;
        case 3:
          return `${t.questions.gender.title}. ${t.questions.gender.subtitle}. ${t.questions.gender.male}, ${t.questions.gender.female}, ${t.questions.gender.other}.`;
        case 4:
          return `${t.questions.activity.title}. ${t.questions.activity.subtitle}. ${t.questions.activity.active}, ${t.questions.activity.moderate}, ${t.questions.activity.low}.`;
        case 5:
          return `${t.questions.lifestyle.title}. ${t.questions.lifestyle.subtitle}. ${t.questions.lifestyle.smokingTitle}, ${t.questions.lifestyle.alcoholTitle}, ${t.questions.lifestyle.dietTitle}.`;
        case 6:
          return `${t.questions.familyHistory.title}. ${t.questions.familyHistory.subtitle}. ${t.questions.familyHistory.diabetes}, ${t.questions.familyHistory.heart}, ${t.questions.familyHistory.bp}, ${t.questions.familyHistory.none}.`;
        case 7:
          return `${t.questions.biomarkers.title}. ${t.questions.biomarkers.calcBmi}. ${t.questions.biomarkers.height}, ${t.questions.biomarkers.weight}.`;
        case 8:
          return `${t.questions.biomarkers.bpTitle}, ${t.questions.biomarkers.sugarTitle}. ${t.questions.biomarkers.normal}, ${t.questions.biomarkers.high}, ${t.questions.biomarkers.unsure}.`;
        default:
          return `${t.appName} health check step ${questionStep} of 8.`;
      }
    }

    return `${t.appName}. ${t.disclaimerShort}`;
  };

  // Toggle voice playback
  const handleToggleVoice = () => {
    if (isSpeaking) {
      speechHelper.stop();
      setIsSpeaking(false);
    } else {
      const textToSpeak = getScreenTextForVoice();
      speechHelper.speak(
        textToSpeak,
        language,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    }
  };

  // Update voice if language changes while speaking
  const handleLanguageChange = (newLang: LanguageCode) => {
    speechHelper.stop();
    setIsSpeaking(false);
    setLanguage(newLang);
  };

  // Stop voice when view changes
  useEffect(() => {
    speechHelper.stop();
    setIsSpeaking(false);
  }, [currentView]);

  // Answer updater
  const handleUpdateAnswers = (updated: Partial<UserAnswers>) => {
    setUserAnswers((prev) => ({ ...prev, ...updated }));
  };

  // Start question flow
  const handleStartCheck = () => {
    setUserAnswers(initialAnswers);
    setCalculatedResult(null);
    setCurrentView('questions');
  };

  // Sample quick test for judges
  const handleSelectSample = (sample: SampleProfile) => {
    setUserAnswers(sample.answers);
    const res = calculateRisk(sample.answers);
    setCalculatedResult(res);
    if (res.isEmergency) {
      setCurrentView('emergency');
    } else {
      setCurrentView('results');
    }
  };

  // Completion of question flow
  const handleCompleteQuestions = () => {
    const res = calculateRisk(userAnswers);
    setCalculatedResult(res);
    if (res.isEmergency) {
      setCurrentView('emergency');
    } else {
      setCurrentView('results');
    }
  };

  // Emergency triggered
  const handleEmergencyTriggered = () => {
    setCurrentView('emergency');
  };

  // Reset / Start Over
  const handleResetToHome = () => {
    speechHelper.stop();
    setIsSpeaking(false);
    setUserAnswers(initialAnswers);
    setCalculatedResult(null);
    setShowDetailedReport(false);
    setShowShareModal(false);
    setCurrentView('welcome');
  };

  // PNG Canvas Download
  const handleDownloadPNG = () => {
    if (calculatedResult) {
      downloadHealthCardPNG(calculatedResult, userAnswers, language);
    }
  };

  if (currentView === 'login') {
    return (
      <HealthBoostLoginPage
        onSuccess={() => setCurrentView('welcome')}
        onBackToApp={() => setCurrentView('welcome')}
        onOpenAiAgent={() => {
          setCurrentView('welcome');
          setShowAiAgentModal(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 flex flex-col font-sans selection:bg-emerald-500/20 relative overflow-x-hidden">
      {/* Dynamic Ambient Refraction Background Orbs for Glass Polymorphism */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Emerald Glow Orb */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-emerald-300/40 via-teal-300/30 to-transparent rounded-full blur-3xl animate-ambient-1" />
        {/* Sky/Oceanic Glow Orb */}
        <div className="absolute top-1/4 -right-28 w-[32rem] h-[32rem] bg-gradient-to-bl from-sky-300/35 via-blue-200/25 to-transparent rounded-full blur-3xl animate-ambient-2" />
        {/* Warm Saffron / Amber Glow Orb */}
        <div className="absolute top-2/3 -left-20 w-[28rem] h-[28rem] bg-gradient-to-tr from-amber-300/30 via-orange-200/20 to-transparent rounded-full blur-3xl animate-ambient-3" />
        {/* Indigo / Purple Subtle Base Glow Orb */}
        <div className="absolute -bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-indigo-300/30 via-purple-200/20 to-transparent rounded-full blur-3xl animate-ambient-1" />
      </div>

      {/* Top App Bar */}
      <Navbar
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
        onReset={handleResetToHome}
        isSpeaking={isSpeaking}
        onToggleVoice={handleToggleVoice}
        showRestartButton={currentView !== 'welcome'}
        onOpenAuthModal={() => setCurrentView('login')}
        onOpenHistory={() => setCurrentView('history')}
        onOpenAiAgent={() => setShowAiAgentModal(true)}
        onOpenTabletScanner={() => setShowTabletScannerModal(true)}
        onOpenNearbyClinics={() => handleOpenNearbyClinics('all')}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-3xl mx-auto py-2 sm:py-6 pb-24 relative z-10">
        {currentView === 'welcome' && (
          <WelcomeScreen
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
            onStart={handleStartCheck}
            onSelectSample={handleSelectSample}
            onOpenAiAgent={() => setShowAiAgentModal(true)}
            onOpenTabletScanner={() => setShowTabletScannerModal(true)}
            onOpenNearbyClinics={() => handleOpenNearbyClinics('all')}
            onOpenLogin={() => setCurrentView('login')}
          />
        )}

        {currentView === 'history' && (
          <HealthHistoryDashboard
            language={language}
            onBackToHome={handleResetToHome}
            onOpenAuthModal={() => setShowAuthModal(true)}
          />
        )}

        {currentView === 'questions' && (
          <QuestionFlow
            answers={userAnswers}
            onChange={handleUpdateAnswers}
            onComplete={handleCompleteQuestions}
            onEmergencyTriggered={handleEmergencyTriggered}
            language={language}
            onBackToHome={handleResetToHome}
            onStepChange={setQuestionStep}
          />
        )}

        {currentView === 'emergency' && (
          <EmergencyScreen
            language={language}
            onGoBack={() => {
              handleUpdateAnswers({ hasEmergencySymptoms: false });
              setCurrentView('questions');
            }}
            onReset={handleResetToHome}
            onOpenNearbyClinics={() => handleOpenNearbyClinics('all', true)}
          />
        )}

        {currentView === 'results' && calculatedResult && (
          <RiskResultScreen
            result={calculatedResult}
            userAnswers={userAnswers}
            language={language}
            onGoToPrevention={() => setCurrentView('prevention')}
            onOpenDetailedReport={() => setShowDetailedReport(true)}
            onShare={() => setShowShareModal(true)}
            onSelectSample={handleSelectSample}
            onOpenAuthModal={() => setShowAuthModal(true)}
            onOpenHistory={() => setCurrentView('history')}
            onOpenAiAgent={() => setShowAiAgentModal(true)}
            onOpenTabletScanner={() => setShowTabletScannerModal(true)}
            onOpenNearbyClinics={() => handleOpenNearbyClinics('all')}
          />
        )}

        {currentView === 'prevention' && calculatedResult && (
          <PreventionPlanScreen
            result={calculatedResult}
            language={language}
            onSaveReport={handleDownloadPNG}
            onShareReport={() => setShowShareModal(true)}
            onOpenDetailedReport={() => setShowDetailedReport(true)}
            onStartOver={handleResetToHome}
          />
        )}
      </main>

      {/* Persistent Voice Help & AI Health Agent Floating Button */}
      <VoiceFloatingButton
        isSpeaking={isSpeaking}
        onToggleVoice={handleToggleVoice}
        language={language}
        onOpenAiAgent={() => setShowAiAgentModal(true)}
        onOpenTabletScanner={() => setShowTabletScannerModal(true)}
      />

      {/* Nearby Clinics & PHCs Geolocation Finder Modal */}
      <NearbyClinicsModal
        isOpen={showNearbyClinicsModal}
        onClose={() => setShowNearbyClinicsModal(false)}
        language={language}
        initialFacilityFilter={clinicFilter}
        filterEmergencyOnly={clinicEmergencyOnly}
      />

      {/* AI Health Companion Voice Agent Modal */}
      <AiHealthAgentModal
        isOpen={showAiAgentModal}
        onClose={() => setShowAiAgentModal(false)}
        language={language}
        calculatedResult={calculatedResult}
        userAnswers={userAnswers}
      />

      {/* Tablet & Medicine Scanner Modal */}
      <TabletScannerModal
        isOpen={showTabletScannerModal}
        onClose={() => setShowTabletScannerModal(false)}
        language={language}
      />

      {/* Authentication & Profile Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        language={language}
      />

      {/* Detailed Technical Report Modal */}
      {showDetailedReport && calculatedResult && (
        <DetailedReportModal
          result={calculatedResult}
          userAnswers={userAnswers}
          language={language}
          onClose={() => setShowDetailedReport(false)}
          onPrint={handleDownloadPNG}
        />
      )}

      {/* Share / Export Modal */}
      {showShareModal && calculatedResult && (
        <ShareModal
          result={calculatedResult}
          userAnswers={userAnswers}
          language={language}
          onClose={() => setShowShareModal(false)}
          onDownloadCanvas={handleDownloadPNG}
        />
      )}
    </div>
  );
}
